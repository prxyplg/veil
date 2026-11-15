import test from 'node:test';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { config } from '../config.js';
import { destinations, configurationError, nextRoute, keyTier, activeDelta, updateStreak, currentStreak, localDay, isPremium, normalizeTier, routePool, cleanProfile, BADGE_IDS, canCustomizeAppearance, appearanceForTier, faviconDataUrl } from '../core.js';
test('provided collection has 3 normal and 32 Premium destinations', () => {
  assert.equal(configurationError(config), '');
  assert.equal(destinations(config.proxies, 'member').length, 3);
  assert.equal(destinations(config.proxies, 'premium').length, 32);
});
test('every destination is used per cycle, no consecutive repeats including after reload', () => {
  for (const tier of ['member','premium']) {
    const pool = destinations(config.proxies, tier);
    let state = {}; let visited = new Set();
    for (let i = 0; i < pool.length * 30; i++) {
      const next = nextRoute(pool, JSON.parse(JSON.stringify(state)));
      assert.notEqual(next.url, state.last);
      assert.ok(pool.some(p => p.url === next.url));
      assert.ok(!visited.has(next.url)); visited.add(next.url);
      if ((i + 1) % pool.length === 0) { assert.equal(visited.size, pool.length); visited.clear(); }
      state = next.state;
    }
  }
});
test('switching modes avoids last route, handles removed routes and empty pools', () => {
  const normal = destinations(config.proxies, 'member');
  const first = nextRoute(normal, {}, () => 0);
  const plus = nextRoute(config.proxies, first.state, () => 0);
  assert.notEqual(first.url, plus.url);
  assert.equal(nextRoute([]), null);
  assert.notEqual(nextRoute(normal.slice(1), first.state).url, first.url);
});
test('invalid, credential-bearing, non-web and duplicate URLs are rejected', () => {
  const proxies = ['javascript:alert(1)','not a URL','https://user:pass@example.com','https://example.com','https://example.com/'].map(url => ({url, normal:true}));
  assert.equal(destinations(proxies,'premium').length, 1);
});
test('keys grant correct tiers, trim edges and reject wrong or unset keys', async () => {
  const hash = text => createHash('sha256').update(text).digest('hex');
  const keys = {normalKeySha256:hash('normal test'),plusKeySha256:hash('plus test'),ownerKeySha256:hash('owner test')};
  assert.equal(await keyTier(' normal test ', keys), 'member');
  assert.equal(await keyTier('plus test', keys), 'premium');
  assert.equal(await keyTier('owner test', keys), 'owner');
  assert.equal(destinations(config.proxies,'owner').length,32);
  assert.equal(await keyTier('wrong', keys), null);
  assert.equal(await keyTier('', {normalKeySha256:'',plusKeySha256:''}), null);
});
test('active time excludes hidden, unfocused, idle and suspended intervals', () => {
  const active = {visible:true, focused:true, idleMs:0};
  assert.equal(activeDelta(1000,active),1000);
  assert.equal(activeDelta(1000,{...active,visible:false}),0);
  assert.equal(activeDelta(1000,{...active,focused:false}),0);
  assert.equal(activeDelta(1000,{...active,idleMs:60000}),0);
  assert.equal(activeDelta(3600000,active),2000);
  assert.equal(activeDelta(-1000,active),0);
});

test('daily activity streak increments once per calendar day and resets after a missed day', () => {
  let stats = updateStreak({},'2026-11-13');
  assert.equal(stats.streakCount,1);
  assert.equal(updateStreak(stats,'2026-11-13').streakCount,1);
  stats = updateStreak(stats,'2026-11-14');
  assert.equal(stats.streakCount,2);
  assert.equal(currentStreak(stats,'2026-11-15'),2);
  assert.equal(currentStreak(stats,'2026-11-16'),0);
  stats = updateStreak(stats,'2026-11-16');
  assert.equal(stats.streakCount,1);
  assert.equal(stats.bestStreak,2);
});
test('streak handles month/year rollover, DST dates and local dates without elapsed-hour assumptions', () => {
  for (const [a,b] of [['2026-12-31','2027-01-01'],['2026-03-08','2026-03-09'],['2026-11-01','2026-11-02']]) {
    assert.equal(updateStreak({streakDay:a,streakCount:3,bestStreak:3},b).streakCount,4);
  }
  assert.equal(currentStreak({}),0);
  assert.equal(localDay(new Date(2026,10,13,23,59)),'2026-11-13');
});

