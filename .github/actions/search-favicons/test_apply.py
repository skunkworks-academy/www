import importlib.util
import json
import shutil
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

HERE = Path(__file__).resolve().parent
SPEC = importlib.util.spec_from_file_location('academy_favicon_apply', HERE / 'apply.py')
icons = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(icons)

class FaviconArtifactTests(unittest.TestCase):
    def setUp(self):
        # Keep every fixture in the chat work directory, not the system temp folder.
        scratch = HERE.parents[3] / 'favicon-apply-tests'
        scratch.mkdir(exist_ok=True)
        self.temp = tempfile.TemporaryDirectory(dir=scratch)
        self.base = Path(self.temp.name).resolve()
        self.assertEqual(self.base.parent, scratch.resolve())
        self.site = self.base / 'site'
        self.site.mkdir()
        self.assets = self.base / 'assets'
        shutil.copytree(HERE / 'assets', self.assets)
        self.page = self.site / 'index.html'
        self.page.write_text('<html><head><title>Academy</title>\n<link rel="icon" href="white.png">\n<link rel="apple-touch-icon" href="old-touch.png">\n</head><body><img src="white-header.png"></body></html>', encoding='utf-8')

    def tearDown(self):
        self.temp.cleanup()

    def test_idempotent_icons_and_untouched_header(self):
        result = icons.apply(self.site, self.assets)
        first = self.page.read_bytes()
        icons.apply(self.site, self.assets)
        self.assertEqual(first, self.page.read_bytes())
        html = first.decode()
        self.assertEqual(html.count('data-skunkworks-favicon="canonical"'), 4)
        self.assertEqual(html.count('rel="apple-touch-icon"'), 1)
        self.assertIn('white-header.png', html)
        self.assertNotIn('old-touch.png', html)
        self.assertNotIn('href="white.png"', html)
        self.assertEqual(result['html_documents'], 1)
        for name, data in icons.validated_assets(self.assets).items():
            destination = self.site / name if name == 'favicon.ico' else self.site / 'images' / name
            self.assertEqual(destination.read_bytes(), data)

    def test_invalid_asset_rejected_before_artifact_changes(self):
        before = self.page.read_bytes()
        (self.assets / 'favicon-search.png').write_bytes(b'corrupt')
        with self.assertRaisesRegex(RuntimeError, 'hash mismatch'):
            icons.apply(self.site, self.assets)
        self.assertEqual(self.page.read_bytes(), before)
        self.assertFalse((self.site / 'images').exists())

    def test_unquoted_and_mixed_case_icon_declarations_are_replaced(self):
        html = '<html><head><link REL=ICON href=old-white.png><link rel=apple-touch-icon href=old.png></head></html>'
        result = icons.decorate(html)
        self.assertNotIn('old-white.png', result)
        self.assertNotIn('href=old.png', result)
        self.assertEqual(result.count('data-skunkworks-favicon="canonical"'), 4)
        self.assertEqual(icons.decorate(result), result)

    def test_wrong_revision_rejected(self):
        manifest = json.loads((self.assets / 'manifest.json').read_text())
        manifest['revision'] = 'obsolete'
        (self.assets / 'manifest.json').write_text(json.dumps(manifest))
        with self.assertRaisesRegex(RuntimeError, 'revision'):
            icons.apply(self.site, self.assets)

    def test_local_manifest_metadata_survives_with_safe_transparent_icons(self):
        manifest = {'name': 'Saved Academy app', 'id': '/academy', 'start_url': '/start', 'display': 'standalone', 'shortcuts': [{'name': 'My learning', 'url': '/learn'}],
                    'icons': [{'src': 'old-white.png', 'sizes': '192x192', 'purpose': 'maskable'}]}
        manifest_path = self.site / 'site.webmanifest'
        manifest_path.write_text(json.dumps(manifest), encoding='utf-8')
        self.page.write_text('<html><head><link rel="manifest" href="/site.webmanifest?old=1"></head></html>')
        icons.apply(self.site, self.assets)
        saved = json.loads(manifest_path.read_text())
        for key in set(manifest) - {'icons'}:
            self.assertEqual(saved[key], manifest[key])
        self.assertEqual([icon['sizes'] for icon in saved['icons']], ['192x192', '512x512'])
        self.assertTrue(all(icon['purpose'] == 'any' and '?v=2026.11.05.2' in icon['src'] for icon in saved['icons']))
        first = manifest_path.read_bytes()
        icons.apply(self.site, self.assets)
        self.assertEqual(manifest_path.read_bytes(), first)

    def test_nested_and_local_custom_domain_manifest(self):
        (self.site / 'CNAME').write_text('jobs.skunkworksacademy.com')
        (self.site / 'nested').mkdir()
        manifest = self.site / 'nested' / 'app.json'
        manifest.write_text('{"name":"Jobs","scope":"/nested/"}')
        self.page.write_text('<html><head><link rel="manifest" href="https://jobs.skunkworksacademy.com/nested/app.json"></head></html>')
        icons.apply(self.site, self.assets)
        self.assertEqual(json.loads(manifest.read_text())['scope'], '/nested/')
        self.assertEqual(len(json.loads(manifest.read_text())['icons']), 2)

    def test_external_and_outside_artifact_manifests_are_not_read_or_requested(self):
        outside = self.base / 'outside.json'
        outside.write_text('{"name":"Outside","icons":[]}')
        self.page.write_text('<html><head><link rel="manifest" href="https://other.example/app.json"><link rel="manifest" href="../outside.json"></head></html>')
        with patch('urllib.request.urlopen', side_effect=AssertionError('No network requests allowed')):
            icons.apply(self.site, self.assets)
        self.assertEqual(outside.read_text(), '{"name":"Outside","icons":[]}')

    def test_invalid_linked_manifest_fails_before_asset_or_html_writes(self):
        self.page.write_text('<html><head><link rel="manifest" href="app.json"></head></html>')
        (self.site / 'app.json').write_text('not-json')
        before = self.page.read_bytes()
        with self.assertRaises(json.JSONDecodeError):
            icons.apply(self.site, self.assets)
        self.assertEqual(self.page.read_bytes(), before)
        self.assertFalse((self.site / 'images').exists())

if __name__ == '__main__':
    unittest.main()
