# Veil Hub 4.5

A browser-local proxy launcher for GitHub Pages, with saved profiles and Premium visual effects.

## Run and publish

Run `node tools/serve.mjs` and open http://127.0.0.1:4173. Opening index.html via file:// does not support JavaScript modules. Activation keys requested in chat are configured as SHA-256 hashes. No key setup is required to use this release.

For GitHub Pages, upload this folder's contents to the repository root. In Settings → Pages choose Deploy from a branch, your main branch and /(root). Deployable files: index.html, styles.css, logo.svg, app.js, core.js, config.js, icons.js, effects.js, sites.js, launcher.js, updates.js, assets/ and .nojekyll. No build/dependencies are required. No repository has been created or published automatically.

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

## Version 3.2

Unverified users cannot change any Appearance control. They see the default theme with an activation message. Saved preferences are retained but not applied until Member/Premium/Owner is active; Premium-only effects remain gated separately. Change handlers also check membership, and tier changes update the lock immediately. Device reduced-motion preferences are always respected.

The favicon is recolored to the effective accent using the same local hood SVG. It updates on color selection, reload and membership changes. The SVG is loaded from the same site once, recolored in the browser and applied as a data URL; no external service is used. The original static favicon remains as a fallback.

## Version 3.3: Unverified and Banned keys

The two additional tier keys requested in chat are configured as hashes. One switches to Unverified; the other switches to Banned. Banned is saved under the existing membership storage key. It hides the entire normal app, closes dialogs, disables effects and activity accumulation, and redirects all page hashes to #banned. No sidebar or normal page is visible.

The BANNED screen has a membership-key form. A valid Unverified, Member, Premium or Owner key restores the corresponding tier immediately; wrong keys and the Banned key leave the screen locked. The master code is not accepted as a recovery membership key; use the Owner membership key first. The master menu can also quick-set Banned when already accessible. Names, badges, settings, statistics and exclusions are preserved.

This remains a local-browser convenience status, not a server-enforced ban. The key tool changes the three ordinary membership keys; the special Banned, Unverified and master key hashes are preserved.

## Version 3.4: Sites library

Sites contains 18 unique destinations supplied by the owner. The duplicate Bored.com entry is combined into one featured Hot tile, placed first. Tiles display bundled site logos/favicons and names, with a search field. The supplied CodePen experience is named Gravity Points. All deep paths and query strings are preserved.

Clicking a tile copies its URL using the browser Clipboard API and shows a confirmation telling the user to paste it into a launched Veil proxy. The tile does not navigate directly, open the destination or launch a proxy automatically. If clipboard access is unavailable or rejected, the dialog displays a selectable URL with honest manual-copy instructions. Sites is available to non-Banned tiers; the existing Banned gate hides it with all other pages.

Deploy sites.js and the entire assets/sites folder along with the other app files. Logos load from local files, never a live external icon service. assets/sites/sources.json records where each icon was obtained; original site icons are used where available, with two cached favicons retrieved at build time. Logos belong to their respective sites and do not imply affiliation. tools/fetch-site-logos.mjs is an optional authoring helper and is never invoked by the deployed app.

## Version 3.5: descriptions and about:blank launching

Every Sites tile now has a short, paraphrased description researched from the official site or author project. sites.js and assets/sites/sources.json record the source URLs. Search includes description text.

Launch opens about:blank synchronously from the click and builds a page containing the selected proxy in an iframe. The browser address stays about:blank instead of immediately navigating to the proxy URL. The opener is disconnected, the frame has a no-referrer policy, and top-level navigation by the embedded frame is sandboxed. A small Open directly fallback is available if the proxy refuses embedding or needs top-level features. Choosing that fallback intentionally navigates away from about:blank.

Embedding cannot bypass X-Frame-Options or CSP frame-ancestors restrictions. Some proxies may also need a top-level page for storage, service workers or login. A parent page cannot reliably detect all cross-origin frame failures, so Veil does not claim to detect success or auto-redirect after a timeout. About:blank does not make traffic anonymous or hide destinations from network administrators.

Deploy launcher.js along with the existing files. No backend, external script, or extra runtime service is required.

## Version 3.6: direct route launches and white Default

