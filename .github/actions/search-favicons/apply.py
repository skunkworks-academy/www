#!/usr/bin/env python3
"""Install the reviewed black/transparent Academy icons in a local site artifact."""
import argparse
import hashlib
import html as html_entities
import json
import re
import struct
from pathlib import Path
from urllib.parse import unquote, urlsplit

BASE = 'https://www.skunkworksacademy.com/'
REVISION = '2026.11.05.2'
PNG_SIZES = {'favicon-search.png': 96, 'favicon-search-dark.png': 96,
             'favicon-32.png': 32, 'apple-touch-icon.png': 180,
             'favicon-192.png': 192, 'favicon-512.png': 512}
ICO_SIZES = {16, 24, 32, 48, 64, 96, 128, 256}

def asset_url(name):
    return BASE + 'images/' + name + '?v=' + REVISION

TAGS = '\n'.join([
    '<link rel="icon" type="image/png" sizes="96x96" href="' + asset_url('favicon-search.png') + '" data-skunkworks-favicon="canonical" />',
    '<link rel="shortcut icon" type="image/png" href="' + asset_url('favicon-search.png') + '" data-skunkworks-favicon="canonical" />',
    '<link rel="icon" type="image/png" sizes="96x96" href="' + asset_url('favicon-search.png') + '" media="(prefers-color-scheme: light)" data-skunkworks-favicon="canonical" />',
    '<link rel="icon" type="image/png" sizes="96x96" href="' + asset_url('favicon-search-dark.png') + '" media="(prefers-color-scheme: dark)" data-skunkworks-favicon="canonical" />',
    '<link rel="apple-touch-icon" sizes="180x180" href="' + asset_url('apple-touch-icon.png') + '" />',
])

def attributes(tag):
    pattern = r'''([\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>"']+))'''
    return {match.group(1).lower(): html_entities.unescape(next(value for value in match.groups()[1:] if value is not None))
            for match in re.finditer(pattern, tag, re.S)}

def decorate(html):
    def strip(match):
        rel = set(attributes(match.group()).get('rel', '').lower().split())
        return '' if rel.intersection({'icon', 'apple-touch-icon', 'apple-touch-icon-precomposed', 'mask-icon'}) else match.group()
    if not re.search(r'<head\b', html, re.I):
        return html
    html = re.sub(r'[ \t]*<link\b[^>]*>[ \t]*(?:\r?\n)?', strip, html, flags=re.I)
    return re.sub(r'</head\s*>', lambda match: TAGS + '\n' + match.group(), html, count=1, flags=re.I)

def validated_assets(assets):
    manifest = json.loads((assets / 'manifest.json').read_text(encoding='utf-8'))
    expected = set(PNG_SIZES) | {'favicon.ico'}
    entries = manifest.get('assets', {})
    if manifest.get('revision') != REVISION or set(entries) != expected:
        raise RuntimeError('Unexpected favicon asset manifest revision or file set.')
    content = {}
    for name in sorted(expected):
        data = (assets / name).read_bytes()
        if hashlib.sha256(data).hexdigest() != entries[name].get('sha256'):
            raise RuntimeError('Favicon asset hash mismatch: ' + name)
        if name in PNG_SIZES:
            size = PNG_SIZES[name]
            if len(data) < 26 or data[:8] != b'\x89PNG\r\n\x1a\n' or struct.unpack('>II', data[16:24]) != (size, size) or data[24:26] != b'\x08\x06':
                raise RuntimeError('Invalid RGBA favicon PNG: ' + name)
            if entries[name].get('size') != [size, size] or entries[name].get('transparent_corners') is not True:
                raise RuntimeError('Invalid favicon PNG manifest: ' + name)
        else:
            if len(data) < 6 or data[:4] != b'\x00\x00\x01\x00':
                raise RuntimeError('Invalid favicon ICO.')
            count = struct.unpack('<H', data[4:6])[0]
            if len(data) < 6 + 16 * count:
                raise RuntimeError('Incomplete favicon ICO directory.')
            sizes = {(data[6 + 16 * i] or 256, data[7 + 16 * i] or 256) for i in range(count)}
            if sizes != {(size, size) for size in ICO_SIZES} or set(entries[name].get('sizes', [])) != ICO_SIZES:
                raise RuntimeError('Unexpected favicon ICO sizes.')
        content[name] = data
    if content['favicon-search.png'] != content['favicon-search-dark.png']:
        raise RuntimeError('Light and dark favicon paths must contain the same black transparent artwork.')
    return content

