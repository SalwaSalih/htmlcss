/* =========================================================
   ROJ INSTITUTE – CODE PUZZLE ("Build the Page")
   The student sees the finished page (Goal) and gets the code
   lines in a random order. Tap the pieces in the right order to
   build the page. Indentation is added automatically, so the
   student sees the structure grow. Some levels have a "trap"
   piece that must not be used.
   Saved in localStorage ("htmlmaster_puzzle"): stars per level.
   Styles: puzzle.css. XP/badges via script.js (window.HTMLMaster).
========================================================= */

(function () {
  const root = document.getElementById("puzzleApp");
  if (!root) return;

  const STORE = "htmlmaster_puzzle";
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  /* -----------------------------
     LEVELS (lines = the solution in order, traps = pieces that do not belong)
  ----------------------------- */
  const LEVELS = [
    {
      title: "My first page", lesson: "HTML Basics",
      goal: "A big heading and two paragraphs.",
      lines: ["<h1>My Page</h1>", "<p>Hello world!</p>", "<p>I am learning HTML.</p>"]
    },
    {
      title: "Page skeleton", lesson: "HTML Basics",
      goal: "Every HTML page has the same skeleton: html, head and body.",
      tip: "<head> comes before <body>. Every tag you open must be closed.",
      lines: ["<!DOCTYPE html>", "<html>", "<head>", "<title>My Page</title>", "</head>", "<body>", "<h1>Hi!</h1>", "</body>", "</html>"]
    },
    {
      title: "Shopping list", lesson: "HTML Basics",
      goal: "A heading and a bullet list with three things.",
      tip: "The <li> items go inside <ul> ... </ul>.",
      lines: ["<h2>Shopping list</h2>", "<ul>", "<li>Milk</li>", "<li>Bread</li>", "<li>Apples</li>", "</ul>"]
    },
    {
      title: "Steps in order", lesson: "HTML Basics",
      goal: "A numbered list: the steps for making tea.",
      tip: "A numbered list uses <ol>, not <ul>.",
      lines: ["<h2>Make tea</h2>", "<ol>", "<li>Boil water</li>", "<li>Add the tea bag</li>", "<li>Wait 3 minutes</li>", "</ol>"],
      traps: ["<ul>"]
    },
    {
      title: "Picture and link", lesson: "Links & Media",
      goal: "A heading, a picture WITH alt text, and a link.",
      tip: "Every image needs alt text. Look for the trap piece without it!",
      lines: [
        "<h2>My cat</h2>",
        "<img src=\"https://placehold.co/200x120?text=Cat\" alt=\"My cat\">",
        "<p>Learn more on <a href=\"https://developer.mozilla.org\">MDN</a></p>"
      ],
      traps: ["<img src=\"https://placehold.co/200x120?text=Cat\">"]
    },
    {
      title: "Semantic page", lesson: "HTML Tags",
      goal: "A page with a header, the main part and a footer.",
      tip: "Order on the page: header → main → footer.",
      lines: ["<header>", "<h1>My Blog</h1>", "</header>", "<main>", "<p>My first post.</p>", "</main>", "<footer>", "<p>&copy; 2026</p>", "</footer>"]
    },
    {
      title: "A small table", lesson: "HTML Tags",
      goal: "A table with a header row (Name, Age) and one row of data.",
      tip: "<tr> is a row. <th> is a header cell, <td> a normal cell.",
      lines: ["<table border=\"1\">", "<tr>", "<th>Name</th>", "<th>Age</th>", "</tr>", "<tr>", "<td>Ali</td>", "<td>12</td>", "</tr>", "</table>"]
    },
    {
      title: "Sign-up form", lesson: "Forms",
      goal: "A form with a name field, a required e-mail field and a button.",
      tip: "Each label comes right before its input. The e-mail type is \"email\".",
      lines: [
        "<form>",
        "<label for=\"name\">Name</label>",
        "<input id=\"name\" type=\"text\">",
        "<label for=\"mail\">E-mail</label>",
        "<input id=\"mail\" type=\"email\" required>",
        "<button>Sign up</button>",
        "</form>"
      ],
      traps: ["<input id=\"mail\" type=\"mail\" required>"]
    },
    {
      title: "Add some color", lesson: "CSS Basics",
      goal: "Use CSS in a <style> tag to make the heading tomato red.",
      tip: "selector { property: value; } – the rule goes inside <style>.",
      lines: ["<style>", "h1 {", "color: tomato;", "}", "</style>", "<h1>Colorful!</h1>"]
    },
    {
      title: "Boss level: profile card", lesson: "CSS Basics",
      goal: "A card with a border and padding, a name and a short text.",
      tip: "Style .card in CSS, then use class=\"card\" in HTML.",
      lines: [
        "<style>", ".card {", "border: 3px solid teal;", "padding: 12px;", "border-radius: 10px;", "}", "</style>",
        "<div class=\"card\">", "<h2>Sara</h2>", "<p>I love coding.</p>", "</div>"
      ],
      traps: ["<div id=\"card\">"]
    }
  ];

  /* -----------------------------
     SAVED PROGRESS
  ----------------------------- */
  const load = () => { try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch { return {}; } };
  const save = (data) => { try { localStorage.setItem(STORE, JSON.stringify(data)); } catch { /* ignore */ } };
  const stars = load(); // { "0": 3, "1": 2, ... }
  const unlocked = (i) => i === 0 || stars[i - 1] > 0;

  /* -----------------------------
     HELPERS
  ----------------------------- */
  const VOID = /^<(img|input|br|hr|meta|link|!DOCTYPE)\b/i;

  // Indent each line by how deep it is (tags and CSS braces)
  function indentLines(lines) {
    let depth = 0;
    return lines.map((line) => {
      const t = line.trim();
      if (/^<\//.test(t) || /^\}/.test(t)) depth = Math.max(0, depth - 1);
      const out = { line, depth };
      const opensTag = /^<([a-z][\w-]*)\b[^>]*>$/i.exec(t);
      if (opensTag && !VOID.test(t)) depth++;
      else if (/\{\s*$/.test(t)) depth++;
      return out;
    });
  }

  const pageFor = (lines) => indentLines(lines).map(({ line, depth }) => "  ".repeat(depth) + line).join("\n");

  // Shuffle that never gives back the solved order
  function shuffled(items) {
    const a = items.slice();
    for (let tries = 0; tries < 20; tries++) {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      if (a.some((x, i) => x !== items[i])) break;
    }
    return a;
  }

  /* -----------------------------
     STATE
  ----------------------------- */
  let level = 0;
  let pieces = [];   // { id, text } not used yet
  let placed = [];   // { id, text } in the student's order
  let hintsUsed = 0;
  let wrongChecks = 0;
  let view = "goal"; // phones: goal | result

  const $ = (sel) => root.querySelector(sel);

  /* -----------------------------
     SCREENS
  ----------------------------- */
  function showLevels() {
    const done = LEVELS.filter((_, i) => stars[i] > 0).length;
    const total = Object.values(stars).reduce((a, b) => a + b, 0);
    root.innerHTML = `
      <div class="pz-levels-head">
        <div>
          <h2>Choose a level</h2>
          <p>${done} of ${LEVELS.length} levels done · ${total} of ${LEVELS.length * 3} ⭐</p>
        </div>
      </div>
      <ol class="pz-levels">
        ${LEVELS.map((lv, i) => {
          const open = unlocked(i);
          const s = stars[i] || 0;
          return `<li>
            <button type="button" class="pz-level ${s ? "is-done" : ""} ${open ? "" : "is-locked"}" data-level="${i}" ${open ? "" : "disabled"}>
              <span class="pz-level-num">${open ? i + 1 : '<i class="fas fa-lock"></i>'}</span>
              <span class="pz-level-text"><strong>${esc(lv.title)}</strong><small>${esc(lv.lesson)}</small></span>
              <span class="pz-level-stars" aria-label="${s} of 3 stars">${"★".repeat(s)}<span>${"★".repeat(3 - s)}</span></span>
            </button>
          </li>`;
        }).join("")}
      </ol>`;
    root.querySelectorAll(".pz-level:not([disabled])").forEach((b) =>
      b.addEventListener("click", () => startLevel(Number(b.dataset.level))));
  }

  function startLevel(i) {
    level = i;
    const lv = LEVELS[i];
    const all = lv.lines.concat(lv.traps || []).map((text, id) => ({ id, text }));
    pieces = shuffled(all);
    placed = [];
    hintsUsed = 0;
    wrongChecks = 0;
    view = "goal";

    root.innerHTML = `
      <div class="pz-top">
        <button type="button" class="pz-back"><i class="fas fa-arrow-left"></i> Levels</button>
        <div class="pz-title">
          <small>Level ${i + 1} of ${LEVELS.length} · ${esc(lv.lesson)}</small>
          <h2>${esc(lv.title)}</h2>
        </div>
      </div>
      <p class="pz-goal"><i class="fas fa-bullseye"></i> ${esc(lv.goal)}${lv.traps ? ' <span class="pz-trap-note"><i class="fas fa-exclamation-triangle"></i> One piece is a trap – don\'t use it!</span>' : ""}</p>

      <div class="pz-view" role="tablist" aria-label="Show the goal or your result">
        <button type="button" role="tab" data-view="goal" aria-selected="true"><i class="fas fa-bullseye"></i> Goal</button>
        <button type="button" role="tab" data-view="result" aria-selected="false"><i class="fas fa-eye"></i> Your page</button>
      </div>
      <div class="pz-previews" data-show="goal">
        <figure class="pz-preview pz-preview-goal">
          <figcaption><i class="fas fa-bullseye"></i> Goal</figcaption>
          <iframe title="The page you should build" sandbox></iframe>
        </figure>
        <figure class="pz-preview pz-preview-result">
          <figcaption><i class="fas fa-eye"></i> Your page</figcaption>
          <iframe title="Your page so far" sandbox></iframe>
        </figure>
      </div>

      <div class="pz-board">
        <section class="pz-zone pz-answer" aria-label="Your code">
          <h3><i class="fas fa-code"></i> Your code <small>tap a line to take it back</small></h3>
          <ol class="pz-lines" id="pzAnswer"></ol>
        </section>
        <section class="pz-zone pz-pieces" aria-label="Pieces">
          <h3><i class="fas fa-puzzle-piece"></i> Pieces <small>tap the next line</small></h3>
          <ul class="pz-lines" id="pzPieces"></ul>
        </section>
      </div>

      <p class="pz-feedback" id="pzFeedback" aria-live="polite"></p>
      <div class="pz-actions">
        <button type="button" class="pz-btn pz-check"><i class="fas fa-check"></i> Check</button>
        <button type="button" class="pz-btn pz-hint"><i class="far fa-lightbulb"></i> Hint</button>
        <button type="button" class="pz-btn pz-undo"><i class="fas fa-undo"></i> Undo</button>
        <button type="button" class="pz-btn pz-restart"><i class="fas fa-redo"></i> Restart</button>
      </div>`;

    $(".pz-preview-goal iframe").srcdoc = pageFor(lv.lines);
    $(".pz-back").addEventListener("click", showLevels);
    $(".pz-check").addEventListener("click", check);
    $(".pz-hint").addEventListener("click", hint);
    $(".pz-undo").addEventListener("click", () => { if (placed.length) { pieces.push(placed.pop()); render(); } });
    $(".pz-restart").addEventListener("click", () => startLevel(level));
    root.querySelectorAll(".pz-view button").forEach((b) => b.addEventListener("click", () => setView(b.dataset.view)));
    render();
    root.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function setView(v) {
    view = v;
    $(".pz-previews").dataset.show = v;
    root.querySelectorAll(".pz-view button").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.view === v)));
  }

  function render(markWrongAt = -1) {
    const answer = $("#pzAnswer");
    const pool = $("#pzPieces");
    const rows = indentLines(placed.map((p) => p.text));

    answer.innerHTML = placed.length
      ? placed.map((p, i) => `<li><button type="button" class="pz-line ${i === markWrongAt ? "is-wrong" : ""}" data-i="${i}" style="--depth:${rows[i].depth}">
          <span class="pz-num">${i + 1}</span><code>${esc(p.text)}</code></button></li>`).join("")
      : '<li class="pz-empty">Tap the pieces below in the right order.</li>';

    pool.innerHTML = pieces.length
      ? pieces.map((p, i) => `<li><button type="button" class="pz-line pz-piece" data-i="${i}"><code>${esc(p.text)}</code></button></li>`).join("")
      : '<li class="pz-empty">All pieces used. Press <strong>Check</strong>!</li>';

    answer.querySelectorAll(".pz-line").forEach((b) => b.addEventListener("click", () => {
      const [p] = placed.splice(Number(b.dataset.i), 1);
      pieces.push(p);
      render();
    }));
    pool.querySelectorAll(".pz-line").forEach((b) => b.addEventListener("click", () => {
      const [p] = pieces.splice(Number(b.dataset.i), 1);
      placed.push(p);
      setFeedback("");
      render();
    }));

    $(".pz-preview-result iframe").srcdoc = pageFor(placed.map((p) => p.text));
  }

  function setFeedback(html, type = "") {
    const fb = $("#pzFeedback");
    fb.className = "pz-feedback" + (type ? " is-" + type : "");
    fb.innerHTML = html;
  }

  // Index of the first line that is not the right one (-1 = all right so far)
  function firstWrong() {
    const want = LEVELS[level].lines;
    for (let i = 0; i < placed.length; i++) if (placed[i].text !== want[i]) return i;
    return -1;
  }

  function check() {
    const lv = LEVELS[level];
    const wrong = firstWrong();
    if (wrong === -1 && placed.length === lv.lines.length) return win();

    wrongChecks++;
    if (wrong === -1) {
      setFeedback(`<i class="fas fa-thumbs-up"></i> So far so good! ${placed.length} of ${lv.lines.length} lines are right. Keep going.`, "ok");
      render();
      return;
    }
    const trap = (lv.traps || []).includes(placed[wrong].text);
    setFeedback(trap
      ? `<i class="fas fa-exclamation-triangle"></i> Line ${wrong + 1} is the trap piece! ${esc(lv.tip || "")}`
      : `<i class="fas fa-times-circle"></i> Line ${wrong + 1} is not right yet. ${wrong} line${wrong === 1 ? "" : "s"} before it ${wrong === 1 ? "is" : "are"} correct. ${esc(lv.tip || "")}`, "bad");
    render(wrong);
  }

  function hint() {
    const lv = LEVELS[level];
    // Take back everything from the first wrong line, then add the next right one
    const wrong = firstWrong();
    if (wrong !== -1) pieces.push(...placed.splice(wrong));
    const nextText = lv.lines[placed.length];
    if (nextText === undefined) return check();
    const idx = pieces.findIndex((p) => p.text === nextText);
    if (idx !== -1) placed.push(pieces.splice(idx, 1)[0]);
    hintsUsed++;
    setFeedback(`<i class="far fa-lightbulb"></i> Hint: line ${placed.length} added for you.`, "ok");
    render();
    if (placed.length === lv.lines.length && firstWrong() === -1) check();
  }

  function win() {
    const lv = LEVELS[level];
    const got = hintsUsed === 0 && wrongChecks <= 1 ? 3 : hintsUsed <= 2 ? 2 : 1;
    const before = stars[level] || 0;
    if (got > before) { stars[level] = got; save(stars); }
    if (!before) {
      window.HTMLMaster?.awardXP?.(10 + got * 5, "Code puzzle");
      if (LEVELS.every((_, i) => stars[i] > 0)) window.HTMLMaster?.grantBadge?.("puzzle-master", "Puzzle Master");
    }
    setView("result");
    render();
    const next = level + 1 < LEVELS.length;
    setFeedback(`
      <span class="pz-win-stars">${"★".repeat(got)}<span>${"★".repeat(3 - got)}</span></span>
      <strong>Level done!</strong> ${got === 3 ? "Perfect – no hints needed." : hintsUsed ? `You used ${hintsUsed} hint${hintsUsed === 1 ? "" : "s"}.` : "Try again with fewer checks for 3 stars."}
      ${!before ? `<span class="pz-xp">+${10 + got * 5} XP</span>` : ""}
      <span class="pz-win-actions">
        ${next ? '<button type="button" class="pz-btn pz-next"><i class="fas fa-arrow-right"></i> Next level</button>' : '<button type="button" class="pz-btn pz-next"><i class="fas fa-trophy"></i> All levels</button>'}
      </span>`, "win");
    $(".pz-next").addEventListener("click", () => (next ? startLevel(level + 1) : showLevels()));
    root.querySelector(".pz-actions").hidden = true;
    root.querySelectorAll(".pz-line").forEach((b) => (b.disabled = true));
  }

  // Start: open a level from the address (#level-3), else the level list
  const m = location.hash.match(/^#level-(\d+)$/);
  const start = m ? Number(m[1]) - 1 : -1;
  if (start >= 0 && start < LEVELS.length && unlocked(start)) startLevel(start);
  else showLevels();
})();
