import { ANIMAL_IDS } from './avatars.js';
export function destinations(proxies, tier) {
  if (tier === 'banned') return [];
  const unique = new Set();
  return proxies.filter(p => {
    try {
      const url = new URL(p.url);
      if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || unique.has(url.href)) return false;
      unique.add(url.href);
      return ['premium', 'owner'].includes(tier) || p.normal === true;
    } catch { return false; }
  });
}

export function configurationError(config) {
  if (destinations(config.proxies, 'premium').length !== config.proxies.length) return 'Some destinations are duplicated or invalid. Ask the owner to check the configuration.';
  if (destinations(config.proxies, 'member').length !== 3) return 'The owner needs to configure exactly three normal destinations before launch.';
  return '';
}

// A shuffled bag visits every destination once before starting a new cycle.
// At a cycle boundary, the last destination is excluded from the first draw.
export function nextRoute(routes, previous = {}, random = Math.random) {
  const ids = routes.map(p => p.url);
  const signature = JSON.stringify(ids);
  let remaining = previous.signature === signature && Array.isArray(previous.remaining)
    ? [...new Set(previous.remaining.filter(url => ids.includes(url)))] : [];
  if (!remaining.length) remaining = [...ids];
  const choices = remaining.filter(url => url !== previous.last);
  const candidates = choices.length ? choices : remaining;
  if (!candidates.length) return null;
  const url = candidates[Math.floor(random() * candidates.length)];
  return { url, state: { signature, remaining: remaining.filter(item => item !== url), last: url } };
}

export async function keyTier(key, config, subtle = globalThis.crypto.subtle) {
  const digest = await subtle.digest('SHA-256', new TextEncoder().encode(key.trim()));
  const hash = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
  if (/^[a-f0-9]{64}$/.test(config.bannedKeySha256) && hash === config.bannedKeySha256) return 'banned';
  if (/^[a-f0-9]{64}$/.test(config.unverifiedKeySha256) && hash === config.unverifiedKeySha256) return 'unverified';
  if (/^[a-f0-9]{64}$/.test(config.ownerKeySha256) && hash === config.ownerKeySha256) return 'owner';
  if (/^[a-f0-9]{64}$/.test(config.plusKeySha256) && hash === config.plusKeySha256) return 'premium';
  if (/^[a-f0-9]{64}$/.test(config.normalKeySha256) && hash === config.normalKeySha256) return 'member';
  return null;
}

export function activeDelta(elapsed, { visible, focused, idleMs }) {
  return visible && focused && idleMs < 60000 ? Math.max(0, Math.min(elapsed, 2000)) : 0;
}

export function localDay(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
function dayNumber(day) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day || '')) return NaN;
  return Date.parse(`${day}T00:00:00Z`) / 86400000;
}
export function updateStreak(stats, today = localDay()) {
  const gap = dayNumber(today) - dayNumber(stats.streakDay);
  if (gap <= 0) return stats;
  const count = gap === 1 ? (stats.streakCount || 0) + 1 : 1;
  return { ...stats, streakDay: today, streakCount: count, bestStreak: Math.max(stats.bestStreak || 0, count) };
}
export function currentStreak(stats, today = localDay()) {
  const gap = dayNumber(today) - dayNumber(stats.streakDay);
  return gap === 0 || gap === 1 ? (stats.streakCount || 0) : 0;
}

export function isPremium(tier) { return tier === 'premium' || tier === 'owner'; }
export function canCustomizeAppearance(tier) { return ['member','premium','owner'].includes(tier); }
export function appearanceForTier(tier, saved, defaults) {
  if (tier === 'banned') return { ...defaults, color: 'red' };
  return { ...(canCustomizeAppearance(tier) ? saved : defaults) };
}

// An explicit route launch counts as a turn if that route is in the rotation.
// Excluded routes may still be launched manually without re-enabling them.
export function recordDirectRoute(routes, previous = {}, url) {
  const ids = routes.map(route => route.url);
  const signature = JSON.stringify(ids);
  const remaining = previous.signature === signature && Array.isArray(previous.remaining)
    ? [...new Set(previous.remaining.filter(item => ids.includes(item)))] : [...ids];
  return { signature, remaining: remaining.filter(item => item !== url), last: url };
}
export function faviconDataUrl(svg, accent) {
  if (!/^#[a-f0-9]{6}$/i.test(accent)) throw new Error('Invalid accent color');
  const shade = factor => '#' + accent.slice(1).match(/../g).map(hex => Math.round(parseInt(hex,16)*factor).toString(16).padStart(2,'0')).join('');
  const tinted = svg.replaceAll('#c18aff',accent).replaceAll('#9670ba',accent).replaceAll('#38234f',shade(.28)).replaceAll('#171121',shade(.12));
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(tinted);
}
export function normalizeTier(status) {
  return status === 'verified' ? 'member' : ['member','premium','owner','banned'].includes(status) ? status : 'unverified';
}
export function routePool(proxies, tier, excluded = []) {
  if (['unverified','banned'].includes(normalizeTier(tier))) return [];
  return destinations(proxies, tier).filter(route => !excluded.includes(route.url));
}
export const BADGE_IDS = ['advertiser','admin','helper','bug-tester','friend','early-access','donor','artist'];
export function cleanProfile(value = {}) {
  const badges = Array.isArray(value?.badges) ? value.badges : [];
  const migrated = value?.badgeSchema === 2 ? badges : badges.map(badge => badge === 'helper' ? 'admin' : badge);
  return {
    name: typeof value?.name === 'string' ? value.name.trim().slice(0,32) : '',
    named: value?.named === true,
    badges: [...new Set(migrated.filter(badge=>BADGE_IDS.includes(badge)))],
    badgeSchema: 2,
    avatar: ANIMAL_IDS.includes(value?.avatar) ? value.avatar : '',
  };
}