test('membership pools automatically limit access and skip exclusions', () => {
 assert.equal(routePool(config.proxies,'unverified').length,0);
 assert.equal(routePool(config.proxies,'member').length,3);
 assert.equal(routePool(config.proxies,'premium').length,32);
 assert.equal(routePool(config.proxies,'owner').length,32);
 const removed=config.proxies[0].url;
 assert.equal(routePool(config.proxies,'member',[removed]).length,2);
 assert.ok(!routePool(config.proxies,'premium',[removed]).some(route=>route.url===removed));
 assert.equal(routePool(config.proxies,'member',config.proxies.map(p=>p.url)).length,0);
});
test('premium effects are locked below Premium and legacy Verified migrates to Member', () => {
 assert.equal(isPremium('unverified'),false); assert.equal(isPremium('member'),false);
 assert.equal(isPremium('premium'),true); assert.equal(isPremium('owner'),true);
 assert.equal(normalizeTier('verified'),'member'); assert.equal(normalizeTier('invalid'),'unverified');
});
test('profile name and badges survive normalization with duplicates and invalid badge IDs removed', () => {
 const profile=cleanProfile({name:'  Avery  ',named:true,badges:['helper','friend','helper','root'],badgeSchema:2});
 assert.deepEqual(profile,{name:'Avery',named:true,badges:['helper','friend'],badgeSchema:2});
 assert.deepEqual(cleanProfile(null),{name:'',named:false,badges:[],badgeSchema:2});
 assert.equal(cleanProfile({name:'A'.repeat(100)}).name.length,32);
});

test('legacy developer Helper migrates to Admin once; new feedback Helper stays Helper', () => {
 const migrated=cleanProfile({name:'Avery',badges:['helper','friend']});
 assert.deepEqual(migrated.badges,['admin','friend']);
 assert.deepEqual(cleanProfile(migrated),migrated);
 const modern=cleanProfile({badges:['helper'],badgeSchema:2});
 assert.deepEqual(cleanProfile(modern).badges,['helper']);
});
test('all eight community badges round-trip through local profiles', () => {
 assert.equal(BADGE_IDS.length,8);
 assert.deepEqual(cleanProfile({badges:BADGE_IDS,badgeSchema:2}).badges,BADGE_IDS);
});

test('all appearance customization is locked for Unverified and restored for paid tiers', () => {
 const saved={color:'red',font:'mono',wallpaper:'nebula',trail:'hearts'};
 const defaults={color:'purple',font:'system',wallpaper:'none',trail:'none'};
 assert.equal(canCustomizeAppearance('unverified'),false);
 for(const tier of ['member','premium','owner']){
  assert.equal(canCustomizeAppearance(tier),true);
  assert.deepEqual(appearanceForTier(tier,saved,defaults),saved);
 }
 assert.deepEqual(appearanceForTier('unverified',saved,defaults),defaults);
 assert.equal(saved.color,'red');
 assert.equal(canCustomizeAppearance('unknown'),false);
});
test('favicon uses the selected accent throughout the trusted hood SVG', () => {
 const source=readFileSync(new URL('../logo.svg',import.meta.url),'utf8');
 const href=faviconDataUrl(source,'#ff9191');
 assert.ok(href.startsWith('data:image/svg+xml;charset=utf-8,'));
 const svg=decodeURIComponent(href.split(',').slice(1).join(','));
 assert.ok(svg.includes('stroke="#ff9191"'));
 assert.ok(!svg.includes('#c18aff'));
 assert.ok(!svg.includes('#9670ba'));
 assert.ok(svg.includes('linearGradient'));
 assert.throws(()=>faviconDataUrl(source,'red;bad'),/Invalid accent/);
});

test('Unverified and Banned keys resolve to their tiers without granting access', async () => {
 const hash=value=>createHash('sha256').update(value).digest('hex');
 const keys={unverifiedKeySha256:hash('guest test'),bannedKeySha256:hash('blocked test')};
 assert.equal(await keyTier(' guest test ',keys),'unverified');
 assert.equal(await keyTier('blocked test',keys),'banned');
 assert.equal(await keyTier('invalid',keys),null);
 assert.equal(normalizeTier('banned'),'banned');
 assert.equal(routePool(config.proxies,'banned').length,0);
 assert.equal(destinations(config.proxies,'banned').length,0);
 assert.equal(canCustomizeAppearance('banned'),false);
 assert.equal(isPremium('banned'),false);
});
