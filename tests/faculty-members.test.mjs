import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';

const page=readFileSync(new URL('../faculty/index.html',import.meta.url),'utf8');
const dataText=readFileSync(new URL('../faculty/members.json',import.meta.url),'utf8');
const data=JSON.parse(dataText);

test('faculty page publishes the sanitized GitHub member roster',()=>{
  assert.equal(data.schema,'skunkworks-academy-public-members/v1');
  assert.equal(data.organization,'skunkworks-academy');
  assert.equal(data.members.length,10);
  assert.equal(new Set(data.members.map(member=>member.login.toLowerCase())).size,10);
  assert.equal((page.match(/data-faculty-login=/g)||[]).length,10);
  for(const member of data.members){
    assert.deepEqual(Object.keys(member).sort(),['login','name','profile']);
    assert.equal(member.profile,'https://github.com/'+member.login);
    const escapedLogin=member.login.replace(/[-/\\^$*+?.()|[\]{}]/g,'\\$&');
    assert.match(page,new RegExp('data-faculty-login="'+escapedLogin+'"','i'));
    assert.ok(page.includes(member.name));
    assert.ok(page.includes(member.profile));
  }
});

test('faculty artifacts exclude private organization metadata',()=>{
  const published=page+'\n'+dataText;
  for(const field of ['tfa_enabled','tfa_level','is_public','saml_name_id','organization_roles_count']){
    assert.equal(published.includes(field),false,field+' must not be published');
  }
  assert.equal(/"role"\s*:/i.test(published),false);
});

test('structured data matches the public member roster',()=>{
  const match=page.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(match);
  const graph=JSON.parse(match[1]);
  const collection=graph['@graph'].find(item=>item['@type']==='CollectionPage');
  assert.equal(collection.mainEntity.numberOfItems,10);
  assert.equal(collection.mainEntity.itemListElement.length,10);
});
