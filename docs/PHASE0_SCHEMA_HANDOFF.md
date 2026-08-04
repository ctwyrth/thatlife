# Phase 0 handoff — schema foundation (you build)

You are hand-coding this phase so you can feel how Studio schemas connect to later UI.  
I will not implement these fields for you unless you ask; use this as your checklist.

**Working directory:** `thatlife_backend/`  
**Validate:** `npx sanity schema validate`  
**Run Studio:** `npm run dev` → confirm new fields appear on User / Pin documents.

Keep the existing one-line file purpose comments and use `defineField` like the current schemas.

---

## 1. Extend [`schemas/user.js`](../thatlife_backend/schemas/user.js)

Add these fields after `image` (all optional so old users keep working):

| Name | Type | Notes |
| --- | --- | --- |
| `bio` | `string` | Short profile blurb (#13) |
| `profileComplete` | `boolean` | First-login gate (#2); default unset/false |
| `notifyOnLike` | `boolean` | Pref only (#1); no mailer in 2.0.0 |
| `notifyOnComment` | `boolean` | Pref only (#1) |
| `theme` | `string` | e.g. `light` \| `dark` (#3); or leave unset |

Suggested pattern:

```js
defineField({
  name: 'bio',
  title: 'Bio',
  type: 'string',
  description: 'Short public profile description',
}),
```

Update `preview.select` if you want `subtitle: 'bio'`.

---

## 2. Extend [`schemas/pin.js`](../thatlife_backend/schemas/pin.js)

Add after existing fields (or grouped logically under image):

| Name | Type | Notes |
| --- | --- | --- |
| `allowDownload` | `boolean` | Default `true` via `initialValue: true` (#7) |
| `tags` | `array` of `string` | Multi-tag chips (#12); keep `category` for sidebar |
| `altText` | `string` | Accessibility |
| `mediaType` | `string` | Prefer `options.list`: `image`, `video`; `initialValue: 'image'` |
| `video` | `file` | `options: { accept: 'video/*' }` — **hook only for 2.1.0** |
| `poster` | `image` | Optional thumbnail for future video tiles |

Example for `tags`:

```js
defineField({
  name: 'tags',
  title: 'Tags',
  type: 'array',
  of: [{ type: 'string' }],
  options: { layout: 'tags' },
}),
```

Do **not** change Create Pin / Feed / PinDetail for video yet.

---

## 3. Sanity Studio check

1. `cd thatlife_backend && npm run dev`  
2. Open a **User** → see bio / prefs / theme  
3. Open a **Pin** → see allowDownload, tags, altText, mediaType, video, poster  
4. Existing pins still open without errors (missing new fields is fine)

---

## 4. Frontend GROQ — pull new fields when the UI needs them

**File:** [`thatlife_frontend/src/utils/data.js`](../thatlife_frontend/src/utils/data.js)

GROQ only returns what you project. Schema fields exist in Studio, but React won’t see them until you add them to the query brace lists.

You can do a **minimal pass now** (recommended) or wait until each UI item needs a field. Either way, don’t invent UI yet—just fetch.

### Minimal pin projection (add to every pin-list / detail query)

Add these lines next to existing fields like `destination` / `category`:

```
allowDownload,
tags,
mediaType,
```

Optional now (skip if you never added `altText` to the pin schema):

```
altText,
```

Video hooks — only project when you’re ready to touch detail UI later (2.1.0). Safe to omit until then:

```
video{
  asset->{
    url
  }
},
poster{
  asset->{
    url
  }
},
```

### Which exports to touch

| Export | Why |
| --- | --- |
| `feedQuery` | Home masonry |
| `searchQuery` | Search + category feed |
| `pinDetailQuery` | Pin detail (needs `allowDownload` / `tags` first) |
| `pinDetailMorePinQuery` | Related pins |
| `userCreatedPinsQuery` | Profile Created |
| `userSavedPinsQuery` | Profile Saved |

Same shape for list queries: add the fields after `_id` / `destination`. Detail can include more.

### User query (when you hit profile / dark mode)

`userQuery` today is `*[_type == "user" && _id == '...']` with **no projection** — Sanity returns the whole document, so `bio`, `theme`, prefs already come back. Only change it if you later switch to an explicit `{ ... }` projection; then list those fields.

### Check

1. Edit a pin in Studio: set a couple of tags, toggle `allowDownload`.
2. In the browser Network tab (or a temporary `console.log` of fetch results), confirm those keys appear on the pin objects.
3. No UI change required for this step to count as done.

---

## 5. When you’re done with Phase 0 — `done`

Phase 0 complete (schemas + Studio check + GROQ projections + runtime verify). Product packages bumped to **2.0.1**.

**Note:** UI tweak **#4** (category icons) shipped in the same pass — separate from Phase 0 §4. Next hand-coding pick for Phase 1 is **#3 dark mode** (or pair on **#5** sidebar).
