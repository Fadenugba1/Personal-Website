# Personal Website

Minimal personal portfolio (layout inspired by [cartertran.com](https://cartertran.com/)) with a
reactive pentagon-tiling background in the style of [xtxmarkets.com](https://www.xtxmarkets.com/) —
the "type 15" convex pentagon tiling, glowing cyan around the cursor.

No frameworks, no build step, no dependencies — plain HTML/CSS/JS.

## Editing content

**Everything on the page renders from [`js/data.js`](js/data.js)** — no HTML or CSS to touch.
Open it, edit the `SITE` object, save, refresh. Order on the page = order in the array.

### Add a project

Copy this shape into the `projects: [...]` array:

```js
{
  title: "My New Project",
  description: "One or two sentences about what it does and what you built.",
  tags: ["Python", "Machine Learning"],
  url: "https://github.com/Fadenugba1/my-new-project", // or null for no link
},
```

### Add experience

Copy this into the `work: [...]` array (a commented-out template is already there):

```js
{
  year: "2026",
  org: "Company Name",
  role: "Software Engineering Intern",
  description: "What you did and what you learned.",
  tags: ["Java", "AWS"],
  url: "https://company.com", // optional — makes the name clickable
},
```

The "2026 — 2026" year range next to *Selected Work* updates itself from the years you enter.

### Add a link (footer "Elsewhere" section)

Copy this into the `links: [...]` array:

```js
{ label: "X (Twitter)", handle: "@yourhandle", url: "https://x.com/yourhandle" },
```

### Header info

`name`, `tagline`, `status`, `location`, `email` and `currently` (role, university, focus tags)
are plain fields at the top of the same file.

Once GitHub Pages is enabled, pushing the edited `data.js` to `main` updates the live site.

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
