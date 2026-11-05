#!/usr/bin/env python3
"""Derive transparent black site icons from the approved emblem; never redraw it.

Run manually from any directory with Pillow installed. Header artwork is untouched.
"""
from pathlib import Path
from PIL import Image, ImageOps
import hashlib, json, shutil

ROOT = Path(__file__).resolve().parents[3]
SOURCE = ROOT / 'images/favicon-black.png'
DEST = Path(__file__).resolve().parent / 'assets'
REVISION = '2026.11.05.2'
source = Image.open(SOURCE).convert('RGBA')
alpha = source.getchannel('A')
assert alpha.getextrema() == (0, 255), 'Approved source must retain transparency'
# Use its exact silhouette, including the original antialiasing, with pure black ink.
mark = Image.new('RGBA', source.size, (0, 0, 0, 0))
mark.putalpha(alpha)
mark = mark.crop(alpha.getbbox())
DEST.mkdir(parents=True, exist_ok=True)

def icon(size):
    glyph = ImageOps.contain(mark, (round(size * .90), round(size * .90)), Image.Resampling.LANCZOS)
    canvas = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    canvas.paste(glyph, ((size-glyph.width)//2, (size-glyph.height)//2))
    return canvas

names = {'favicon-search.png': 96, 'favicon-search-dark.png': 96,
         'favicon-32.png': 32, 'apple-touch-icon.png': 180,
         'favicon-192.png': 192, 'favicon-512.png': 512}
report = {'revision': REVISION, 'source': 'images/favicon-black.png',
          'source_sha256': hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
          'source_alpha_bbox': alpha.getbbox(), 'assets': {}}
for name,size in names.items():
    image = icon(size)
    image.save(DEST/name, optimize=True)
    assert image.getchannel('A').getextrema() == (0,255)
    assert all(image.getpixel(point)[3] == 0 for point in [(0,0),(size-1,0),(0,size-1),(size-1,size-1)])
    assert all(pixel[:3] == (0,0,0) for pixel in image.get_flattened_data())
    shutil.copyfile(DEST/name, ROOT/'images'/name)
    report['assets'][name] = {'size': [size,size], 'sha256': hashlib.sha256((DEST/name).read_bytes()).hexdigest(), 'rgba': True, 'transparent_corners': True}
icon(256).save(DEST/'favicon.ico', sizes=[(n,n) for n in [16,24,32,48,64,96,128,256]])
shutil.copyfile(DEST/'favicon.ico', ROOT/'favicon.ico')
report['assets']['favicon.ico'] = {'sizes': [16,24,32,48,64,96,128,256], 'sha256': hashlib.sha256((DEST/'favicon.ico').read_bytes()).hexdigest()}
(DEST/'manifest.json').write_text(json.dumps(report, indent=2)+'\n',encoding='utf-8')
print(json.dumps(report))
