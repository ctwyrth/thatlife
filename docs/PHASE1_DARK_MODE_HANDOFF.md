# Phase 1 handoff — #3 Dark mode (you build)

Hand-code this so you feel how Tailwind `dark:` + `localStorage` + the existing `user.theme` field connect.  
I will not implement it unless you ask; use this as your checklist.

**Working directory:** `thatlife_frontend/`  
**Validate:** `npm run dev` → toggle theme, reload, check Login / Home / Feed / Pin detail / Create / Profile.

Keep one-line file purpose comments on new/changed files.

---

## Goals (acceptance)

- [x] User can choose **dark** vs **light**
- [x] Preference persists after reload (`localStorage`)
- [x] When signed in, preference also syncs to Sanity `user.theme` (`light` | `dark`) when practical
- [x] Core screens readable in both themes (sidebar, navbar, feed, pin detail, create, login, profile)

Schema already has `theme` on User (Phase 0). No Studio changes required.

---

## 1. Enable Tailwind class dark mode

**File:** [`tailwind.config.cjs`](../thatlife_frontend/tailwind.config.cjs)

Add at the top level of the exported config (sibling of `content` / `theme`):

```js
darkMode: 'class',
```

With this, `dark:bg-gray-900` only applies when `<html class="dark">` (or an ancestor) has the `dark` class.

---

## 2. Theme helpers

**New file (suggested):** `src/utils/theme.js`

Purpose comment at top. Export something like:

| Helper | Job |
| --- | --- |
| `THEME_KEY` | e.g. `'thatlife-theme'` — the **storage key name**, not the theme value |
| `getStoredTheme()` | `localStorage.getItem(THEME_KEY)`; default `'light'` if missing/invalid |
| `applyTheme(theme)` | put `'dark'` on `<html>` only when `theme === 'dark'`; always save via `THEME_KEY` |
| `toggleTheme()` | flip light ↔ dark via `applyTheme` |

Keep themes as the strings **`light`** and **`dark`** so they match the Sanity schema `options.list`.

### What `THEME_KEY` is

`localStorage` is a key → value map. You need a **fixed string name** for the slot where you store the preference:

```
localStorage['thatlife-theme'] = 'dark'   // or 'light'
```

`THEME_KEY` is just that slot name, exported so `theme.js` and the `index.html` boot script use the **exact same string**. The theme itself (`'light'` / `'dark'`) is the **value** you store under that key — not the key.

```js
export const THEME_KEY = 'thatlife-theme';

export function getStoredTheme() {
  const value = localStorage.getItem(THEME_KEY); // read by key name
  return value === 'dark' || value === 'light' ? value : 'light';
}

export function applyTheme(theme) {
  // Prefer one line over if/else — see below
  document.documentElement.classList.toggle('dark', theme === 'dark');
  localStorage.setItem(THEME_KEY, theme); // write value under same key
}
```

Flow: NavBar click → `toggleTheme()` → `applyTheme('dark')` → (1) `<html class="dark">` (2) `localStorage.setItem('thatlife-theme', 'dark')`. On reload, the inline script and `getStoredTheme()` both read that same key.

### `applyTheme` — if/else vs `toggle`

Yes: conceptually “if dark, add class; else remove it.” You can write that as if/else:

```js
if (theme === 'dark') {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}
```

Or the equivalent one-liner (same behavior):

```js
document.documentElement.classList.toggle('dark', theme === 'dark');
```

The second argument means: **force the class on when true, force it off when false**. You are not “toggling blindly”; you are syncing the DOM to the `theme` argument. Always also `setItem(THEME_KEY, theme)` so the choice survives reload.

Tailwind only cares about the class name `dark` on `<html>`. The strings `'light'` / `'dark'` are for storage + Sanity; only `'dark'` maps to adding that class.

---

## 3. Avoid flash of wrong theme (FOUC)

**File:** [`index.html`](../thatlife_frontend/index.html)

