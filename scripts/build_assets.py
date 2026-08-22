#!/usr/bin/env python3
"""
Build web-ready assets in public/ from the original files in ~/Desktop/certificates.

Run once (or after replacing a source file):

    npm run assets

Requires Pillow and PyMuPDF, both already present system-wide. No network access
is needed, which is why this is a local script rather than a build-time step.

What it produces:
  public/profile.webp                  head-and-shoulders portrait, 4:5
  public/certs/cnd-badge.webp          EC-Council CND badge
  public/certs/cnd-certificate.webp    CND certificate, rendered from the PDF at 2x
  public/certs/cnd-certificate.pdf     original PDF, for download
  public/certs/<slug>.webp             full-size certificate scans
  public/certs/<slug>-thumb.webp       gallery thumbnails
"""

from __future__ import annotations

import shutil
import sys
from pathlib import Path

try:
    import pymupdf
    from PIL import Image
except ImportError as exc:  # pragma: no cover
    sys.exit(f"missing dependency: {exc}. Install with: pip3 install pillow pymupdf")

SRC = Path.home() / "Desktop" / "certificates"
OUT = Path(__file__).resolve().parent.parent / "public"
CERTS = OUT / "certs"

# Longest-edge targets. Full views are opened in a lightbox on a large screen;
# thumbnails render in a grid at roughly 300 CSS px, so 600 covers 2x.
FULL_EDGE = 1600
THUMB_EDGE = 600
WEBP = {"format": "WEBP", "quality": 82, "method": 6}

# The portrait crop, in source pixel coordinates of the 800x1280 original.
# Deliberately excludes the bottom-right corner, which carries a generative-AI
# sparkle watermark at roughly x 730-760, y 1198-1243.
PROFILE_SRC = "WhatsApp Image 2026-08-22 at 23.54.38 (1).jpeg"
PROFILE_CROP = (5, 200, 565, 900)  # 560x700, exactly 4:5

BADGE_SRC = "WhatsApp Image 2026-08-22 at 23.33.44.jpeg"
CND_PDF = "ECC-CND-ANSI-Certificate copy.pdf"

# Certificate scans -> output slug.
SCANS = {
    "WhatsApp Image 2026-08-22 at 23.24.42.jpeg": "csdf-2026",
    "WhatsApp Image 2026-08-22 at 23.25.53.jpeg": "internship-skillorbit",
    "WhatsApp Image 2026-08-22 at 23.23.02.jpeg": "sih-2025",
}


def resized(img: Image.Image, longest: int) -> Image.Image:
    """Downscale so the longest edge is `longest`. Never upscales."""
    w, h = img.size
    if max(w, h) <= longest:
        return img.copy()
    scale = longest / max(w, h)
    return img.resize((round(w * scale), round(h * scale)), Image.LANCZOS)


def save(img: Image.Image, path: Path) -> None:
    img.convert("RGB").save(path, **WEBP)
    kb = path.stat().st_size / 1024
    print(f"  {path.relative_to(OUT.parent)}  {img.size[0]}x{img.size[1]}  {kb:.0f} KB")


def require(name: str) -> Path:
    path = SRC / name
    if not path.exists():
        sys.exit(f"source file not found: {path}")
    return path


def main() -> None:
    if not SRC.is_dir():
        sys.exit(f"source directory not found: {SRC}")
    CERTS.mkdir(parents=True, exist_ok=True)

    print("profile photo")
    with Image.open(require(PROFILE_SRC)) as im:
        portrait = im.crop(PROFILE_CROP)
        save(portrait, OUT / "profile.webp")

    print("CND badge")
    with Image.open(require(BADGE_SRC)) as im:
        save(im, CERTS / "cnd-badge.webp")

    print("CND certificate (from PDF)")
    pdf_path = require(CND_PDF)
    with pymupdf.open(pdf_path) as doc:
        # Render at 2x the 840x664pt page for a crisp 1680x1328 raster.
        pix = doc[0].get_pixmap(matrix=pymupdf.Matrix(2, 2))
        cert = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    save(cert, CERTS / "cnd-certificate.webp")
    save(resized(cert, THUMB_EDGE), CERTS / "cnd-certificate-thumb.webp")
    shutil.copy2(pdf_path, CERTS / "cnd-certificate.pdf")
    print(f"  public/certs/cnd-certificate.pdf  (original, for download)")

    print("certificate scans")
    for filename, slug in SCANS.items():
        with Image.open(require(filename)) as im:
            save(resized(im, FULL_EDGE), CERTS / f"{slug}.webp")
            save(resized(im, THUMB_EDGE), CERTS / f"{slug}-thumb.webp")

    # public/favicon.svg is hand-authored, not generated — nothing to do here.

    print("\ndone")


if __name__ == "__main__":
    main()
