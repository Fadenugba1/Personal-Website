# Personal Website

Minimal personal portfolio (layout inspired by [cartertran.com](https://cartertran.com/)) with a
reactive pentagon-tiling background in the style of [xtxmarkets.com](https://www.xtxmarkets.com/) —
the "type 15" convex pentagon tiling, glowing cyan around the cursor.

No frameworks, no build step, no dependencies — plain HTML/CSS/JS.

## Editing content

**Everything on the page renders from [`js/data.js`](js/data.js).** Open it and edit the `SITE` object:

- **Links** (`links`) — add any social/profile link on demand:
  ```js
  { label: "X (Twitter)", handle: "@yourhandle", url: "https://x.com/yourhandle" },
  ```
- **Experience** (`work`) — entries with `year`, `org`, `role`, `description`, `tags`, optional `url`.
- **Projects** (`projects`) — entries with `title`, `description`, `tags`, `url`.
- **Header info** — `name`, `tagline`, `status`, `location`, `email`, `currently`.

Commented-out template entries in `data.js` show the exact shape to copy.

## Running locally

Just open `index.html` in a browser, or serve the folder:

```sh
python -m http.server 8000
# then visit http://localhost:8000
```

## Deploying (GitHub Pages)

Repo Settings → Pages → Source: **Deploy from a branch** → `main` / root.
The site will be live at `https://fadenugba1.github.io/Personal-Website/`.

## Tweaking the background

Constants at the top of [`js/pentagons.js`](js/pentagons.js):

| Constant | Effect |
|---|---|
| `ACCENT` | glow color (default XTX cyan `#00c0fc`) |
| `SCALE` | pentagon size in px |
| `HOVER_RADIUS` | cursor glow radius |
| `MAX_ALPHA` | peak glow brightness |
| `DECAY` | how fast cells fade |
| `SPARK_EVERY` | ambient flicker frequency |

Respects `prefers-reduced-motion` (renders a static tiling, no animation).
