"""Pas 2 — Relaciona les fotos citades a cada publicació amb els fitxers reals.

La carpeta de fotos va per data de cursa, no de publicació, així que
l'emparellament es fa pel nom de fitxer que cita el Word:
  1. exacte (NFC, sense distingir majúscules)
  2. laxe (sense accents/símbols ni sufix -N), a qualsevol carpeta
Tot el que no quadra va a match-log.md per revisar a mà.
"""
from collections import defaultdict
from datetime import date

from common import (MATCH_LOG, MATCHED_JSON, NEWS_DIR, OVERRIDES_JSON, RAW_JSON,
                    date_in_name, dump, load, loose_name, norm_name)


def main():
    entries = load(RAW_JSON)
    overrides = load(OVERRIDES_JSON) if OVERRIDES_JSON.exists() else {}
    disk = sorted(NEWS_DIR.rglob('*.jpg'))
    rel = lambda p: p.relative_to(NEWS_DIR).as_posix()
    by_exact = {norm_name(p.name): p for p in disk}
    by_loose = defaultdict(list)
    for p in disk:
        by_loose[loose_name(p.name)].append(p)

    used = defaultdict(list)
    missing = []

    for e in entries:
        e['imagenes'] = []
        for cited in e['fotos_citadas']:
            p, method = by_exact.get(norm_name(cited)), 'exacto'
            if p is None and cited in overrides and (NEWS_DIR / overrides[cited]).exists():
                p, method = NEWS_DIR / overrides[cited], 'manual'
            if p is None:
                cands = [c for c in by_loose[loose_name(cited)] if rel(c) not in {i['ruta'] for i in e['imagenes']}]
                if cands:
                    p, method = cands[0], 'aproximado'
            if p is None:
                missing.append((e, cited))
                e['avisos'].append(f'foto no encontrada: {cited}')
                continue
            if rel(p) in {i['ruta'] for i in e['imagenes']}:
                e['avisos'].append(f'foto repetida en la misma publicación: {cited}')
                continue
            e['imagenes'].append({'citada': cited, 'ruta': rel(p), 'metodo': method})
            used[rel(p)].append(e['id'])
            if method == 'aproximado':
                e['avisos'].append(f'foto emparejada por aproximación: {cited} -> {p.name}')

            photo_date = date_in_name(p.name)
            if photo_date and e['fecha']:
                try:
                    days = (date.fromisoformat(e['fecha']) - date.fromisoformat(photo_date)).days
                except ValueError:
                    e['avisos'].append(f'fecha imposible en el nombre de la foto: {p.name}')
                    continue
                if days < -1 or days > 90:
                    e['avisos'].append(f'foto con fecha lejana a la publicación ({photo_date}): {p.name}')
        if not e['imagenes']:
            e['avisos'].append('sin imagen')

    for ruta, ids in used.items():
        if len(ids) > 1:
            for e in entries:
                if e['id'] in ids:
                    e['avisos'].append(f'foto compartida con {", ".join(i for i in ids if i != e["id"])}: {ruta}')

    # Fotos que cap Word cita: suggerim la publicació que usa altres fotos de la mateixa carpeta
    folder_owner = defaultdict(set)
    for ruta, ids in used.items():
        folder_owner[ruta.rsplit('/', 1)[0]].update(ids)
    uncited = [rel(p) for p in disk if rel(p) not in used]

    dump(MATCHED_JSON, entries)

    lines = ['# Log d\'emparellament de fotos', '',
             f'- Publicacions: {len(entries)}',
             f'- Fotos al disc: {len(disk)} · usades: {len(used)} · no citades: {len(uncited)}',
             f'- Fotos citades no trobades: {len(missing)}', '',
             '## Fotos citades al Word que no existeixen al disc', '',
             '| Publicació | Data | Foto citada | Candidates (mateixa data al nom, no citades) |', '|---|---|---|---|']
    uncited_by_date = defaultdict(list)
    for u in uncited:
        uncited_by_date[date_in_name(u)].append(u)
    for e, c in missing:
        cands = uncited_by_date.get(date_in_name(c), []) if date_in_name(c) else []
        lines.append(f'| {e["id"]} | {e["fecha"]} | `{c}` | {"<br>".join(f"`{x}`" for x in cands) or "—"} |')
    lines += ['', '## Fotos al disc que cap Word cita', '',
              '| Foto | Publicacions que usen la mateixa carpeta |', '|---|---|']
    lines += [f'| `{u}` | {", ".join(sorted(folder_owner.get(u.rsplit("/", 1)[0], []))) or "—"} |' for u in uncited]
    MATCH_LOG.write_text('\n'.join(lines) + '\n', encoding='utf-8')

    print(f'usadas {len(used)}/{len(disk)} · no encontradas {len(missing)} · no citadas {len(uncited)} -> {MATCHED_JSON.name}, {MATCH_LOG.name}')


if __name__ == '__main__':
    main()
