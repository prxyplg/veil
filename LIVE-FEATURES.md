# Live announcements and active-user counts without a backend

Veil's current release is entirely client-side. Its scripts, SVG icons, effects, fonts and data storage run in each user's browser. GitHub Pages serves the files. It does not require a Node server, database, external CDN, analytics service or paid account to run the deployed app. The local Node preview server is only a development convenience. The proxy destinations themselves are necessarily outside Veil.

## What an owner announcement needs

For an announcement typed on your computer to reach someone else's device, there must be a shared place to publish it. localStorage on your browser is not shared with another user's browser. A master menu saved locally cannot remotely change their data.

### A static-only option using the same GitHub Pages site

An announcement editor could export an announcements.json file with an ID, title, message, start time and optional expiry. You would commit/upload that file to the same GitHub repository. Once GitHub Pages deploys it, Veil could fetch ./announcements.json every 30–60 seconds and on tab focus. On seeing a new ID, it would show a dismissible announcement. The dismissed ID would be saved in that user's localStorage so it stays closed.

This uses only the same static site hosting already needed for Veil. It needs no additional runtime service or database. It is not instant: publication depends on uploading the file, the Pages deployment, cache behavior and the next client check. Offline browsers see it only when online again.

Typing in the master menu alone cannot securely publish that file to the repository. The zero-backend workflow is Draft → Download JSON → Upload/commit to GitHub. A direct Publish button would need the owner's authenticated GitHub access or a secure service. Never distribute a GitHub personal access token in this public app.

A truly live, authenticated Publish button with push delivery to every connected device needs shared infrastructure. That is outside the requirement of no external runtime service.

## Live active users

A global active-user counter needs each device to report that it is active, plus a shared place that combines the reports. A typical service would accept an anonymous session heartbeat every 15–30 seconds, expire sessions after about 60 seconds without a heartbeat, and return the remaining session count. It would count sessions, not necessarily unique people, unless actual user authentication existed.

A static GitHub Pages site cannot accept or aggregate those writes. A counter in localStorage can only know this browser's own state. BroadcastChannel can coordinate tabs of the same origin in the same browser/storage partition, but cannot discover users on other devices. A random or increment-on-load number would not be a real active-user count.

Under the no-backend requirement, useful honest alternatives are Current session, Your launches, Your active time, Your streak, or Open Veil tabs in this browser. A global live count is not available without relaxing that requirement.

## Current implementation

No live announcement system or global user counter has been added, and no fake live data is displayed. The Badges page describes recognition and owner award criteria; it does not automatically verify contributions or donations. The master menu edits only the current browser's profile.

References:
- https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API
