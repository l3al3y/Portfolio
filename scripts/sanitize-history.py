"""One-time, owner-authorized privacy rewrite. Never log removed values.

Keep the current tree intact while replacing historical copies of the retired
runtime and the nine reviewed PDFs/previews. Also remove historical date-of-birth
and age literals derived from the retired profile, without encoding them here.
"""
from pathlib import Path
import json, os, re, subprocess, sys, tempfile

ROOT = Path(__file__).resolve().parent.parent
def git(*args):
    return subprocess.check_output(['git', *args], cwd=ROOT)

paths = ['app.js']
documents = [
    'Anugerah_Pelajar_Terbaik_Sesi_Mac_2018', 'Anugerah_Pengarah_Semester_2_2017',
    'Festo_Industrial_AI_Automation', 'Kursus_Arduino_Kolej_Komuniti_Selandar',
    'Kursus_Basic_IoT_Kolej_Komuniti_Bukit_Beruang', 'Kursus_Fiber_Optik_Splicing_Polishing',
    'Pelajar_Cemerlang_Asas_Komunikasi_Rangkaian', 'SPM_Certificate', 'WiMyL_Gold_Award',
]
for name in documents:
    paths.extend(['certificates/' + name + '.pdf', 'assets/documents/' + name + '-1.webp'])

def prepare():
    replacements = {}; values = set(); entries = {}
    for row in git('rev-list', '--objects', '--all').splitlines():
        parts = row.split(b' ', 1)
        if len(parts) == 2:
            entries[parts[0].decode()] = parts[1].decode('utf-8')
    for oid, path in entries.items():
        if path in paths:
            data = git('cat-file', 'blob', oid)
            safe = git('show', 'HEAD:' + path)
            if path == 'app.js':
                for m in re.finditer(br'\b(?:dob|age)\s*:\s*"([^"\r\n]+)"', data):
                    value = m.group(1)
                    if re.search(br'\d', value): values.add(value)
            if data != safe: replacements[oid] = safe
    return replacements, sorted(values, key=len, reverse=True)

if __name__ == '__main__':
    expected_tree = git('rev-parse', 'HEAD^{tree}').decode().strip()
    before = git('rev-parse', 'HEAD').decode().strip()
    refs = {}
    for row in git('for-each-ref', '--format=%(refname) %(objectname)', 'refs/heads', 'refs/tags').decode().splitlines():
        ref, oid = row.split(); refs[ref] = oid
    replacements, values = prepare()
    counts = {'replacedDocumentOrRuntimeBlobs': 0, 'scrubbedTextBlobs': 0}
    def callback(blob, metadata):
        old = blob.data
        if blob.original_id.decode() in replacements:
            blob.data = replacements[blob.original_id.decode()]
            counts['replacedDocumentOrRuntimeBlobs'] += 1
        elif b'\0' not in old:
            try: old.decode('utf-8')
            except UnicodeDecodeError: return
            for value in values: blob.data = blob.data.replace(value, b'[REDACTED]')
            if blob.data != old: counts['scrubbedTextBlobs'] += 1
    import git_filter_repo as fr
    args = fr.FilteringOptions.parse_args(['--force', '--sensitive-data-removal', '--no-fetch', '--replace-refs', 'delete-no-add'])
    os.chdir(ROOT)
    fr.RepoFilter(args, blob_callback=callback).run()
    after = git('rev-parse', 'HEAD').decode().strip()
    if git('rev-parse', 'HEAD^{tree}').decode().strip() != expected_tree:
        raise SystemExit('Current tree changed unexpectedly; refusing to publish history.')
    remaining, remaining_values = prepare()
    if remaining or remaining_values:
        raise SystemExit('Historical private payload remains; refusing to publish history.')
    subprocess.run([sys.executable, 'scripts/check_secrets.py'], cwd=ROOT, check=True)
    receipt = {'before': before, 'after': after, 'currentTree': expected_tree, 'counts': counts,
               'reviewedPaths': paths, 'refs': {ref: {'before': old, 'after': git('rev-parse', ref).decode().strip()} for ref, old in refs.items()}}
    if '--publish' in sys.argv:
        if os.environ.get('GITHUB_REPOSITORY') != 'l3al3y/Portfolio' or os.environ.get('GITHUB_SHA') != before:
            raise SystemExit('Publishing is restricted to the reviewed repository and exact workflow head.')
        remote = 'https://github.com/l3al3y/Portfolio.git'
        # Checkout's short-lived token stays in its auth header; no credentials in URLs.
        operation = 'set-url' if 'origin' in git('remote').decode().split() else 'add'
        subprocess.run(['git', 'remote', operation, 'origin', remote], check=True)
        leases = ['--force-with-lease=' + ref + ':' + old for ref, old in refs.items()]
        subprocess.run(['git', 'push', '--atomic', *leases, 'origin', *[ref + ':' + ref for ref in refs]], check=True)
    Path(os.environ.get('RUNNER_TEMP', tempfile.gettempdir()), 'history-sanitization.json').write_text(json.dumps(receipt, indent=2))
    print(json.dumps({'before': before, 'after': after, 'treePreserved': True, 'counts': counts, 'published': '--publish' in sys.argv}))
