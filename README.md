# Veil Hub 3.1

A browser-local proxy launcher for GitHub Pages, with saved profiles and Premium visual effects.

## Run and publish

Run `node tools/serve.mjs` and open http://127.0.0.1:4173. Opening index.html via file:// does not support JavaScript modules. Activation keys requested in chat are configured as SHA-256 hashes. No key setup is required to use this release.

For GitHub Pages, upload this folder's contents to the repository root. In Settings → Pages choose Deploy from a branch, your main branch and /(root). Deployable files: index.html, styles.css, logo.svg, app.js, core.js, config.js, icons.js, effects.js and .nojekyll. No build/dependencies are required. No repository has been created or published automatically.

[GitHub Pages instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

Run `node --test` to verify rotation, tier access, exclusions, profile normalization, active time and streaks.

## Membership and profile

- Unverified: distinctly labeled, dashed guest card; launching and Premium effects are locked.
- Member (formerly Verified): the three member routes, color themes, six fonts and glow controls. The card explicitly says verified access.
- Premium: all 32 routes, eight animated wallpapers and eight cursor trails. $5 lifetime.
- Owner: full Premium access with a crown badge.
- Member costs $1 lifetime. Buy buttons say Contact the owner; no payment is collected automatically.

Entering any valid tier key replaces the current tier, including downgrades. The launcher automatically uses the current membership's pool; there is no manual Member/Premium mode selector. Premium is called Premium throughout the app.

The first successful activation asks for a name. It is saved separately in veil.profile.v1 and is not requested again when keys change or membership is forgotten. A pending first-name prompt resumes if the browser is closed before completion. Existing active profiles without names receive this one-time prompt after loading. Names are limited to 32 characters and displayed as text.

Enter the requested master code into the same activation field to open the Owner master menu. It can set the name, quick-set Unverified/Member/Premium/Owner, and assign all eight community badges. Closing it locks the menu again. The master code hash is in config.masterKeySha256; it does not change when ordinary tier keys are changed with the key tool.

Badge icons: Advertiser megaphone, Admin crossed tools, Helper light bulb, Bug tester ladybug, Friend heart, Early access star, Donor money bag, Artist palette. Named badges appear in a list in the member card, with up to eight scattered stickers around the tier badge. Old developer Helper awards migrate to Admin once. Badges and names stay saved independently of membership.

## Visuals and navigation

The outer frame has a fixed viewport-relative size. The header and sidebar stay in place; page contents animate inside a separately scrolling panel. The logo, controls, card aura and badge stickers have subtle animations. A five-second loading screen appears on every full open/reload with logo and real progress-bar updates; page navigation does not show it again.

Appearance settings include nine colors, glow strength 1–10, glow on/off, six font stacks, animation on/off, and Premium effects. Font stacks use system-installed fonts and fallbacks, with no font downloads required.

Wallpapers: Aurora, Starfield, Waves, Digital rain, Orbits, Nebula, Vortex, Fireflies.
Cursor trails: Comet, Sparkles, Bubbles, Ribbon, Orbit, Embers, Hearts, Pulse rings.

Both match the selected accent. Effects are gated for Premium and Owner in both UI and renderer. Downgrading stops them immediately while retaining selections for a later upgrade. Off is available for both. Cursor trails require mouse/pen movement and are not emitted for touch. Animations respect the system reduced-motion preference; effects pause in hidden tabs, run at a capped frame rate and cap device pixel ratio/particle counts.

## Routes

The configured collection contains 32 provided URLs, three marked normal: true. Member uses those three; Premium/Owner use the full collection.

Toggle a route off to exclude it; the row becomes shaded and crossed out. Exclusions persist across reloads and membership changes in veil.excluded.v1. Excluded URLs never enter the launch pool. When all are excluded, launching is disabled. If only one enabled route remains and it was the last launch, another must be enabled to prevent consecutive repeats.

Rotation randomly draws every enabled route once before resetting, avoids consecutive repeats across cycles and saves cycle state. A blocked popup does not consume a turn. Veil opens a new tab with opener disconnected; it does not implement a proxy or guarantee URL availability.

## Home and Activity

Home greets the saved user and presents a member card with name, tier, badges, cumulative active uptime, current streak, successful launches and last route.

Activity shows minutes/hours/days, current and best streak, successful launches, session active time, last launch timestamp and a seven-day active-minutes chart. New daily data starts with this release; old cumulative totals are retained without inventing historical daily values.

Time counts while Veil is visible, focused and has input within the last 60 seconds. Loading, idle/offline time and time spent on an opened proxy tab do not count. Suspension gaps are capped. Streaks count each local calendar day with active use once; a missed day ends the streak. The daily log keeps up to 366 dates.

Settings exports profile/stats/appearance to JSON, forgets membership, or resets statistics. Reset clears streaks and daily data, but preserves the profile, tier, route exclusions and rotation. Reset and Forget require a dialog confirmation.

## Local data and limits

Data stays in localStorage under veil.*. Earlier volt/Verified memberships migrate automatically. Clearing site data, another browser/device/origin, private browsing or browser eviction can remove saved state. When storage is blocked the app works only for that visit and warns about persistence.

This is a client-side convenience gate. Local tiers, master access, badges, stats and effect locks can be edited or bypassed by a browser user. Public source exposes destinations and key hashes. Enforced purchases, revocation, cross-device identities and secure owner permissions require server-side authentication. Changing a key does not revoke a membership already stored locally.

The logo and name are branding, not a promise of anonymity or traffic protection.

## Version 3.1

Home uses a standard head-and-shoulders profile avatar. The Veil brand is a more defined hooded figure and also the relative SVG favicon on GitHub Pages. Popup close icons use geometrically centered SVG strokes. Badges has a dedicated page explaining every badge, its meaning and how the owner can award it. Nebula has brighter additive clouds and star detail.

The deployed app has no runtime services, package dependencies, remote fonts, CDN assets, analytics or third-party SDKs. All effect drawing and profile storage are local to each browser. See LIVE-FEATURES.md for what static-only announcements can do and why a global active-user count requires shared infrastructure.
