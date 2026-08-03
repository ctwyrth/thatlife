# thatLife Sanity Studio (v3)

Local CMS for the thatLife photo-blogging app. Connected to Sanity project `nnu4f987` / dataset `production`.

## Setup

```bash
cd thatlife_backend
npm install
npm run dev
```

Studio opens at the URL printed in the terminal (usually `http://localhost:3333`).

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run Studio locally |
| `npm run build` | Production Studio build |
| `npm run deploy` | Deploy hosted Studio (requires Sanity login) |

## Schemas

- `user` — display name + avatar URL
- `pin` — image post, category, optional destination, saves, comments
- `comment` / `save` — object types embedded on pins
- `postedBy` — reference to `user`