def manifest_paths(root, documents):
    paths = set()
    hosts = {'www.skunkworksacademy.com', 'skunkworksacademy.com'}
    if (root / 'CNAME').is_file():
        hosts.add((root / 'CNAME').read_text(encoding='utf-8').strip().lower())
    for document, html in documents:
        for tag in re.findall(r'<link\b[^>]*>', html, re.I):
            attrs = attributes(tag)
            if 'manifest' not in attrs.get('rel', '').lower().split():
                continue
            url = urlsplit(attrs.get('href', ''))
            if url.scheme not in ('', 'http', 'https') or (url.netloc and url.hostname not in hosts):
                continue
            local = unquote(url.path)
            candidate = (root / local.lstrip('/') if local.startswith('/') or url.netloc else document.parent / local).resolve()
            if candidate.is_relative_to(root) and candidate.is_file() and not candidate.is_symlink():
                paths.add(candidate)
    for path in root.rglob('*.webmanifest'):
        if path.resolve().is_relative_to(root) and not path.is_symlink() and not set(path.relative_to(root).parts).intersection({'.git', '.github', 'node_modules'}):
            paths.add(path)
    path = root / 'manifest.json'
    if path.is_file() and not path.is_symlink():
        value = json.loads(path.read_text(encoding='utf-8'))
        if isinstance(value, dict) and ('icons' in value or 'start_url' in value):
            paths.add(path)
    return paths

def apply(root, assets):
    root = root.resolve()
    if not root.is_dir():
        raise RuntimeError('Website artifact directory does not exist: ' + str(root))
    content = validated_assets(assets.resolve())
    for target in [root / 'images', root / 'favicon.ico']:
        if target.is_symlink() or not target.resolve().is_relative_to(root):
            raise RuntimeError('Favicon output must remain inside the artifact: ' + str(target))
    documents = []
    for path in root.rglob('*.html'):
        if path.is_symlink() or not path.resolve().is_relative_to(root) or set(path.relative_to(root).parts).intersection({'.git', '.github', 'node_modules'}):
            continue
        try:
            html = path.read_bytes().decode('utf-8')
        except UnicodeDecodeError:
            continue
        if re.search(r'<head\b', html, re.I):
            documents.append((path, html))
    updates = {}
    for path, html in documents:
        result = decorate(html)
        if result.count('data-skunkworks-favicon="canonical"') != 4:
            raise RuntimeError('Favicon normalization failed: ' + str(path.relative_to(root)))
        updates[path] = result
    manifests = manifest_paths(root, documents)
    for path in manifests:
        value = json.loads(path.read_text(encoding='utf-8'))
        if not isinstance(value, dict):
            raise RuntimeError('Web manifest must be a JSON object: ' + str(path.relative_to(root)))
        value['icons'] = [{'src': asset_url('favicon-' + str(size) + '.png'), 'sizes': str(size) + 'x' + str(size), 'type': 'image/png', 'purpose': 'any'} for size in (192, 512)]
        updates[path] = json.dumps(value, ensure_ascii=False, indent=2) + '\n'
    (root / 'images').mkdir(exist_ok=True)
    for name, value in content.items():
        (root / name if name == 'favicon.ico' else root / 'images' / name).write_bytes(value)
    for path, value in updates.items():
        path.write_bytes(value.encode('utf-8'))
    return {'html_documents': len(documents), 'manifest_documents': len(manifests), 'homepage_exists': (root / 'index.html').exists(),
            'revision': REVISION, 'assets': ['favicon.ico'] + ['images/' + name for name in PNG_SIZES]}

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--root', required=True)
    parser.add_argument('--assets', default=str(Path(__file__).parent / 'assets'))
    args = parser.parse_args()
    print(json.dumps(apply(Path(args.root), Path(args.assets))))
