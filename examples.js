/* =========================================================
   HTML MASTER – EXAMPLE GALLERY (examples.html)
   Each example: live preview, highlighted code, what you learn,
   and a button that opens it in the HTML editor (editor.js).
   Styles: examples.css
========================================================= */

(function () {
  const grid = document.getElementById("exGrid");
  if (!grid) return;

  const LEVELS = { 1: "Beginner", 2: "Intermediate", 3: "Advanced" };

  /* -----------------------------
     EXAMPLES
     cat: topic  level: 1-3  learn: short lessons shown on the card
  ----------------------------- */
  const EXAMPLES = [
    // ---------- Text ----------
    {
      title: "Headings & paragraphs",
      cat: "Text", level: 1,
      desc: "The basic building blocks of every page.",
      learn: ["<code>&lt;h1&gt;</code> is the main title, <code>&lt;h2&gt;</code> a section title", "Each <code>&lt;p&gt;</code> is its own block of text"],
      code: `<h1>My Travel Blog</h1>
<p>Welcome! Here I write about the places I visit.</p>

<h2>Norway</h2>
<p>Norway is famous for its fjords, mountains and northern lights.</p>

<h2>Japan</h2>
<p>Japan mixes old temples with modern cities.</p>`
    },
    {
      title: "Text formatting",
      cat: "Text", level: 1,
      desc: "Give words meaning: important, emphasised, highlighted…",
      learn: ["<code>&lt;strong&gt;</code> = important, <code>&lt;em&gt;</code> = stressed", "Formatting tags go inside a paragraph"],
      code: `<p>This is <strong>very important</strong> information.</p>
<p>I <em>really</em> like pizza.</p>
<p>Remember to <mark>bring your passport</mark>.</p>
<p>Old price: <del>500 kr</del> New price: <ins>399 kr</ins></p>
<p>Water is H<sub>2</sub>O and 3<sup>2</sup> = 9.</p>
<p>Use the <code>&lt;p&gt;</code> tag for paragraphs.</p>
<p><small>© 2026 My Website</small></p>`
    },
    {
      title: "Quotes & abbreviations",
      cat: "Text", level: 2,
      desc: "Quote other people correctly and explain short words.",
      learn: ["<code>&lt;blockquote&gt;</code> for long quotes, <code>&lt;q&gt;</code> for short ones", "<code>title</code> on <code>&lt;abbr&gt;</code> shows the full word on hover"],
      code: `<blockquote cite="https://www.w3.org/">
  <p>The power of the Web is in its universality.</p>
</blockquote>
<p>— Tim Berners-Lee, inventor of the <abbr title="World Wide Web">WWW</abbr></p>

<p>My teacher always says <q>practice makes perfect</q>.</p>`
    },
    {
      title: "Line breaks & dividers",
      cat: "Text", level: 1,
      desc: "Start new lines in an address or poem and separate topics.",
      learn: ["<code>&lt;br&gt;</code> breaks a line inside text", "<code>&lt;hr&gt;</code> draws a line between topics", "Both are empty tags with no closing tag"],
      code: `<h2>Contact</h2>
<address>
  HTML Master School<br>
  Main Street 1<br>
  0150 Oslo
</address>

<hr>

<h2>Opening hours</h2>
<p>Monday–Friday: 08–16</p>`
    },

    // ---------- Links & images ----------
    {
      title: "All kinds of links",
      cat: "Links & images", level: 1,
      desc: "Link to websites, sections on the same page, email and phone.",
      learn: ["<code>href</code> decides where the link goes", "<code>#id</code> jumps to an element on the same page", "<code>target=\"_blank\"</code> opens a new tab"],
      code: `<h2>Useful links</h2>
<ul>
  <li><a href="https://developer.mozilla.org" target="_blank" rel="noopener">MDN Web Docs</a> (new tab)</li>
  <li><a href="#contact">Jump to contact</a> (same page)</li>
  <li><a href="mailto:hello@example.com">Send an email</a></li>
  <li><a href="tel:+4712345678">Call us</a></li>
</ul>

<h2 id="contact">Contact</h2>
<p>You jumped here with a link to #contact.</p>`
    },
    {
      title: "Image with caption",
      cat: "Links & images", level: 1,
      desc: "Show a picture with a description underneath.",
      learn: ["<code>alt</code> describes the image for screen readers", "<code>&lt;figure&gt;</code> + <code>&lt;figcaption&gt;</code> connect an image and its caption"],
      code: `<figure>
  <img src="https://placehold.co/320x200/2e86c1/white?text=Mountain" alt="A blue mountain landscape" width="320">
  <figcaption>The view from the top of the mountain.</figcaption>
</figure>`
    },
    {
      title: "Clickable image",
      cat: "Links & images", level: 1,
      desc: "Put an image inside a link to make it clickable.",
      learn: ["Any element can go inside <code>&lt;a&gt;</code>", "The <code>alt</code> text tells where the link goes"],
      code: `<p>Click the picture to visit Example.com:</p>
<a href="https://example.com" target="_blank" rel="noopener">
  <img src="https://placehold.co/240x120/28b463/white?text=Visit+site" alt="Visit Example.com" width="240">
</a>`
    },
    {
      title: "Responsive image",
      cat: "Links & images", level: 3,
      desc: "Let the browser pick the best image size for the screen.",
      learn: ["<code>&lt;picture&gt;</code> with <code>&lt;source media&gt;</code> swaps images by screen width", "<code>loading=\"lazy\"</code> loads the image only when needed"],
      code: `<picture>
  <source media="(min-width: 600px)" srcset="https://placehold.co/600x200/884ea0/white?text=Big+screen">
  <img src="https://placehold.co/300x200/ca6f1e/white?text=Small+screen" alt="A banner that changes with screen size" loading="lazy" style="max-width: 100%;">
</picture>
<p>Make the window wider or narrower to see the image change.</p>`
    },

    // ---------- Lists ----------
    {
      title: "Bullet & numbered lists",
      cat: "Lists", level: 1,
      desc: "Lists for things without order and steps in order.",
      learn: ["<code>&lt;ul&gt;</code> = bullets, <code>&lt;ol&gt;</code> = numbers", "Every item is an <code>&lt;li&gt;</code>"],
      code: `<h3>Shopping list</h3>
<ul>
  <li>Milk</li>
  <li>Bread</li>
  <li>Apples</li>
</ul>

<h3>How to make tea</h3>
<ol>
  <li>Boil the water</li>
  <li>Put the tea bag in a cup</li>
  <li>Pour the water and wait 3 minutes</li>
</ol>`
    },
    {
      title: "Nested list",
      cat: "Lists", level: 2,
      desc: "A list inside a list, like a table of contents.",
      learn: ["The inner list goes <em>inside</em> an <code>&lt;li&gt;</code>", "<code>type=\"a\"</code> uses letters instead of numbers"],
      code: `<h3>Course plan</h3>
<ol>
  <li>HTML
    <ol type="a">
      <li>Tags and elements</li>
      <li>Links and images</li>
    </ol>
  </li>
  <li>CSS
    <ol type="a">
      <li>Colors and fonts</li>
      <li>Flexbox</li>
    </ol>
  </li>
  <li>JavaScript</li>
</ol>`
    },
    {
      title: "Glossary (description list)",
      cat: "Lists", level: 2,
      desc: "Terms with their explanations.",
      learn: ["<code>&lt;dl&gt;</code> wraps the list", "<code>&lt;dt&gt;</code> is the term, <code>&lt;dd&gt;</code> the description"],
      code: `<h3>Web words</h3>
<dl>
  <dt>HTML</dt>
  <dd>The language that gives a web page its structure.</dd>

  <dt>CSS</dt>
  <dd>The language that decides how the page looks.</dd>

  <dt>Browser</dt>
  <dd>The program that shows web pages, like Chrome or Firefox.</dd>
</dl>`
    },

    // ---------- Tables ----------
    {
      title: "Simple table",
      cat: "Tables", level: 1,
      desc: "Rows and columns of data.",
      learn: ["<code>&lt;tr&gt;</code> = row, <code>&lt;td&gt;</code> = cell", "<code>&lt;th&gt;</code> is a header cell (bold)"],
      code: `<table border="1">
  <tr>
    <th>Name</th>
    <th>Age</th>
    <th>City</th>
  </tr>
  <tr>
    <td>Ada</td>
    <td>36</td>
    <td>London</td>
  </tr>
  <tr>
    <td>Linus</td>
    <td>28</td>
    <td>Helsinki</td>
  </tr>
</table>`
    },
    {
      title: "Complete table",
      cat: "Tables", level: 2,
      desc: "A table with a title, header, body and total row.",
      learn: ["<code>&lt;caption&gt;</code> gives the table a title", "<code>&lt;thead&gt;</code>, <code>&lt;tbody&gt;</code>, <code>&lt;tfoot&gt;</code> group the rows", "<code>scope=\"col\"</code> helps screen readers"],
      code: `<table border="1">
  <caption>Class results</caption>
  <thead>
    <tr>
      <th scope="col">Student</th>
      <th scope="col">Points</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Sara</td><td>92</td></tr>
    <tr><td>Omar</td><td>85</td></tr>
    <tr><td>Lina</td><td>78</td></tr>
  </tbody>
  <tfoot>
    <tr><th scope="row">Average</th><td>85</td></tr>
  </tfoot>
</table>`
    },
    {
      title: "Merged cells (timetable)",
      cat: "Tables", level: 2,
      desc: "Cells that span several columns or rows.",
      learn: ["<code>colspan=\"2\"</code> stretches a cell over 2 columns", "<code>rowspan=\"2\"</code> stretches a cell over 2 rows"],
      code: `<table border="1">
  <tr>
    <th>Time</th>
    <th>Monday</th>
    <th>Tuesday</th>
  </tr>
  <tr>
    <td>08:00</td>
    <td rowspan="2">Maths (double)</td>
    <td>English</td>
  </tr>
  <tr>
    <td>09:00</td>
    <td>Science</td>
  </tr>
  <tr>
    <td>10:00</td>
    <td colspan="2">Lunch break for everyone</td>
  </tr>
</table>`
    },

    // ---------- Forms ----------
    {
      title: "Login form",
      cat: "Forms", level: 1,
      desc: "Email, password and a button.",
      learn: ["<code>&lt;label for&gt;</code> must match the input's <code>id</code>", "<code>type=\"password\"</code> hides what you type", "<code>required</code> stops empty fields"],
      code: `<form>
  <h2>Log in</h2>

  <label for="email">Email</label><br>
  <input id="email" type="email" placeholder="you@example.com" required><br><br>

  <label for="password">Password</label><br>
  <input id="password" type="password" required><br><br>

  <button type="submit">Log in</button>
</form>`
    },
    {
      title: "Input types",
      cat: "Forms", level: 2,
      desc: "The browser gives you date pickers, colour pickers and sliders for free.",
      learn: ["Change <code>type</code> to get a different control", "Phones show the right keyboard for <code>email</code>, <code>tel</code> and <code>number</code>"],
      code: `<form>
  <p><label>Birthday: <input type="date"></label></p>
  <p><label>Age: <input type="number" min="1" max="120"></label></p>
  <p><label>Favourite colour: <input type="color" value="#3498db"></label></p>
  <p><label>Volume: <input type="range" min="0" max="10"></label></p>
  <p><label>Phone: <input type="tel" placeholder="123 45 678"></label></p>
  <p><label>Website: <input type="url" placeholder="https://"></label></p>
  <p><label>Upload a photo: <input type="file" accept="image/*"></label></p>
</form>`
    },
    {
      title: "Radio buttons & checkboxes",
      cat: "Forms", level: 2,
      desc: "Choose one option, or several.",
      learn: ["Radio buttons with the same <code>name</code> belong together (pick one)", "<code>&lt;fieldset&gt;</code> + <code>&lt;legend&gt;</code> group related choices"],
      code: `<form>
  <fieldset>
    <legend>Pizza size</legend>
    <label><input type="radio" name="size" value="small"> Small</label>
    <label><input type="radio" name="size" value="medium" checked> Medium</label>
    <label><input type="radio" name="size" value="large"> Large</label>
  </fieldset>

  <fieldset>
    <legend>Toppings</legend>
    <label><input type="checkbox" name="topping" value="cheese" checked> Cheese</label>
    <label><input type="checkbox" name="topping" value="ham"> Ham</label>
    <label><input type="checkbox" name="topping" value="pineapple"> Pineapple</label>
  </fieldset>

  <button>Order</button>
</form>`
    },
    {
      title: "Contact form",
      cat: "Forms", level: 1,
      desc: "Name, a dropdown and a message box.",
      learn: ["<code>&lt;select&gt;</code> + <code>&lt;option&gt;</code> makes a dropdown", "<code>&lt;textarea&gt;</code> is for longer text"],
      code: `<form>
  <h2>Contact us</h2>

  <p>
    <label for="name">Name</label><br>
    <input id="name" type="text" required>
  </p>

  <p>
    <label for="topic">Topic</label><br>
    <select id="topic">
      <option>Question</option>
      <option>Feedback</option>
      <option>Something else</option>
    </select>
  </p>

  <p>
    <label for="message">Message</label><br>
    <textarea id="message" rows="4" cols="30" placeholder="Write here..."></textarea>
  </p>

  <button type="submit">Send</button>
</form>`
    },
    {
      title: "Form validation",
      cat: "Forms", level: 2,
      desc: "Let the browser check the answers before sending — no JavaScript needed.",
      learn: ["<code>minlength</code>, <code>min</code>/<code>max</code> and <code>pattern</code> set rules", "Press the button with wrong values to see the browser's messages"],
      code: `<form>
  <p>
    <label for="user">Username (at least 3 letters)</label><br>
    <input id="user" type="text" minlength="3" required>
  </p>
  <p>
    <label for="mail">Email</label><br>
    <input id="mail" type="email" required>
  </p>
  <p>
    <label for="zip">Postal code (4 digits)</label><br>
    <input id="zip" type="text" pattern="[0-9]{4}" title="Exactly 4 digits">
  </p>
  <p>
    <label for="age">Age (13–99)</label><br>
    <input id="age" type="number" min="13" max="99">
  </p>
  <button>Sign up</button>
</form>`
    },

    // ---------- Page layout ----------
    {
      title: "Semantic page layout",
      cat: "Page layout", level: 2,
      desc: "The standard skeleton of a real web page.",
      learn: ["<code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;aside&gt;</code>, <code>&lt;footer&gt;</code> describe each part", "Search engines and screen readers understand the page better"],
      code: `<header>
  <h1>Green Garden</h1>
  <nav>
    <a href="#">Home</a> |
    <a href="#">Plants</a> |
    <a href="#">Contact</a>
  </nav>
</header>

<main>
  <article>
    <h2>How to grow tomatoes</h2>
    <p>Tomatoes love sun and water every day.</p>
  </article>

  <aside>
    <h3>Tip of the day</h3>
    <p>Water your plants in the morning.</p>
  </aside>
</main>

<footer>
  <p>© 2026 Green Garden</p>
</footer>`
    },
    {
      title: "Blog post",
      cat: "Page layout", level: 2,
      desc: "An article with author, date and tags.",
      learn: ["<code>&lt;article&gt;</code> is a piece that makes sense on its own", "<code>&lt;time datetime&gt;</code> gives computers the exact date"],
      code: `<article>
  <header>
    <h2>My first week learning HTML</h2>
    <p>By <strong>Sara</strong> · <time datetime="2026-03-14">14 March 2026</time></p>
  </header>

  <p>This week I learned how tags work. Every element has an opening and a closing tag.</p>
  <p>My favourite tag so far is <code>&lt;a&gt;</code>, because links make the web a web!</p>

  <footer>
    <p>Tags: <a href="#">html</a>, <a href="#">beginner</a></p>
  </footer>
</article>`
    },
    {
      title: "Navigation menu",
      cat: "Page layout", level: 1,
      desc: "A menu is a list of links inside <nav>.",
      learn: ["Menus are lists: <code>&lt;nav&gt;</code> → <code>&lt;ul&gt;</code> → <code>&lt;li&gt;</code> → <code>&lt;a&gt;</code>", "<code>aria-current=\"page\"</code> marks the page you're on"],
      code: `<nav>
  <ul>
    <li><a href="#" aria-current="page">Home</a></li>
    <li><a href="#">About</a></li>
    <li><a href="#">Blog</a></li>
    <li><a href="#">Contact</a></li>
  </ul>
</nav>`
    },

    // ---------- Media ----------
    {
      title: "Video player",
      cat: "Media", level: 1,
      desc: "Play a video with the browser's own controls.",
      learn: ["<code>controls</code> adds play, pause and volume", "<code>&lt;source&gt;</code> lists the video file", "Text inside <code>&lt;video&gt;</code> shows if video isn't supported"],
      code: `<video controls width="320" poster="https://placehold.co/320x180/1e1e1e/white?text=Press+play">
  <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4">
  Your browser does not support video.
</video>`
    },
    {
      title: "Audio player",
      cat: "Media", level: 1,
      desc: "Play a sound file.",
      learn: ["<code>&lt;audio controls&gt;</code> shows a small player", "Add <code>loop</code> to repeat the sound"],
      code: `<h3>Listen to a dinosaur 🦖</h3>
<audio controls>
  <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3" type="audio/mpeg">
  Your browser does not support audio.
</audio>`
    },
    {
      title: "Embed a map",
      cat: "Media", level: 2,
      desc: "Show another web page, like a map, inside yours.",
      learn: ["<code>&lt;iframe&gt;</code> is a window to another page", "Always add a <code>title</code> so screen readers know what it is"],
      code: `<h3>Find us in Oslo</h3>
<iframe
  title="Map of central Oslo"
  width="320"
  height="200"
  src="https://www.openstreetmap.org/export/embed.html?bbox=10.70%2C59.90%2C10.78%2C59.93&amp;layer=mapnik"
  loading="lazy">
</iframe>`
    },

    // ---------- Interactive (no JavaScript) ----------
    {
      title: "FAQ that opens and closes",
      cat: "Interactive", level: 2,
      desc: "Click a question to show the answer — pure HTML.",
      learn: ["<code>&lt;details&gt;</code> hides its content", "<code>&lt;summary&gt;</code> is the clickable title", "Add <code>open</code> to start expanded"],
      code: `<h2>FAQ</h2>

<details open>
  <summary>What is HTML?</summary>
  <p>HTML is the language used to build web pages.</p>
</details>

<details>
  <summary>Do I need to install anything?</summary>
  <p>No! You only need a browser and a text editor.</p>
</details>

<details>
  <summary>How long does it take to learn?</summary>
  <p>You can make your first page today.</p>
</details>`
    },
    {
      title: "Progress bars",
      cat: "Interactive", level: 2,
      desc: "Show how far something has come.",
      learn: ["<code>&lt;progress&gt;</code> shows a task's progress", "<code>&lt;meter&gt;</code> shows a value in a range (it turns red when it's low)"],
      code: `<p>
  <label for="course">Course progress:</label>
  <progress id="course" value="70" max="100">70%</progress> 70%
</p>

<p>
  <label for="battery">Battery:</label>
  <meter id="battery" value="0.2" low="0.3" high="0.7" optimum="1">20%</meter> 20%
</p>

<p>
  <label for="disk">Disk space used:</label>
  <meter id="disk" value="0.6">60%</meter> 60%
</p>`
    },
    {
      title: "Pop-up without JavaScript",
      cat: "Interactive", level: 3,
      desc: "A button that opens a pop-up using the popover attribute.",
      learn: ["<code>popover</code> makes an element a pop-up", "<code>popovertarget</code> on a button connects it to the pop-up's <code>id</code>", "Press Esc or click outside to close it"],
      code: `<button popovertarget="info">Show info</button>

<div id="info" popover>
  <h3>Hello! 👋</h3>
  <p>This pop-up is made with HTML only.</p>
  <button popovertarget="info" popovertargetaction="hide">Close</button>
</div>`
    },

    // ---------- HTML + CSS ----------
    {
      title: "Styled button",
      cat: "HTML + CSS", level: 2,
      desc: "Use CSS to make a button look modern, with a hover effect.",
      learn: ["The <code>&lt;style&gt;</code> tag holds CSS rules", "<code>.class</code> in CSS matches <code>class=\"...\"</code> in HTML", "<code>:hover</code> styles the button under the mouse"],
      code: `<style>
  .btn {
    background: #3498db;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .btn:hover {
    background: #1f6fa8;
  }
</style>

<button class="btn">Click me</button>`
    },
    {
      title: "Profile card",
      cat: "HTML + CSS", level: 2,
      desc: "A small card with a round photo, name and links.",
      learn: ["<code>border-radius: 50%</code> makes the image round", "<code>box-shadow</code> lifts the card off the page"],
      code: `<style>
  .card {
    width: 220px;
    padding: 20px;
    text-align: center;
    font-family: sans-serif;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  .card img {
    border-radius: 50%;
  }
  .card h3 {
    margin: 10px 0 4px;
  }
  .card p {
    color: gray;
    margin: 0 0 12px;
  }
</style>

<div class="card">
  <img src="https://placehold.co/100x100/3498db/white?text=AS" alt="Profile photo of Ahmed" width="100" height="100">
  <h3>Ahmed S.</h3>
  <p>Web developer</p>
  <a href="#">GitHub</a> · <a href="#">LinkedIn</a>
</div>`
    },
    {
      title: "Menu bar with flexbox",
      cat: "HTML + CSS", level: 3,
      desc: "Turn a list of links into a horizontal menu bar.",
      learn: ["<code>display: flex</code> puts the list items in a row", "<code>list-style: none</code> removes the bullets"],
      code: `<style>
  nav ul {
    display: flex;
    gap: 8px;
    list-style: none;
    padding: 10px;
    margin: 0;
    background: #2c3e50;
    border-radius: 8px;
  }
  nav a {
    color: white;
    text-decoration: none;
    padding: 8px 14px;
    border-radius: 6px;
    font-family: sans-serif;
  }
  nav a:hover {
    background: #3498db;
  }
</style>

<nav>
  <ul>
    <li><a href="#">Home</a></li>
    <li><a href="#">Courses</a></li>
    <li><a href="#">Blog</a></li>
    <li><a href="#">Contact</a></li>
  </ul>
</nav>`
    },

    // ---------- Projects ----------
    {
      title: "About me page",
      cat: "Projects", level: 1,
      desc: "A complete little page about yourself — a great first project.",
      learn: ["A full page starts with <code>&lt;!DOCTYPE html&gt;</code>", "<code>&lt;head&gt;</code> holds the title, <code>&lt;body&gt;</code> the content", "Combines headings, images, lists and links"],
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>About Me</title>
</head>
<body>
  <h1>Hi, I'm Sara! 👋</h1>
  <img src="https://placehold.co/150x150/e67e22/white?text=Sara" alt="Photo of Sara" width="150">

  <h2>About me</h2>
  <p>I'm 15 years old and I love <strong>drawing</strong> and <strong>coding</strong>.</p>

  <h2>My hobbies</h2>
  <ul>
    <li>Football</li>
    <li>Gaming</li>
    <li>Building websites</li>
  </ul>

  <h2>Contact</h2>
  <p>Email me at <a href="mailto:sara@example.com">sara@example.com</a></p>
</body>
</html>`
    },
    {
      title: "Recipe page",
      cat: "Projects", level: 2,
      desc: "Ingredients, steps and cooking time on one page.",
      learn: ["<code>&lt;ul&gt;</code> for ingredients, <code>&lt;ol&gt;</code> for steps", "<code>&lt;article&gt;</code> wraps the whole recipe"],
      code: `<article>
  <h1>Pancakes 🥞</h1>
  <p><strong>Time:</strong> 20 minutes · <strong>Serves:</strong> 4</p>
  <img src="https://placehold.co/320x160/f4d03f/333?text=Pancakes" alt="A stack of pancakes" width="320">

  <h2>Ingredients</h2>
  <ul>
    <li>3 eggs</li>
    <li>5 dl milk</li>
    <li>2.5 dl flour</li>
    <li>A pinch of salt</li>
  </ul>

  <h2>Steps</h2>
  <ol>
    <li>Whisk the eggs and half of the milk.</li>
    <li>Add the flour and salt, then the rest of the milk.</li>
    <li>Fry in a hot pan until golden on both sides.</li>
  </ol>

  <p><em>Tip:</em> Serve with berries and jam!</p>
</article>`
    },
    {
      title: "Restaurant menu",
      cat: "Projects", level: 2,
      desc: "A menu with sections, dishes and prices.",
      learn: ["<code>&lt;section&gt;</code> splits the menu into parts", "A small CSS rule lines up names and prices"],
      code: `<style>
  .menu { font-family: Georgia, serif; max-width: 320px; }
  .menu h2 { border-bottom: 2px solid #c0392b; color: #c0392b; }
  .dish { display: flex; justify-content: space-between; }
  .menu p { margin: 2px 0 12px; color: gray; font-size: 14px; }
</style>

<div class="menu">
  <h1>Café Luna</h1>

  <section>
    <h2>Starters</h2>
    <div class="dish"><strong>Tomato soup</strong><span>89 kr</span></div>
    <p>With fresh basil and bread</p>
  </section>

  <section>
    <h2>Mains</h2>
    <div class="dish"><strong>Pizza Margherita</strong><span>159 kr</span></div>
    <p>Tomato, mozzarella, basil</p>
    <div class="dish"><strong>Veggie burger</strong><span>149 kr</span></div>
    <p>Served with fries</p>
  </section>
</div>`
    }
  ];

  /* -----------------------------
     HELPERS
  ----------------------------- */
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const highlight = (code) => (window.HMEditor?.highlight
    ? window.HMEditor.highlight(code)
    : window.HMHighlight?.html ? window.HMHighlight.html(code) : esc(code));

  // Unique tag names used in the code, in order of appearance
  function tagsIn(code) {
    const seen = new Set();
    code.replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<script[\s\S]*?<\/script>/gi, "<script>")
      .replace(/<style[\s\S]*?<\/style>/gi, "<style>")
      .replace(/<([a-zA-Z][\w-]*)/g, (_, t) => { seen.add(t.toLowerCase()); return ""; });
    return [...seen];
  }

  // Links in previews open a new tab instead of replacing the preview
  function previewDoc(code) {
    const base = '<base target="_blank">';
    if (/<head[^>]*>/i.test(code)) return code.replace(/<head[^>]*>/i, (m) => m + base);
    if (/^\s*<!doctype[^>]*>/i.test(code)) return code.replace(/^\s*<!doctype[^>]*>/i, (m) => m + base);
    return base + code;
  }

  function toast(msg) {
    if (typeof showToast === "function") showToast(msg);
  }

  /* -----------------------------
     CARDS
  ----------------------------- */
  // Previews load only when a card scrolls into view (30+ iframes would be slow)
  const lazy = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const f = e.target;
          f.srcdoc = f.dataset.srcdoc;
          lazy.unobserve(f);
        });
      }, { rootMargin: "200px" })
    : null;

  function buildCard(ex) {
    const card = document.createElement("article");
    card.className = "ex-card";

    // Preview / Code view
    const view = document.createElement("div");
    view.className = "ex-view";

    const frame = document.createElement("iframe");
    frame.title = `Preview: ${ex.title}`;
    frame.setAttribute("sandbox", "allow-scripts allow-forms allow-modals allow-popups");
    frame.dataset.srcdoc = previewDoc(ex.code);
    if (lazy) lazy.observe(frame);
    else frame.srcdoc = frame.dataset.srcdoc;

    const pre = document.createElement("pre");
    pre.hidden = true;
    pre.innerHTML = highlight(ex.code);

    const sw = document.createElement("div");
    sw.className = "ex-switch";
    sw.innerHTML = `<button type="button" aria-pressed="true"><i class="fas fa-eye"></i> Preview</button><button type="button" aria-pressed="false"><i class="fas fa-code"></i> Code</button>`;
    const [btnPreview, btnCode] = sw.querySelectorAll("button");
    const show = (code) => {
      pre.hidden = !code;
      frame.hidden = code;
      btnPreview.setAttribute("aria-pressed", String(!code));
      btnCode.setAttribute("aria-pressed", String(code));
    };
    btnPreview.addEventListener("click", () => show(false));
    btnCode.addEventListener("click", () => show(true));

    view.append(sw, frame, pre);

    // Text
    const body = document.createElement("div");
    body.className = "ex-body";
    body.innerHTML = `
      <div class="ex-head">
        <div>
          <h3 class="ex-title"></h3>
          <div class="ex-cat"></div>
        </div>
        <span class="ex-level ex-level-${ex.level}">${LEVELS[ex.level]}</span>
      </div>
      <p class="ex-desc"></p>
      <ul class="ex-learn">${ex.learn.map((l) => `<li>${l}</li>`).join("")}</ul>
      <div class="ex-tags" aria-label="Tags used"></div>
      <div class="ex-actions">
        <button type="button" class="ex-btn ex-btn-main" data-act="open"><i class="fas fa-pen"></i> Try it in the editor</button>
        <button type="button" class="ex-btn" data-act="copy"><i class="far fa-copy"></i> Copy</button>
      </div>`;
    body.querySelector(".ex-title").textContent = ex.title;
    body.querySelector(".ex-cat").textContent = ex.cat;
    body.querySelector(".ex-desc").textContent = ex.desc;

    const tagsEl = body.querySelector(".ex-tags");
    tagsIn(ex.code).forEach((t) => {
      const chip = document.createElement("span");
      chip.className = "ex-tag";
      chip.textContent = `<${t}>`;
      const info = window.HMEditor?.describe?.(t);
      if (info) chip.title = `${info[0]}: ${info[1]}`;
      tagsEl.appendChild(chip);
    });

    body.querySelector('[data-act="open"]').addEventListener("click", () => openInEditor(ex));
    body.querySelector('[data-act="copy"]').addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(ex.code);
        toast("📋 Code copied");
      } catch {
        show(true);
        toast("Select the code and press Ctrl+C");
      }
    });

    card.append(view, body);
    return card;
  }

  function openInEditor(ex) {
    const editor = document.getElementById("htmlCode");
    if (!editor) {
      // The gallery has its own page: hand the code to the editor on the home page
      // (script.js loads "tagExample" into the editor there)
      try { localStorage.setItem("tagExample", ex.code); } catch { /* ignore */ }
      window.location.href = "index.html#examples";
      return;
    }
    if (window.HMEditor) window.HMEditor.setCode(ex.code);
    else editor.value = ex.code;
    document.getElementById("htmlEditor")?.scrollIntoView({ behavior: "smooth", block: "start" });
    toast(`📘 "${ex.title}" is in the editor – change it and see what happens! (Ctrl+Z brings back your old code)`);
  }

  /* -----------------------------
     FILTERS
  ----------------------------- */
  const searchEl = document.getElementById("exSearch");
  const catsEl = document.getElementById("exCats");
  const levelsEl = document.getElementById("exLevels");
  const countEl = document.getElementById("exCount");
  const emptyEl = document.getElementById("exEmpty");
  const moreBtn = document.getElementById("exMore");

  const INITIAL = window.matchMedia("(max-width: 768px)").matches ? 4 : 9;
  let activeCat = "All";
  let activeLevel = 0;
  let showAll = false;

  const items = EXAMPLES.map((ex) => {
    const card = buildCard(ex);
    grid.appendChild(card);
    const text = `${ex.title} ${ex.cat} ${ex.desc} ${tagsIn(ex.code).join(" ")} ${ex.learn.join(" ")}`.toLowerCase().replace(/<[^>]+>/g, " ");
    return { ex, card, text };
  });

  function chip(label, count, pressed, onClick) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "ex-chip";
    b.setAttribute("aria-pressed", String(pressed));
    b.innerHTML = count === null ? esc(label) : `${esc(label)}<small>${count}</small>`;
    b.addEventListener("click", onClick);
    return b;
  }

  function renderFilters() {
    const cats = ["All", ...new Set(EXAMPLES.map((e) => e.cat))];
    catsEl.innerHTML = "";
    cats.forEach((c) => {
      const n = c === "All" ? EXAMPLES.length : EXAMPLES.filter((e) => e.cat === c).length;
      catsEl.appendChild(chip(c, n, c === activeCat, () => { activeCat = c; renderFilters(); apply(); }));
    });

    levelsEl.innerHTML = "";
    [[0, "All levels"], [1, LEVELS[1]], [2, LEVELS[2]], [3, LEVELS[3]]].forEach(([lvl, label]) => {
      levelsEl.appendChild(chip(label, null, lvl === activeLevel, () => { activeLevel = lvl; renderFilters(); apply(); }));
    });
  }

  function apply() {
    const q = searchEl.value.trim().toLowerCase();
    const filtering = q || activeCat !== "All" || activeLevel;
    const matches = items.filter(({ ex, text }) =>
      (activeCat === "All" || ex.cat === activeCat) &&
      (!activeLevel || ex.level === activeLevel) &&
      (!q || text.includes(q)));

    // Without filters, show a short list first so the page isn't too long
    const limit = filtering || showAll ? Infinity : INITIAL;
    items.forEach(({ card }) => { card.hidden = true; });
    matches.forEach(({ card }, i) => { card.hidden = i >= limit; });

    emptyEl.hidden = matches.length > 0;
    const shown = Math.min(matches.length, limit);
    countEl.textContent = `Showing ${shown} of ${filtering ? matches.length : EXAMPLES.length} examples`;
    moreBtn.hidden = shown >= matches.length;
  }

  searchEl.addEventListener("input", apply);
  moreBtn.addEventListener("click", () => { showAll = true; apply(); });

  renderFilters();
  apply();
})();
