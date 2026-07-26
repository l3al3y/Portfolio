import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

async def generate_resume_pdf():
    root_dir = Path(__file__).resolve().parent.parent
    html_path = root_dir / "resume" / "resume.html"
    pdf_path = root_dir / "resume" / "resume.pdf"

    if not html_path.exists():
        print(f"HTML resume not found at {html_path}")
        return

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto(html_path.as_uri(), wait_until="networkidle")
        await page.pdf(
            path=str(pdf_path),
            format="A4",
            print_background=True,
            margin={"top": "10mm", "bottom": "10mm", "left": "10mm", "right": "10mm"},
        )
        await browser.close()
        print(f"PDF Resume successfully generated: {pdf_path}")

if __name__ == "__main__":
    asyncio.run(generate_resume_pdf())