Before the app bundle loads, add a tiny inline script in `<head>` that reads `localStorage` and sets `class="dark"` on `<html>` when needed. Example pattern:

```html
<script>
  (function () {
    try {
      var t = localStorage.getItem('thatlife-theme');
      if (t === 'dark') document.documentElement.classList.add('dark');
    } catch (e) {}
  })();
</script>
```

Use the **same key** as `THEME_KEY` in `theme.js`.

---

## 4. Theme toggle UI

**Suggested:** compact control in [`NavBar.jsx`](../thatlife_frontend/src/components/NavBar.jsx) (always visible next to search / Sign in). Optionally mirror in [`SideBar.jsx`](../thatlife_frontend/src/components/SideBar.jsx) later under Account (#5/#6).

- Use `react-icons` (e.g. sun / moon) — already in the project
- On click: `const next = toggleTheme()` (or get + apply)
- Optional: `useState` for icon label so the button updates without full reload

Guests and signed-in users both get the toggle.

---

## 5. Sync to Sanity when logged in (optional but recommended)

When the user toggles theme **and** you have a Sanity user id (`user._id`):

```js
client
  .patch(user._id)
  .set({ theme: nextTheme })
  .commit()
  .catch(() => {/* local theme still works if mutate fails */});
```

On Home load (you already `client.fetch(userQuery(...))`):

- If `data[0].theme` is `light` or `dark`, call `applyTheme(data[0].theme)` so account preference wins over a stale local value (or only apply if local is empty — pick one rule and stick to it).

**Recommended rule:** on login/fetch, **Sanity `user.theme` wins** when set; otherwise keep `localStorage` / default light.

Do not block the UI on the patch.

---

## 6. Class audit — add `dark:` variants

You do **not** need every gray shade perfect on day one. Aim for readable contrast on high-traffic surfaces.

**Common swaps**

| Light (today) | Dark companion |
| --- | --- |
| `bg-white` | `dark:bg-gray-900` or `dark:bg-gray-800` |
| `bg-gray-50` | `dark:bg-gray-950` / `dark:bg-black` |
| `text-black` / `text-gray-500` | `dark:text-white` / `dark:text-gray-300` |
| `border-black` / `border-gray-200` | `dark:border-gray-600` |
| Active sidebar `border-black` | `dark:border-white` |
| Search `bg-white` inputs | matching dark surface + `dark:text-white` |

**Priority files**

1. `containers/Home.jsx` — shell background
2. `components/SideBar.jsx` — nav + links (`isActiveStyle` / `isNotActiveStyle`)
3. `components/NavBar.jsx` — search bar + toggle
4. `components/Pin.jsx` / `PinDetail.jsx` — overlays already dark-ish; fix white chips / text
5. `components/CreatePin.jsx`, `Login.jsx`, `UserProfile.jsx`
6. `components/Spinner.jsx` if it assumes a light page

Tip: search the frontend for `bg-white` and `bg-gray-50` and fix hits file by file.

Logo: if the PNG is dark-on-transparent and vanishes on dark bg, either leave a note for later or add a light invert (`dark:invert`) only if it looks acceptable.

---

## 7. Check

1. Toggle → `<html>` gains/loses `class="dark"`; surfaces update
2. Hard reload → theme stays
3. Guest toggle works without Sanity
4. Signed-in: Studio User document `theme` updates after toggle (or stays local-only if you deferred §5)
5. Spot-check Login, Home feed, open a pin, Create Pin, User profile

---

## Out of scope for this handoff

- Full editable profile page (#1) — toggle in nav is enough for now
- Perfect every hover state / every modal
- CSS variable redesign of brand colors (nice later; `dark:` classes are enough for #3)

---

## When you’re done — `done`

Dark mode shipped (helpers + toggle + Sanity sync + `dark:` class audit). Next Phase 1 item is **#5 collapsible / sectioned sidebar**.