Launcher cards are passive divs. Only the rotation switch changes exclusions; clicking the name or empty card area has no action. Each accessible route also has a separate Launch button that uses the same about:blank frame launcher. Excluded routes remain directly launchable without being re-enabled. A direct launch updates stats and the last-route/cycle record, so the next random draw avoids immediately repeating it. Explicit manual launches may repeat a route on purpose. Unverified and Banned cannot direct-launch.

The white Default option spans the full top row of Appearance, with the other nine colors below it. Fresh/default Member and Unverified appearance uses white accents; existing saved custom selections are retained for activated users. White applies to the logo and favicon too. Banned always uses red independently of saved appearance.

Sites now includes VOLE.wtf (quirky web games and experiments) and Daily Games at playdaily.org (daily trivia and puzzles), bringing the total to 20 unique entries. Both have locally bundled icons and short descriptions researched from their sites.

## Version 3.7: Premium direct launch

Choosing a specific proxy with its per-route Launch button is now restricted to Premium and Owner. Unverified and Member see shaded buttons; clicking one opens the same Contact the owner dialog used by Buy Premium ($5 lifetime). The shared direct-launch path checks the tier too. Member random rotation and exclusion switches still work as before. Premium/Owner can still manually launch excluded routes without re-enabling them.

## Release 3.5

Updates contains a history split by topic, numbered consecutively from v0.1. Every date follows the original request timestamp in America/New_York. Info credits Daniel Lantz and explains Veil. Quick launch remains Premium/Owner-only. The badge guide prioritizes Admin, Artist, Bug tester, Helper, Advertiser, Donor, Early access, then Friend. Activity uses a compact layout; smaller screens retain scrolling when needed to keep statistics accessible.

## Release 3.6

Added 18 achievements (six launch, six active-time, six best-streak milestones) in a three-column grid, nine Help cards, and launch History with local timestamps and route names. History retains the newest 500 successful popup launches; older browsers can recover only the last recorded launch. Reset statistics clears history too, but earned achievements persist. Data export includes both. All 13 navigation links fit the normal desktop frame; short windows retain scrolling for accessibility. Include community.js when uploading.

## Release 3.7

Disabled native context menus and text selection in the app, with an exception for the Sites popup copy-link field. Form fields still accept typing. These UI preferences do not protect source code or restrict browser developer tools.

## Release 3.8

Achievements now uses one scrolling three-column grid with 36 milestones. New discovery counts cover distinct copied sites, launched routes, visited pages, colors, fonts, wallpapers, trails, and data exports, saved in veil.discoveries.v1. Existing totals and recorded route names count; unsaved past customization or site-copy events cannot be recovered. Resetting statistics retains discovery progress and earned awards. Profiles save one of 18 bundled SVG animal avatars. First naming assigns an animal randomly; existing named activated profiles without one receive one once. Only the master menu can choose a different animal. Unverified always displays the person icon while retaining its saved animal. Include avatars.js in uploads.

## Release 3.9

Redrew all 18 animal avatars as layered local SVG emblems with high-contrast markings. Enlarged the master-menu picker and home avatar rendering. Existing saved animal IDs, random assignment, and Unverified person icon are preserved.

## Release 4.0

Removed Owl, Deer, Bat, and Axolotl. The picker and random assignment use the 14 remaining animals. Invalid retired avatars are cleared during normalization and replaced once for named activated profiles. Unverified keeps the default person.

## Release 4.1

Home-card badge pills flow horizontally and wrap as needed, keeping each badge together.

## Release 4.2

Equipped community badge pills and header stickers use fixed individual colors: Advertiser orange, Admin blue, Helper yellow, Bug tester lime, Friend pink, Early access violet, Donor mint, Artist cyan. The information page and master-menu badge controls keep the selected app accent.

## Release 4.3

Smoothed the shared hood logo and added wrapped fabric folds. All logo placements and the dynamically recolored favicon use the updated local SVG.

## Release 4.4

Added rounded shoulders beneath the hood in the shared logo, including the favicon, while retaining accent recoloring.

## Release 4.5

Proxy windows now contain only a full-window iframe, with no Veil toolbar or direct-open fallback. Their tab title is Veil X Achroma. Sites that refuse embedding may remain blank. Reload the launcher and open a new proxy window after replacing the files; existing popup windows keep their old content. Versioned module imports refresh the launcher code.
