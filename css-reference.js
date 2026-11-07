/* =========================================================
   CSS PROPERTIES PAGE – data + live demos
   Used by lessons/css-properties.html
========================================================= */

(function () {
  /* -----------------------------
     DEMO TEMPLATES
     demo:    what is shown in the card (.cr-t = element the property is applied to)
     sel/html: the clean selector + HTML shown in the code example
     css:     extra CSS the "Try it" example needs to look right
  ----------------------------- */
  const IMG = "data:image/svg+xml," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="120" viewBox="0 0 300 120">' +
    '<rect width="300" height="120" fill="#85c1e9"/><circle cx="60" cy="40" r="22" fill="#f4d03f"/>' +
    '<path d="M0 120 L90 50 L160 120 Z" fill="#229954"/><path d="M110 120 L200 35 L300 120 Z" fill="#1e8449"/></svg>'
  );

  const STAR = "data:image/svg+xml," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">' +
    '<path d="M12 2l3 7h7l-5.5 4.5 2 7.5-6.5-4.5-6.5 4.5 2-7.5L2 9h7z" fill="#e67e22"/></svg>'
  );

  const items = (n, cls = "cr-item") =>
    Array.from({ length: n }, (_, i) => `<div class="${cls}">${i + 1}</div>`).join("");

  const plainItems = (n) =>
    Array.from({ length: n }, (_, i) => `  <div>${i + 1}</div>`).join("\n");

  const TEXT = "The quick brown fox jumps over the lazy dog. CSS changes how this text looks.";

  const TPL = {
    text: {
      demo: `<p class="cr-t">${TEXT}</p>`,
      sel: ".text",
      html: `<p class="text">${TEXT}</p>`,
      css: ""
    },
    box: {
      demo: `<div class="cr-box cr-t"><div class="cr-inner">Content</div></div>`,
      sel: ".box",
      html: `<div class="box">\n  <p>Content</p>\n</div>`,
      css: ".box { background: lightblue; padding: 10px; border: 2px solid steelblue; }"
    },
    display: {
      demo: `<div>Text before <span class="cr-box cr-t">Target</span> text after. <span class="cr-box">Neighbour</span></div>`,
      sel: ".target",
      html: `<p>Text before <span class="target">Target</span> text after.</p>`,
      css: ".target { background: lightblue; padding: 6px; border: 2px solid steelblue; }"
    },
    float: {
      demo: `<div><div class="cr-box cr-t" style="width:80px;height:60px">Box</div>${TEXT} ${TEXT}</div>`,
      sel: ".box",
      html: `<div class="box">Box</div>\n<p>${TEXT}</p>`,
      css: ".box { width: 80px; height: 60px; background: lightblue; }"
    },
    scroll: {
      demo: `<div class="cr-scroll cr-t">${TEXT} ${TEXT} ${TEXT} Averyveryveryveryverylongwordthatdoesnotfit.</div>`,
      sel: ".panel",
      html: `<div class="panel">\n  ${TEXT} ${TEXT} ${TEXT}\n</div>`,
      css: ".panel { height: 90px; border: 2px solid steelblue; padding: 8px; }"
    },
    pos: {
      demo: `<div class="cr-pos-wrap"><div class="cr-box cr-t" style="width:110px">I move</div></div>`,
      sel: ".box",
      html: `<div class="parent">\n  <div class="box">I move</div>\n</div>`,
      css: ".parent { position: relative; height: 150px; background: #eef; }\n.box { width: 110px; background: lightblue; padding: 10px; }"
    },
    stack: {
      demo: `<div class="cr-pos-wrap"><div class="cr-box" style="position:absolute;left:20px;top:15px;width:120px;height:70px;z-index:1">z-index: 1</div><div class="cr-box cr-t" style="position:absolute;left:70px;top:35px;width:120px;height:70px;background:#f5b7b1;border-color:#c0392b">Target</div></div>`,
      sel: ".target",
      html: `<div class="parent">\n  <div class="other">z-index: 1</div>\n  <div class="target">Target</div>\n</div>`,
      css: ".parent { position: relative; height: 150px; }\n.other, .target { position: absolute; width: 120px; height: 70px; }\n.other { left: 20px; top: 15px; z-index: 1; background: lightblue; }\n.target { left: 70px; top: 35px; background: pink; }"
    },
    flex: {
      demo: `<div class="cr-flex cr-t">${items(3)}</div>`,
      sel: ".container",
      html: `<div class="container">\n${plainItems(3)}\n</div>`,
      css: ".container { display: flex; gap: 8px; min-height: 120px; background: #eef; }\n.container div { background: steelblue; color: white; padding: 10px; }"
    },
    flexMany: {
      demo: `<div class="cr-flex cr-t" style="min-height:140px">${items(6).replace(/class="cr-item"/g, 'class="cr-item" style="width:90px"')}</div>`,
      sel: ".container",
      html: `<div class="container">\n${plainItems(6)}\n</div>`,
      css: ".container { display: flex; gap: 8px; min-height: 140px; background: #eef; }\n.container div { width: 90px; background: steelblue; color: white; padding: 10px; }"
    },
    flexItem: {
      demo: `<div class="cr-flex"><div class="cr-item cr-t">1</div>${items(3).replace(/>(\d)</g, (m, d) => `>${Number(d) + 1}<`)}</div>`,
      sel: ".item",
      html: `<div class="container">\n  <div class="item">1</div>\n  <div>2</div>\n  <div>3</div>\n  <div>4</div>\n</div>`,
      css: ".container { display: flex; gap: 8px; min-height: 120px; background: #eef; }\n.container div { background: steelblue; color: white; padding: 10px; }\n.container .item { background: tomato; }"
    },
    grid: {
      demo: `<div class="cr-grid-demo cr-t">${items(6)}</div>`,
      sel: ".grid",
      html: `<div class="grid">\n${plainItems(6)}\n</div>`,
      css: ".grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; min-height: 120px; background: #eef; }\n.grid div { background: steelblue; color: white; padding: 10px; }"
    },
    gridItem: {
      demo: `<div class="cr-grid-demo"><div class="cr-item cr-t">1</div>${items(5).replace(/>(\d)</g, (m, d) => `>${Number(d) + 1}<`)}</div>`,
      sel: ".item",
      html: `<div class="grid">\n  <div class="item">1</div>\n  <div>2</div>\n  <div>3</div>\n  <div>4</div>\n  <div>5</div>\n  <div>6</div>\n</div>`,
      css: ".grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; background: #eef; }\n.grid div { background: steelblue; color: white; padding: 10px; }\n.grid .item { background: tomato; }"
    },
    image: {
      demo: `<img class="cr-t" src="${IMG}" alt="Landscape illustration">`,
      sel: "img",
      html: `<img src="https://placehold.co/300x120/85c1e9/1e8449?text=Landscape" alt="A landscape">`,
      css: "img { width: 120px; height: 80px; border: 2px solid steelblue; }"
    },
    list: {
      demo: `<ul class="cr-t" style="padding-left:30px;background:#ebf5fb"><li>Apples</li><li>Bananas</li><li>Cherries</li></ul>`,
      sel: "ul",
      html: `<ul>\n  <li>Apples</li>\n  <li>Bananas</li>\n  <li>Cherries</li>\n</ul>`,
      css: "ul { background: #eef; }"
    },
    table: {
      demo: `<table class="cr-t"><tr><th>Name</th><th>Age</th></tr><tr><td>Ada</td><td>36</td></tr><tr><td>Linus</td><td>28</td></tr></table>`,
      sel: "table",
      html: `<table>\n  <tr><th>Name</th><th>Age</th></tr>\n  <tr><td>Ada</td><td>36</td></tr>\n</table>`,
      css: "th, td { border: 1px solid steelblue; padding: 4px 10px; }"
    },
    hover: {
      wrap: "cr-demo-hover",
      demo: `<div class="cr-box cr-t" style="width:120px">Hover me</div><span class="cr-demo-hint">hover the box</span>`,
      sel: ".box",
      html: `<div class="box">Hover me</div>`,
      css: ".box { width: 120px; background: lightblue; padding: 10px; }\n.box:hover { transform: translateX(100px) rotate(8deg); background: lightgreen; }"
    },
    anim: {
      demo: `<div class="cr-box cr-t" style="width:80px;height:50px">Box</div>`,
      sel: ".box",
      html: `<div class="box">Box</div>`,
      css: ".box { width: 80px; height: 50px; background: lightblue; }\n@keyframes slide { from { transform: translateX(0); } to { transform: translateX(120px); } }\n@keyframes spin { to { transform: rotate(360deg); } }\n@keyframes pulse { 50% { transform: scale(1.25); opacity: 0.6; } }"
    },
    input: {
      demo: `<label><input class="cr-t" type="checkbox" checked> Checkbox</label> <input class="cr-t" type="range"><br><input class="cr-t" type="text" placeholder="Type here…">`,
      sel: "input",
      html: `<input type="checkbox" checked>\n<input type="range">\n<input type="text" placeholder="Type here…">`,
      css: ""
    }
  };

  /* -----------------------------
     PROPERTIES
     p: property  c: category  d: description  v: values to try
     t: template  b: base CSS the demo needs (shown in the example too)
  ----------------------------- */
  const P = [
    // ---- Text ----
    { p: "color", c: "Text", t: "text", d: "Sets the text color.", v: ["crimson", "#2e86c1", "rgb(39, 174, 96)", "hsl(280, 60%, 45%)"] },
    { p: "text-align", c: "Text", t: "text", d: "Aligns text horizontally inside its box.", v: ["left", "center", "right", "justify"] },
    { p: "text-decoration", c: "Text", t: "text", d: "Adds lines to text, like underline or strike-through.", v: ["none", "underline", "line-through", "overline", "underline wavy crimson"] },
    { p: "text-decoration-color", c: "Text", t: "text", b: "text-decoration: underline", d: "Sets the color of the underline/line.", v: ["crimson", "royalblue", "orange"] },
    { p: "text-decoration-style", c: "Text", t: "text", b: "text-decoration: underline", d: "Sets the style of the underline/line.", v: ["solid", "double", "dotted", "dashed", "wavy"] },
    { p: "text-underline-offset", c: "Text", t: "text", b: "text-decoration: underline", d: "Moves the underline away from the text.", v: ["auto", "4px", "8px"] },
    { p: "text-transform", c: "Text", t: "text", d: "Changes letter case without changing the HTML.", v: ["none", "uppercase", "lowercase", "capitalize"] },
    { p: "text-indent", c: "Text", t: "text", d: "Indents the first line of a paragraph.", v: ["0", "30px", "4em"] },
    { p: "letter-spacing", c: "Text", t: "text", d: "Space between letters.", v: ["normal", "2px", "0.3em", "-1px"] },
    { p: "word-spacing", c: "Text", t: "text", d: "Space between words.", v: ["normal", "10px", "1em"] },
    { p: "line-height", c: "Text", t: "text", d: "Height of each line of text. A plain number like 1.5 is recommended.", v: ["1", "1.5", "2", "30px"] },
    { p: "text-shadow", c: "Text", t: "text", d: "Adds a shadow behind text: x-offset y-offset blur color.", v: ["none", "2px 2px 0 #aaa", "0 0 8px royalblue", "1px 1px 2px black"] },
    { p: "white-space", c: "Text", t: "text", d: "Controls wrapping and whether spaces/new lines are kept.", v: ["normal", "nowrap", "pre-wrap"] },
    { p: "word-break", c: "Text", t: "scroll", b: "height: auto", d: "Whether long words may break in the middle.", v: ["normal", "break-all", "keep-all"] },
    { p: "overflow-wrap", c: "Text", t: "scroll", b: "height: auto", d: "Lets very long words wrap instead of overflowing.", v: ["normal", "break-word", "anywhere"] },
    { p: "text-overflow", c: "Text", t: "text", b: "white-space: nowrap; overflow: hidden", d: "What to show when text is cut off. Needs overflow: hidden and nowrap.", v: ["clip", "ellipsis"] },
    { p: "writing-mode", c: "Text", t: "text", b: "height: 110px", d: "Writes text horizontally or vertically.", v: ["horizontal-tb", "vertical-rl", "vertical-lr"] },
    { p: "direction", c: "Text", t: "text", d: "Text direction, for right-to-left languages like Arabic.", v: ["ltr", "rtl"] },
    { p: "column-count", c: "Text", t: "text", d: "Splits text into newspaper-style columns.", v: ["1", "2", "3"] },
    { p: "column-gap", c: "Text", t: "text", b: "column-count: 2", d: "Gap between text columns (also used in flex and grid).", v: ["normal", "10px", "40px"] },

    // ---- Font ----
    { p: "font-family", c: "Font", t: "text", d: "Chooses the typeface. List fallbacks, ending with a generic family.", v: ["Arial, sans-serif", "Georgia, serif", "'Courier New', monospace", "cursive"] },
    { p: "font-size", c: "Font", t: "text", d: "Size of the text. rem is relative to the root font size.", v: ["12px", "16px", "1.5rem", "2em", "larger"] },
    { p: "font-weight", c: "Font", t: "text", d: "Thickness of the text.", v: ["normal", "bold", "300", "900"] },
    { p: "font-style", c: "Font", t: "text", d: "Makes text italic.", v: ["normal", "italic", "oblique"] },
    { p: "font-variant", c: "Font", t: "text", d: "Small capital letters and other variants.", v: ["normal", "small-caps"] },
    { p: "font", c: "Font", t: "text", d: "Shorthand: style weight size/line-height family.", v: ["16px Arial, sans-serif", "italic bold 20px Georgia, serif", "small-caps 18px/2 monospace"] },

    // ---- Color & Background ----
    { p: "background-color", c: "Background", t: "box", d: "Fills the element's background with a color.", v: ["lightyellow", "#d6eaf8", "rgba(231, 76, 60, 0.3)", "transparent"] },
    { p: "background-image", c: "Background", t: "box", d: "Puts an image or gradient behind the content.", v: ["none", "linear-gradient(90deg, #ff9a9e, #fad0c4)", "radial-gradient(circle, gold, tomato)", "linear-gradient(to bottom, royalblue, transparent)"] },
    { p: "background-size", c: "Background", t: "box", b: `background-image: url("${STAR}"); min-height: 100px`, d: "Size of the background image.", v: ["auto", "40px", "contain", "cover"] },
    { p: "background-repeat", c: "Background", t: "box", b: `background-image: url("${STAR}"); min-height: 100px`, d: "Whether the background image tiles.", v: ["repeat", "no-repeat", "repeat-x", "repeat-y", "space"] },
    { p: "background-position", c: "Background", t: "box", b: `background-image: url("${STAR}"); background-repeat: no-repeat; min-height: 100px`, d: "Where the background image is placed.", v: ["left top", "center", "right bottom", "20px 40px"] },
    { p: "background", c: "Background", t: "box", d: "Shorthand for all background properties in one line.", v: ["tomato", "linear-gradient(135deg, #667eea, #764ba2)", `url("${STAR}") no-repeat center / 50px lightyellow`] },
    { p: "background-clip", c: "Background", t: "box", b: "background-color: gold; padding: 20px; border: 8px dashed steelblue", d: "How far the background extends: under the border, padding or only content.", v: ["border-box", "padding-box", "content-box"] },

    // ---- Box model ----
    { p: "margin", c: "Box model", t: "box", d: "Space outside the border. 1–4 values: top right bottom left.", v: ["0", "20px", "10px 40px", "0 auto"] },
    { p: "margin-top", c: "Box model", t: "box", d: "Margin on one side only (also margin-right, -bottom, -left).", v: ["0", "20px", "40px"] },
    { p: "padding", c: "Box model", t: "box", d: "Space inside the border, around the content.", v: ["0", "10px", "30px", "5px 40px"] },
    { p: "padding-left", c: "Box model", t: "box", d: "Padding on one side only (also padding-top, -right, -bottom).", v: ["10px", "40px", "80px"] },
    { p: "box-sizing", c: "Box model", t: "box", b: "width: 200px; padding: 20px; border-width: 8px", d: "Whether width includes padding and border. border-box makes sizing easier.", v: ["content-box", "border-box"] },

    // ---- Border ----
    { p: "border", c: "Border", t: "box", d: "Shorthand: width style color.", v: ["none", "2px solid steelblue", "4px dashed tomato", "6px double green"] },
    { p: "border-width", c: "Border", t: "box", d: "Thickness of the border.", v: ["1px", "5px", "10px", "2px 10px"] },
    { p: "border-style", c: "Border", t: "box", b: "border-width: 5px", d: "Look of the border line.", v: ["solid", "dashed", "dotted", "double", "groove", "none"] },
    { p: "border-color", c: "Border", t: "box", d: "Color of the border.", v: ["steelblue", "tomato", "gold", "red green blue orange"] },
    { p: "border-radius", c: "Border", t: "box", d: "Rounds the corners. 50% on a square makes a circle.", v: ["0", "8px", "20px", "50%", "30px 0"] },
    { p: "border-top", c: "Border", t: "box", d: "Border on one side only (also border-right, -bottom, -left).", v: ["none", "4px solid tomato", "8px dotted green"] },
    { p: "outline", c: "Border", t: "box", d: "A line outside the border that takes no space. Used for focus styles.", v: ["none", "3px solid orange", "2px dashed red"] },
    { p: "outline-offset", c: "Border", t: "box", b: "outline: 2px solid orange", d: "Distance between the outline and the border.", v: ["0", "5px", "12px"] },

    // ---- Size ----
    { p: "width", c: "Size", t: "box", d: "Width of the element.", v: ["auto", "150px", "50%", "100%", "fit-content"] },
    { p: "height", c: "Size", t: "box", d: "Height of the element.", v: ["auto", "50px", "100px"] },
    { p: "max-width", c: "Size", t: "box", d: "The element can never be wider than this. Great for responsive pages.", v: ["none", "200px", "50%"] },
    { p: "min-width", c: "Size", t: "display", d: "The element can never be narrower than this.", v: ["0", "150px", "250px"] },
    { p: "min-height", c: "Size", t: "box", d: "The element is at least this tall.", v: ["0", "80px", "120px"] },
    { p: "max-height", c: "Size", t: "scroll", b: "height: auto", d: "The element can never be taller than this.", v: ["none", "60px", "40px"] },
    { p: "aspect-ratio", c: "Size", t: "box", b: "width: 120px", d: "Keeps a width/height ratio.", v: ["auto", "1 / 1", "16 / 9", "3 / 4"] },

    // ---- Display & visibility ----
    { p: "display", c: "Display", t: "display", d: "How the element is laid out: block takes the full row, inline flows in text.", v: ["inline", "block", "inline-block", "none"] },
    { p: "visibility", c: "Display", t: "display", d: "Hides an element but keeps its space (unlike display: none).", v: ["visible", "hidden"] },
    { p: "opacity", c: "Display", t: "box", d: "Transparency of the whole element, 0 to 1.", v: ["1", "0.7", "0.4", "0.1"] },
    { p: "overflow", c: "Display", t: "scroll", d: "What happens when content is too big for its box.", v: ["visible", "hidden", "scroll", "auto"] },
    { p: "overflow-x", c: "Display", t: "scroll", b: "white-space: nowrap", d: "Overflow in one direction only (also overflow-y).", v: ["visible", "hidden", "auto"] },
    { p: "float", c: "Display", t: "float", d: "Pushes an element left or right and lets text wrap around it.", v: ["none", "left", "right"] },
    { p: "object-fit", c: "Display", t: "image", d: "How an image fills its box when the sizes don't match.", v: ["fill", "contain", "cover", "none"] },
    { p: "object-position", c: "Display", t: "image", b: "object-fit: cover", d: "Which part of the image shows when it is cropped.", v: ["center", "left", "right", "top"] },

    // ---- Position ----
    { p: "position", c: "Position", t: "pos", b: "top: 20px; left: 30px", d: "How the element is positioned. absolute uses the nearest positioned parent.", v: ["static", "relative", "absolute", "sticky"] },
    { p: "top", c: "Position", t: "pos", b: "position: absolute", d: "Distance from the top of the positioning parent.", v: ["0", "20px", "50%"] },
    { p: "left", c: "Position", t: "pos", b: "position: absolute", d: "Distance from the left of the positioning parent.", v: ["0", "40px", "50%"] },
    { p: "right", c: "Position", t: "pos", b: "position: absolute", d: "Distance from the right of the positioning parent.", v: ["0", "40px"] },
    { p: "bottom", c: "Position", t: "pos", b: "position: absolute", d: "Distance from the bottom of the positioning parent.", v: ["0", "20px"] },
    { p: "inset", c: "Position", t: "pos", b: "position: absolute", d: "Shorthand for top right bottom left.", v: ["10px", "10px 40px", "0 auto auto 0"] },
    { p: "z-index", c: "Position", t: "stack", d: "Which positioned element is on top. Higher wins.", v: ["0", "2", "-1"] },

    // ---- Flexbox (container) ----
    { p: "display: flex", key: "display", val: "flex", c: "Flexbox", t: "flex", d: "Turns an element into a flex container: its children line up in a row.", v: ["block", "flex", "inline-flex"] },
    { p: "flex-direction", c: "Flexbox", t: "flex", d: "Direction of the items: row or column.", v: ["row", "row-reverse", "column", "column-reverse"] },
    { p: "justify-content", c: "Flexbox", t: "flex", d: "Spreads items along the main axis (horizontally in a row).", v: ["flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"] },
    { p: "align-items", c: "Flexbox", t: "flex", d: "Aligns items on the cross axis (vertically in a row).", v: ["stretch", "flex-start", "center", "flex-end", "baseline"] },
    { p: "flex-wrap", c: "Flexbox", t: "flexMany", d: "Whether items may wrap onto new lines.", v: ["nowrap", "wrap", "wrap-reverse"] },
    { p: "align-content", c: "Flexbox", t: "flexMany", b: "flex-wrap: wrap", d: "Spreads wrapped lines on the cross axis.", v: ["stretch", "flex-start", "center", "space-between"] },
    { p: "flex-flow", c: "Flexbox", t: "flexMany", d: "Shorthand for flex-direction and flex-wrap.", v: ["row nowrap", "row wrap", "column wrap"] },
    { p: "gap", c: "Flexbox", t: "flex", d: "Space between items in flex and grid layouts.", v: ["0", "8px", "24px"] },

    // ---- Flexbox (item) ----
    { p: "flex-grow", c: "Flex item", t: "flexItem", d: "How much the item grows to fill free space.", v: ["0", "1", "3"] },
    { p: "flex-shrink", c: "Flex item", t: "flexItem", b: "width: 250px", d: "How much the item shrinks when space is tight. 0 = never.", v: ["1", "0", "5"] },
    { p: "flex-basis", c: "Flex item", t: "flexItem", d: "Starting size of the item before growing/shrinking.", v: ["auto", "100px", "50%"] },
    { p: "flex", c: "Flex item", t: "flexItem", d: "Shorthand for grow shrink basis. flex: 1 is the most common.", v: ["0 1 auto", "1", "2 1 0"] },
    { p: "order", c: "Flex item", t: "flexItem", d: "Changes the visual order without changing the HTML.", v: ["0", "1", "5", "-1"] },
    { p: "align-self", c: "Flex item", t: "flexItem", d: "Overrides align-items for one item.", v: ["auto", "flex-start", "center", "flex-end"] },

    // ---- Grid ----
    { p: "display: grid", key: "display", val: "grid", c: "Grid", t: "grid", d: "Turns an element into a grid container with rows and columns.", v: ["block", "grid"] },
    { p: "grid-template-columns", c: "Grid", t: "grid", d: "Defines the columns. fr means a share of the free space.", v: ["1fr 1fr", "repeat(3, 1fr)", "100px 1fr", "1fr 2fr 1fr", "repeat(auto-fill, minmax(60px, 1fr))"] },
    { p: "grid-template-rows", c: "Grid", t: "grid", d: "Defines the rows.", v: ["auto", "50px 80px", "1fr 2fr"] },
    { p: "row-gap", c: "Grid", t: "grid", d: "Space between rows only.", v: ["0", "8px", "30px"] },
    { p: "justify-items", c: "Grid", t: "grid", d: "Aligns items horizontally inside their cells.", v: ["stretch", "start", "center", "end"] },
    { p: "place-items", c: "Grid", t: "grid", d: "Shorthand for align-items and justify-items. center centers everything.", v: ["stretch", "center", "start end"] },
    { p: "grid-auto-flow", c: "Grid", t: "grid", d: "How extra items are placed: in rows or columns.", v: ["row", "column", "dense"] },
    { p: "grid-template-areas", c: "Grid", t: "grid", b: "grid-template-columns: 1fr 1fr 1fr", d: "Names areas of the grid with strings. Items use grid-area to sit in them.", v: [`"a a b" "c d d"`, `"a b c" "d e f"`] },
    { p: "grid-column", c: "Grid item", t: "gridItem", d: "Which columns the item spans.", v: ["auto", "span 2", "1 / -1", "2 / 4"] },
    { p: "grid-row", c: "Grid item", t: "gridItem", d: "Which rows the item spans.", v: ["auto", "span 2", "1 / 3"] },
    { p: "justify-self", c: "Grid item", t: "gridItem", d: "Aligns one item horizontally in its cell.", v: ["stretch", "start", "center", "end"] },

    // ---- Effects ----
    { p: "box-shadow", c: "Effects", t: "box", d: "Shadow around the box: x y blur spread color.", v: ["none", "0 4px 10px rgba(0,0,0,0.3)", "0 0 0 4px gold", "inset 0 0 12px steelblue"] },
    { p: "filter", c: "Effects", t: "image", d: "Visual filters like blur or grayscale.", v: ["none", "blur(2px)", "grayscale(100%)", "brightness(1.5)", "sepia(1)", "hue-rotate(90deg)"] },
    { p: "clip-path", c: "Effects", t: "image", d: "Cuts the element into a shape.", v: ["none", "circle(40%)", "polygon(50% 0, 100% 100%, 0 100%)", "inset(10px round 12px)"] },
    { p: "mix-blend-mode", c: "Effects", t: "box", b: "background-color: tomato", d: "How the element's colors blend with what is behind it.", v: ["normal", "multiply", "screen", "difference"] },

    // ---- Transform ----
    { p: "transform", c: "Transform", t: "box", b: "width: 140px", d: "Moves, rotates, scales or skews the element without affecting layout.", v: ["none", "rotate(15deg)", "scale(1.3)", "translateX(60px)", "skewX(-15deg)"] },
    { p: "transform-origin", c: "Transform", t: "box", b: "width: 140px; transform: rotate(20deg)", d: "The point the transform happens around.", v: ["center", "top left", "bottom right"] },
    { p: "rotate", c: "Transform", t: "box", b: "width: 140px", d: "Rotates the element (short alternative to transform: rotate()).", v: ["0deg", "45deg", "-20deg"] },
    { p: "scale", c: "Transform", t: "box", b: "width: 140px", d: "Scales the element (short alternative to transform: scale()).", v: ["1", "1.4", "0.6"] },
    { p: "translate", c: "Transform", t: "box", b: "width: 140px", d: "Moves the element (short alternative to transform: translate()).", v: ["0", "50px", "40px 20px"] },

    // ---- Transition & Animation ----
    { p: "transition", c: "Animation", t: "hover", d: "Animates changes smoothly, e.g. on :hover. Hover the box!", v: ["none", "all 0.3s ease", "transform 1s ease-in-out", "all 0.5s linear"] },
    { p: "transition-duration", c: "Animation", t: "hover", b: "transition-property: all", d: "How long the transition takes.", v: ["0.2s", "1s", "2s"] },
    { p: "transition-timing-function", c: "Animation", t: "hover", b: "transition: all 1s", d: "The speed curve of the transition.", v: ["ease", "linear", "ease-in", "ease-out", "cubic-bezier(.68,-0.6,.32,1.6)"] },
    { p: "animation", c: "Animation", t: "anim", d: "Runs a @keyframes animation: name duration timing count direction.", v: ["none", "slide 1s ease-in-out infinite alternate", "spin 2s linear infinite", "pulse 1s infinite"] },
    { p: "animation-duration", c: "Animation", t: "anim", b: "animation-name: slide; animation-iteration-count: infinite; animation-direction: alternate", d: "How long one cycle of the animation takes.", v: ["0.5s", "1s", "3s"] },
    { p: "animation-iteration-count", c: "Animation", t: "anim", b: "animation-name: pulse; animation-duration: 0.8s", d: "How many times the animation runs.", v: ["1", "3", "infinite"] },
    { p: "animation-timing-function", c: "Animation", t: "anim", b: "animation: slide 1.5s infinite alternate", d: "The speed curve of each cycle.", v: ["ease", "linear", "ease-in-out", "steps(4)"] },

    // ---- Lists & tables ----
    { p: "list-style-type", c: "Lists & tables", t: "list", d: "The marker in front of list items.", v: ["disc", "circle", "square", "decimal", "upper-roman", "none"] },
    { p: "list-style-position", c: "Lists & tables", t: "list", d: "Whether the marker sits inside or outside the item.", v: ["outside", "inside"] },
    { p: "list-style", c: "Lists & tables", t: "list", d: "Shorthand for list-style-type, position and image.", v: ["disc outside", "square inside", "none"] },
    { p: "border-collapse", c: "Lists & tables", t: "table", d: "Merges table cell borders into single lines.", v: ["separate", "collapse"] },
    { p: "border-spacing", c: "Lists & tables", t: "table", d: "Space between cell borders (with separate borders).", v: ["0", "4px", "10px"] },
    { p: "caption-side", c: "Lists & tables", t: "table", d: "Puts a table's <caption> on top or bottom.", v: ["top", "bottom"] },
    { p: "vertical-align", c: "Lists & tables", t: "table", b: "height: 110px", d: "Vertical position of content in table cells (and inline elements).", v: ["top", "middle", "bottom"] },

    // ---- Interaction & other ----
    { p: "cursor", c: "Interaction", t: "box", d: "The mouse pointer shown over the element. Hover the box!", v: ["auto", "pointer", "not-allowed", "grab", "help", "crosshair"] },
    { p: "pointer-events", c: "Interaction", t: "input", d: "none makes the element ignore clicks.", v: ["auto", "none"] },
    { p: "user-select", c: "Interaction", t: "text", d: "Whether the user can select the text.", v: ["auto", "none", "all"] },
    { p: "accent-color", c: "Interaction", t: "input", d: "Color of checkboxes, radio buttons and sliders.", v: ["auto", "tomato", "seagreen", "purple"] },
    { p: "caret-color", c: "Interaction", t: "input", d: "Color of the blinking text cursor in inputs.", v: ["auto", "red", "royalblue"] },
    { p: "resize", c: "Interaction", t: "scroll", b: "overflow: auto", d: "Lets the user resize the box by dragging its corner.", v: ["none", "both", "horizontal", "vertical"] },
    { p: "scroll-behavior", c: "Interaction", t: "scroll", b: "overflow: auto", d: "Smooth scrolling for anchor links (usually set on html).", v: ["auto", "smooth"] },
    { p: "--custom-property", key: "--main-color", c: "Interaction", t: "box", b: "background: var(--main-color)", d: "CSS variables: define once, reuse with var(). Change the variable and every use updates.", v: ["lightblue", "gold", "tomato"] }
  ];

  // Some cards apply a different property than their title (e.g. "display: flex")
  const keyOf = (prop) => prop.key || prop.p;

  // Shared with css-editor.js: explanations and example values per property
  const byKey = new Map();
  P.forEach((prop) => { if (!byKey.has(keyOf(prop))) byKey.set(keyOf(prop), prop); });
  window.CSSRef = {
    describe(name) {
      const prop = byKey.get(String(name).toLowerCase());
      return prop ? { desc: prop.d, values: prop.v, category: prop.c } : null;
    },
    names: () => [...byKey.keys()].filter((k) => !k.startsWith("--"))
  };

  // Table demo needs a caption for caption-side, and vertical-align applies to cells
  const TABLE_CAPTION = "<caption>Team</caption>";

  /* -----------------------------
     CODE EXAMPLES
  ----------------------------- */
  function declarations(prop, value) {
    const base = (prop.b || "")
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => `  ${s};`);
    return [...base, `  ${keyOf(prop)}: ${value};`].join("\n");
  }

  function cssExample(prop, value) {
    const tpl = TPL[prop.t];
    const sel = prop.p === "vertical-align" ? "td" : tpl.sel;
    return `${sel} {\n${declarations(prop, value)}\n}`;
  }

  function htmlExample(prop) {
    const tpl = TPL[prop.t];
    if (prop.p === "caption-side") return tpl.html.replace("<table>", `<table>\n  ${TABLE_CAPTION}`);
    return tpl.html;
  }

  function trySnippet(prop, value) {
    const tpl = TPL[prop.t];
    const css = [tpl.css, cssExample(prop, value)].filter(Boolean).join("\n\n");
    return `<style>\n${css}\n</style>\n\n${htmlExample(prop)}`;
  }

  /* -----------------------------
     LIVE DEMO
  ----------------------------- */
  // Demos use cr- prefixed keyframes so they never clash with the site's own
  const demoValue = (value) => value.replace(/\b(slide|spin|pulse)\b/g, "cr-$1");

  function applyDemo(card, prop, value) {
    const targets = prop.p === "vertical-align"
      ? card.querySelectorAll(".cr-demo td")
      : card.querySelectorAll(".cr-t");

    targets.forEach((el) => {
      // Keep any inline layout the template set, then apply base + chosen value
      if (!el.dataset.crBase) el.dataset.crBase = el.getAttribute("style") || "";
      const decl = `${el.dataset.crBase};${prop.b ? demoValue(prop.b) + ";" : ""}`;
      el.setAttribute("style", decl);
      el.style.setProperty(keyOf(prop), demoValue(value));

      // Restart animations so a new value is visible straight away
      if (prop.c === "Animation" && prop.t === "anim") {
        el.style.animationPlayState = "running";
        el.getAnimations?.().forEach((a) => { a.cancel(); a.play(); });
      }
    });

    card.querySelector(".cr-css").textContent = cssExample(prop, value);
    card.querySelectorAll(".cr-value").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.value === value)));
    card.dataset.value = value;
  }

  function demoHTML(prop) {
    let html = TPL[prop.t].demo;
    if (prop.p === "caption-side") html = html.replace('<table class="cr-t">', `<table class="cr-t">${TABLE_CAPTION}`);
    if (prop.p === "grid-template-areas") {
      // Give the six items names so the areas are visible
      const names = ["a", "b", "c", "d", "e", "f"];
      let i = 0;
      html = html.replace(/class="cr-item"/g, () => `class="cr-item" style="grid-area:${names[i++]}"`)
                 .replace(/>(\d)</g, (m, d) => `>${names[d - 1]}<`);
    }
    return html;
  }

  /* -----------------------------
     RENDERING
  ----------------------------- */
  // Phones: the "three ways" cards open and close (the recommended one starts open)
  document.querySelectorAll(".cr-way").forEach((way, i) => {
    const h = way.querySelector("h3");
    if (!h) return;
    if (i === 0) way.classList.add("is-open");
    h.setAttribute("role", "button");
    h.setAttribute("tabindex", "0");
    const toggle = () => h.setAttribute("aria-expanded", String(way.classList.toggle("is-open")));
    h.setAttribute("aria-expanded", String(i === 0));
    h.addEventListener("click", toggle);
    h.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });
  });

  const grid = document.getElementById("crGrid");
  const filtersEl = document.getElementById("crFilters");
  const searchEl = document.getElementById("crSearch");
  const emptyEl = document.getElementById("crEmpty");
  const countEl = document.getElementById("crCount");

  if (!grid || !filtersEl || !searchEl) return;

  const categories = ["All", ...new Set(P.map((x) => x.c))];
  // Start with the first category (not all cards at once) so the page stays short
  let activeCat = categories[1] || "All";

  function buildCard(prop) {
    const card = document.createElement("article");
    card.className = "cr-card";
    card.id = "prop-" + prop.p.replace(/[^a-z0-9-]/gi, "-");

    const head = document.createElement("div");
    head.className = "cr-card-head";
    const name = document.createElement("code");
    name.className = "cr-name";
    name.textContent = prop.p;
    const cat = document.createElement("span");
    cat.className = "cr-cat";
    cat.textContent = prop.c;
    head.append(name, cat);
    // Phones: cards start closed; tap the name to open the demo (CSS does the hiding)
    head.setAttribute("role", "button");
    head.setAttribute("tabindex", "0");
    head.setAttribute("aria-expanded", "false");
    const toggle = () => head.setAttribute("aria-expanded", String(card.classList.toggle("is-open")));
    head.addEventListener("click", toggle);
    head.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });

    const desc = document.createElement("p");
    desc.className = "cr-desc";
    desc.textContent = prop.d;

    const values = document.createElement("div");
    values.className = "cr-values";
    values.setAttribute("aria-label", `Values for ${prop.p}`);
    prop.v.forEach((v) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "cr-value";
      b.dataset.value = v;
      // Long data: URLs are unreadable on a button
      b.textContent = v.replace(/url\("data:[^"]+"\)/, "url(star.svg)");
      b.addEventListener("click", () => applyDemo(card, prop, v));
      values.appendChild(b);
    });

    const demo = document.createElement("div");
    demo.className = "cr-demo" + (TPL[prop.t].wrap ? " " + TPL[prop.t].wrap : "");
    demo.innerHTML = demoHTML(prop);

    const code = document.createElement("details");
    code.className = "cr-code";
    code.innerHTML = `<summary>Show CSS + HTML</summary>
      <p class="cr-file">style.css</p><pre class="cr-css"></pre>
      <p class="cr-file">index.html</p><pre class="cr-html"></pre>`;
    code.querySelector(".cr-html").textContent = htmlExample(prop);

    const tryBtn = document.createElement("button");
    tryBtn.type = "button";
    tryBtn.className = "cr-try";
    tryBtn.innerHTML = '<i class="fas fa-play"></i> Try it in the editor';
    tryBtn.addEventListener("click", () => {
      // Opens the CSS editor on this page (css-editor.js), with CSS and HTML in separate files
      if (window.CSSEditor) {
        const tpl = TPL[prop.t];
        const css = [tpl.css, cssExample(prop, card.dataset.value)].filter(Boolean).join("\n\n");
        window.CSSEditor.load({ css, html: htmlExample(prop), title: prop.p });
        return;
      }
      // Fallback: the HTML editor on the home page
      localStorage.setItem("tagExample", trySnippet(prop, card.dataset.value));
      window.location.href = "../index.html#examples";
    });

    card.append(head, desc, values, demo, code, tryBtn);
    // Start on the second value when there is one, so the demo shows an effect
    applyDemo(card, prop, prop.v[Math.min(1, prop.v.length - 1)]);
    return card;
  }

  // Cards are built once; filtering just hides them
  const cards = P.map((prop) => {
    const card = buildCard(prop);
    grid.appendChild(card);
    return { prop, card, text: `${prop.p} ${prop.d} ${prop.c} ${prop.v.join(" ")}`.toLowerCase() };
  });

  function renderFilters() {
    filtersEl.innerHTML = "";
    categories.forEach((c) => {
      const n = c === "All" ? P.length : P.filter((x) => x.c === c).length;
      const b = document.createElement("button");
      b.type = "button";
      b.className = "cr-filter";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", String(c === activeCat));
      b.innerHTML = `${c}<small>${n}</small>`;
      b.addEventListener("click", () => {
        activeCat = c;
        renderFilters();
        applyFilter();
      });
      filtersEl.appendChild(b);
    });
  }

  function applyFilter() {
    const q = searchEl.value.trim().toLowerCase();
    let shown = 0;
    cards.forEach(({ prop, card, text }) => {
      // While searching, look in every category
      const visible = q ? text.includes(q) : (activeCat === "All" || prop.c === activeCat);
      card.hidden = !visible;
      if (visible) shown++;
    });
    emptyEl.hidden = shown > 0;
    countEl.textContent = `Showing ${shown} of ${P.length} properties.`;
  }

  searchEl.addEventListener("input", applyFilter);

  renderFilters();
  applyFilter();
})();
