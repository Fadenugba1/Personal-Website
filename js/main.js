/* Renders all page content from SITE (js/data.js). */

(() => {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const year = new Date().getFullYear();

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  const tagList = (tags) => {
    const ul = el("ul", "tags");
    (tags || []).forEach((t) => ul.appendChild(el("li", "tag", t)));
    return ul;
  };

  /* ---- head / hero ---- */
  document.title = SITE.name.join(" ") + " — " + SITE.tagline;
  $("#nav-year").textContent = year;

  const h1 = $("#hero-name");
  SITE.name.forEach((part, i) => {
    if (i > 0) h1.appendChild(document.createElement("br"));
    h1.appendChild(document.createTextNode(part));
  });
  $("#hero-tagline").textContent = SITE.tagline;
  $("#hero-status").textContent = SITE.status;
  $("#hero-location").textContent = SITE.location;

  /* ---- currently ---- */
  const cur = SITE.currently;
  $("#currently-role").textContent = cur.role;
  const org = $("#currently-org");
  if (cur.orgUrl) {
    const a = el("a", null, cur.org);
    a.href = cur.orgUrl;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    org.appendChild(a);
  } else {
    org.textContent = cur.org;
  }
  $("#currently-dates").textContent = cur.dates;
  $("#currently-focus").replaceWith(
    Object.assign(tagList(cur.focus), { id: "currently-focus" })
  );

  /* ---- selected work ---- */
  $("#work-heading").textContent = SITE.workHeading || "Selected Work";
  if (SITE.work.length) {
    const years = SITE.work.map((w) => parseInt(w.year, 10)).filter((n) => !isNaN(n));
    if (years.length) {
      $("#work-range").textContent =
        Math.min(...years) + " — " + Math.max(...years);
    }
  }
  const workList = $("#work-list");
  SITE.work.forEach((w) => {
    const li = el("li", "entry");
    li.appendChild(el("span", "entry-year", w.year));
    const body = el("div", "entry-body");
    const title = el("h3", "entry-title");
    if (w.url) {
      const a = el("a", null, w.org);
      a.href = w.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      title.appendChild(a);
    } else {
      title.textContent = w.org;
    }
    body.appendChild(title);
    body.appendChild(el("p", "entry-role", w.role));
    body.appendChild(el("p", "entry-desc", w.description));
    if (w.tags && w.tags.length) body.appendChild(tagList(w.tags));
    li.appendChild(body);
    workList.appendChild(li);
  });
  if (!SITE.work.length) $("#work").hidden = true;

  /* ---- projects ---- */
  const projList = $("#project-list");
  SITE.projects.forEach((p) => {
    const li = el("li", "entry project");
    const body = el("div", "entry-body");
    const title = el("h3", "entry-title");
    if (p.url) {
      const a = el("a", null, p.title);
      a.href = p.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      title.appendChild(a);
      title.appendChild(el("span", "ext", " ↗"));
    } else {
      title.textContent = p.title;
    }
    body.appendChild(title);
    body.appendChild(el("p", "entry-desc", p.description));
    if (p.tags && p.tags.length) body.appendChild(tagList(p.tags));
    li.appendChild(body);
    projList.appendChild(li);
  });
  if (!SITE.projects.length) $("#projects").hidden = true;

  /* ---- connect ---- */
  $("#connect-heading").textContent = SITE.connect.heading;
  $("#connect-blurb").textContent = SITE.connect.blurb;
  const cta = $("#connect-cta");
  cta.textContent = SITE.connect.cta;
  cta.href = "mailto:" + SITE.email;

  /* ---- footer / elsewhere ---- */
  const linkList = $("#elsewhere-list");
  SITE.links.forEach((l) => {
    const li = el("li");
    const a = el("a", "elsewhere-link");
    a.href = l.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.appendChild(el("span", "elsewhere-label", l.label));
    a.appendChild(el("span", "elsewhere-handle", l.handle + " ↗"));
    li.appendChild(a);
    linkList.appendChild(li);
  });

  $("#footer-copy").textContent =
    "© " + year + " " + SITE.name.join(" ") + ". All rights reserved.";
})();
