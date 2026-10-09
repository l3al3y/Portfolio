"""Build only the intended public website artifact for GitHub Pages."""
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parent.parent
DEST = ROOT / "public-site"
if DEST.exists():
    raise SystemExit("public-site already exists; use a fresh checkout for staging")
DEST.mkdir()
for name in [".nojekyll", "CNAME", "_headers", "index.html", "manga.html", "privacy.html", "terms.html", "app.js", "style.css", "controller.js", "manga.js", "favicon.ico", "favicon.svg", "favicon-32x32.png", "favicon-192x192.png", "apple-touch-icon.png", "googleeb52c0cc14a917bd.html", "robots.txt", "sitemap.xml", "updates.xml"]:
    shutil.copy2(ROOT / name, DEST / name)
for name in ["assets", "certificates", "extension", "lab", "resume", "smc"]:
    shutil.copytree(ROOT / name, DEST / name, ignore=shutil.ignore_patterns("smc") if name == "assets" else None)
blocked = {".env", ".db", ".sqlite", ".sqlite3", ".apk", ".xapk", ".npk", ".key", ".pem", ".p12", ".pfx", ".jks", ".keystore"}
for path in DEST.rglob("*"):
    if path.is_file() and (path.name.startswith(".env") or path.suffix.lower() in blocked):
        raise SystemExit("Blocked private/build file in website artifact: " + str(path.relative_to(DEST)))
print("Staged public website files:", sum(path.is_file() for path in DEST.rglob("*")))
