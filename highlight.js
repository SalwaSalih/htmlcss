/* =========================================================
   HTML MASTER – SHARED SYNTAX HIGHLIGHTING
   window.HMHighlight.html(code)   -> highlighted HTML markup
   window.HMHighlight.css(code)    -> highlighted CSS markup
   window.HMHighlight.scanCss(code) -> CSS split into typed pieces
   Used by editor.js, examples.js and css-editor.js.
   Colors: highlight.css
========================================================= */

(function () {
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  /* -----------------------------
     HTML
  ----------------------------- */
  const TOKEN_RE = /<!--[\s\S]*?(?:-->|$)|<!DOCTYPE[^>]*>?|<\/?[a-zA-Z][^<>]*>?|&#?[a-zA-Z0-9]+;/gi;
  const ATTR_RE = /([^\s=\/>]+)(\s*=\s*)?("[^"]*"?|'[^']*'?|[^\s"'>]+)?/g;

  const span = (cls, text) => `<span class="he-t-${cls}">${esc(text)}</span>`;

  function highlightAttrs(text) {
    let out = "";
    let last = 0;
    let m;
    ATTR_RE.lastIndex = 0;
    while ((m = ATTR_RE.exec(text))) {
      if (m[0] === "") { ATTR_RE.lastIndex++; continue; }
      out += esc(text.slice(last, m.index));
      out += span("attr", m[1]);
      if (m[2]) out += esc(m[2]);
      if (m[3]) out += span("string", m[3]);
      last = ATTR_RE.lastIndex;
    }
    return out + esc(text.slice(last));
  }

  function highlightToken(tok) {
    if (tok.startsWith("<!--")) return span("comment", tok);
    if (/^<!doctype/i.test(tok)) return span("doctype", tok);
    if (tok[0] === "&") return span("entity", tok);

    const m = tok.match(/^(<\/?)([a-zA-Z][\w-]*)([\s\S]*?)(\/?>)?$/);
    if (!m) return esc(tok);
    return span("bracket", m[1]) + span("tag", m[2]) + highlightAttrs(m[3]) + (m[4] ? span("bracket", m[4]) : "");
  }

  function html(code) {
    let out = "";
    let last = 0;
    let m;
    TOKEN_RE.lastIndex = 0;
    while ((m = TOKEN_RE.exec(code))) {
      out += esc(code.slice(last, m.index)) + highlightToken(m[0]);
      last = TOKEN_RE.lastIndex;
    }
    // Trailing newline keeps an overlay <pre> as tall as its textarea
    return out + esc(code.slice(last)) + "\n";
  }

  /* -----------------------------
     CSS
  ----------------------------- */
  // At-rules whose block holds more rules (not declarations)
  const NESTING_AT = /^@(media|supports|container|layer|document|scope|starting-style|(-webkit-)?keyframes)\b/i;
  const CSS_TOKEN_RE = /\/\*[\s\S]*?(?:\*\/|$)|[{};:]|"(?:[^"\\\n]|\\.)*"?|'(?:[^'\\\n]|\\.)*'?|[^{};:"'\/]+|\//g;

  /*
    Splits CSS into pieces: { type, text, start, prop? }
    type: comment | selector | at | prop | value | punct
    "value" pieces also carry the property they belong to.
  */
  function scanCss(code) {
    const segs = [];
    const stack = ["rules"];
    let phase = "prop";
    let buf = "";
    let bufType = null;
    let bufStart = 0;
    let curProp = "";

    const flush = () => {
      if (buf) segs.push(bufType === "value" ? { type: bufType, text: buf, start: bufStart, prop: curProp } : { type: bufType, text: buf, start: bufStart });
      buf = "";
      bufType = null;
    };
    const add = (type, text, start) => {
      if (bufType !== type) { flush(); bufType = type; bufStart = start; }
      buf += text;
    };
    const punct = (text, start) => { flush(); segs.push({ type: "punct", text, start }); };
    const retagAt = () => { if (bufType === "selector" && buf.trim().startsWith("@")) bufType = "at"; };

    let m;
    CSS_TOKEN_RE.lastIndex = 0;
    while ((m = CSS_TOKEN_RE.exec(code))) {
      const t = m[0];
      const at = m.index;
      const ctx = stack[stack.length - 1];

      if (t.startsWith("/*")) { flush(); segs.push({ type: "comment", text: t, start: at }); continue; }

      if (ctx === "rules") {
        if (t === "{") {
          retagAt();
          const head = buf.trim();
          punct(t, at);
          stack.push(head.startsWith("@") && NESTING_AT.test(head) ? "rules" : "decls");
          phase = "prop";
        } else if (t === ";") {
          retagAt();
          punct(t, at);
        } else if (t === "}") {
          punct(t, at);
          if (stack.length > 1) stack.pop();
        } else {
          add("selector", t, at);
        }
        continue;
      }

      // Inside a rule: property: value;
      if (t === "{") {
        if (bufType) bufType = "selector"; // nested rule
        punct(t, at);
        stack.push("decls");
        phase = "prop";
      } else if (t === "}") {
        punct(t, at);
        if (stack.length > 1) stack.pop();
        phase = "prop";
      } else if (t === ";") {
        punct(t, at);
        phase = "prop";
      } else if (t === ":" && phase === "prop") {
        curProp = buf.trim().toLowerCase();
        punct(t, at);
        phase = "value";
      } else {
        add(phase === "prop" ? "prop" : "value", t, at);
      }
    }
    flush();
    return segs;
  }

  const cspan = (cls, text) => `<span class="ce-t-${cls}">${esc(text)}</span>`;

  // Wrap a regex's matches in spans, escaping everything in between
  function paint(text, re, painter) {
    let out = "";
    let last = 0;
    let m;
    re.lastIndex = 0;
    while ((m = re.exec(text))) {
      if (m[0] === "") { re.lastIndex++; continue; }
      out += esc(text.slice(last, m.index)) + painter(m);
      last = re.lastIndex;
    }
    return out + esc(text.slice(last));
  }

  const SELECTOR_RE = /(\.[\w-]+)|(#[\w-]+)|(::?[\w-]+)|(\[[^\]]*\]?)|([a-zA-Z][\w-]*|\*)|([>+~,])/g;
  function paintSelector(text) {
    return paint(text, SELECTOR_RE, (m) =>
      m[1] ? cspan("class", m[0]) :
      m[2] ? cspan("id", m[0]) :
      m[3] ? cspan("pseudo", m[0]) :
      m[4] ? cspan("attr", m[0]) :
      m[5] ? cspan("tag", m[0]) :
      cspan("punct", m[0]));
  }

  const NOT_COLOR_WORDS = new Set(["inherit", "initial", "unset", "revert", "currentcolor"]);
  const colorCache = new Map();
  function isColorWord(word) {
    const w = word.toLowerCase();
    if (NOT_COLOR_WORDS.has(w)) return false;
    if (!colorCache.has(w)) colorCache.set(w, !!(window.CSS && CSS.supports && CSS.supports("color", w)));
    return colorCache.get(w);
  }

  const VALUE_RE = /("[^"]*"?|'[^']*'?)|(#[0-9a-fA-F]{3,8}\b)|(!important)|(-?(?:\d+\.?\d*|\.\d+))([a-zA-Z%]+)?|([a-zA-Z-]+)(?=\()|([a-zA-Z][\w-]*)/g;
  function paintValue(text) {
    return paint(text, VALUE_RE, (m) => {
      if (m[1]) return cspan("string", m[1]);
      if (m[2]) return cspan("color", m[2]);
      if (m[3]) return cspan("important", m[3]);
      if (m[4] !== undefined) return cspan("number", m[4]) + (m[5] ? cspan("unit", m[5]) : "");
      if (m[6]) return cspan("func", m[6]);
      return isColorWord(m[7]) ? cspan("color", m[7]) : cspan("keyword", m[7]);
    });
  }

  function css(code) {
    let out = "";
    for (const s of scanCss(code)) {
      switch (s.type) {
        case "comment": out += cspan("comment", s.text); break;
        case "punct": out += cspan("punct", s.text); break;
        case "selector": out += paintSelector(s.text); break;
        case "at": {
          const m = s.text.match(/^(\s*)(@[\w-]+)([\s\S]*)$/);
          out += m ? esc(m[1]) + cspan("at", m[2]) + paintValue(m[3]) : esc(s.text);
          break;
        }
        case "prop": out += s.text.replace(/^(\s*)([\s\S]*?)(\s*)$/, (_, a, b, c) => esc(a) + cspan("prop", b) + esc(c)); break;
        case "value": out += paintValue(s.text); break;
        default: out += esc(s.text);
      }
    }
    return out + "\n";
  }

  window.HMHighlight = { html, css, scanCss, escape: esc };
})();
