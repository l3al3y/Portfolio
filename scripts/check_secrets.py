"""Reject known credential formats without logging their values.

Use --staged before a local commit. CI scans the committed tree, including small
ZIP members. This is pattern detection, not a replacement for key revocation.
"""
import argparse
import io
from pathlib import PurePosixPath
import re
import subprocess
import sys
import zipfile

PATTERNS = {
    'Rootsys key': re.compile(br'fiq-[A-Za-z0-9]{20,}'),
    'AI provider key': re.compile(br'\bsk-(?:proj-|ant-)?[A-Za-z0-9_-]{20,}'),
    'GitHub token': re.compile(br'\b(?:gh[pousr]_[A-Za-z0-9]{25,}|github_pat_[A-Za-z0-9_]{30,})'),
    'Google API key': re.compile(br'\bAIza[0-9A-Za-z_-]{30,}'),
    'AWS access key': re.compile(br'\bAKIA[0-9A-Z]{16}'),
    'Private signing key': re.compile(br'-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----'),
}
MAX_FILE = 32 * 1024 * 1024
MAX_ARCHIVE = 64 * 1024 * 1024


def safe_label(value):
    data = value.encode('utf-8', errors='replace')
    for pattern in PATTERNS.values():
        data = pattern.sub(b'[REDACTED]', data)
    return data.decode('utf-8').replace('\n', '\\n').replace('\r', '\\r')


def scan(data, label, depth=0):
    findings = []
    for kind, pattern in PATTERNS.items():
        for match in pattern.finditer(data):
            line = data.count(b'\n', 0, match.start()) + 1
            findings.append(f'{safe_label(label)}:{line}: {kind} (value omitted)')
    if data.startswith(b'PK\x03\x04'):
        if depth >= 3:
            findings.append(f'{safe_label(label)}: nested archive exceeds scan limit')
            return findings
        try:
            with zipfile.ZipFile(io.BytesIO(data)) as archive:
                entries = archive.infolist()
                if len(entries) > 10000 or sum(e.file_size for e in entries) > MAX_ARCHIVE:
                    findings.append(f'{safe_label(label)}: archive exceeds scan limit')
                    return findings
                for entry in entries:
                    if entry.is_dir():
                        continue
                    if entry.file_size > MAX_FILE:
                        findings.append(f'{safe_label(label)}: member exceeds scan limit')
                        continue
                    findings.extend(scan(archive.read(entry), label + '!' + entry.filename, depth + 1))
        except (zipfile.BadZipFile, RuntimeError, NotImplementedError):
            findings.append(f'{safe_label(label)}: archive cannot be inspected')
    return findings


def git(*args):
    return subprocess.check_output(['git', *args])


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--staged', action='store_true')
    args = parser.parse_args(argv)
    findings = []
    if args.staged:
        names = git('diff', '--cached', '--name-only', '--diff-filter=ACMR', '-z').split(b'\0')
        entries = [(name.decode('utf-8'), ':' + name.decode('utf-8')) for name in names if name]
    else:
        entries = []
        for row in git('ls-tree', '-r', '-z', 'HEAD').split(b'\0'):
            if not row:
                continue
            metadata, name = row.split(b'\t', 1)
            mode, kind, oid = metadata.split()
            if kind == b'blob':
                entries.append((name.decode('utf-8'), oid.decode('ascii')))
    for name, oid in entries:
        relative = PurePosixPath(name)
        # Refuse secret containers even when a value is not detectable.
        if (relative.name == '.env' or relative.name.startswith('.env.') and relative.name != '.env.example'
                or relative.suffix.lower() in {'.key', '.pem', '.p12', '.pfx', '.jks', '.keystore', '.db', '.sqlite', '.sqlite3'}):
            findings.append(f'{safe_label(name)}: private file type must stay outside the public repository')
        size = int(git('cat-file', '-s', oid))
        if size > MAX_FILE:
            findings.append(f'{safe_label(name)}: file exceeds scan limit; keep build assets in the download repository')
            continue
        findings.extend(scan(git('cat-file', 'blob', oid), name))
    if findings:
        print('\n'.join(findings), file=sys.stderr)
        print('Secret check failed. Remove the value/file; revoke any credential already published.', file=sys.stderr)
        return 1
    print(f'Secret check passed: {len(entries)} tracked files; no configured credential pattern found.')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
