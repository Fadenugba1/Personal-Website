/* ============================================================
   Reactive pentagon background — inspired by xtxmarkets.com.

   Tiles the plane with the "type 15" convex pentagon tiling
   (the same tiling XTX uses: groups of 12 pentagons built from
   one base pentagon by reflection/rotation). Cells glow cyan
   near the cursor and slowly fade; ambient sparks keep the
   field alive when idle.
   ============================================================ */

(() => {
  "use strict";

  const canvas = document.getElementById("bg-pentagons");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const ACCENT = { r: 0, g: 192, b: 252 }; // #00c0fc — XTX cyan
  const LINE_COLOR = "rgba(132, 165, 173, 0.13)";
  const SCALE = 64; // px per tiling unit
  const TILT = -0.525; // global rotation (radians), as on xtxmarkets.com
  const HOVER_RADIUS = 150; // px
  const MAX_ALPHA = 0.5; // peak cell glow
  const DECAY = 2.2; // intensity decay rate (per second)
  const SPARK_EVERY = [0.5, 1.6]; // seconds between ambient sparks (min, max)
  const PARALLAX = 0.05;
  const PAD = 280; // extra tiled px above/below viewport for parallax

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- geometry: the type-15 pentagon group ---------- */

  const SQ3 = Math.sqrt(3);

  // Base pentagon vertices (exact type-15 shape), inset slightly
  // along each vertex bisector so a thin gap shows between tiles.
  function basePentagon() {
    const v = [
      [0, 0],
      [-1 / 4, SQ3 / 4],
      [-(3 + SQ3) / 4, (1 + SQ3) / 4],
      [-(4 + SQ3) / 4, 1 / 4],
      [-1, 0],
    ];
    const inset = 0.05;
    const out = [];
    for (let i = 0; i < v.length; i++) {
      const c = v[i];
      const p = v[(i - 1 + v.length) % v.length];
      const n = v[(i + 1) % v.length];
      let ax = p[0] - c[0], ay = p[1] - c[1];
      let bx = n[0] - c[0], by = n[1] - c[1];
      const al = Math.hypot(ax, ay), bl = Math.hypot(bx, by);
      ax /= al; ay /= al; bx /= bl; by /= bl;
      let mx = (ax + bx) / 2, my = (ay + by) / 2;
      const ml = Math.hypot(mx, my);
      out.push([c[0] + (mx / ml) * inset, c[1] + (my / ml) * inset]);
    }
    return out;
  }

  // scale → rotate → translate (matches three.js geometry ops order)
  function xform(pts, sx, sy, rot, tx, ty) {
    const c = Math.cos(rot), s = Math.sin(rot);
    return pts.map(([x, y]) => {
      x *= sx; y *= sy;
      return [c * x - s * y + tx, s * x + c * y + ty];
    });
  }

  // The 12 pentagons of one repeating group (transform chains
  // taken from XTX's pentagonData).
  function buildGroup() {
    const P = [];
    P[0] = basePentagon();
    P[1] = xform(P[0], 1, 1, -Math.PI / 6, SQ3 / 2, -1 / 2);
    P[2] = xform(P[0], 1, -1, -Math.PI / 6, (SQ3 - 1) / 4, (1 + SQ3) / 4);
    for (let i = 0; i < 3; i++) {
      P[3 + i] = xform(P[i], -1, 1, Math.PI / 3, -(5 + SQ3) / 4, (1 - SQ3) / 4);
    }
    for (let i = 0; i < 6; i++) {
      P[6 + i] = xform(P[i], 1, 1, Math.PI, SQ3, -1 / 2);
    }
    return P;
  }

  const GROUP = buildGroup();
  const ROW_STEP = [(1 + SQ3) / 4, -(3 + SQ3) / 4];
  const COL_STEP = [(10 + 7 * SQ3) / 4, (3 + 2 * SQ3) / 4];

  /* ---------- tiling / cells ---------- */

  let cells = []; // { path, cx, cy, intensity, neighbors: [] }
  let staticLayer = null; // offscreen canvas with the stroked tiling
  let W = 0, H = 0, DPR = 1;

  function rebuild() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";

    const cx0 = W / 2, cy0 = H / 2;
    const cos = Math.cos(TILT), sin = Math.sin(TILT);
    // Cover a disc that contains the viewport plus parallax padding.
    const R = Math.hypot(W, H) / 2 + PAD + 3 * SCALE;

    // Invert the (rowStep, colStep) basis to find the row/col range
    // needed to cover the disc's bounding square.
    const [rx, ry] = ROW_STEP, [qx, qy] = COL_STEP;
    const det = rx * qy - qx * ry;
    let rMin = Infinity, rMax = -Infinity, cMin = Infinity, cMax = -Infinity;
    for (const [px, py] of [[-R, -R], [R, -R], [-R, R], [R, R]]) {
      const u = px / SCALE, v = py / SCALE;
      const row = (u * qy - v * qx) / det;
      const col = (v * rx - u * ry) / det;
      rMin = Math.min(rMin, row); rMax = Math.max(rMax, row);
      cMin = Math.min(cMin, col); cMax = Math.max(cMax, col);
    }
    rMin = Math.floor(rMin) - 1; rMax = Math.ceil(rMax) + 1;
    cMin = Math.floor(cMin) - 1; cMax = Math.ceil(cMax) + 1;

    cells = [];
    for (let row = rMin; row <= rMax; row++) {
      for (let col = cMin; col <= cMax; col++) {
        const ox = row * ROW_STEP[0] + col * COL_STEP[0];
        const oy = row * ROW_STEP[1] + col * COL_STEP[1];
        for (const pent of GROUP) {
          const path = new Path2D();
          let sx = 0, sy = 0, first = true;
          for (const [vx, vy] of pent) {
            // unit coords → tiling offset → scale → tilt → center
            const ux = (vx + ox) * SCALE;
            const uy = (vy + oy) * SCALE;
            const X = cos * ux - sin * uy + cx0;
            const Y = sin * ux + cos * uy + cy0;
            if (first) { path.moveTo(X, Y); first = false; } else { path.lineTo(X, Y); }
            sx += X; sy += Y;
          }
          path.closePath();
          const ccx = sx / 5, ccy = sy / 5;
          // Keep only cells that can ever be visible (incl. parallax).
          if (ccx < -2 * SCALE || ccx > W + 2 * SCALE) continue;
          if (ccy < -PAD - 2 * SCALE || ccy > H + PAD + 2 * SCALE) continue;
          cells.push({ path, cx: ccx, cy: ccy, intensity: 0, neighbors: null });
        }
      }
    }

    // Approximate adjacency by centroid distance (used by sparks).
    const NEIGHBOR_R = 1.15 * SCALE;
    const grid = new Map();
    const key = (x, y) => ((x | 0) * 73856093) ^ ((y | 0) * 19349663);
    for (let i = 0; i < cells.length; i++) {
      const k = key(Math.floor(cells[i].cx / NEIGHBOR_R), Math.floor(cells[i].cy / NEIGHBOR_R));
      if (!grid.has(k)) grid.set(k, []);
      grid.get(k).push(i);
    }
    for (let i = 0; i < cells.length; i++) {
      const c = cells[i];
      const gx = Math.floor(c.cx / NEIGHBOR_R), gy = Math.floor(c.cy / NEIGHBOR_R);
      const near = [];
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const bucket = grid.get(key(gx + dx, gy + dy));
          if (!bucket) continue;
          for (const j of bucket) {
            if (j === i) continue;
            if (Math.hypot(cells[j].cx - c.cx, cells[j].cy - c.cy) < NEIGHBOR_R) near.push(j);
          }
        }
      }
      c.neighbors = near;
    }

    // Pre-render the tiling outlines once.
    staticLayer = document.createElement("canvas");
    staticLayer.width = canvas.width;
    staticLayer.height = Math.round((H + 2 * PAD) * DPR);
    const sctx = staticLayer.getContext("2d");
    sctx.scale(DPR, DPR);
    sctx.translate(0, PAD);
    sctx.strokeStyle = LINE_COLOR;
    sctx.lineWidth = 1;
    for (const c of cells) sctx.stroke(c.path);
  }

  /* ---------- dynamics ---------- */

  const mouse = { x: -1e9, y: -1e9 };
  let scrollOffset = 0;
  let sparkTimer = 0.6;
  let lastT = performance.now();

  function ignite(i, amount) {
    const c = cells[i];
    if (c) c.intensity = Math.min(1, Math.max(c.intensity, amount));
  }

  function frame(now) {
    const dt = Math.min((now - lastT) / 1000, 0.05);
    lastT = now;

    // parallax drift with page scroll
    const target = -Math.max(-PAD, Math.min(PAD, window.scrollY * PARALLAX));
    scrollOffset += (target - scrollOffset) * 0.12;

    // local (untranslated) mouse position
    const mx = mouse.x, my = mouse.y - scrollOffset;

    // ambient sparks
    sparkTimer -= dt;
    if (sparkTimer <= 0 && cells.length) {
      sparkTimer = SPARK_EVERY[0] + Math.random() * (SPARK_EVERY[1] - SPARK_EVERY[0]);
      const i = (Math.random() * cells.length) | 0;
      ignite(i, 0.25 + Math.random() * 0.35);
      for (const j of cells[i].neighbors) {
        if (Math.random() < 0.5) ignite(j, 0.12 + Math.random() * 0.15);
      }
    }

    const decay = Math.exp(-DECAY * dt);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, W, H);
    // drawImage in CSS px (ctx is DPR-scaled), so draw at CSS size
    ctx.drawImage(staticLayer, 0, -PAD + scrollOffset, W, H + 2 * PAD);

    ctx.translate(0, scrollOffset);
    for (const c of cells) {
      // cursor proximity
      const d = Math.hypot(c.cx - mx, c.cy - my);
      if (d < HOVER_RADIUS) {
        const t = 1 - d / HOVER_RADIUS;
        const boost = Math.pow(t, 1.6) * 0.95;
        if (boost > c.intensity) c.intensity = boost;
      }
      c.intensity *= decay;
      if (c.intensity > 0.006) {
        ctx.fillStyle =
          "rgba(" + ACCENT.r + "," + ACCENT.g + "," + ACCENT.b + "," +
          (c.intensity * MAX_ALPHA).toFixed(3) + ")";
        ctx.fill(c.path);
      } else {
        c.intensity = 0;
      }
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    requestAnimationFrame(frame);
  }

  function drawStatic() {
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(staticLayer, 0, -PAD, W, H + 2 * PAD);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  /* ---------- wiring ---------- */

  rebuild();

  if (reducedMotion) {
    drawStatic();
    window.addEventListener("resize", () => { rebuild(); drawStatic(); });
    return;
  }

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    if (e.touches.length) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener("mouseout", (e) => {
    if (!e.relatedTarget) { mouse.x = -1e9; mouse.y = -1e9; }
  });

  let resizeT = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(rebuild, 150);
  });

  requestAnimationFrame((t) => { lastT = t; frame(t); });
})();
