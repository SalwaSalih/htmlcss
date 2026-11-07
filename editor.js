/* =========================================================
   HTML MASTER – INTERACTIVE HTML EDITOR (index.html #examples)
   - Syntax highlighting + line numbers
   - Live result in a sandboxed iframe
   - "What does this tag do?" explanations
   - Beginner-friendly tips (unclosed tags, missing alt, typos…)
   - Structure view (the DOM tree)
   - Auto-checked challenges with XP
   Styles: editor.css
========================================================= */

(function () {
  const ta = document.getElementById("htmlCode");
  const hl = document.getElementById("heHighlight");
  const gutter = document.getElementById("heGutter");
  const frame = document.getElementById("outputFrame");
  if (!ta || !hl || !gutter || !frame) return;

  const $ = (id) => document.getElementById(id);
  const explainEl = $("heExplain");
  const cursorEl = $("heCursor");
  const tipsEl = $("heTips");
  const tipCountEl = $("heTipCount");
  const treeEl = $("heTree");
  const liveEl = $("heLive");

  const STORAGE_CODE = "htmlEditorCode";
  const STORAGE_CHALLENGES = "htmlmaster_editor_challenges";
  const INDENT = "  ";

  // The editor starts empty; the textarea placeholder says "Add your HTML code here"
  const STARTER = "";
  // Code that older versions put in the editor; treated as "nothing written yet"
  const OLD_STARTER = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My first page</title>
</head>
<body>
  <!-- Write your HTML below this line -->
  <p>Hello! Change this text and watch the result update.</p>

</body>
</html>`;

  /* -----------------------------
     TAG + ATTRIBUTE DICTIONARY (used for explanations and the structure view)
  ----------------------------- */
  const TAGS = {
    html: ["The whole page", "The root element. Everything else goes inside it. Add lang=\"en\" so screen readers know the language."],
    head: ["Info about the page", "Holds things visitors don't see on the page: the title, meta tags, CSS links."],
    body: ["Visible content", "Everything visitors see on the page goes inside <body>."],
    title: ["Page title", "The text shown in the browser tab and in search results. Goes inside <head>."],
    meta: ["Page settings", "Extra info about the page, like charset=\"UTF-8\" or the viewport for mobile. Has no closing tag."],
    link: ["Links a file", "Connects an outside file, usually a CSS stylesheet: <link rel=\"stylesheet\" href=\"style.css\">. No closing tag."],
    style: ["CSS on this page", "Write CSS rules for this page only. Better: put CSS in its own .css file."],
    script: ["JavaScript", "Adds JavaScript code, or loads it with src=\"file.js\"."],
    h1: ["Main heading", "The most important heading. Use one <h1> per page for the main title."],
    h2: ["Section heading", "A heading for a main section. Headings go in order: h1 → h2 → h3."],
    h3: ["Sub-heading", "A heading inside an <h2> section."],
    h4: ["Small heading", "A heading inside an <h3> section."],
    h5: ["Smaller heading", "A heading inside an <h4> section."],
    h6: ["Smallest heading", "The least important heading level."],
    p: ["Paragraph", "A block of text. The browser adds space above and below it."],
    br: ["Line break", "Starts a new line inside text. Has no closing tag."],
    hr: ["Divider line", "A horizontal line that separates topics. Has no closing tag."],
    a: ["Link", "Makes a clickable link. href says where it goes: <a href=\"https://example.com\">Visit</a>."],
    img: ["Image", "Shows a picture. Needs src (the file) and alt (a text description). Has no closing tag."],
    strong: ["Important text", "Marks text as important. Shown in bold and announced by screen readers."],
    em: ["Emphasis", "Stressed text, shown in italics. Changes how a sentence is read."],
    b: ["Bold text", "Bold text without extra meaning. Prefer <strong> for important text."],
    i: ["Italic text", "Italic text, e.g. for foreign words or names. Prefer <em> for emphasis."],
    u: ["Underlined text", "Underlined text. Careful: underlines look like links."],
    mark: ["Highlighted text", "Highlights text like a marker pen."],
    small: ["Small print", "Side comments and fine print, like copyright notes."],
    del: ["Deleted text", "Text that was removed, shown with a line through it."],
    ins: ["Inserted text", "Text that was added, usually underlined."],
    sub: ["Subscript", "Small text below the line, like the 2 in H₂O."],
    sup: ["Superscript", "Small text above the line, like the 2 in x²."],
    code: ["Code", "A short piece of computer code, shown in a monospace font."],
    pre: ["Preformatted text", "Keeps spaces and line breaks exactly as you typed them."],
    blockquote: ["Long quote", "A quote from somewhere else, shown indented."],
    q: ["Short quote", "A short inline quote. The browser adds quotation marks."],
    abbr: ["Abbreviation", "An abbreviation. Use title=\"...\" to show the full meaning on hover."],
    span: ["Inline container", "A box with no meaning, used inside text to style a few words with CSS."],
    div: ["Block container", "A box with no meaning, used to group things for layout and CSS. Prefer semantic tags when one fits."],
    ul: ["Bullet list", "An unordered list. Each item goes in an <li>."],
    ol: ["Numbered list", "An ordered list (1, 2, 3…). Each item goes in an <li>."],
    li: ["List item", "One item in a <ul> or <ol> list."],
    dl: ["Description list", "A list of terms (<dt>) and their descriptions (<dd>)."],
    dt: ["Term", "A term in a description list."],
    dd: ["Description", "The description of a term in a description list."],
    table: ["Table", "A table of data, built from rows (<tr>) and cells (<td>/<th>)."],
    caption: ["Table title", "A title for the table. Goes right after <table>."],
    thead: ["Table header", "Groups the header rows of a table."],
    tbody: ["Table body", "Groups the main rows of a table."],
    tfoot: ["Table footer", "Groups the summary rows at the bottom of a table."],
    tr: ["Table row", "One row in a table. Contains <th> or <td> cells."],
    th: ["Header cell", "A heading cell in a table, shown bold and centered."],
    td: ["Table cell", "A normal data cell in a table row."],
    form: ["Form", "Collects input from the user. action says where to send it."],
    input: ["Input field", "A field the user can type in or click. type sets the kind: text, email, password, checkbox… No closing tag."],
    label: ["Label", "A text label for a form field. Connect it with for=\"id-of-the-input\" so clicking the label focuses the field."],
    button: ["Button", "A clickable button. In a form it submits by default."],
    textarea: ["Big text field", "A multi-line text field for longer messages."],
    select: ["Dropdown", "A dropdown list. Each choice is an <option>."],
    option: ["Dropdown choice", "One choice in a <select> dropdown."],
    fieldset: ["Field group", "Groups related form fields with a border."],
    legend: ["Group title", "A title for a <fieldset>."],
    header: ["Page/section header", "Introductory content: usually a logo, title or navigation."],
    nav: ["Navigation", "A group of main navigation links."],
    main: ["Main content", "The main content of the page. Use only one."],
    section: ["Section", "A themed section of the page, usually with a heading."],
    article: ["Article", "A self-contained piece, like a blog post or news story."],
    aside: ["Side content", "Content that is related but not essential, like a sidebar."],
    footer: ["Footer", "The bottom part: copyright, contact info, links."],
    figure: ["Figure", "An image, chart or code example with an optional <figcaption>."],
    figcaption: ["Figure caption", "A caption for a <figure>."],
    video: ["Video", "Plays a video. Add controls so the user can play/pause."],
    audio: ["Audio", "Plays sound. Add controls so the user can play/pause."],
    source: ["Media source", "A file for <video>, <audio> or <picture>. No closing tag."],
    iframe: ["Embedded page", "Shows another web page inside this one, e.g. a YouTube video."],
    canvas: ["Drawing area", "An area you can draw on with JavaScript."],
    svg: ["Vector graphic", "Draws shapes and icons that stay sharp at any size."],
    picture: ["Responsive image", "Offers different image files for different screens."],
    details: ["Expandable box", "Content the user can open and close. The title goes in <summary>."],
    summary: ["Expandable title", "The always-visible title of a <details> box."],
    time: ["Date/time", "A date or time that computers can read: <time datetime=\"2026-01-01\">."],
    address: ["Contact info", "Contact information for the page or article."],
    cite: ["Title of a work", "The title of a book, film, song…"],
    kbd: ["Keyboard key", "Keyboard input, like <kbd>Ctrl</kbd>."],
    noscript: ["No-JavaScript fallback", "Shown only when JavaScript is turned off."],
    template: ["Template", "HTML that isn't shown, used by JavaScript later."],
    progress: ["Progress bar", "Shows how much of a task is done."],
    meter: ["Meter", "Shows a value in a range, like disk usage."],
    output: ["Result", "Shows the result of a calculation."],
    datalist: ["Suggestions", "A list of suggestions for an <input>."],
    optgroup: ["Option group", "Groups options in a <select>."],
    colgroup: ["Column group", "Groups table columns for styling."],
    col: ["Column", "One column in a <colgroup>."],
    wbr: ["Word break chance", "Where a long word may break."],
    embed: ["Embedded content", "Embeds outside content like a PDF."],
    object: ["Embedded object", "Embeds an outside resource."],
    map: ["Image map", "Clickable areas on an image."],
    area: ["Image map area", "One clickable area in a <map>."],
    track: ["Subtitles", "Subtitles or captions for <video>."],
    dialog: ["Dialog box", "A pop-up dialog window."],
    search: ["Search area", "Wraps a search form."],
    hgroup: ["Heading group", "A heading with a subtitle."],
    s: ["No longer correct", "Text that is no longer accurate, shown struck through."],
    var: ["Variable", "A variable in maths or programming."],
    samp: ["Sample output", "Output from a computer program."],
    data: ["Machine-readable value", "Adds a machine-readable value to content."],
    bdi: ["Isolated text direction", "Text that may go in a different direction."],
    bdo: ["Text direction override", "Forces a text direction."],
    ruby: ["Ruby annotation", "Pronunciation hints for East Asian text."],
    rt: ["Ruby text", "The pronunciation in a <ruby>."],
    rp: ["Ruby fallback", "Fallback brackets for <ruby>."],
    base: ["Base URL", "Sets the base URL for all links on the page."],
    slot: ["Slot", "A placeholder in a web component."]
  };

  // Old tags that still work but should be replaced by CSS or better tags
  const DEPRECATED = {
    font: "Use CSS instead: color, font-family and font-size.",
    center: "Use CSS instead: text-align: center;",
    marquee: "Moving text is hard to read. Use CSS animation if you really need it.",
    big: "Use CSS instead: font-size.",
    strike: "Use <s> or <del> instead.",
    tt: "Use <code> or <kbd> instead.",
    frame: "Frames are removed from HTML. Use <iframe>.",
    frameset: "Frames are removed from HTML. Use <iframe>.",
    blink: "Blinking text was removed from HTML."
  };

  const ATTRS = {
    href: "Where the link goes. A full URL (https://…), a file (page.html) or a part of the page (#id).",
    src: "The file to show: an image, video, audio or script.",
    alt: "Text that describes the image. Read by screen readers and shown if the image fails to load.",
    title: "Extra info shown as a tooltip on hover.",
    id: "A unique name for one element. Used by CSS (#name), JavaScript and links (#name).",
    class: "A name you can give to many elements so CSS can style them (.name).",
    style: "CSS written directly on this element. Handy for testing, but a CSS file is better.",
    lang: "The language of the content, e.g. en or no.",
    target: "Where the link opens. _blank = new tab.",
    rel: "How the linked page relates to this one. Use rel=\"noopener\" with target=\"_blank\".",
    type: "The kind of element, e.g. for <input>: text, email, password, number, checkbox, radio, date…",
    name: "The name sent with the form data.",
    value: "The starting value of a field, or the value sent for a button/option.",
    placeholder: "Light grey hint text shown inside an empty field.",
    required: "The form can't be sent until this field is filled in.",
    disabled: "The element can't be used or clicked.",
    checked: "The checkbox or radio button starts ticked.",
    for: "Connects a <label> to the field with the same id.",
    action: "Where the form data is sent.",
    method: "How the form data is sent: get (in the URL) or post (hidden).",
    width: "The width in pixels.",
    height: "The height in pixels.",
    controls: "Shows play/pause buttons on video and audio.",
    autoplay: "Starts playing automatically (browsers often require muted too).",
    loop: "Plays again from the start when finished.",
    muted: "Starts with the sound off.",
    colspan: "How many columns this table cell spans.",
    rowspan: "How many rows this table cell spans.",
    charset: "The character encoding. Always use UTF-8.",
    content: "The value of a <meta> tag.",
    download: "Downloads the file instead of opening it.",
    loading: "loading=\"lazy\" waits to load the image until it's close to the screen.",
    min: "The smallest allowed value.",
    max: "The largest allowed value.",
    maxlength: "The most characters allowed.",
    pattern: "A pattern the value must match.",
    readonly: "The field can be read but not changed.",
    selected: "This option starts selected.",
    rows: "Height of a textarea in lines.",
    cols: "Width of a textarea in characters.",
    datetime: "A date/time computers can read.",
    tabindex: "The order for keyboard Tab focus.",
    hidden: "Hides the element.",
    contenteditable: "Lets the user edit the element's text."
  };

  const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);
  // Tags the browser may close by itself (valid HTML, but good practice to close)
  const OPTIONAL_CLOSE = new Set(["li", "p", "td", "th", "tr", "option", "dt", "dd", "thead", "tbody", "tfoot", "html", "head", "body", "optgroup", "colgroup", "caption"]);
  // Block elements that end an open <p> when they appear inside it
  const CLOSES_P = new Set(["address", "article", "aside", "blockquote", "details", "div", "dl", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hr", "main", "nav", "ol", "p", "pre", "section", "table", "ul"]);
  const RAW_TEXT = new Set(["script", "style", "textarea", "title"]);
  const KNOWN = new Set([...Object.keys(TAGS), ...Object.keys(DEPRECATED), "path", "circle", "rect", "line", "polygon", "polyline", "ellipse", "g", "text", "defs", "use", "math"]);

  /* -----------------------------
     HELPERS
  ----------------------------- */
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const codeTag = (name) => `<code>&lt;${esc(name)}&gt;</code>`;

  function lineOf(text, index) {
    let line = 1;
    for (let i = 0; i < index && i < text.length; i++) if (text.charCodeAt(i) === 10) line++;
    return line;
  }

  // Comments become spaces (keeping line breaks) so tag scanning ignores them
  function blankComments(code) {
    return code.replace(/<!--[\s\S]*?(?:-->|$)/g, (m) => m.replace(/[^\n]/g, " "));
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

  function closestTag(name) {
    let best = null;
    let bestD = 3;
    for (const t of Object.keys(TAGS)) {
      const dist = levenshtein(name, t);
      if (dist < bestD) { best = t; bestD = dist; }
    }
    return best;
  }

  function toast(msg) {
    if (typeof showToast === "function") showToast(msg);
  }

  /* -----------------------------
     SYNTAX HIGHLIGHTING (shared, see highlight.js)
  ----------------------------- */
  const highlight = window.HMHighlight ? window.HMHighlight.html : (code) => esc(code) + "\n";

  /* -----------------------------
     TIPS (beginner-friendly checker)
  ----------------------------- */
  function lint(code) {
    const tips = [];
    const add = (level, index, title, text) => tips.push({ level, line: lineOf(code, index), title, text });
    const src = blankComments(code);
    const tagRe = /<(\/?)([a-zA-Z][\w-]*)([^<>]*)(>?)/g;
    const stack = [];
    const ids = new Map();
    const labelFor = new Set();
    const inputs = [];
    let lastHeading = 0;
    let m;

    while ((m = tagRe.exec(src))) {
      const [whole, slash, rawName, attrText, gt] = m;
      const name = rawName.toLowerCase();
      const at = m.index;
      const closing = slash === "/";

      if (!gt) {
        add("warn", at, `${codeTag(name)} is missing its >`, `Every tag ends with <code>&gt;</code>. Write ${codeTag(name)}.`);
      }

      if (rawName !== name && !rawName.includes("-") && KNOWN.has(name)) {
        add("info", at, `Write tags in lowercase`, `${esc(rawName)} works, but lowercase ${codeTag(name)} is the normal way to write HTML.`);
      }

      if (!KNOWN.has(name) && !name.includes("-")) {
        const guess = closestTag(name);
        add("warn", at, `${codeTag(name)} is not an HTML tag`, guess
          ? `Did you mean ${codeTag(guess)}? The browser ignores tags it doesn't know.`
          : `The browser ignores tags it doesn't know. Check the spelling.`);
      }

      if (DEPRECATED[name] && !closing) {
        add("info", at, `${codeTag(name)} is outdated`, esc(DEPRECATED[name]));
      }

      if (closing) {
        if (VOID.has(name)) {
          add("warn", at, `${codeTag(name)} has no closing tag`, `${codeTag(name)} is an empty element. Remove <code>&lt;/${name}&gt;</code>.`);
          continue;
        }
        let j = stack.length - 1;
        while (j >= 0 && stack[j].name !== name) j--;
        if (j < 0) {
          add("warn", at, `Extra closing tag <code>&lt;/${esc(name)}&gt;</code>`, `There is no open ${codeTag(name)} to close here. Remove it, or add the opening tag.`);
          continue;
        }
        for (let k = stack.length - 1; k > j; k--) {
          const open = stack[k];
          if (OPTIONAL_CLOSE.has(open.name)) {
            add("info", open.at, `Close your ${codeTag(open.name)}`, `The browser closes it for you, but it's good practice to write <code>&lt;/${open.name}&gt;</code>.`);
          } else {
            add("warn", open.at, `${codeTag(open.name)} is not closed`, `It must be closed with <code>&lt;/${open.name}&gt;</code> before <code>&lt;/${esc(name)}&gt;</code>. Tags close in the opposite order they open, like boxes inside boxes.`);
          }
        }
        stack.length = j;
        continue;
      }

      // Opening tag
      const attrs = {};
      const quotes = (attrText.match(/"/g) || []).length;
      if (quotes % 2) add("warn", at, `A quote is not closed`, `Attribute values start and end with <code>"</code>, like <code>href="page.html"</code>.`);
      attrText.replace(/([^\s=\/]+)(?:\s*=\s*("[^"]*"|'[^']*'|[^\s"']+))?/g, (_, k, v) => {
        attrs[k.toLowerCase()] = v === undefined ? "" : v.replace(/^["']|["']$/g, "");
        return "";
      });

      if (stack.length && stack[stack.length - 1].name === "p" && CLOSES_P.has(name)) {
        add("warn", at, `${codeTag(name)} can't go inside ${codeTag("p")}`, `A paragraph can only hold text and inline tags. Close the <code>&lt;p&gt;</code> first.`);
        stack.pop();
      }

      if (name === "img") {
        if (!("src" in attrs)) add("warn", at, `${codeTag("img")} needs src`, `Tell the browser which picture to show: <code>src="photo.jpg"</code>.`);
        if (!("alt" in attrs)) add("warn", at, `${codeTag("img")} needs alt text`, `Describe the image for people who can't see it: <code>alt="A red bicycle"</code>.`);
      }
      if (name === "a" && !("href" in attrs)) {
        add("warn", at, `${codeTag("a")} needs href`, `Without href it isn't a link. Add where it goes: <code>href="https://example.com"</code>.`);
      }
      if (name === "a" && attrs.target === "_blank" && !/noopener|noreferrer/.test(attrs.rel || "")) {
        add("info", at, `Add rel="noopener"`, `Links that open in a new tab should have <code>rel="noopener"</code> for safety.`);
      }
      if (/^h[1-6]$/.test(name)) {
        const level = Number(name[1]);
        if (lastHeading && level > lastHeading + 1) {
          add("info", at, `Heading level skipped`, `You jumped from ${codeTag("h" + lastHeading)} to ${codeTag(name)}. Go one level at a time so the page outline makes sense.`);
        }
        lastHeading = level;
      }
      if ("id" in attrs && attrs.id) {
        if (ids.has(attrs.id)) add("warn", at, `id="${esc(attrs.id)}" is used twice`, `Each id must be unique on the page. Use class for names that repeat.`);
        ids.set(attrs.id, at);
      }
      if (name === "label" && attrs.for) labelFor.add(attrs.for);
      if ((name === "input" && !/^(hidden|submit|button|reset|image)$/.test(attrs.type || "")) || name === "textarea" || name === "select") {
        inputs.push({ at, id: attrs.id, insideLabel: stack.some((s) => s.name === "label") });
      }

      // Skip the raw contents of <script>, <style>, <textarea>, <title>
      if (RAW_TEXT.has(name)) {
        const end = src.toLowerCase().indexOf(`</${name}`, tagRe.lastIndex);
        if (end === -1) {
          add("warn", at, `${codeTag(name)} is not closed`, `Add <code>&lt;/${name}&gt;</code> after its content.`);
          tagRe.lastIndex = src.length;
        } else {
          tagRe.lastIndex = end;
          stack.push({ name, at });
        }
        continue;
      }

      // Unknown tags were already reported above; don't also report them as unclosed
      const unknown = !KNOWN.has(name) && !name.includes("-");
      const selfClosed = /\/\s*$/.test(attrText);
      if (!VOID.has(name) && !selfClosed && !unknown) stack.push({ name, at });
    }

    for (const open of stack) {
      if (OPTIONAL_CLOSE.has(open.name)) {
        if (!["html", "head", "body"].includes(open.name)) {
          add("info", open.at, `Close your ${codeTag(open.name)}`, `The browser closes it for you, but it's good practice to write <code>&lt;/${open.name}&gt;</code>.`);
        }
      } else {
        add("warn", open.at, `${codeTag(open.name)} is never closed`, `Add <code>&lt;/${open.name}&gt;</code> where it should end.`);
      }
    }

    for (const field of inputs) {
      if (!field.insideLabel && !(field.id && labelFor.has(field.id))) {
        add("info", field.at, `Give this field a label`, `Add <code>&lt;label for="${esc(field.id || "my-id")}"&gt;</code>${field.id ? "" : " and the same id on the field"} so everyone knows what to type.`);
      }
    }

    if (/<html[\s>]/i.test(src)) {
      if (!/^\s*<!doctype html>/i.test(code)) add("info", 0, `Start with <code>&lt;!DOCTYPE html&gt;</code>`, `The first line tells the browser this is modern HTML.`);
      if (!/<title[\s>]/i.test(src)) add("info", 0, `Add a ${codeTag("title")}`, `Put a title inside <code>&lt;head&gt;</code>. It is shown in the browser tab.`);
      const htmlTag = src.match(/<html([^>]*)>/i);
      if (htmlTag && !/\blang\s*=/.test(htmlTag[1])) add("info", src.search(/<html/i), `Add lang to ${codeTag("html")}`, `<code>&lt;html lang="en"&gt;</code> helps screen readers pronounce the text correctly.`);
    }

    tips.sort((a, b) => (a.level === b.level ? a.line - b.line : a.level === "warn" ? -1 : 1));
    return tips.slice(0, 40);
  }

  function renderTips(tips) {
    const warnings = tips.filter((t) => t.level === "warn").length;
    tipCountEl.textContent = String(tips.length);
    tipCountEl.classList.toggle("he-has-issues", warnings > 0);

    tipsEl.innerHTML = "";
    if (!tips.length) {
      tipsEl.innerHTML = `<li class="he-tip he-ok"><span class="he-tip-icon">✅</span><span class="he-tip-title">Looks great!</span><span class="he-tip-text">No problems found. Your HTML is well-formed.</span></li>`;
      return;
    }
    tips.forEach((t) => {
      const li = document.createElement("li");
      li.className = "he-tip" + (t.level === "info" ? " he-info" : "");
      li.title = "Go to line " + t.line;
      li.innerHTML = `<span class="he-tip-icon">${t.level === "warn" ? "⚠️" : "💡"}</span>
        <span class="he-tip-title">${t.title}<small>line ${t.line}</small></span>
        <span class="he-tip-text">${t.text}</span>`;
      li.addEventListener("click", () => goToLine(t.line));
      tipsEl.appendChild(li);
    });
  }

  /* -----------------------------
     STRUCTURE VIEW (DOM tree)
  ----------------------------- */
  function renderTree(doc, code) {
    treeEl.innerHTML = "";
    const fullDoc = /<html[\s>]/i.test(code);
    const roots = fullDoc ? [doc.documentElement] : [...doc.body.childNodes];
    let count = 0;

    function build(node, depth) {
      if (count > 300 || depth > 14) return null;
      if (node.nodeType === 3) {
        const text = node.textContent.trim();
        if (!text) return null;
        count++;
        const t = document.createElement("div");
        t.className = "he-node-text";
        t.textContent = `"${text.length > 50 ? text.slice(0, 50) + "…" : text}"`;
        return t;
      }
      if (node.nodeType !== 1) return null;
      count++;

      const name = node.tagName.toLowerCase();
      const box = document.createElement("div");
      box.className = "he-node";

      const row = document.createElement("div");
      row.className = "he-node-row";
      const tag = document.createElement("span");
      tag.className = "he-node-tag";
      tag.textContent = `<${name}${node.id ? "#" + node.id : ""}${node.classList.length ? "." + [...node.classList].join(".") : ""}>`;
      const desc = document.createElement("span");
      desc.className = "he-node-desc";
      desc.textContent = TAGS[name] ? TAGS[name][0] : "";
      row.append(tag, desc);
      row.title = "Show in code";
      row.addEventListener("click", () => selectElementInCode(doc, node));
      box.appendChild(row);

      if (!RAW_TEXT.has(name) || name === "title" || name === "textarea") {
        node.childNodes.forEach((child) => {
          const c = build(child, depth + 1);
          if (c) box.appendChild(c);
        });
      }
      return box;
    }

    roots.forEach((n) => {
      const el = build(n, 0);
      if (el) treeEl.appendChild(el);
    });

    if (!treeEl.children.length) {
      treeEl.innerHTML = `<p class="he-pane-help">Nothing here yet. Write a tag like <code>&lt;h1&gt;Hello&lt;/h1&gt;</code>.</p>`;
    }
  }

  // Find the n-th <tag in the code that matches the n-th element of that type
  function selectElementInCode(doc, node) {
    const name = node.tagName.toLowerCase();
    const n = [...doc.getElementsByTagName(name)].indexOf(node);
    const src = blankComments(ta.value);
    const re = new RegExp(`<${name}(?=[\\s>/])`, "gi");
    let m;
    let i = 0;
    while ((m = re.exec(src))) {
      if (i++ === n) {
        const end = src.indexOf(">", m.index);
        ta.focus();
        ta.setSelectionRange(m.index, end === -1 ? m.index + name.length + 1 : end + 1);
        scrollToLine(lineOf(src, m.index));
        explainAt(m.index + 1);
        return;
      }
    }
    toast(`The browser added <${name}> for you. It isn't in your code.`);
  }

  /* -----------------------------
     EXPLAIN THE TAG UNDER THE CURSOR
  ----------------------------- */
  const DEFAULT_EXPLAIN = `<i class="fas fa-lightbulb"></i> Click on a tag in your code to see what it does. <small class="he-kbd-hint">(Press Esc then Tab to leave the editor.)</small>`;

  function explainAt(pos) {
    const code = ta.value;
    const lt = code.lastIndexOf("<", pos);
    const gt = code.lastIndexOf(">", pos - 1);
    // Also allow the cursor to sit right on the "<"
    const start = code[pos] === "<" ? pos : lt;

    if (start === -1 || (start !== pos && gt > lt)) {
      explainEl.innerHTML = DEFAULT_EXPLAIN;
      return;
    }

    const end = code.indexOf(">", start);
    const token = code.slice(start, end === -1 ? code.length : end + 1);
    if (token.startsWith("<!--")) {
      explainEl.innerHTML = `<i class="fas fa-lightbulb"></i> <strong>Comment</strong> – a note for people reading the code. The browser doesn't show it.`;
      return;
    }
    if (/^<!doctype/i.test(token)) {
      explainEl.innerHTML = `<i class="fas fa-lightbulb"></i> <code>&lt;!DOCTYPE html&gt;</code> – tells the browser this is a modern HTML5 page. Always the very first line.`;
      return;
    }

    const m = token.match(/^<\/?([a-zA-Z][\w-]*)/);
    if (!m) {
      explainEl.innerHTML = DEFAULT_EXPLAIN;
      return;
    }
    const name = m[1].toLowerCase();

    // Is the cursor on an attribute?
    const offset = pos - start;
    const attrRe = /([^\s=\/<>]+)(?:\s*=\s*("[^"]*"?|'[^']*'?|[^\s"'>]+))?/g;
    attrRe.lastIndex = m[0].length;
    let a;
    while ((a = attrRe.exec(token))) {
      if (offset >= a.index && offset <= a.index + a[0].length) {
        const attr = a[1].toLowerCase();
        if (ATTRS[attr]) {
          explainEl.innerHTML = `<i class="fas fa-lightbulb"></i> <code>${esc(attr)}</code> attribute on ${codeTag(name)} – ${esc(ATTRS[attr])}`;
          return;
        }
        break;
      }
    }

    const closing = token.startsWith("</");
    const info = TAGS[name];
    if (info) {
      const voidNote = VOID.has(name) ? "" : closing ? " (this is the closing tag)" : "";
      explainEl.innerHTML = `<i class="fas fa-lightbulb"></i> ${codeTag(name)} <strong>${esc(info[0])}</strong>${voidNote} – ${esc(info[1])} <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/${encodeURIComponent(name)}" target="_blank" rel="noopener">Learn more</a>`;
    } else if (DEPRECATED[name]) {
      explainEl.innerHTML = `<i class="fas fa-lightbulb"></i> ${codeTag(name)} is an old tag. ${esc(DEPRECATED[name])}`;
    } else {
      const guess = closestTag(name);
      explainEl.innerHTML = `<i class="fas fa-lightbulb"></i> ${codeTag(name)} isn't an HTML tag.${guess ? ` Did you mean ${codeTag(guess)}?` : ""}`;
    }
  }

  /* -----------------------------
     CHALLENGES
  ----------------------------- */
  const hasText = (el) => !!el && el.textContent.trim().length > 0;

  const CHALLENGES = [
    {
      title: "Your first heading",
      text: "Add an <code>&lt;h1&gt;</code> heading with your name.",
      hint: "<h1>Your Name</h1>",
      check: (doc) => hasText(doc.querySelector("h1"))
    },
    {
      title: "Make a word important",
      text: "Write a <code>&lt;p&gt;</code> that has one word inside <code>&lt;strong&gt;</code>.",
      hint: "<p>HTML is <strong>fun</strong>!</p>",
      check: (doc) => [...doc.querySelectorAll("p strong")].some(hasText)
    },
    {
      title: "Link to another site",
      text: "Make a link with <code>&lt;a&gt;</code> to <code>https://example.com</code> with some text.",
      hint: "<a href=\"https://example.com\">Visit Example</a>",
      check: (doc) => [...doc.querySelectorAll("a[href]")].some((a) => /^https?:\/\//.test(a.getAttribute("href")) && hasText(a))
    },
    {
      title: "Picture with a description",
      text: "Add an <code>&lt;img&gt;</code> with a <code>src</code> and a helpful <code>alt</code> text.",
      hint: "<img src=\"https://placehold.co/200\" alt=\"A grey square\">",
      check: (doc) => [...doc.querySelectorAll("img[src]")].some((i) => (i.getAttribute("alt") || "").trim().length > 2)
    },
    {
      title: "Shopping list",
      text: "Make a list (<code>&lt;ul&gt;</code> or <code>&lt;ol&gt;</code>) with at least 3 items.",
      hint: "<ul>\n  <li>Milk</li>\n  <li>Bread</li>\n  <li>Eggs</li>\n</ul>",
      check: (doc) => [...doc.querySelectorAll("ul, ol")].some((l) => [...l.children].filter((c) => c.tagName === "LI" && hasText(c)).length >= 3)
    },
    {
      title: "A small table",
      text: "Build a <code>&lt;table&gt;</code> with a header row (<code>&lt;th&gt;</code>) and at least 2 rows of data.",
      hint: "<table>\n  <tr><th>Name</th><th>Age</th></tr>\n  <tr><td>Ada</td><td>36</td></tr>\n  <tr><td>Linus</td><td>28</td></tr>\n</table>",
      check: (doc) => [...doc.querySelectorAll("table")].some((t) => t.querySelector("th") && [...t.querySelectorAll("tr")].filter((r) => r.querySelector("td")).length >= 2)
    },
    {
      title: "A form with a label",
      text: "Make a <code>&lt;form&gt;</code> with a <code>&lt;label for=\"…\"&gt;</code> connected to an <code>&lt;input id=\"…\"&gt;</code>, and a <code>&lt;button&gt;</code>.",
      hint: "<form>\n  <label for=\"name\">Name</label>\n  <input id=\"name\" type=\"text\">\n  <button>Send</button>\n</form>",
      check: (doc) => [...doc.querySelectorAll("form")].some((f) => f.querySelector("button, input[type=submit]") &&
        [...f.querySelectorAll("label[for]")].some((l) => f.querySelector(`#${CSS.escape(l.getAttribute("for"))}`)))
    },
    {
      title: "A real page layout",
      text: "Use the semantic tags <code>&lt;header&gt;</code>, <code>&lt;main&gt;</code> and <code>&lt;footer&gt;</code>, each with some content.",
      hint: "<header><h1>My site</h1></header>\n<main><p>Welcome!</p></main>\n<footer><p>© 2026</p></footer>",
      check: (doc) => ["header", "main", "footer"].every((t) => hasText(doc.querySelector(t)))
    }
  ];

  let done = new Set();
  try { done = new Set(JSON.parse(localStorage.getItem(STORAGE_CHALLENGES)) || []); } catch { /* ignore */ }

  const listEl = $("heChallenges");
  const progressEl = $("heChallengeProgress");

  function renderChallenges() {
    if (!listEl) return;
    listEl.innerHTML = "";
    const activeIndex = CHALLENGES.findIndex((_, i) => !done.has(i));
    CHALLENGES.forEach((c, i) => {
      const li = document.createElement("li");
      li.className = "he-challenge" + (done.has(i) ? " he-done" : "") + (i === activeIndex ? " he-active" : "");
      li.innerHTML = `
        <div class="he-challenge-title"><i class="${done.has(i) ? "fas fa-check-circle" : "far fa-circle"}"></i> ${i + 1}. ${esc(c.title)}</div>
        <p>${c.text}</p>
        <div class="he-hint" hidden></div>
        <div class="he-challenge-actions">
          <button type="button" data-act="hint"><i class="far fa-lightbulb"></i> Hint</button>
          <button type="button" data-act="insert"><i class="fas fa-paste"></i> Show me</button>
        </div>`;
      const hint = li.querySelector(".he-hint");
      hint.textContent = c.hint;
      hint.style.whiteSpace = "pre-wrap";
      hint.style.fontFamily = "var(--he-font)";
      li.querySelector('[data-act="hint"]').addEventListener("click", () => { hint.hidden = !hint.hidden; });
      li.querySelector('[data-act="insert"]').addEventListener("click", () => insertExample(c.hint));
      listEl.appendChild(li);
    });
    if (progressEl) progressEl.textContent = `${done.size} / ${CHALLENGES.length} done`;
    // One dot per challenge: green = done, blue = the one to do now
    const dots = $("heDots");
    if (dots) dots.innerHTML = CHALLENGES.map((_, i) =>
      `<span class="${done.has(i) ? "is-done" : i === activeIndex ? "is-now" : ""}"></span>`).join("");
    const allDone = $("heAllDone");
    if (allDone) allDone.hidden = activeIndex !== -1;
  }

  function checkChallenges(doc, code) {
    let changed = false;
    CHALLENGES.forEach((c, i) => {
      if (done.has(i)) return;
      let ok = false;
      try { ok = c.check(doc, code); } catch { ok = false; }
      if (ok) {
        done.add(i);
        changed = true;
        window.HTMLMaster?.awardXP?.(15, "Editor challenge");
        toast(`🏁 Challenge done: ${c.title} (+15 XP)`);
      }
    });
    if (changed) {
      try { localStorage.setItem(STORAGE_CHALLENGES, JSON.stringify([...done])); } catch { /* ignore */ }
      if (done.size === CHALLENGES.length) toast("🎉 You finished every editor challenge!");
      renderChallenges();
    }
  }

  /* -----------------------------
     RESULT (sandboxed iframe)
  ----------------------------- */
  // Links in the result open in a new tab instead of replacing the preview
  function withBaseTarget(code) {
    const base = '<base target="_blank">';
    if (/<head[^>]*>/i.test(code)) return code.replace(/<head[^>]*>/i, (m) => m + base);
    if (/^\s*<!doctype[^>]*>/i.test(code)) return code.replace(/^\s*<!doctype[^>]*>/i, (m) => m + base);
    return base + code;
  }

  function run() {
    frame.srcdoc = withBaseTarget(ta.value);
  }

  /* -----------------------------
     EDITOR UPDATES
  ----------------------------- */
  let analyseTimer;
  let runTimer;
  let saveTimer;

  function renderCode() {
    const code = ta.value;
    hl.innerHTML = highlight(code);
    const lines = code.split("\n").length;
    if (gutter.childElementCount !== lines) {
      let html = "";
      for (let i = 1; i <= lines; i++) html += `<div>${i}</div>`;
      gutter.innerHTML = html;
    }
    syncScroll();
  }

  function analyse() {
    const code = ta.value;
    const tips = lint(code);
    renderTips(tips);
    const tipLines = new Set(tips.filter((t) => t.level === "warn").map((t) => t.line));
    [...gutter.children].forEach((d, i) => d.classList.toggle("he-has-tip", tipLines.has(i + 1)));

    const doc = new DOMParser().parseFromString(code, "text/html");
    renderTree(doc, code);
    checkChallenges(doc, code);
  }

  function onChange() {
    renderCode();
    clearTimeout(analyseTimer);
    analyseTimer = setTimeout(analyse, 250);
    if (liveEl && liveEl.checked) {
      clearTimeout(runTimer);
      runTimer = setTimeout(run, 400);
    }
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try { localStorage.setItem(STORAGE_CODE, ta.value); } catch { /* ignore */ }
    }, 500);
  }

  function syncScroll() {
    hl.scrollTop = ta.scrollTop;
    hl.scrollLeft = ta.scrollLeft;
    gutter.scrollTop = ta.scrollTop;
  }

  function updateCursor() {
    const before = ta.value.slice(0, ta.selectionStart);
    const line = before.split("\n").length;
    const col = before.length - before.lastIndexOf("\n");
    if (cursorEl) cursorEl.textContent = `Line ${line}, Col ${col}`;
  }

  function lineHeight() {
    return parseFloat(getComputedStyle(ta).lineHeight) || 21;
  }

  function scrollToLine(line) {
    ta.scrollTop = Math.max(0, (line - 3) * lineHeight());
    syncScroll();
  }

  function goToLine(line) {
    const lines = ta.value.split("\n");
    let pos = 0;
    for (let i = 0; i < line - 1 && i < lines.length; i++) pos += lines[i].length + 1;
    ta.focus();
    ta.setSelectionRange(pos, pos + (lines[line - 1] || "").length);
    scrollToLine(line);
    updateCursor();
  }

  /* -----------------------------
     TYPING HELPERS
  ----------------------------- */
  // insertText keeps the browser's undo history (Ctrl+Z) working
  function insertText(text) {
    ta.focus();
    const ok = document.execCommand && document.execCommand("insertText", false, text);
    if (!ok) {
      ta.setRangeText(text, ta.selectionStart, ta.selectionEnd, "end");
      ta.dispatchEvent(new Event("input"));
    }
  }

  function currentIndent() {
    const start = ta.value.lastIndexOf("\n", ta.selectionStart - 1) + 1;
    return ta.value.slice(start).match(/^[ \t]*/)[0];
  }


  // Challenge examples go on their own line just before </body> (or at the end)
  function insertExample(code) {
    const value = ta.value;
    const bodyEnd = value.search(/\n?[ \t]*<\/body>/i);
    const pos = bodyEnd === -1 ? value.length : bodyEnd;
    const lineStart = value.lastIndexOf("\n", pos - 1) + 1;
    const indent = bodyEnd === -1 ? "" : (value.slice(lineStart).match(/^[ \t]*/)[0] || INDENT);
    ta.focus({ preventScroll: true });
    ta.setSelectionRange(pos, pos);
    insertText("\n" + indent + code.replace(/\n/g, "\n" + indent));
    const line = lineOf(ta.value, pos + 1);
    scrollToLine(line);
    setView("code");
    ta.closest(".he")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  let escaped = false;

  ta.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { escaped = true; return; }

    // Tab indents (Esc then Tab leaves the editor for keyboard users)
    if (e.key === "Tab" && !escaped && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      const { selectionStart: s, selectionEnd: en, value } = ta;
      if (s !== en && value.slice(s, en).includes("\n") || e.shiftKey) {
        const lineStart = value.lastIndexOf("\n", s - 1) + 1;
        const block = value.slice(lineStart, en);
        const changed = e.shiftKey
          ? block.replace(/^( {1,2}|\t)/gm, "")
          : block.replace(/^/gm, INDENT);
        ta.setSelectionRange(lineStart, en);
        insertText(changed);
        ta.setSelectionRange(lineStart, lineStart + changed.length);
      } else {
        insertText(INDENT);
      }
      return;
    }
    escaped = false;

    // Enter keeps the indentation; between <tag>|</tag> it opens a new indented line
    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault();
      const { selectionStart: s, value } = ta;
      const indent = currentIndent();
      const before = value.slice(0, s);
      const after = value.slice(ta.selectionEnd);
      const opened = before.match(/<([a-zA-Z][\w-]*)[^<>]*>$/);
      const opensBlock = opened && !VOID.has(opened[1].toLowerCase()) && !/\/>$/.test(before);
      if (opensBlock && /^<\//.test(after)) {
        insertText("\n" + indent + INDENT + "\n" + indent);
        const pos = s + 1 + indent.length + INDENT.length;
        ta.setSelectionRange(pos, pos);
      } else {
        insertText("\n" + indent + (opensBlock ? INDENT : ""));
      }
    }
  });

  ta.addEventListener("input", (e) => {
    // Auto-close: typing the ">" of <p> adds </p> after the cursor
    if (e.inputType === "insertText" && e.data === ">") {
      const s = ta.selectionStart;
      const before = ta.value.slice(0, s);
      const m = before.match(/<([a-zA-Z][\w-]*)(\s[^<>]*)?>$/);
      if (m && !before.endsWith("/>")) {
        const name = m[1].toLowerCase();
        const after = ta.value.slice(s);
        if (!VOID.has(name) && !after.trimStart().toLowerCase().startsWith(`</${name}`)) {
          insertText(`</${m[1]}>`);
          ta.setSelectionRange(s, s);
        }
      }
    }
    onChange();
    updateCursor();
  });

  ta.addEventListener("scroll", syncScroll);
  ["click", "keyup"].forEach((ev) => ta.addEventListener(ev, () => {
    updateCursor();
    explainAt(ta.selectionStart);
  }));

  /* -----------------------------
     TIDY (re-indent lines by nesting)
  ----------------------------- */
  function tidy(code) {
    const lines = code.split("\n");
    let depth = 0;
    let inRaw = null;
    return lines.map((raw) => {
      const line = raw.trim();
      if (!line) return "";
      if (inRaw) {
        if (new RegExp(`</${inRaw}`, "i").test(line)) inRaw = null;
        else return raw; // leave <pre>/<script>/<style> contents alone
      }
      const clean = line.replace(/<!--[\s\S]*?-->/g, "");
      const startsWithClose = /^<\//.test(clean);
      if (startsWithClose) depth = Math.max(0, depth - 1);
      const out = INDENT.repeat(depth) + line;

      let delta = 0;
      clean.replace(/<(\/?)([a-zA-Z][\w-]*)([^<>]*)>/g, (_, slash, name, attrs) => {
        name = name.toLowerCase();
        if (VOID.has(name) || /\/$/.test(attrs)) return "";
        delta += slash ? -1 : 1;
        return "";
      });
      if (startsWithClose) delta += 1;
      depth = Math.max(0, depth + delta);

      const raw2 = clean.match(/<(pre|script|style|textarea)[\s>]/i);
      if (raw2 && !new RegExp(`</${raw2[1]}`, "i").test(clean)) inRaw = raw2[1];
      return out;
    }).join("\n");
  }

  /* -----------------------------
     TOOLBAR
  ----------------------------- */
  let lastRewarded = null;

  $("runCode")?.addEventListener("click", () => {
    run();
    showPane("preview");
    setView("result");
    // XP only when the code actually changed, so Run can't be farmed
    if (ta.value.trim() && ta.value !== lastRewarded) {
      lastRewarded = ta.value;
      window.HTMLMaster?.awardXP?.(10, "Run Code");
    }
  });

  liveEl?.addEventListener("change", () => { if (liveEl.checked) run(); });

  $("heFormat")?.addEventListener("click", () => {
    const tidied = tidy(ta.value);
    if (tidied === ta.value) { toast("✨ Already tidy!"); return; }
    ta.focus();
    ta.setSelectionRange(0, ta.value.length);
    insertText(tidied);
    toast("✨ Indentation fixed");
  });

  $("heCopy")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(ta.value);
      toast("📋 Code copied");
    } catch {
      ta.select();
      toast("Press Ctrl+C to copy");
    }
  });

  $("heDownload")?.addEventListener("click", () => {
    let code = ta.value;
    // A fragment becomes a complete page so the file opens correctly
    if (!/<html[\s>]/i.test(code)) {
      const body = code.split("\n").map((l) => "  " + l).join("\n");
      code = `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>My page</title>\n</head>\n<body>\n${body}\n</body>\n</html>\n`;
    }
    const url = URL.createObjectURL(new Blob([code], { type: "text/html" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-page.html";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  $("heReset")?.addEventListener("click", (e) => {
    const reset = () => {
      ta.focus();
      ta.setSelectionRange(0, ta.value.length);
      // "delete" keeps Ctrl+Z working; fall back to clearing the value
      if (!(document.execCommand && document.execCommand("delete"))) {
        ta.value = "";
        ta.dispatchEvent(new Event("input"));
      }
      run();
      setView("code");
      toast("↺ Editor cleared – press Ctrl+Z to undo");
    };
    // Only ask when there is work to lose
    if (!ta.value.trim()) { toast("The editor is already empty"); return; }
    else window.confirmButton(e.currentTarget, "Sure? Click again", reset);
  });

  /* -----------------------------
     TABS
  ----------------------------- */
  const tabs = document.querySelectorAll(".he-tab");
  const panes = document.querySelectorAll(".he-pane");

  function showPane(name) {
    tabs.forEach((t) => t.setAttribute("aria-selected", String(t.dataset.pane === name)));
    panes.forEach((p) => { p.hidden = p.dataset.pane !== name; });
  }

  tabs.forEach((t) => t.addEventListener("click", () => showPane(t.dataset.pane)));

  /* -----------------------------
     PHONES: switch between "Code" and "Result" instead of
     scrolling up and down between them (CSS only shows one at a time)
  ----------------------------- */
  const heRoot = $("htmlEditor");
  const viewBtns = document.querySelectorAll(".he-view-btn");

  function setView(name) {
    if (!heRoot) return;
    heRoot.classList.toggle("he-view-result", name === "result");
    viewBtns.forEach((b) => b.setAttribute("aria-selected", String(b.dataset.view === name)));
  }

  viewBtns.forEach((b) => b.addEventListener("click", () => {
    setView(b.dataset.view);
    if (b.dataset.view === "result") run();
  }));

  /* Phones: show one challenge at a time, the rest behind a button */
  const challengesBox = document.querySelector(".he-challenges");
  if (challengesBox && listEl) {
    const allBtn = document.createElement("button");
    allBtn.type = "button";
    allBtn.className = "he-challenges-all";
    allBtn.addEventListener("click", () => {
      const open = challengesBox.classList.toggle("he-show-all");
      allBtn.textContent = open ? "Show only my current challenge" : "See all challenges";
    });
    allBtn.textContent = "See all challenges";
    listEl.insertAdjacentElement("afterend", allBtn);
  }

  /* -----------------------------
     START
  ----------------------------- */
  let saved = null;
  try { saved = localStorage.getItem(STORAGE_CODE); } catch { /* ignore */ }
  ta.value = saved && saved.trim() && saved.trim() !== OLD_STARTER.trim() ? saved : STARTER;
  explainEl.innerHTML = DEFAULT_EXPLAIN;

  renderChallenges();
  renderCode();
  analyse();
  run();

  // Other scripts can set code with HMEditor.setCode()
  window.HMEditor = {
    setCode(code) {
      // Select-all + insert keeps Ctrl+Z, so replaced work can be undone
      ta.focus({ preventScroll: true });
      ta.setSelectionRange(0, ta.value.length);
      insertText(code);
      ta.setSelectionRange(0, 0);
      ta.scrollTop = 0;
      run();
    },
    isStarter: () => !ta.value.trim() || ta.value.trim() === OLD_STARTER.trim(),
    // Shared with examples.js so code looks the same everywhere
    highlight,
    describe: (tag) => TAGS[tag] || null
  };
})();
