/* =========================================================
   HTML MASTER – CSS EDITOR (lessons/css-properties.html #playground)
   Two files side by side, like a real project:
     style.css  – the CSS you are learning
     index.html – the page it styles (links style.css)
   Features: live result, explanations of properties/values/selectors,
   beginner-friendly tips, a "Selectors" view showing what each rule
   matches, and auto-checked challenges with XP.
   Needs: highlight.js. Optional: css-reference.js (window.CSSRef).
   Styles: css-editor.css + highlight.css
========================================================= */

(function () {
  const root = document.getElementById("cssEditor");
  const H = window.HMHighlight;
  if (!root || !H) return;

  const $ = (id) => document.getElementById(id);
  const esc = H.escape;
  const frame = $("ceFrame");
  const explainEl = $("ceExplain");
  const liveEl = $("ceLive");
  const tipsEl = $("ceTips");
  const tipCountEl = $("ceTipCount");
  const rulesEl = $("ceRules");

  const STORE = { css: "cssEditorCss", html: "cssEditorHtml", challenges: "cssEditorChallenges" };
  const INDENT = "  ";
  const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);

  const STARTER_CSS = `/* style.css – this file is linked from index.html */

p {
  color: #555;
  line-height: 1.6;
}
`;

  const STARTER_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My pets</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>My Pets</h1>
  <p>Here are my three favourite animals.</p>

  <div class="cards">
    <div class="card">
      <h2>Cat</h2>
      <p>Sleeps 16 hours a day.</p>
    </div>
    <div class="card">
      <h2>Dog</h2>
      <p>Loves long walks.</p>
    </div>
    <div class="card">
      <h2>Rabbit</h2>
      <p>Can jump very high.</p>
    </div>
  </div>

  <button class="btn">Adopt a pet</button>
</body>
</html>
`;

  // Turns an HTML fragment into a full page that links style.css
  function wrapPage(body) {
    if (/<html[\s>]/i.test(body)) return body;
    const inner = body.trim().split("\n").map((l) => INDENT + l).join("\n");
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CSS example</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
${inner}
</body>
</html>
`;
  }

  /* -----------------------------
     EXPLANATION DATA
  ----------------------------- */
  const UNITS = {
    px: "pixels – a fixed size on the screen",
    em: "relative to this element's font size (2em = twice as big)",
    rem: "relative to the page's root font size (usually 16px)",
    "%": "a percentage of the parent element",
    vw: "a percentage of the window width (100vw = full width)",
    vh: "a percentage of the window height (100vh = full height)",
    fr: "a share of the free space in a grid",
    s: "seconds",
    ms: "milliseconds (1000ms = 1s)",
    deg: "degrees (a full turn is 360deg)",
    ch: "the width of the character \"0\"",
    pt: "points, mostly used for printing"
  };

  const FUNCS = {
    rgb: "a color mixed from red, green and blue (0–255 each)",
    rgba: "an rgb color with transparency (the last number is 0–1)",
    hsl: "a color from hue (0–360°), saturation and lightness",
    hsla: "an hsl color with transparency",
    "linear-gradient": "a smooth fade between colors along a line",
    "radial-gradient": "a smooth fade from the center outwards",
    url: "the address of a file, like an image",
    calc: "does math with mixed units, e.g. calc(100% - 20px)",
    var: "uses a CSS variable defined with --name",
    repeat: "repeats a grid column/row pattern",
    minmax: "a size that stays between a minimum and a maximum",
    clamp: "a value that grows with the screen but stays between a min and max",
    min: "uses the smallest of the values",
    max: "uses the largest of the values",
    translate: "moves the element",
    translateX: "moves the element sideways",
    translateY: "moves the element up or down",
    rotate: "turns the element",
    scale: "makes the element bigger or smaller",
    blur: "blurs the element",
    cubic: "a custom speed curve"
  };

  const AT_RULES = {
    media: "Applies the rules inside only when a condition is true, e.g. on small screens: <code>@media (max-width: 600px) { … }</code>",
    keyframes: "Defines the steps of an animation. Use it with the <code>animation</code> property.",
    import: "Loads another CSS file into this one.",
    "font-face": "Loads your own font file so you can use it with font-family.",
    supports: "Applies the rules inside only if the browser supports a feature.",
    container: "Applies the rules inside based on the size of a container element."
  };

  const PSEUDO = {
    hover: "when the mouse is over it",
    focus: "when it has keyboard focus",
    "focus-visible": "when it has visible keyboard focus",
    "focus-within": "when something inside it has focus",
    active: "while it is being clicked",
    visited: "when the link has been visited",
    checked: "when it is checked",
    disabled: "when it is disabled",
    "first-child": "that is the first child of its parent",
    "last-child": "that is the last child of its parent",
    "nth-child": "that is child number {n}",
    "first-of-type": "that is the first of its type",
    "last-of-type": "that is the last of its type",
    root: "(the root <html> element)",
    empty: "that has no content",
    before: "– the content added before it",
    after: "– the content added after it",
    "first-letter": "– only its first letter",
    "first-line": "– only its first line",
    placeholder: "– its placeholder text",
    selection: "– the text the user selects",
    marker: "– the bullet or number of a list item"
  };

  // CSS properties that are allowed to be plain numbers
  const UNITLESS = new Set(["line-height", "opacity", "z-index", "flex-grow", "flex-shrink", "flex", "order", "font-weight", "column-count", "animation-iteration-count", "aspect-ratio", "scale", "zoom", "orphans", "widows", "tab-size"]);

  // Pseudo-classes/elements that depend on user actions or aren't real elements;
  // removed before asking "which elements does this match?"
  const DYNAMIC_PSEUDO = /::?(hover|focus|focus-within|focus-visible|active|visited|link|target|checked|disabled|enabled|before|after|first-line|first-letter|placeholder|selection|marker|backdrop)\b(\([^)]*\))?/gi;

  /* -----------------------------
     HELPERS
  ----------------------------- */
  function lineOf(text, index) {
    let line = 1;
    for (let i = 0; i < index && i < text.length; i++) if (text.charCodeAt(i) === 10) line++;
    return line;
  }

  function levenshtein(a, b) {
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
    }
    return d[a.length][b.length];
  }

  function closest(word, list, max = 2) {
    let best = null;
    let bestD = max + 1;
    for (const w of list) {
      const dist = levenshtein(word, w);
      if (dist < bestD) { best = w; bestD = dist; }
    }
    return best;
  }

  const supports = (prop, value) => !!(window.CSS && CSS.supports && CSS.supports(prop, value));
  const isKnownProp = (prop) => prop.startsWith("--") || supports(prop, "initial");

  let propList = null;
  function allProps() {
    if (!propList) {
      const set = new Set([...getComputedStyle(document.documentElement)]);
      ["margin", "padding", "border", "background", "font", "flex", "grid", "gap", "inset", "overflow", "list-style", "transition", "animation", "outline", "border-radius", "columns", "text-decoration", "place-items", "place-content", "flex-flow", "grid-template", "grid-area", "grid-column", "grid-row", "border-color", "border-style", "border-width", "border-top", "border-right", "border-bottom", "border-left"].forEach((p) => set.add(p));
      (window.CSSRef?.names?.() || []).forEach((p) => set.add(p));
      propList = [...set].filter((p) => !p.startsWith("-"));
    }
    return propList;
  }

  // Example values from css-reference.js, without the long data: URLs used by its demos
  const describeProp = (prop) => {
    const info = window.CSSRef?.describe?.(prop);
    return info ? { ...info, values: info.values.filter((v) => !v.includes("data:")) } : null;
  };
  const codeOf = (s) => `<code>${esc(s)}</code>`;
  const toast = (msg) => { if (typeof showToast === "function") showToast(msg); };

  /* -----------------------------
     CODE PANE (textarea on top of a highlighted <pre>)
  ----------------------------- */
  function createPane({ ta, pre, gutter, highlight, opensBlock, autoClose, onInput }) {
    let escaped = false;

    const sync = () => {
      pre.scrollTop = ta.scrollTop;
      pre.scrollLeft = ta.scrollLeft;
      gutter.scrollTop = ta.scrollTop;
    };

    const pane = {
      ta,
      render() {
        pre.innerHTML = highlight(ta.value);
        const n = ta.value.split("\n").length;
        if (gutter.childElementCount !== n) {
          let html = "";
          for (let i = 1; i <= n; i++) html += `<div>${i}</div>`;
          gutter.innerHTML = html;
        }
        sync();
      },
      // insertText keeps the browser's undo history (Ctrl+Z) working
      insert(text) {
        ta.focus({ preventScroll: true });
        const ok = document.execCommand && document.execCommand("insertText", false, text);
        if (!ok) {
          ta.setRangeText(text, ta.selectionStart, ta.selectionEnd, "end");
          ta.dispatchEvent(new Event("input"));
        }
      },
      setValue(value) {
        ta.focus({ preventScroll: true });
        ta.setSelectionRange(0, ta.value.length);
        pane.insert(value);
        ta.setSelectionRange(0, 0);
        ta.scrollTop = 0;
        sync();
      },
      currentIndent() {
        const start = ta.value.lastIndexOf("\n", ta.selectionStart - 1) + 1;
        return ta.value.slice(start).match(/^[ \t]*/)[0];
      },
      goToLine(line, select = true) {
        const lines = ta.value.split("\n");
        let pos = 0;
        for (let i = 0; i < line - 1 && i < lines.length; i++) pos += lines[i].length + 1;
        ta.focus({ preventScroll: true });
        ta.setSelectionRange(pos, select ? pos + (lines[line - 1] || "").length : pos);
        ta.scrollTop = Math.max(0, (line - 3) * (parseFloat(getComputedStyle(ta).lineHeight) || 21));
        sync();
      },
      markLines(lines) {
        [...gutter.children].forEach((d, i) => d.classList.toggle("ce-has-tip", lines.has(i + 1)));
      }
    };

    ta.addEventListener("scroll", sync);

    ta.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { escaped = true; return; }

      // Tab indents (Esc then Tab leaves the editor for keyboard users)
      if (e.key === "Tab" && !escaped && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        const { selectionStart: s, selectionEnd: en, value } = ta;
        if ((s !== en && value.slice(s, en).includes("\n")) || e.shiftKey) {
          const lineStart = value.lastIndexOf("\n", s - 1) + 1;
          const block = value.slice(lineStart, en);
          const changed = e.shiftKey ? block.replace(/^( {1,2}|\t)/gm, "") : block.replace(/^/gm, INDENT);
          ta.setSelectionRange(lineStart, en);
          pane.insert(changed);
          ta.setSelectionRange(lineStart, lineStart + changed.length);
        } else {
          pane.insert(INDENT);
        }
        return;
      }
      escaped = false;

      // Enter keeps indentation; between { } or <tag></tag> it opens an indented line
      if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) {
        e.preventDefault();
        const s = ta.selectionStart;
        const before = ta.value.slice(0, s);
        const after = ta.value.slice(ta.selectionEnd);
        const indent = pane.currentIndent();
        const block = opensBlock(before, after);
        if (block === "between") {
          pane.insert("\n" + indent + INDENT + "\n" + indent);
          const pos = s + 1 + indent.length + INDENT.length;
          ta.setSelectionRange(pos, pos);
        } else {
          pane.insert("\n" + indent + (block ? INDENT : ""));
        }
      }
    });

    ta.addEventListener("input", (e) => {
      if (e.inputType === "insertText" && e.data) {
        const extra = autoClose(e.data, ta.value.slice(0, ta.selectionStart), ta.value.slice(ta.selectionStart));
        if (extra) {
          const s = ta.selectionStart;
          pane.insert(extra);
          ta.setSelectionRange(s, s);
        }
      }
      pane.render();
      onInput();
    });

    return pane;
  }

  /* -----------------------------
     CSS PARSER (rules, declarations, structural problems)
  ----------------------------- */
  function parseCss(code) {
    const segs = H.scanCss(code);
    const rules = [];
    const problems = [];
    const stack = [];
    let head = null;
    let decl = null;

    const atName = (text) => (text.trim().match(/^@([\w-]+)/) || [])[1]?.toLowerCase() || "";
    const top = () => stack[stack.length - 1];
    const inKeyframes = () => stack.some((s) => s.kind === "at" && /keyframes$/.test(s.name));

    const finishDecl = () => {
      if (!decl) return;
      const rule = top()?.rule;
      if (!decl.colon) {
        if (decl.prop) problems.push({ level: "warn", at: decl.start, title: `${codeOf(decl.prop)} needs a colon`, text: `Write the property, a colon and the value: ${codeOf("color: red;")}` });
      } else if (rule) {
        // A value that runs onto the next "property:" means a ; is missing
        const missing = decl.value.match(/\n\s*([a-z-]+)\s*:/i);
        if (missing) {
          const first = decl.value.slice(0, decl.value.indexOf("\n")).trim();
          problems.push({ level: "warn", at: decl.start, title: `Missing ${codeOf(";")}`, text: `Add a semicolon after ${codeOf(`${decl.prop}: ${first}`)}. Each declaration ends with <code>;</code>, otherwise the next line is read as part of this value.` });
          decl.value = first;
          decl.broken = true;
        }
        rule.decls.push({ prop: decl.prop.toLowerCase(), value: decl.value.trim(), at: decl.start, broken: decl.broken });
      }
      decl = null;
    };

    for (const s of segs) {
      const lead = s.text.length - s.text.trimStart().length;
      switch (s.type) {
        case "selector":
        case "at":
          // Whitespace-only pieces don't start a selector; the first real text does
          if (head && head.text.trim()) head.text += s.text;
          else head = { text: s.text, start: s.start + lead, type: s.type };
          break;
        case "prop":
          finishDecl();
          decl = { prop: s.text.trim(), start: s.start + lead, value: "", colon: false };
          break;
        case "value":
          if (decl) decl.value += s.text;
          break;
        case "punct":
          if (s.text === ":") { if (decl) decl.colon = true; break; }
          if (s.text === ";") {
            finishDecl();
            head = null; // e.g. @import "x.css";
            break;
          }
          if (s.text === "{") {
            finishDecl();
            if (head && head.text.trim().startsWith("@")) {
              const name = atName(head.text);
              if (/^(media|supports|container|layer|scope|-webkit-keyframes|keyframes)$/.test(name)) {
                stack.push({ kind: "at", name, start: head.start, text: head.text.trim() });
              } else {
                const rule = { selector: head.text.trim(), start: head.start, bodyStart: s.start, end: code.length, decls: [], isAt: true, keyframe: false };
                rules.push(rule);
                stack.push({ kind: "rule", rule });
              }
            } else {
              if (!head || !head.text.trim()) {
                problems.push({ level: "warn", at: s.start, title: `${codeOf("{")} without a selector`, text: `Write which elements to style before the brace, e.g. ${codeOf("h1 {")}` });
              }
              const rule = { selector: head ? head.text.trim().replace(/\s+/g, " ") : "", start: head ? head.start : s.start, bodyStart: s.start, end: code.length, decls: [], isAt: false, keyframe: inKeyframes() };
              rules.push(rule);
              stack.push({ kind: "rule", rule });
            }
            head = null;
            break;
          }
          if (s.text === "}") {
            finishDecl();
            if (head && head.text.trim()) {
              problems.push({ level: "warn", at: head.start, title: `${codeOf(head.text.trim().slice(0, 30))} has no ${codeOf("{ }")}`, text: "A selector needs a block with declarations: <code>selector { property: value; }</code>" });
            }
            head = null;
            const closed = stack.pop();
            if (!closed) {
              problems.push({ level: "warn", at: s.start, title: `Extra ${codeOf("}")}`, text: "There is no open <code>{</code> for this brace. Remove it." });
            } else if (closed.kind === "rule") {
              closed.rule.end = s.start;
            }
          }
          break;
        default:
          break;
      }
    }

    finishDecl();
    if (head && head.text.trim()) {
      problems.push({ level: "warn", at: head.start, title: `${codeOf(head.text.trim().slice(0, 30))} has no ${codeOf("{ }")}`, text: "A selector needs a block with declarations: <code>selector { property: value; }</code>" });
    }
    stack.forEach((open) => {
      const what = open.kind === "rule" ? open.rule.selector : open.text;
      problems.push({ level: "warn", at: open.kind === "rule" ? open.rule.start : open.start, title: `${codeOf(what || "{")} is missing ${codeOf("}")}`, text: "Every <code>{</code> needs a closing <code>}</code>." });
    });

    return { rules, problems };
  }

  /* -----------------------------
     SELECTORS: matching, specificity, plain-English explanation
  ----------------------------- */
  function stripDynamic(sel) {
    let s = sel.replace(DYNAMIC_PSEUDO, "").trim();
    if (!s || /[>+~,]\s*$/.test(s)) s += "*";
    return s.replace(/,\s*(?=,|$)/g, ", *");
  }

  function matchesIn(doc, sel) {
    if (!doc) return { ok: true, els: [] };
    try {
      return { ok: true, els: [...doc.querySelectorAll(stripDynamic(sel))] };
    } catch {
      return { ok: false, els: [] };
    }
  }

  function specificity(sel) {
    const s = sel.replace(/:where\([^)]*\)/g, "").replace(/\[[^\]]*\]/g, (m) => " .attr ");
    const ids = (s.match(/#[\w-]+/g) || []).length;
    const pseudoEls = (s.match(/::[\w-]+|:(before|after|first-line|first-letter)\b/g) || []).length;
    const classes = (s.match(/\.[\w-]+/g) || []).length + (s.match(/(?<!:):(?!:)[\w-]+/g) || []).length - (s.match(/:(before|after|first-line|first-letter)\b/g) || []).length - (s.match(/:(not|is|has)\b/g) || []).length;
    const tags = (s.replace(/[#.:][\w-]+(\([^)]*\))?/g, " ").match(/(^|[\s>+~(])([a-zA-Z][\w-]*)/g) || []).length + pseudoEls;
    return [ids, Math.max(0, classes), tags];
  }

  function describeCompound(c, subject) {
    const tag = (c.match(/^([a-zA-Z][\w-]*|\*)/) || [])[1];
    const classes = [...c.matchAll(/\.([\w-]+)/g)].map((m) => m[1]);
    const ids = [...c.matchAll(/#([\w-]+)/g)].map((m) => m[1]);
    const attrs = [...c.matchAll(/\[([^\]]+)\]/g)].map((m) => m[1]);
    const pseudos = [...c.matchAll(/::?([\w-]+)(?:\(([^)]*)\))?/g)];

    let text = tag && tag !== "*" ? `${subject ? "every " : "a "}${codeOf(`<${tag}>`)}` : subject ? "every element" : "an element";
    if (ids.length) text += ` with id ${codeOf(ids[0])}`;
    if (classes.length) text += ` with class ${classes.map(codeOf).join(" and ")}`;
    if (attrs.length) text += ` with attribute ${attrs.map((a) => codeOf(`[${a}]`)).join(" and ")}`;
    pseudos.forEach(([, name, arg]) => {
      const n = name.toLowerCase();
      if (n === "not" && arg) text += ` that is not ${codeOf(arg)}`;
      else if (PSEUDO[n]) text += " " + esc(PSEUDO[n]).replace("{n}", esc(arg || "n"));
      else text += ` (${codeOf(":" + n)})`;
    });
    return text;
  }

  function explainSelector(sel) {
    return sel.split(",").map((part) => {
      const pieces = part.trim().split(/\s*([>+~])\s*|\s+/).filter((x) => x);
      let i = pieces.length - 1;
      let text = describeCompound(pieces[i], true);
      while (i > 0) {
        let comb = " ";
        let j = i - 1;
        if ([">", "+", "~"].includes(pieces[j])) { comb = pieces[j]; j--; }
        if (j < 0) break;
        text += { " ": " inside ", ">": " directly inside ", "+": " right after ", "~": " after " }[comb] + describeCompound(pieces[j], false);
        i = j;
      }
      return text;
    }).join(" <strong>and</strong> ");
  }

  function shortName(el) {
    return `<${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}${el.classList.length ? "." + [...el.classList].join(".") : ""}>`;
  }

  /* -----------------------------
     TIPS
  ----------------------------- */
  function lint(css, html, parsed, doc) {
    const tips = parsed.problems.map((p) => ({ ...p, file: "css", line: lineOf(css, p.at) }));
    const add = (level, at, title, text, file = "css") => tips.push({ level, line: file === "css" ? lineOf(css, at) : at, title, text, file });

    const htmlClasses = new Set();
    const htmlIds = new Set();
    if (doc) {
      doc.querySelectorAll("[class]").forEach((el) => el.classList.forEach((c) => { if (!c.startsWith("ce-")) htmlClasses.add(c); }));
      doc.querySelectorAll("[id]").forEach((el) => htmlIds.add(el.id));
    }

    for (const rule of parsed.rules) {
      if (!rule.decls.length) add("info", rule.start, `Empty rule ${codeOf(rule.selector || "{ }")}`, "This rule has no declarations yet. Add something like <code>color: crimson;</code>");

      // Selector checks
      if (!rule.isAt && !rule.keyframe && rule.selector) {
        const m = matchesIn(doc || document, rule.selector);
        if (!m.ok) {
          add("warn", rule.start, `Typo in selector ${codeOf(rule.selector)}`, "The browser can't read this selector, so the whole rule is ignored. Check for stray characters.");
        } else if (doc && !m.els.length) {
          let hint = "";
          const cls = rule.selector.match(/\.([\w-]+)/);
          const id = rule.selector.match(/#([\w-]+)/);
          if (cls && !htmlClasses.has(cls[1])) {
            const guess = closest(cls[1], [...htmlClasses]);
            hint = guess ? ` Did you mean ${codeOf("." + guess)}?` : htmlClasses.size ? ` Classes in index.html: ${[...htmlClasses].slice(0, 6).map((c) => codeOf("." + c)).join(", ")}.` : " There are no classes in index.html yet.";
          } else if (id && !htmlIds.has(id[1])) {
            const guess = closest(id[1], [...htmlIds]);
            hint = guess ? ` Did you mean ${codeOf("#" + guess)}?` : " Add the id to an element in index.html.";
          } else if (rule.selector.startsWith(".") === false && !cls && !id) {
            hint = " There is no such element in index.html.";
          }
          add("warn", rule.start, `${codeOf(rule.selector)} matches nothing`, `No element in index.html is selected by this rule, so it does nothing.${hint}`);
        }
      }

      // Declaration checks
      const seen = new Map();
      for (const d of rule.decls) {
        d.valid = false;
        if (!d.prop) continue;
        if (!isKnownProp(d.prop)) {
          const guess = closest(d.prop.replace(/\s+/g, "-"), allProps());
          add("warn", d.at, `${codeOf(d.prop)} is not a CSS property`, guess ? `Did you mean ${codeOf(guess)}?` : "Check the spelling. The browser ignores properties it doesn't know.");
          continue;
        }
        if (!d.value) {
          add("warn", d.at, `${codeOf(d.prop)} has no value`, `Add a value after the colon, e.g. ${codeOf(`${d.prop}: ${(describeProp(d.prop)?.values || ["…"])[1] || "…"};`)}`);
          continue;
        }
        const value = d.value.replace(/\s*!important\s*$/i, "");
        if (/!important/i.test(d.value)) add("info", d.at, `Avoid ${codeOf("!important")}`, "It forces this value to win over everything. Prefer a more specific selector instead.");
        if (seen.has(d.prop)) add("info", d.at, `${codeOf(d.prop)} is set twice`, `This rule already sets ${codeOf(d.prop)} on line ${lineOf(css, seen.get(d.prop))}. The last one wins.`);
        seen.set(d.prop, d.at);

        if (d.prop.startsWith("--") || /var\(/i.test(value) || rule.keyframe || rule.isAt || supports(d.prop, value)) {
          d.valid = true;
          continue;
        }
        if (/^-?\d*\.?\d+$/.test(value) && value !== "0" && !UNITLESS.has(d.prop)) {
          add("warn", d.at, `${codeOf(`${d.prop}: ${value}`)} needs a unit`, `Numbers need a unit, like ${codeOf(value + "px")}, ${codeOf(value + "%")} or ${codeOf(value + "rem")}.`);
          continue;
        }
        const examples = describeProp(d.prop)?.values;
        add("warn", d.at, `${codeOf(value)} isn't a valid value for ${codeOf(d.prop)}`, examples ? `Try one of these: ${examples.slice(0, 4).map(codeOf).join(", ")}` : "Check the spelling and the units.");
      }
    }

    // index.html must link the stylesheet for any of this to apply
    if (/<html[\s>]/i.test(html) && !linksStylesheet(html)) {
      add("warn", lineOf(html, Math.max(0, html.search(/<\/head>/i))), "index.html doesn't link style.css", `Add ${codeOf('<link rel="stylesheet" href="style.css">')} inside <code>&lt;head&gt;</code>, or your CSS is not used at all!`, "html");
    }

    tips.sort((a, b) => (a.level === b.level ? (a.file === b.file ? a.line - b.line : a.file === "css" ? -1 : 1) : a.level === "warn" ? -1 : 1));
    return tips.slice(0, 40);
  }

  function renderTips(tips) {
    const warnings = tips.filter((t) => t.level === "warn").length;
    tipCountEl.textContent = String(tips.length);
    tipCountEl.classList.toggle("ce-has-issues", warnings > 0);

    tipsEl.innerHTML = "";
    if (!tips.length) {
      tipsEl.innerHTML = `<li class="ce-tip ce-ok"><span class="ce-tip-icon">✅</span><span class="ce-tip-title">Looks great!</span><span class="ce-tip-text">No problems found in your CSS.</span></li>`;
    }
    tips.forEach((t) => {
      const li = document.createElement("li");
      li.className = "ce-tip" + (t.level === "info" ? " ce-info" : "");
      li.innerHTML = `<span class="ce-tip-icon">${t.level === "warn" ? "⚠️" : "💡"}</span>
        <span class="ce-tip-title">${t.title}<small>${t.file === "css" ? "style.css" : "index.html"} line ${t.line}</small></span>
        <span class="ce-tip-text">${t.text}</span>`;
      li.addEventListener("click", () => (t.file === "css" ? cssPane : htmlPane).goToLine(t.line));
      tipsEl.appendChild(li);
    });

    cssPane.markLines(new Set(tips.filter((t) => t.level === "warn" && t.file === "css").map((t) => t.line)));
    htmlPane.markLines(new Set(tips.filter((t) => t.level === "warn" && t.file === "html").map((t) => t.line)));
  }

  /* -----------------------------
     SELECTORS VIEW
  ----------------------------- */
  function renderRules(parsed, doc) {
    rulesEl.innerHTML = "";
    const rules = parsed.rules.filter((r) => !r.isAt && !r.keyframe && r.selector);
    if (!rules.length) {
      rulesEl.innerHTML = `<li class="ce-help">No rules yet. Write one like <code>h1 { color: crimson; }</code></li>`;
      return;
    }
    rules.forEach((rule) => {
      const m = matchesIn(doc, rule.selector);
      const els = m.els;
      const li = document.createElement("li");
      li.className = "ce-rule" + (doc && m.ok && !els.length ? " ce-none" : "");
      const counts = new Map();
      els.forEach((el) => { const n = shortName(el); counts.set(n, (counts.get(n) || 0) + 1); });
      const matched = [...counts].slice(0, 4).map(([n, c]) => esc(n) + (c > 1 ? ` ×${c}` : "")).join(", ");
      const spec = specificity(rule.selector);

      li.innerHTML = `
        <div class="ce-rule-head">
          <span class="ce-rule-sel">${esc(rule.selector)}</span>
          <span class="ce-badge ${!m.ok || !els.length ? "ce-badge-nomatch" : "ce-badge-match"}">${!m.ok ? "typo" : `${els.length} match${els.length === 1 ? "" : "es"}`}</span>
          <span class="ce-badge" title="Specificity (ids, classes, elements). The higher one wins when rules disagree.">${spec.join("-")}</span>
        </div>
        <div class="ce-rule-text">Selects ${explainSelector(rule.selector)}.${matched ? `<br>In your page: ${matched}` : ""}</div>
        <div class="ce-rule-decls">${esc(rule.decls.map((d) => `${d.prop}: ${d.value};`).join(" "))}</div>`;
      li.title = "Click to show in the result and in style.css";
      li.addEventListener("click", () => {
        cssPane.goToLine(lineOf(cssPane.ta.value, rule.start), false);
        showPane("preview");
        flashElements(els);
      });
      rulesEl.appendChild(li);
    });
  }

  /* -----------------------------
     RESULT (iframe, same-origin but no scripts)
  ----------------------------- */
  const LINK_RE = /<link\b[^>]*href\s*=\s*["']?(?:\.\/)?style\.css["']?[^>]*>/i;
  const linksStylesheet = (html) => LINK_RE.test(html);
  const TOOLS_CSS = "[data-ce-hl]{outline:3px dashed #e67e22 !important;outline-offset:2px !important;}";
  const safeCss = (css) => css.replace(/<\/style/gi, "<\\/style");

  function buildDoc() {
    const html = htmlPane.ta.value;
    const css = cssPane.ta.value;
    const userStyle = `<style id="ce-user-css">${safeCss(css)}</style>`;
    const tools = `<style id="ce-tools">${TOOLS_CSS}</style><base target="_blank">`;
    if (!/<html[\s>]/i.test(html)) {
      // A fragment: apply the CSS as if it were linked
      return `<!DOCTYPE html><html><head>${userStyle}${tools}</head><body>${html}</body></html>`;
    }
    let doc = html.replace(LINK_RE, userStyle);
    doc = /<\/head>/i.test(doc) ? doc.replace(/<\/head>/i, tools + "</head>") : tools + doc;
    return doc;
  }

  let frameReady = false;
  let lastHtml = null;

  function run() {
    frameReady = false;
    lastHtml = htmlPane.ta.value;
    frame.srcdoc = buildDoc();
  }

  frame.addEventListener("load", () => {
    frameReady = true;
    analyse();
  });

  const frameDoc = () => (frameReady ? frame.contentDocument : null);

  // Fast path: only the CSS changed, so swap the stylesheet without reloading the page
  function applyCss() {
    const doc = frameDoc();
    const style = doc && doc.getElementById("ce-user-css");
    if (style && lastHtml === htmlPane.ta.value) style.textContent = cssPane.ta.value;
    else run();
  }

  let flashTimer;
  function highlightElements(els) {
    const doc = frameDoc();
    if (!doc) return;
    doc.querySelectorAll("[data-ce-hl]").forEach((el) => el.removeAttribute("data-ce-hl"));
    els.forEach((el) => el.setAttribute("data-ce-hl", ""));
  }

  function flashElements(els) {
    clearTimeout(flashTimer);
    highlightElements(els);
    if (els[0]) els[0].scrollIntoView({ block: "center" });
    flashTimer = setTimeout(() => highlightElements([]), 2000);
  }

  /* -----------------------------
     EXPLAIN WHAT IS UNDER THE CURSOR
  ----------------------------- */
  const DEFAULT_EXPLAIN = `<i class="fas fa-lightbulb"></i> Click on a selector, property or value in <code>style.css</code> to see what it does. The elements a rule selects get an orange outline in the result.`;

  function explainValueToken(prop, value, offset) {
    const re = /(#[0-9a-fA-F]{3,8}\b)|(-?(?:\d+\.?\d*|\.\d+))([a-zA-Z%]+)?|([a-zA-Z-]+)\(|([a-zA-Z][\w-]*)/g;
    let m;
    while ((m = re.exec(value))) {
      if (offset < m.index || offset > m.index + m[0].length) continue;
      if (m[1] || (m[5] && supports("color", m[5]) && !/^(inherit|initial|unset|currentcolor)$/i.test(m[5]))) {
        const c = m[1] || m[5];
        return `<span class="ce-swatch" style="background:${esc(c)}"></span>${codeOf(c)} is a color.${m[1] ? " #RRGGBB: two hex digits each for red, green and blue." : ""}`;
      }
      if (m[2] !== undefined) {
        const unit = m[3] && m[3].toLowerCase();
        if (unit && UNITS[unit]) return `${codeOf(m[2] + m[3])} – ${codeOf(unit)} means ${esc(UNITS[unit])}.`;
        if (!unit && m[2] === "0") return `${codeOf("0")} needs no unit – zero is zero in every unit.`;
        if (!unit) return UNITLESS.has(prop) ? `${codeOf(m[2])} – ${codeOf(prop)} takes a plain number.` : `${codeOf(m[2])} probably needs a unit, like ${codeOf(m[2] + "px")}.`;
      }
      if (m[4]) {
        const f = m[4].toLowerCase();
        return FUNCS[f] ? `${codeOf(f + "()")} – ${esc(FUNCS[f])}.` : `${codeOf(f + "()")} is a CSS function.`;
      }
      if (m[5]) {
        const info = describeProp(prop);
        return `${codeOf(m[5])} is a keyword value for ${codeOf(prop)}.${info ? " Other values: " + info.values.slice(0, 4).map(codeOf).join(", ") : ""}`;
      }
    }
    return null;
  }

  function explainCss(pos) {
    const code = cssPane.ta.value;
    const parsed = lastParsed || parseCss(code);
    const seg = H.scanCss(code).find((s) => pos >= s.start && pos <= s.start + s.text.length && s.text.trim()) || null;

    // Outline the elements of the rule the cursor is in
    const rule = parsed.rules.find((r) => !r.isAt && !r.keyframe && pos >= r.start && pos <= r.end + 1);
    const els = rule ? matchesIn(frameDoc(), rule.selector).els : [];
    if (document.activeElement === cssPane.ta) highlightElements(els);
    const matchNote = rule ? ` <small>(${els.length} element${els.length === 1 ? "" : "s"} selected)</small>` : "";

    if (!seg) return rule ? `<i class="fas fa-lightbulb"></i> Inside the rule ${codeOf(rule.selector)}.${matchNote}` : DEFAULT_EXPLAIN;

    switch (seg.type) {
      case "comment":
        return `<i class="fas fa-lightbulb"></i> <strong>Comment</strong> – a note for people reading the code. The browser ignores everything between <code>/*</code> and <code>*/</code>.`;
      case "selector":
        return `<i class="fas fa-crosshairs"></i> Selector ${codeOf(seg.text.trim())} selects ${explainSelector(seg.text.trim())}.${matchNote}`;
      case "at": {
        const name = (seg.text.trim().match(/^@([\w-]+)/) || [])[1] || "";
        const key = name.replace(/^-webkit-/, "");
        return `<i class="fas fa-lightbulb"></i> ${codeOf("@" + name)} – ${AT_RULES[key] || "an at-rule: a special instruction for the browser."}`;
      }
      case "prop": {
        const prop = seg.text.trim().toLowerCase();
        const info = describeProp(prop);
        const mdn = `<a href="https://developer.mozilla.org/en-US/docs/Web/CSS/${encodeURIComponent(prop)}" target="_blank" rel="noopener">Learn more</a>`;
        if (info) return `<i class="fas fa-lightbulb"></i> ${codeOf(prop)} – ${esc(info.desc)} Try: ${info.values.slice(0, 4).map(codeOf).join(", ")}. ${mdn}`;
        if (isKnownProp(prop)) return `<i class="fas fa-lightbulb"></i> ${codeOf(prop)} is a CSS property. ${mdn}`;
        const guess = closest(prop, allProps());
        return `<i class="fas fa-exclamation-triangle"></i> ${codeOf(prop)} is not a CSS property.${guess ? ` Did you mean ${codeOf(guess)}?` : ""}`;
      }
      case "value": {
        const text = explainValueToken(seg.prop, seg.text, pos - seg.start);
        return `<i class="fas fa-lightbulb"></i> ${text || `The value of ${codeOf(seg.prop)}.`}${matchNote}`;
      }
      case "punct":
        return `<i class="fas fa-lightbulb"></i> ${{
          "{": "<code>{</code> starts the declarations of a rule.",
          "}": "<code>}</code> ends the rule.",
          ":": "<code>:</code> separates the property from its value.",
          ";": "<code>;</code> ends a declaration. Don't forget it!"
        }[seg.text] || ""}${matchNote}`;
      default:
        return DEFAULT_EXPLAIN;
    }
  }

  function explainHtml(pos) {
    const code = htmlPane.ta.value;
    // class="a b" or id="x" under the cursor?
    const attrRe = /\b(class|id)\s*=\s*"([^"]*)"/gi;
    let m;
    while ((m = attrRe.exec(code))) {
      const valStart = m.index + m[0].indexOf('"') + 1;
      if (pos < valStart || pos > valStart + m[2].length) continue;
      const before = m[2].slice(0, pos - valStart).split(/\s+/).pop();
      const after = m[2].slice(pos - valStart).split(/\s+/)[0];
      const word = before + after;
      if (!word) break;
      const sel = m[1].toLowerCase() === "class" ? "." + word : "#" + word;
      const used = (lastParsed?.rules || []).filter((r) => r.selector.includes(sel)).map((r) => codeOf(r.selector));
      return `<i class="fas fa-crosshairs"></i> ${m[1].toLowerCase() === "class" ? "Class" : "Id"} ${codeOf(word)} – select it in style.css with ${codeOf(sel + " { … }")}. ${used.length ? "Used by: " + used.join(", ") : "No rule uses it yet."}`;
    }
    const lt = code.lastIndexOf("<", pos);
    const gt = code.lastIndexOf(">", pos - 1);
    if (lt > gt) {
      const tag = (code.slice(lt).match(/^<\/?([a-zA-Z][\w-]*)/) || [])[1];
      if (tag && tag.toLowerCase() === "link") return `<i class="fas fa-link"></i> ${codeOf('<link rel="stylesheet" href="style.css">')} connects this page to style.css. Without it, the CSS isn't used.`;
      if (tag) return `<i class="fas fa-crosshairs"></i> Select every ${codeOf(`<${tag.toLowerCase()}>`)} in style.css with ${codeOf(`${tag.toLowerCase()} { … }`)}.`;
    }
    return `<i class="fas fa-lightbulb"></i> <code>index.html</code> is the page structure. Give elements a <code>class</code> so style.css can select them.`;
  }

  /* -----------------------------
     CHALLENGES (checked in the real result page)
  ----------------------------- */
  const cs = (el) => el.ownerDocument.defaultView.getComputedStyle(el);
  const all = (doc, sel) => [...doc.querySelectorAll(sel)];
  const ruleMatches = (doc, rule, el) => { try { return el.matches(stripDynamic(rule.selector)); } catch { return false; } };

  const CHALLENGES = [
    {
      title: "Color the heading",
      text: "Give the <code>&lt;h1&gt;</code> a color.",
      hint: "h1 {\n  color: crimson;\n}",
      check: (doc) => { const h = doc.querySelector("h1"); return h && cs(h).color !== "rgb(0, 0, 0)"; }
    },
    {
      title: "Change the font",
      text: "Set a <code>font-family</code> on <code>body</code> so the whole page changes.",
      hint: "body {\n  font-family: Arial, sans-serif;\n}",
      check: (doc, rules) => rules.some((r) => ruleMatches(doc, r, doc.body) && r.decls.some((d) => d.valid && (d.prop === "font-family" || d.prop === "font")))
    },
    {
      title: "Style the cards",
      text: "Give every <code>.card</code> a <code>background-color</code> and at least <code>10px</code> of <code>padding</code>.",
      hint: ".card {\n  background-color: lightyellow;\n  padding: 16px;\n}",
      check: (doc) => { const c = all(doc, ".card"); return c.length && c.every((el) => cs(el).backgroundColor !== "rgba(0, 0, 0, 0)" && parseFloat(cs(el).paddingTop) >= 10); }
    },
    {
      title: "Round the corners",
      text: "Give the cards rounded corners with <code>border-radius</code>.",
      hint: ".card {\n  border-radius: 12px;\n}",
      check: (doc) => { const c = all(doc, ".card"); return c.length && c.every((el) => parseFloat(cs(el).borderTopLeftRadius) > 0); }
    },
    {
      title: "Center the title",
      text: "Center the <code>&lt;h1&gt;</code> text with <code>text-align</code>.",
      hint: "h1 {\n  text-align: center;\n}",
      check: (doc) => { const h = doc.querySelector("h1"); return h && cs(h).textAlign === "center"; }
    },
    {
      title: "Cards side by side",
      text: "Put the cards in a row: use <code>display: flex</code> on <code>.cards</code> (and a <code>gap</code>).",
      hint: ".cards {\n  display: flex;\n  gap: 16px;\n}",
      check: (doc) => { const c = doc.querySelector(".cards"); return c && /flex|grid/.test(cs(c).display); }
    },
    {
      title: "Add a shadow",
      text: "Lift the cards off the page with <code>box-shadow</code>.",
      hint: ".card {\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n}",
      check: (doc) => { const c = all(doc, ".card"); return c.length && c.every((el) => cs(el).boxShadow !== "none"); }
    },
    {
      title: "Hover effect",
      text: "Make the button change when the mouse is over it, with a <code>:hover</code> rule.",
      hint: ".btn:hover {\n  background-color: seagreen;\n  color: white;\n}",
      check: (doc, rules) => rules.some((r) => /:hover/.test(r.selector) && r.decls.some((d) => d.valid) && all(doc, "button, .btn").some((el) => ruleMatches(doc, r, el)))
    }
  ];

  let done = new Set();
  try { done = new Set(JSON.parse(localStorage.getItem(STORE.challenges)) || []); } catch { /* ignore */ }

  function renderChallenges() {
    const list = $("ceChallenges");
    if (!list) return;
    list.innerHTML = "";
    const active = CHALLENGES.findIndex((_, i) => !done.has(i));
    CHALLENGES.forEach((c, i) => {
      const li = document.createElement("li");
      li.className = "ce-challenge" + (done.has(i) ? " ce-done" : "") + (i === active ? " ce-active" : "");
      li.innerHTML = `
        <div class="ce-challenge-title"><i class="${done.has(i) ? "fas fa-check-circle" : "far fa-circle"}"></i> ${i + 1}. ${esc(c.title)}</div>
        <p>${c.text}</p>
        <div class="ce-hint" hidden></div>
        <div class="ce-challenge-actions">
          <button type="button" data-act="hint"><i class="far fa-lightbulb"></i> Hint</button>
          <button type="button" data-act="insert"><i class="fas fa-paste"></i> Show me</button>
        </div>`;
      const hint = li.querySelector(".ce-hint");
      hint.textContent = c.hint;
      li.querySelector('[data-act="hint"]').addEventListener("click", () => { hint.hidden = !hint.hidden; });
      li.querySelector('[data-act="insert"]').addEventListener("click", () => {
        const v = cssPane.ta.value;
        cssPane.ta.focus({ preventScroll: true });
        cssPane.ta.setSelectionRange(v.length, v.length);
        cssPane.insert((v.endsWith("\n\n") ? "" : v.endsWith("\n") ? "\n" : "\n\n") + c.hint + "\n");
        cssPane.goToLine(cssPane.ta.value.split("\n").length - 1, false);
        root.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      list.appendChild(li);
    });
    const progress = $("ceChallengeProgress");
    if (progress) progress.textContent = `${done.size} / ${CHALLENGES.length} done`;
  }

  function checkChallenges(doc, rules) {
    if (!doc) return;
    let changed = false;
    CHALLENGES.forEach((c, i) => {
      if (done.has(i)) return;
      let ok = false;
      try { ok = !!c.check(doc, rules); } catch { ok = false; }
      if (ok) {
        done.add(i);
        changed = true;
        window.HTMLMaster?.awardXP?.(15, "CSS challenge");
        toast(`🎨 Challenge done: ${c.title} (+15 XP)`);
      }
    });
    if (changed) {
      try { localStorage.setItem(STORE.challenges, JSON.stringify([...done])); } catch { /* ignore */ }
      if (done.size === CHALLENGES.length) toast("🎉 You finished every CSS challenge!");
      renderChallenges();
    }
  }

  /* -----------------------------
     ANALYSE + SAVE
  ----------------------------- */
  let lastParsed = null;
  let analyseTimer;
  let runTimer;
  let saveTimer;

  function analyse() {
    const css = cssPane.ta.value;
    const html = htmlPane.ta.value;
    const doc = frameDoc();
    lastParsed = parseCss(css);
    renderTips(lint(css, html, lastParsed, doc));
    renderRules(lastParsed, doc);
    checkChallenges(doc, lastParsed.rules);
  }

  function scheduleAnalyse() {
    clearTimeout(analyseTimer);
    analyseTimer = setTimeout(analyse, 250);
  }

  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try {
        localStorage.setItem(STORE.css, cssPane.ta.value);
        localStorage.setItem(STORE.html, htmlPane.ta.value);
      } catch { /* ignore */ }
    }, 500);
  }

  /* -----------------------------
     PANES
  ----------------------------- */
  const cssPane = createPane({
    ta: $("ceCss"), pre: $("ceCssHl"), gutter: $("ceCssGutter"),
    highlight: H.css,
    opensBlock: (before, after) => (/\{\s*$/.test(before) ? (/^\s*\}/.test(after) ? "between" : true) : false),
    autoClose: (typed, before, after) => (typed === "{" && !/^\s*\}/.test(after) ? "}" : null),
    onInput: () => {
      if (liveEl.checked) applyCss();
      scheduleAnalyse();
      save();
      updateExplain();
    }
  });

  const htmlPane = createPane({
    ta: $("ceHtml"), pre: $("ceHtmlHl"), gutter: $("ceHtmlGutter"),
    highlight: H.html,
    opensBlock: (before, after) => {
      const m = before.match(/<([a-zA-Z][\w-]*)[^<>]*>$/);
      if (!m || VOID.has(m[1].toLowerCase()) || /\/>$/.test(before)) return false;
      return /^<\//.test(after) ? "between" : true;
    },
    autoClose: (typed, before, after) => {
      if (typed !== ">") return null;
      const m = before.match(/<([a-zA-Z][\w-]*)(\s[^<>]*)?>$/);
      if (!m || before.endsWith("/>") || VOID.has(m[1].toLowerCase())) return null;
      return after.trimStart().toLowerCase().startsWith(`</${m[1].toLowerCase()}`) ? null : `</${m[1]}>`;
    },
    onInput: () => {
      if (liveEl.checked) {
        clearTimeout(runTimer);
        runTimer = setTimeout(run, 400);
      }
      scheduleAnalyse();
      save();
    }
  });

  let explainFrom = "css";
  function updateExplain() {
    explainEl.innerHTML = explainFrom === "css" ? explainCss(cssPane.ta.selectionStart) : explainHtml(htmlPane.ta.selectionStart);
  }

  ["click", "keyup", "focus"].forEach((ev) => {
    cssPane.ta.addEventListener(ev, () => { explainFrom = "css"; updateExplain(); });
    htmlPane.ta.addEventListener(ev, () => { explainFrom = "html"; highlightElements([]); updateExplain(); });
  });
  cssPane.ta.addEventListener("blur", () => highlightElements([]));

  /* -----------------------------
     TABS
  ----------------------------- */
  const tabs = root.querySelectorAll(".ce-tab");
  const panes = root.querySelectorAll(".ce-pane");
  function showPane(name) {
    tabs.forEach((t) => t.setAttribute("aria-selected", String(t.dataset.pane === name)));
    panes.forEach((p) => { p.hidden = p.dataset.pane !== name; });
  }
  tabs.forEach((t) => t.addEventListener("click", () => showPane(t.dataset.pane)));

  /* -----------------------------
     SNIPPETS
  ----------------------------- */
  const SNIPPETS = [
    ["color", "color: |crimson;"],
    ["background", "background-color: |lightyellow;"],
    ["font-size", "font-size: |20px;"],
    ["font-family", "font-family: |Arial, sans-serif;"],
    ["margin", "margin: |20px;"],
    ["padding", "padding: |10px 20px;"],
    ["border", "border: |2px solid steelblue;"],
    ["border-radius", "border-radius: |8px;"],
    ["width", "width: |300px;"],
    ["box-shadow", "box-shadow: |0 4px 12px rgba(0, 0, 0, 0.15);"],
    ["flex", "display: flex;\ngap: |16px;"],
    ["center", "display: flex;\njustify-content: center;\nalign-items: center;|"],
    ["transition", "transition: |all 0.3s ease;"],
    ["new rule", ".|my-class {\n  \n}", true],
    [":hover", "|button:hover {\n  background-color: seagreen;\n}", true],
    ["@media", "@media (max-width: 600px) {\n  |\n}", true]
  ];

  // Is the cursor inside a rule's { } (where declarations go)?
  function insideDeclarations(code, pos) {
    const segs = H.scanCss(code.slice(0, pos));
    const open = [];
    segs.forEach((s, i) => {
      if (s.type !== "punct") return;
      if (s.text === "{") open.push(i);
      if (s.text === "}") open.pop();
    });
    if (!open.length) return false;
    // Directly inside @media { } we need a rule, not a declaration
    const head = segs[open[open.length - 1] - 1];
    return !(head && head.type === "at" && /^\s*@(media|supports|container|layer)/i.test(head.text));
  }

  function insertSnippet(snippet, isRule) {
    const ta = cssPane.ta;
    if (ta.selectionStart !== ta.selectionEnd) ta.setSelectionRange(ta.selectionEnd, ta.selectionEnd);
    let text = snippet;
    // Declarations must go inside a rule; outside one, wrap them in "h1 { }"
    if (!isRule && !insideDeclarations(ta.value, ta.selectionStart)) {
      text = "h1 {\n" + text.split("\n").map((l) => INDENT + l).join("\n") + "\n}\n";
      toast("Declarations go inside a rule. Change h1 to the element you want to style.");
    }
    const indent = cssPane.currentIndent();
    text = text.replace(/\n/g, "\n" + indent);
    const caret = text.indexOf("|");
    text = text.replace("|", "");
    const start = ta.selectionStart;
    cssPane.insert(text);
    if (caret >= 0) ta.setSelectionRange(start + caret, start + caret);
    explainFrom = "css";
    updateExplain();
  }

  const snippetBar = $("ceSnippets");
  SNIPPETS.forEach(([label, code, isRule]) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "ce-snippet";
    b.textContent = label;
    const info = describeProp(label === "background" ? "background-color" : label);
    b.title = info ? info.desc : isRule ? "Insert a new rule" : "Insert at the cursor";
    b.addEventListener("click", () => insertSnippet(code, !!isRule));
    snippetBar?.appendChild(b);
  });

  /* -----------------------------
     TOOLBAR
  ----------------------------- */
  function formatCss(code) {
    let out = "";
    let depth = 0;
    let head = "";
    let prop = null;
    let value = "";
    const ind = () => INDENT.repeat(depth);
    const flushDecl = () => {
      if (prop) out += `${ind()}${prop}: ${value.trim().replace(/\s+/g, " ")};\n`;
      prop = null;
      value = "";
    };
    for (const s of H.scanCss(code)) {
      if (s.type === "comment") { flushDecl(); out += ind() + s.text.trim() + "\n" + (depth === 0 ? "\n" : ""); }
      else if (s.type === "selector" || s.type === "at") head += s.text;
      else if (s.type === "prop") { if (s.text.trim()) prop = s.text.trim(); }
      else if (s.type === "value") value += s.text;
      else if (s.text === "{") {
        out += `${ind()}${head.trim().replace(/\s+/g, " ").replace(/\s*,\s*/g, ", ")} {\n`;
        depth++;
        head = "";
      } else if (s.text === ";") {
        if (prop) flushDecl();
        else if (head.trim()) { out += ind() + head.trim() + ";\n"; head = ""; }
      } else if (s.text === "}") {
        flushDecl();
        depth = Math.max(0, depth - 1);
        out += ind() + "}\n" + (depth === 0 ? "\n" : "");
      }
    }
    flushDecl();
    return out.replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
  }

  $("ceFormat")?.addEventListener("click", () => {
    if ((lastParsed || parseCss(cssPane.ta.value)).problems.length) {
      showPane("tips");
      toast("Fix the problems in Tips first, then tidy.");
      return;
    }
    const tidy = formatCss(cssPane.ta.value);
    if (tidy === cssPane.ta.value) { toast("✨ Already tidy!"); return; }
    cssPane.setValue(tidy);
    toast("✨ CSS tidied");
  });

  $("ceCopy")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(cssPane.ta.value);
      toast("📋 style.css copied");
    } catch {
      cssPane.ta.select();
      toast("Press Ctrl+C to copy");
    }
  });

  $("ceDownload")?.addEventListener("click", () => {
    const download = (name, text, type) => {
      const url = URL.createObjectURL(new Blob([text], { type }));
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    };
    download("style.css", cssPane.ta.value, "text/css");
    download("index.html", wrapPage(htmlPane.ta.value), "text/html");
    toast("💾 Saved style.css and index.html – keep them in the same folder");
  });

  $("ceReset")?.addEventListener("click", (e) => {
    const reset = () => {
      cssPane.setValue(STARTER_CSS);
      htmlPane.setValue(STARTER_HTML);
      run();
      toast("↺ Back to the starter files – press Ctrl+Z in a file to undo");
    };
    // Only ask when there is work to lose
    if (cssPane.ta.value === STARTER_CSS && htmlPane.ta.value === STARTER_HTML) reset();
    else window.confirmButton(e.currentTarget, "Sure? Click again", reset);
  });

  $("ceRun")?.addEventListener("click", () => { run(); showPane("preview"); });
  liveEl?.addEventListener("change", () => { if (liveEl.checked) run(); });

  /* -----------------------------
     START
  ----------------------------- */
  const read = (key) => { try { return localStorage.getItem(key); } catch { return null; } };
  cssPane.ta.value = read(STORE.css) ?? STARTER_CSS;
  htmlPane.ta.value = read(STORE.html) || STARTER_HTML;
  cssPane.render();
  htmlPane.render();
  explainEl.innerHTML = DEFAULT_EXPLAIN;
  renderChallenges();
  run();

  // Used by the "Try it" buttons on the property cards (css-reference.js)
  window.CSSEditor = {
    load({ css, html, title }) {
      // One declaration per line is easier to read and edit
      const clean = parseCss(css).problems.length ? css.trim() + "\n" : formatCss(css);
      cssPane.setValue(clean);
      if (html) htmlPane.setValue(wrapPage(html));
      run();
      showPane("preview");
      root.scrollIntoView({ behavior: "smooth", block: "start" });
      toast(`🎨 ${title ? title + " is" : "The example is"} in the CSS editor. Change the values! (Ctrl+Z undoes)`);
    }
  };
})();
