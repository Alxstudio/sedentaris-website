"""Pas 1 — Extreu les publicacions dels Word a raw-news.json.

Separador: capçalera 'PUBLICACION NNN.  DD DE MES YYYY'. No es fa servir
qualsevol data perquè els textos contenen subdates com '(Sábado, 06 de ...)'.
"""
import html
import re
import unicodedata
import zipfile

from common import MESOS, NEWS_DIR, RAW_JSON, dump, nfc

HEADER_RE = re.compile(
    r'^PUBLICACI[OÓ]N\s+(\d+)\.\s+(\d{1,2})\s+DE\s+([A-ZÁÉÍÓÚ]+)\s+(?:DE\s+)?(\d{4})\s*$', re.I)
JPG_RE = re.compile(r'\S.*\.jpe?g$', re.I)
RACE_DATE_RE = re.compile(r'\s*\((\d{2})/(\d{2})/(\d{4})\)\s*')


def docx_paragraphs(path):
    xml = zipfile.ZipFile(path).read('word/document.xml').decode('utf-8')
    for p in re.findall(r'<w:p[ >].*?</w:p>', xml, re.S):
        # Els salts i tabuladors van fora de <w:t>: cal convertir-los en text o es perden
        p = re.sub(r'<w:tab\b[^>]*/>', '<w:t> </w:t>', p)
        p = re.sub(r'<w:br\b[^>]*/>', '<w:t>\n</w:t>', p)
        text = ''.join(re.findall(r'<w:t(?:\s[^>]*)?>([^<]*)</w:t>', p))
        for line in nfc(html.unescape(text)).split('\n'):
            yield line.strip()


def split_title(line):
    """El títol ve en majúscules acabat en punt, a vegades enganxat al primer paràgraf."""
    # Categoria Ll i no islower(): 'º' i 'ª' donen islower() == True
    first_lower = next((i for i, c in enumerate(line) if unicodedata.category(c) == 'Ll'), None)
    if first_lower is None:
        return line, ''
    cut = line.rfind('.', 0, first_lower)
    if cut == -1:
        return None, line
    return line[:cut + 1], line[cut + 1:].strip()


def parse_doc(path):
    # La numeració és per document (el de 2023 continua fins al febrer de 2024),
    # així que l'id usa l'any del document i no el de la data.
    serie = re.search(r'\d{4}', str(path.relative_to(NEWS_DIR))).group()
    entries, cur = [], None
    for para in docx_paragraphs(path):
        m = HEADER_RE.match(para)
        if m:
            num, day, month, year = m.groups()
            cur = {
                'id': f'{serie}-{int(num):03d}',
                'doc': str(path.relative_to(NEWS_DIR)),
                'numero': int(num),
                'cabecera': para,
                'fecha': None,
                'titulo': None,
                'fecha_carrera': None,
                'fotos_citadas': [],
                'parrafos': [],
                'avisos': [],
            }
            mes = MESOS.get(month.upper())
            if mes:
                cur['fecha'] = f'{year}-{mes:02d}-{int(day):02d}'
            else:
                cur['avisos'].append(f'mes no reconocido: {month}')
            entries.append(cur)
            continue
        if cur is None or not para:
            continue
        if re.match(r'^fotos\s*:', para, re.I):
            para = re.sub(r'^fotos\s*:\s*', '', para, flags=re.I)
            if not para:
                continue
        if JPG_RE.fullmatch(para):
            cur['fotos_citadas'].append(para)
            continue
        if re.fullmatch(r'[.…\s]+', para):
            continue
        if re.fullmatch(r'\S+', para) and (re.search(r'(-|[-.]jpe?g?|\.j)$', para, re.I)
                                           or re.search(r'\d{2}-\d{2}-\d{4}', para)):
            cur['avisos'].append(f'nombre de foto incompleto en el Word: {para}')
            repaired = re.sub(r'[-.](jpe?g?|j)?$', '', para, flags=re.I) + '.jpg'
            if re.search(r'\d{2}-\d{2}-\d{4}', repaired):
                cur['fotos_citadas'].append(repaired)
            continue
        if cur['titulo'] is None:
            title, rest = split_title(para)
            if title is None and len(para) <= 90 and not para.endswith(':'):
                title, rest = para, ''
                cur['avisos'].append('título no está en mayúsculas (revisar)')
            if title:
                rd = RACE_DATE_RE.search(title)
                if rd:
                    cur['fecha_carrera'] = f'{rd.group(3)}-{rd.group(2)}-{rd.group(1)}'
                    title = RACE_DATE_RE.sub(' ', title).strip()
                cur['titulo'] = title.rstrip('.').strip()
                if rest:
                    cur['parrafos'].append(rest)
                continue
            cur['titulo'] = re.split(r'(?<=[.:])\s', para)[0][:80].rstrip('.:,')
            cur['avisos'].append('título derivado del texto (el Word no trae título)')
        cur['parrafos'].append(para)

    for e in entries:
        # Alguns salts de línia del Word cauen a mitja frase: s'uneixen al paràgraf anterior
        merged = []
        for p in e.pop('parrafos'):
            if merged and not re.search(r'[.:!?)"»]$', merged[-1]) and p[:1].islower():
                merged[-1] += ' ' + p
            else:
                merged.append(p)
        e['texto'] = '\n\n'.join(merged)
        if not e['texto']:
            e['avisos'].append('texto vacío')
        if re.search(r'AQU[IÍ] TIENES QUE|RECUPERAR UN VIDEO', e['texto']):
            e['avisos'].append('nota interna en el texto (proponer excluir)')
    return entries


def main():
    docs = sorted(NEWS_DIR.rglob('*.docx'), key=lambda p: p.name)
    entries = [e for d in docs for e in parse_doc(d)]

    seen, titles = {}, {}
    for e in entries:
        base = e['id']
        n = seen.get(base, 0)
        if n:
            e['id'] = f'{base}-{chr(ord("a") + n)}'
            e['avisos'].append(f'número de publicación repetido en el Word ({base})')
        seen[base] = n + 1
        key = e['titulo'].lower()
        if key and key in titles:
            e['avisos'].append(f'título duplicado con {titles[key]}')
        titles.setdefault(key, e['id'])
    entries.sort(key=lambda e: (e['fecha'] or '', e['id']))

    dump(RAW_JSON, entries)
    print(f'{len(entries)} publicaciones de {len(docs)} documentos -> {RAW_JSON.name}')


if __name__ == '__main__':
    main()
