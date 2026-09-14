"""Pas 3 — Genera report.md per revisar abans d'importar res."""
from collections import Counter

from common import MATCHED_JSON, REPORT_MD, load


def cell(s):
    return s.replace('|', '\\|').replace('\n', ' ')


def main():
    entries = load(MATCHED_JSON)
    dup_dates = {d for d, n in Counter(e['fecha'] for e in entries).items() if n > 1}
    with_warn = sum(1 for e in entries if e['avisos'])

    lines = ['# Reporte de validación — importación de noticias', '',
             f'- Publicaciones: **{len(entries)}** · con avisos: **{with_warn}**',
             f'- Fotos emparejadas: **{sum(len(e["imagenes"]) for e in entries)}**',
             f'- Fechas compartidas por varias publicaciones: {len(dup_dates)} (normal: se publicaban varias el mismo día)', '']

    for year in sorted({e['id'][:4] for e in entries}):
        lines += [f'## {year}', '',
                  '| ID | Fecha | Título | Inicio del texto | Fotos | Avisos |',
                  '|---|---|---|---|---|---|']
        for e in (x for x in entries if x['id'][:4] == year):
            words = ' '.join(e['texto'].split()[:12])
            fotos = f'{len(e["imagenes"])}/{len(e["fotos_citadas"])}'
            avisos = '<br>'.join(cell(a) for a in e['avisos']) or '✓'
            lines.append(f'| {e["id"]} | {e["fecha"]} | {cell(e["titulo"] or "—")} | {cell(words)}… | {fotos} | {avisos} |')
        lines.append('')

    REPORT_MD.write_text('\n'.join(lines), encoding='utf-8')
    print(f'{len(entries)} publicaciones, {with_warn} con avisos -> {REPORT_MD.name}')


if __name__ == '__main__':
    main()
