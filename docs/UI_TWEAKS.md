# thatLife UI tweaks list (v2.0.0)

Living checklist for visual and UX polish before tagging **2.0.0**.  
ATProto work stays out of scope here — fork after this list ships.

Status key: `todo` | `in_progress` | `done`

## Scope decisions (from UI modernization assessment)

Locked for planning / implementation order:

- **Grid attribution:** Remove always-visible poster name/avatar under masonry tiles; use a thin **title + tags** footer on the card instead. Full author row stays on pin detail / profile.
- **Short-form video:** **Schema hooks only** in the 2.0.0 pass (`mediaType`, optional `video` / poster fields on `pin`). No create UI, feed playback, or asset-proxy work for video until **2.1.0** (see #11).
- **Pin detail:** Desktop/tablet **modal** over the feed; mobile **full page**; keep a shareable `/pin-detail/:id` (or `/pin/:id`) route (#10).

Ordered build path: [`docs/V2_IMPLEMENTATION.md`](V2_IMPLEMENTATION.md).  
Hand-coding guide for Phase 0: [`docs/PHASE0_SCHEMA_HANDOFF.md`](PHASE0_SCHEMA_HANDOFF.md).

---

## 1. Editable profile settings — `todo`

**Problem:** The user page (`UserProfile`) is view-only today (Created/Saved pins + logout). There is no way to edit display identity or notification prefs.

**Goal:** Give the signed-in user a clear path to an editable profile/settings surface where they can:

- Change their **displayed username** (`userName` in Sanity)
- **Update their avatar** (upload/replace image; today avatar is the Google profile URL string)
- Toggle notifications for:
  - likes (saves) on their posts
  - comments on their posts

**Current code touchpoints:**

- [`thatlife_frontend/src/components/UserProfile.jsx`](../thatlife_frontend/src/components/UserProfile.jsx) — public profile + logout only
- [`thatlife_backend/schemas/user.js`](../thatlife_backend/schemas/user.js) — only `userName` + `image` (string); no notification fields yet
- Login writes user via Google `name` / `picture` / `sub` in [`Login.jsx`](../thatlife_frontend/src/components/Login.jsx)

**Likely implementation notes (when we build it):**

- Add an **Edit profile** / **Settings** entry visible only on your own profile (or from sidebar when signed in)
- Extend Sanity `user` schema with notification prefs (e.g. `notifyOnLike`, `notifyOnComment` booleans) and possibly treat `image` as Sanity image asset or keep URL string after upload
- Wire updates through existing `/api/mutate` (+ `/api/asset` for avatar upload)
- Notification *delivery* (email/push) can be stubbed as stored prefs for v2.0.0 unless we explicitly add a mailer later — UI + persisted settings are the v2 deliverable

**Acceptance:**

- [ ] Own profile exposes Edit / Settings
- [ ] Username change saves and shows across feed/profile
- [ ] Avatar can be updated and shows in nav/sidebar/pins
- [ ] Like/comment notification toggles persist on the user document

---

## 2. First login lands on editable profile — `todo`

**Problem:** After Google OAuth, users go straight to the home feed (`Login.jsx` → `navigate('/')`). New accounts never see profile setup.

**Goal:** On **first** successful login (new Sanity user / no completed profile flag), route to the editable profile/settings page from item **#1**. Returning users keep the current home-feed landing.

**Likely implementation notes:**

- Detect first login via `createIfNotExists` result, a `profileComplete` (or similar) field on `user`, or “username still equals Google name and never edited”
- After Google success: `navigate('/profile/edit')` (or agreed route) when first-time; else `navigate('/')`
- Editable profile page should offer a clear **Continue to feed** / skip once minimum fields are set (decide during build)

**Acceptance:**

- [ ] Brand-new account opens editable profile after Google auth
- [ ] Subsequent logins open the home feed (unless we later add a “force setup” flag)
- [ ] User can reach the feed from that first-run screen

**Depends on:** #1

---

## 3. Dark mode selection + implementation — `done`

**Problem:** UI is light-only (`bg-white` / `bg-gray-50` / black accents). No theme preference.

**Goal:** User can select **dark mode** (and switch back to light); theme applies app-wide and persists across sessions.

**Handoff:** [`PHASE1_DARK_MODE_HANDOFF.md`](PHASE1_DARK_MODE_HANDOFF.md)

**Likely implementation notes:**

- Prefer `class` strategy on `html`/`body` (Tailwind `darkMode: 'class'`) plus CSS variables for brand red/black
- Persist choice in `localStorage` and optionally on the Sanity `user` document so it follows the account
- Entry point: editable profile (#1) and/or a compact control in sidebar/nav
- Audit high-traffic surfaces: `SideBar`, `NavBar`, `Feed`/`Pin`, `PinDetail`, `Login`, `UserProfile`, `CreatePin`

**Acceptance:**

- [x] User can choose dark vs light
- [x] Preference persists after reload
- [x] Core screens remain readable (contrast, borders, overlays) in both themes

---

## 4. More categories + icon-based category list — `done`

**Problem:** Category list uses remote photos (fragile/broken thumbs) and is missing several intended topics.

**Goal:**

- Add at least **Movies**, **Books**, and **Celebrities**
- Replace photo thumbnails with **simple icons** (e.g. `react-icons`) in the sidebar category list
- Keep category names compatible with pin `category` filtering / Create Pin dropdown

**Current code touchpoints:**

- [`thatlife_frontend/src/utils/data.js`](../thatlife_frontend/src/utils/data.js) — `categories` array (`icon` components)
- [`SideBar.jsx`](../thatlife_frontend/src/components/SideBar.jsx) — renders category icon component
- Create Pin category `<select>` (same `categories` source)

**Acceptance:**

- [x] Movies, Books, Celebrities appear in sidebar and create-pin category list
- [x] Sidebar uses icons (not photo URLs) for every category
- [x] Existing category routes (`category/:name`) still work; new ones filter correctly

---

## 5. Collapsible, better-sectioned left sidebar — `done`

**Problem:** Sidebar is a flat stack: logo → single **Home** link → long category list → user chip. Home feels under-expanded; no clear sections; sidebar isn’t collapsible on desktop.

**Goal:**

- Make the left sidebar **collapsible** (desktop + keep mobile drawer behavior)
- **Section** navigation more clearly, e.g.:
  - **Main** — Home, and expand Home-adjacent links (at least **About**; other links TBD during build)
  - **Discover** — categories (with icons from #4)
  - **Account** — user menu from #6
- Collapsed state should still expose logo/home and a control to expand

**Current code touchpoints:**

- [`SideBar.jsx`](../thatlife_frontend/src/components/SideBar.jsx), [`Home.jsx`](../thatlife_frontend/src/containers/Home.jsx) (desktop column + mobile toggle)
- [`About.jsx`](../thatlife_frontend/src/components/About.jsx) — `/about` route

**Decisions:**

- Collapsed = **icons-only rail** (not fully hidden); preference in `localStorage` (`thatlife-sidebar-collapsed`)
- Main links for now: Home + About (more TBD)
- Account section still links to profile / Sign in until #6 shared menu

**Acceptance:**

- [x] User can collapse/expand the sidebar on desktop
- [x] Nav is visually sectioned (Main / Discover / Account or equivalent)
- [x] About page/route exists and is linked from Main
- [x] Mobile sidebar behavior remains usable

---

## 6. User menu: Page / Profile / Sign off (sidebar + navbar) — `todo`

**Problem:** Sidebar bottom user chip and navbar top-right avatar both hard-link to `user-profile/:id` only. Logout lives only as an icon on the profile header.

**Goal:** Both entry points expose a small menu with three actions:

1. **User’s Page** — public profile (`user-profile/:id`, Created/Saved pins)
2. **Profile Page** — editable settings from #1
3. **Sign Off** — Google logout + clear `localStorage` + route to login

**Current code touchpoints:**

- [`SideBar.jsx`](../thatlife_frontend/src/components/SideBar.jsx) — bottom `<Link to={user-profile/...}>`
- [`NavBar.jsx`](../thatlife_frontend/src/components/NavBar.jsx) — avatar next to create (`IoMdAdd`)
- Logout logic today in [`UserProfile.jsx`](../thatlife_frontend/src/components/UserProfile.jsx)

**Likely implementation notes:**

- Shared `UserMenu` dropdown/popover used in sidebar + navbar
- Distinguish routes clearly: e.g. `/user-profile/:id` vs `/profile` or `/settings`
- Keyboard + click-outside dismiss; works in light/dark (#3)

**Acceptance:**

- [ ] Sidebar user control opens the three-item menu (not an immediate redirect)
- [ ] Navbar avatar opens the same three-item menu
- [ ] User’s Page / Profile / Sign Off all work as specified

**Depends on:** #1 (Profile Page target)

---

## 7. Post options: downloads, optional URL, strip image metadata — `todo`

**Problem:** Create Pin requires a destination URL; feed/detail always show a download control (`?dl=` on the asset URL). There is no per-post privacy/options and no EXIF/metadata scrubbing before upload.

**Goal:** When creating (and ideally viewing) a post, support:

1. **Allow downloads** — toggle whether viewers get the download button (default TBD: likely on)
2. **Destination URL optional** — not required to publish; only show link UI when present
3. **Strip image metadata before post** — if workable, option to remove EXIF/GPS/etc. client-side (or via a small upload pipeline) before the asset hits Sanity

**Current code touchpoints:**

- [`CreatePin.jsx`](../thatlife_frontend/src/components/CreatePin.jsx) — `savePin` requires `destination`; upload is raw `File` to Sanity
- [`Pin.jsx`](../thatlife_frontend/src/components/Pin.jsx) / [`PinDetail.jsx`](../thatlife_frontend/src/components/PinDetail.jsx) — always render download + destination link
- [`pin.js` schema](../thatlife_backend/schemas/pin.js) — `destination` url field; no `allowDownload` (or similar)

**Likely implementation notes:**

- Schema: add `allowDownload` (boolean, default `true`); keep `destination` but stop treating it as required in the form
- Create Pin: checkbox/toggles for allow-download + strip-metadata; validate URL only when non-empty
- Pin/PinDetail: gate download UI on `allowDownload`; keep destination conditional (`destination && …` already partly there on hover card)
- Metadata strip: try browser-side re-encode (canvas / `createImageBitmap`) for JPEG/PNG before `client.assets.upload`; note SVG/GIF limits; if strip fails, show clear message and optionally block post when “strip required”
- True forensic scrubbing isn’t guaranteed in-browser — document honesty in UI (“removes common EXIF when possible”)

**Acceptance:**

- [ ] Posts can be created without a destination URL
- [ ] Destination link only appears when a URL was provided
- [ ] Per-post control hides/shows download affordances on feed + detail
- [ ] Optional strip-metadata path runs before upload when selected (or explains why it can’t for that file type)

---

## 8. Pin card redesign (title/tags footer; no always-on username) — `todo`

**Problem:** Masonry tiles always show a large poster avatar + name under the image ([`Pin.jsx`](../thatlife_frontend/src/components/Pin.jsx)). Resting state has no title/tags; the grid feels dated vs modern Pinterest.

**Goal:** Resting card = image + thin footer (1-line **title** + **tag chips** from `tags` / category). No always-visible username. Hover/focus exposes Save and a compact overflow menu (download if allowed, destination, delete if owner). Full author row only on detail/profile.

**Depends on:** #12 for tags on cards (category chip alone is OK as interim).

**Acceptance:**

- [ ] Grid tiles do not show poster name/avatar in the resting state
- [ ] Title (and tags when present) appear in a compact footer
- [ ] Save / download / link / delete remain available on hover or menu without cluttering the default view

---

## 9. Optimistic save (no full page reload) — `todo`

**Problem:** Saving a pin calls `window.location.reload()` after Sanity commit ([`Pin.jsx`](../thatlife_frontend/src/components/Pin.jsx)).

**Goal:** Update local pin `save` state (and button label/count) immediately on success; revert or toast on failure. No full reload.

**Acceptance:**

- [ ] Save toggles UI without reloading the page
- [ ] Failed saves surface an error and restore prior state

---

## 10. Pin detail modal (desktop) + full page (mobile) — `todo`

**Problem:** `/pin-detail/:pinId` replaces the feed with a full-page detail view, losing masonry context ([`Pins.jsx`](../thatlife_frontend/src/containers/Pins.jsx), [`PinDetail.jsx`](../thatlife_frontend/src/components/PinDetail.jsx)).

**Goal:** Keep a shareable pin route. On **md+**, open detail as a modal/drawer over the dimmed feed; on **small screens**, keep full-page detail. Esc/backdrop closes and restores prior scroll when possible. Related pins stay in the detail panel scroll.

**Acceptance:**

- [ ] Deep link `/pin-detail/:id` still works on refresh
- [ ] Desktop: modal over feed; mobile: full page
- [ ] Close returns to feed without a hard navigation loss of context (best-effort scroll restore)

---

## 11. Short-form video — schema hooks in 2.0.0; full feature in 2.1.0 — `todo`

**Problem:** Pins are image-only. Modern Pinterest-like apps support short video (“Idea Pin” style) in the same masonry.

**Goal (2.0.0 — schema only):** Extend pin schema with `mediaType` (`image` | `video`), optional `video` file field, and poster/thumbnail. Do **not** change Create Pin, feed tiles, detail player, or `/api/asset` for video in this pass.

**Goal (2.1.0):** Upload caps (duration/size), create UI for short video, muted autoplay/hover-play on tiles, detail playback, extend asset proxy for video bodies.

**Acceptance (2.0.0 hooks):**

- [ ] Schema includes `mediaType` + optional video/poster fields
- [ ] Existing image pins remain valid (missing `mediaType` treated as image)
- [ ] No video upload/playback UI shipped in 2.0.0

**Acceptance (2.1.0):** tracked separately when that release starts.

---

## 12. Pin `tags[]` + show on cards/detail — `todo`

**Problem:** Discovery is a single `category` string. Cards and detail have no multi-tag surface.

**Goal:** Add `tags` (array of strings) on the pin schema; keep `category` as the primary sidebar topic. Create Pin can add tags; cards (#8) and detail show chips. Search can optionally match tags later.

**Acceptance:**

- [ ] Pins store zero or more tags
- [ ] Tags appear on detail; appear on card footer when present
- [ ] Category sidebar behavior unchanged

---

## 13. User `bio` on public profile — `todo`

**Problem:** Public profile only shows name + avatar (+ pins). No short bio for a current Pinterest-like identity.

**Goal:** Add optional `bio` on the user schema; editable on profile settings (#1); shown on public [`UserProfile`](../thatlife_frontend/src/components/UserProfile.jsx).

**Depends on:** #1 for edit UI.

**Acceptance:**

- [ ] Bio field on user document
- [ ] Visible on public profile when set
- [ ] Editable from profile settings

---

## Backlog (add items below)

_Add new numbered items as we find them during QA._
