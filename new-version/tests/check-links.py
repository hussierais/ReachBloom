"""Run from any directory: python3 tests/check-links.py."""
from pathlib import Path
from html.parser import HTMLParser
root = Path(__file__).resolve().parent.parent
class Parser(HTMLParser):
    def __init__(self, text):
        super().__init__(); self.refs = []; self.ids = []; self.feed(text)
    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if 'id' in values: self.ids.append(values['id'])
        key = {'a': 'href', 'img': 'src', 'script': 'src', 'link': 'href'}.get(tag)
        if key and key in values: self.refs.append(values[key])
errors = []
files = [*root.glob('*.html'), *root.joinpath('stores').glob('*.html')]
for file in files:
    parsed = Parser(file.read_text())
    if len(parsed.ids) != len(set(parsed.ids)): errors.append((file.name, 'duplicate static ID'))
    for value in parsed.refs:
        if '://' in value or value.startswith('data:'): continue
        path, _, fragment = value.partition('#')
        target = file.parent / path.split('?')[0] if path else file
        if not target.is_file(): errors.append((file.name, value))
        elif fragment and target.suffix == '.html' and fragment not in Parser(target.read_text()).ids:
            errors.append((file.name, value))
assert not errors, errors
print(f'PASS: static paths, fragments and IDs on {len(files)} active HTML pages.')
