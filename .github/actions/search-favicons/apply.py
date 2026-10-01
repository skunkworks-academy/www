#!/usr/bin/env python3
"""Apply the Academy search favicon contract to a built website artifact."""
import argparse,json,re,shutil,struct
from pathlib import Path
BASE='https://www.skunkworksacademy.com/'
TAGS='\n'.join([
 '<link rel="icon" type="image/png" sizes="96x96" href="'+BASE+'images/favicon-search.png" data-skunkworks-favicon="canonical" />',
 '<link rel="shortcut icon" type="image/png" href="'+BASE+'images/favicon-search.png" data-skunkworks-favicon="canonical" />',
 '<link rel="icon" type="image/png" sizes="96x96" href="'+BASE+'images/favicon-search.png" media="(prefers-color-scheme: light)" data-skunkworks-favicon="canonical" />',
 '<link rel="icon" type="image/png" sizes="96x96" href="'+BASE+'images/favicon-search-dark.png" media="(prefers-color-scheme: dark)" data-skunkworks-favicon="canonical" />',
])
def decorate(html):
 def strip(tag):
  match=re.search(r'\brel\s*=\s*(["\'])(.*?)\1',tag.group(),re.I)
  if not match:return tag.group()
  rel=match.group(2).lower().split()
  return '' if 'icon' in rel else tag.group()
 if not re.search(r'<head\b',html,re.I):return html
 html=re.sub(r'[ \t]*<link\b[^>]*>[ \t]*(?:\r?\n)?',strip,html,flags=re.I)
 return re.sub(r'</head\s*>',lambda m:TAGS+'\n'+m.group(),html,count=1,flags=re.I)
def apply(root,assets):
 root=root.resolve()
 if not root.is_dir():raise RuntimeError('Website artifact directory does not exist: '+str(root))
 for name in ['favicon-search.png','favicon-search-dark.png']:
  b=(assets/name).read_bytes()
  if b[:8]!=b'\x89PNG\r\n\x1a\n' or struct.unpack('>II',b[16:24])!=(96,96):raise RuntimeError('Invalid favicon PNG: '+name)
 (root/'images').mkdir(exist_ok=True)
 for name in ['favicon-search.png','favicon-search-dark.png']:shutil.copyfile(assets/name,root/'images'/name)
 shutil.copyfile(assets/'favicon.ico',root/'favicon.ico')
 docs=0
 for p in root.rglob('*.html'):
  if p.is_symlink() or any(x in p.relative_to(root).parts for x in ['.git','.github','node_modules']):continue
  b=p.read_bytes()
  try:s=b.decode('utf-8')
  except UnicodeDecodeError:continue
  if not re.search(r'<head\b',s,re.I):continue
  result=decorate(s)
  if result.count('data-skunkworks-favicon="canonical"')!=4:raise RuntimeError('Favicon normalization failed: '+str(p.relative_to(root)))
  p.write_bytes(result.encode('utf-8'));docs+=1
 return {'html_documents':docs,'homepage_exists':(root/'index.html').exists(),'assets':['favicon.ico','images/favicon-search.png','images/favicon-search-dark.png']}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--root',required=True);p.add_argument('--assets',default=str(Path(__file__).parent/'assets'));a=p.parse_args();print(json.dumps(apply(Path(a.root),Path(a.assets))))
