"""Rutes i utilitats compartides pels scripts d'importació de notícies."""
import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent
NEWS_DIR = ROOT.parent / 'public' / 'news'

RAW_JSON = ROOT / 'raw-news.json'
MATCHED_JSON = ROOT / 'news.json'
MATCH_LOG = ROOT / 'match-log.md'
OVERRIDES_JSON = ROOT / 'overrides.json'
REPORT_MD = ROOT / 'report.md'

MESOS = {
    'ENERO': 1, 'FEBRERO': 2, 'MARZO': 3, 'ABRIL': 4, 'MAYO': 5, 'JUNIO': 6,
    'JULIO': 7, 'AGOSTO': 8, 'SEPTIEMBRE': 9, 'SETIEMBRE': 9, 'OCTUBRE': 10,
    'NOVIEMBRE': 11, 'DICIEMBRE': 12,
}


def nfc(s: str) -> str:
    return unicodedata.normalize('NFC', s)


def norm_name(s: str) -> str:
    """Clau per comparar noms de fitxer: NFC, minúscules, sense espais ni extensió doble ('x.jpg .jpg')."""
    s = re.sub(r'(\.jpe?g)(\s*\.jpe?g)+$', r'\1', nfc(s).strip(), flags=re.I)
    return s.lower()


def loose_name(s: str) -> str:
    """Clau laxa: només alfanumèrics sense accents i sense sufix final -N, .N o -0N."""
    base = re.sub(r'\.jpe?g$', '', norm_name(s))
    base = re.sub(r'[-.]0?\d$', '', base)
    base = unicodedata.normalize('NFD', base)
    base = ''.join(c for c in base if not unicodedata.combining(c))
    return re.sub(r'[^a-z0-9]', '', base)


def date_in_name(s: str):
    """Retorna 'YYYY-MM-DD' si el nom conté una data DD-MM-YYYY."""
    m = re.search(r'(\d{2})[-_](\d{2})[-_](\d{4})', s)
    return f'{m.group(3)}-{m.group(2)}-{m.group(1)}' if m else None


def load(path: Path):
    return json.loads(path.read_text(encoding='utf-8'))


def dump(path: Path, data):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
