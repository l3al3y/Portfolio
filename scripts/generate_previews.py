"""Regenerate document previews. Requires pypdfium2 and Pillow; no browser dependency."""
import json
from pathlib import Path
import pypdfium2 as pdfium

root = Path(__file__).resolve().parent.parent
dest = root / 'assets' / 'documents'
dest.mkdir(exist_ok=True)
registry = json.loads((root / 'certificates' / 'registry.json').read_text(encoding='utf-8'))
files = ['certificates/' + c['filename'] for c in registry] + ['resume/resume.pdf']
manifest = {}
for filename in files:
    document = pdfium.PdfDocument(root / filename)
    pages = []
    for i in range(len(document)):
        page = document[i]
        width, height = page.get_size()
        bitmap = page.render(scale=1400 / max(width, height))
        image = bitmap.to_pil().convert('RGB')
        name = Path(filename).stem + '-' + str(i + 1) + '.webp'
        image.save(dest / name, 'WEBP', quality=86, method=6)
        pages.append({'src': 'assets/documents/' + name, 'width': image.width, 'height': image.height})
        bitmap.close()
        page.close()
    document.close()
    manifest[filename] = pages
(dest / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
print(f'Rendered {sum(map(len, manifest.values()))} pages for {len(manifest)} documents.')
