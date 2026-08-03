# thatLife UI tweaks list (v2.0.0)

Living checklist for visual and UX polish before tagging **2.0.0**.  
ATProto work stays out of scope here — fork after this list ships.

Status key: `todo` | `in_progress` | `done`

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

## 3. Dark mode selection + implementation — `todo`

**Problem:** UI is light-only (`bg-white` / `bg-gray-50` / black accents). No theme preference.

**Goal:** User can select **dark mode** (and switch back to light); theme applies app-wide and persists across sessions.

**Likely implementation notes:**

- Prefer `class` strategy on `html`/`body` (Tailwind `darkMode: 'class'`) plus CSS variables for brand red/black
- Persist choice in `localStorage` and optionally on the Sanity `user` document so it follows the account
- Entry point: editable profile (#1) and/or a compact control in sidebar/nav
- Audit high-traffic surfaces: `SideBar`, `NavBar`, `Feed`/`Pin`, `PinDetail`, `Login`, `UserProfile`, `CreatePin`

**Acceptance:**

- [ ] User can choose dark vs light
- [ ] Preference persists after reload
- [ ] Core screens remain readable (contrast, borders, overlays) in both themes

---

## 4. More categories + icon-based category list — `todo`

**Problem:** Category list uses remote photos (fragile/broken thumbs) and is missing several intended topics.

**Goal:**

- Add at least **Movies**, **Books**, and **Celebrities**
- Replace photo thumbnails with **simple icons** (e.g. `react-icons`) in the sidebar category list
- Keep category names compatible with pin `category` filtering / Create Pin dropdown

**Current code touchpoints:**

- [`thatlife_frontend/src/utils/data.js`](../thatlife_frontend/src/utils/data.js) — `categories` array (`image` URLs)
- [`SideBar.jsx`](../thatlife_frontend/src/components/SideBar.jsx) — renders `<img src={category.image} />`
- Create Pin category `<select>` (same `categories` source)

**Acceptance:**

- [ ] Movies, Books, Celebrities appear in sidebar and create-pin category list
- [ ] Sidebar uses icons (not photo URLs) for every category
- [ ] Existing category routes (`category/:name`) still work; new ones filter correctly

---

## 5. Collapsible, better-sectioned left sidebar — `todo`

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

**Open decisions (fill in while building):**

- Additional Main links beyond About (e.g. Help, Privacy, Changelog?)
- Collapsed = icons-only rail vs fully hidden

**Acceptance:**

- [ ] User can collapse/expand the sidebar on desktop
- [ ] Nav is visually sectioned (Main / Discover / Account or equivalent)
- [ ] About page/route exists and is linked from Main
- [ ] Mobile sidebar behavior remains usable

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

## Backlog (add items below)

_Add new numbered items as we find them during QA._
