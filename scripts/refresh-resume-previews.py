"""Refresh the portfolio's resume previews without changing certificate previews."""
import json
import shutil
from pathlib import Path
import pypdfium2 as pdfium

root = Path(__file__).resolve().parent.parent
data = json.loads((root / 'resume/profiles.json').read_text(encoding='utf-8'))
path = root / 'assets/documents/manifest.json'
manifest = json.loads(path.read_text(encoding='utf-8'))
for profile in data['profiles']:
    relative = 'resume/' + profile['pdf']
    doc = pdfium.PdfDocument(root / relative)
    pages = []
    for i in range(len(doc)):
        page = doc[i]
        bitmap = page.render(scale=1400 / max(page.get_size()))
        image = bitmap.to_pil().convert('RGB')
        name = profile['pdf'].removesuffix('.pdf') + '-' + str(i + 1) + '.webp'
        image.save(root / 'assets/documents' / name, 'WEBP', quality=90, method=6)
        pages.append({'src':'assets/documents/' + name,'width':image.width,'height':image.height})
        bitmap.close()
        page.close()
    doc.close()
    manifest[relative] = pages
primary = next(p for p in data['profiles'] if p['id'] == 'computer-engineering')
shutil.copyfile(root / 'resume' / primary['pdf'], root / 'resume/resume.pdf')
manifest['resume/resume.pdf'] = manifest['resume/' + primary['pdf']]
path.write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
print('Updated preview pages for four resumes; certificate previews preserved.')
