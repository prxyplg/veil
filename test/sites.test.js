import test from 'node:test';
import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import { sites, copySiteUrl } from '../sites.js';

test('Sites contains all 20 unique destinations and one featured Bored tile',async()=>{
 assert.equal(sites.length,20);
 assert.equal(new Set(sites.map(site=>site.url)).size,20);
 assert.equal(sites[0].url,'https://www.bored.com');
 assert.deepEqual(sites.filter(site=>site.featured).map(site=>site.id),['bored']);
 for(const site of sites){
  assert.equal(new URL(site.url).protocol,'https:');
  assert.match(site.logo,/^assets\/sites\/[a-z0-9-]+\.(svg|png|ico|webp|jpg|gif)$/);
  await access(new URL('../'+site.logo,import.meta.url));
 }
});
test('copy preserves exact destination including deep paths and query strings',async()=>{
 const copied=[];
 for(const site of sites)assert.equal(await copySiteUrl(site.url,{writeText:async value=>{copied.push(value);}}),true);
 assert.deepEqual(copied,sites.map(site=>site.url));
 assert.ok(copied.includes('https://codepen.io/akm2/full/AGgarW?utm_medium=with-love&utm_source=shouldseethis.com'));
 assert.ok(copied.includes('https://www.historicaltechtree.com/?node=recP2LgxgbeHNEZRO'));
});
test('clipboard rejection or unavailability does not claim a successful copy',async()=>{
 assert.equal(await copySiteUrl(sites[0].url,{}),false);
 assert.equal(await copySiteUrl(sites[0].url,{writeText:async()=>{throw new Error('Not allowed');}}),false);
 await assert.rejects(copySiteUrl('javascript:alert(1)',{}),/Unknown site URL/);
});

test('each site has a short description and a recorded web source',()=>{
 for(const site of sites){assert.ok(site.description.length>20);assert.ok(site.description.length<90);assert.ok(site.description.split(/\s+/).length<=16);assert.equal(new URL(site.descriptionSource).protocol,'https:');}
});

test('VOLE.wtf and Daily Games are included with bundled logos',()=>{for(const host of ['vole.wtf','playdaily.org'])assert.ok(sites.some(site=>new URL(site.url).hostname===host&&site.logo&&site.description));});
