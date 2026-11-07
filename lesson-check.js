/* =========================================================
   ROJ INSTITUTE – LESSON CHECKS
   At the end of every lesson page:
   1. A small hands-on task (write code, see it, press Check)
   2. A 3-question quiz. The lesson only counts as done when
      every answer is right (students can try again).
   Used by script.js (initLessonPage). Styles: style.css ("lc-").
========================================================= */

(function () {
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  /* -----------------------------
     QUIZ QUESTIONS (answer = index of the right option)
  ----------------------------- */
  const QUIZ = {
    "basics": [
      { q: "Which tag holds everything you can see on the page?", options: ["<head>", "<body>", "<title>"], answer: 1,
        why: "<body> holds the visible content. <head> holds info about the page." },
      { q: "Which line is a correct paragraph?", options: ["<p>Hello</p>", "<p>Hello<p>", "<para>Hello</para>"], answer: 0,
        why: "A paragraph starts with <p> and ends with </p> (with a slash)." },
      { q: "In <a href=\"page.html\">, what is href?", options: ["A tag", "An attribute", "A heading"], answer: 1,
        why: "Attributes go inside the opening tag and give extra information, like where a link goes." }
    ],
    "links-media": [
      { q: "Which attribute tells a link where to go?", options: ["src", "href", "alt"], answer: 1,
        why: "<a href=\"...\"> – href is the address of the link." },
      { q: "Why should every <img> have an alt attribute?", options: ["It makes the image bigger", "It describes the image for people who cannot see it", "It is needed for the image to load"], answer: 1,
        why: "Screen readers read the alt text aloud, and it shows if the image cannot load." },
      { q: "Which path is relative?", options: ["https://example.com/cat.jpg", "images/cat.jpg"], answer: 1,
        why: "A relative path starts from the current file. An absolute path is a full web address." }
    ],
    "tags": [
      { q: "Which tag is best for the main navigation links?", options: ["<div>", "<nav>", "<span>"], answer: 1,
        why: "<nav> is a semantic tag: it tells the browser and screen readers \"these are navigation links\"." },
      { q: "Which tag marks text as important?", options: ["<strong>", "<b>", "<i>"], answer: 0,
        why: "<strong> means important. <b> only makes text bold without extra meaning." },
      { q: "In a table, which tag is one row?", options: ["<td>", "<tr>", "<th>"], answer: 1,
        why: "<tr> = table row. <td> is a cell and <th> is a header cell." }
    ],
    "forms": [
      { q: "Which input type is best for an e-mail address?", options: ["type=\"text\"", "type=\"email\"", "type=\"mail\""], answer: 1,
        why: "type=\"email\" checks the format and shows the right keyboard on phones." },
      { q: "What does the required attribute do?", options: ["Makes the field bigger", "The form cannot be sent while the field is empty", "Hides the field"], answer: 1,
        why: "The browser stops the form and asks the user to fill in the field." },
      { q: "How do you connect a <label> to an input with id=\"name\"?", options: ["<label for=\"name\">", "<label id=\"name\">", "<label name=\"input\">"], answer: 0,
        why: "for=\"...\" must match the input's id. Clicking the label then moves to the field." }
    ],
    "advanced": [
      { q: "Which meta tag makes a page fit phone screens?", options: ["<meta charset=\"UTF-8\">", "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">", "<meta name=\"mobile\">"], answer: 1,
        why: "The viewport meta tag tells phones to use the real screen width." },
      { q: "How do you write the symbol < as text in HTML?", options: ["&lt;", "&less;", "<<"], answer: 0,
        why: "&lt; is an entity. The browser shows it as < without starting a tag." },
      { q: "What helps people who use a screen reader the most?", options: ["Lots of colors", "Semantic tags and alt text", "Big images"], answer: 1,
        why: "Screen readers understand headings, landmarks like <nav> and <main>, and alt text." }
    ],
    "css-js": [
      { q: "Which line makes all paragraphs blue?", options: ["p { color: blue; }", "<p color=\"blue\">", "p = blue"], answer: 0,
        why: "CSS uses selector { property: value; }." },
      { q: "Which property adds space INSIDE a box, between the text and the border?", options: ["margin", "padding", "border"], answer: 1,
        why: "padding is the space inside. margin is the space outside the border." },
      { q: "How do you style <p class=\"note\"> in CSS?", options: [".note { }", "#note { }", "note { }"], answer: 0,
        why: "A class is selected with a dot: .note. An id uses #." }
    ]
  };

  /* -----------------------------
     HANDS-ON TASKS (check gets the parsed document and the raw code)
  ----------------------------- */
  const text = (el) => !!el && el.textContent.trim().length > 0;
  const TASKS = {
    "basics": {
      goal: "Write a heading with your name and a paragraph about your favourite hobby.",
      starter: "<!-- Write your heading and paragraph here -->\n",
      steps: [
        { label: "An <h1> heading with text", test: (d) => text(d.querySelector("h1")) },
        { label: "A <p> paragraph with text", test: (d) => text(d.querySelector("p")) }
      ]
    },
    "links-media": {
      goal: "Add a link to https://developer.mozilla.org and an image with alt text.",
      starter: "<!-- Add a link and an image -->\n",
      steps: [
        { label: "A link (<a>) with an href", test: (d) => !!d.querySelector("a[href]") && text(d.querySelector("a[href]")) },
        { label: "An image (<img>) with a src", test: (d) => !!d.querySelector("img[src]") },
        { label: "The image has alt text", test: (d) => { const i = d.querySelector("img"); return !!i && (i.getAttribute("alt") || "").trim().length > 0; } }
      ]
    },
    "tags": {
      goal: "Build a small page with <header>, <main> and <footer>. Make one word important with <strong>.",
      starter: "<header>\n  \n</header>\n",
      steps: [
        { label: "A <header>", test: (d) => !!d.querySelector("header") },
        { label: "A <main>", test: (d) => !!d.querySelector("main") },
        { label: "A <footer>", test: (d) => !!d.querySelector("footer") },
        { label: "A <strong> word", test: (d) => text(d.querySelector("strong")) }
      ]
    },
    "forms": {
      goal: "Make a form with a label, a required e-mail field and a button.",
      starter: "<form>\n  \n</form>\n",
      steps: [
        { label: "A <form>", test: (d) => !!d.querySelector("form") },
        { label: "An input with type=\"email\"", test: (d) => !!d.querySelector('input[type="email"]') },
        { label: "The e-mail field is required", test: (d) => !!d.querySelector('input[type="email"][required]') },
        { label: "A <label> connected with for=\"...\"", test: (d) => [...d.querySelectorAll("label[for]")].some((l) => d.getElementById(l.getAttribute("for"))) },
        { label: "A <button>", test: (d) => !!d.querySelector("button, input[type=submit]") }
      ]
    },
    "advanced": {
      goal: "Write the text \"5 < 10\" correctly using an entity, and add an image with good alt text.",
      starter: "<p>5 ... 10</p>\n",
      steps: [
        { label: "The text uses &lt; for <", test: (d, code) => /&lt;/.test(code) && /5\s*<\s*10/.test(d.body.textContent) },
        { label: "An image with alt text", test: (d) => { const i = d.querySelector("img"); return !!i && (i.getAttribute("alt") || "").trim().length > 2; } }
      ]
    },
    "css-js": {
      goal: "Style a card: give the heading a color, and give the card padding, a border and a background color.",
      starter: "<style>\n  h2 {  }\n  .card {  }\n</style>\n\n<div class=\"card\">\n  <h2>About me</h2>\n  <p>I like football and music.</p>\n</div>\n",
      steps: [
        { label: "The heading has a color", test: (d, code) => /h[1-6][^{]*\{[^}]*color\s*:/i.test(code) },
        { label: ".card has padding", test: (d, code) => /\.card\s*\{[^}]*padding\s*:/i.test(code) },
        { label: ".card has a border", test: (d, code) => /\.card\s*\{[^}]*border\s*:/i.test(code) },
        { label: "A background-color is used", test: (d, code) => /background(-color)?\s*:/i.test(code) }
      ]
    }
  };

  const TASKS_KEY = "htmlmaster_lesson_tasks";
  function tasksDone() {
    try { return JSON.parse(localStorage.getItem(TASKS_KEY)) || []; } catch { return []; }
  }

  /* -----------------------------
     QUIZ UI (inside the lesson-done card)
  ----------------------------- */
  function renderQuiz(card, id, onPass) {
    const questions = QUIZ[id];
    card.classList.add("lc-quiz-card");
    card.innerHTML = `
      <div class="lc-quiz-head">
        <div class="lesson-done-icon"><i class="fas fa-flag-checkered"></i></div>
        <div class="lesson-done-text"><strong>Check yourself</strong>
          <span>Answer all ${questions.length} questions correctly to finish the lesson.</span></div>
      </div>
      <ol class="lc-questions">
        ${questions.map((q, qi) => `
          <li class="lc-q" data-q="${qi}">
            <p class="lc-q-text">${esc(q.q)}</p>
            <div class="lc-options">
              ${q.options.map((o, oi) => `
                <label class="lc-option"><input type="radio" name="lc-${id}-${qi}" value="${oi}"> <span>${esc(o)}</span></label>`).join("")}
            </div>
            <p class="lc-feedback" hidden></p>
          </li>`).join("")}
      </ol>
      <button type="button" class="lesson-done-btn lc-check"><i class="fas fa-check"></i> Check my answers <small>+20 XP</small></button>
      <p class="lc-result" aria-live="polite"></p>`;

    // Changing an answer clears its old feedback
    card.querySelectorAll(".lc-q").forEach((li) => {
      li.addEventListener("change", () => {
        li.classList.remove("is-right", "is-wrong");
        li.querySelector(".lc-feedback").hidden = true;
      });
    });

    card.querySelector(".lc-check").addEventListener("click", () => {
      let right = 0, unanswered = 0;
      questions.forEach((q, qi) => {
        const li = card.querySelector(`.lc-q[data-q="${qi}"]`);
        const picked = li.querySelector("input:checked");
        const fb = li.querySelector(".lc-feedback");
        li.classList.remove("is-right", "is-wrong");
        if (!picked) { unanswered++; fb.hidden = true; return; }
        const ok = Number(picked.value) === q.answer;
        if (ok) right++;
        li.classList.add(ok ? "is-right" : "is-wrong");
        fb.hidden = false;
        fb.innerHTML = ok
          ? `<i class="fas fa-check-circle"></i> Right! ${esc(q.why)}`
          : `<i class="fas fa-times-circle"></i> Not quite. Read the question again and try another answer.`;
      });
      const result = card.querySelector(".lc-result");
      if (unanswered) {
        result.textContent = `Answer every question first (${unanswered} left).`;
      } else if (right === questions.length) {
        result.textContent = "";
        onPass();
      } else {
        result.textContent = `${right} of ${questions.length} right. Change the red answers and check again.`;
      }
    });
  }

  /* -----------------------------
     TASK UI (placed above the quiz card)
  ----------------------------- */
  function renderTask(card, id) {
    const task = TASKS[id];
    if (!task || document.querySelector(".lc-task")) return;
    const storeKey = `htmlmaster_task_code_${id}`;
    let saved = null;
    try { saved = localStorage.getItem(storeKey); } catch { /* ignore */ }

    const box = document.createElement("section");
    box.className = "lc-task";
    box.innerHTML = `
      <div class="lc-task-head">
        <h3><i class="fas fa-pencil-alt"></i> Your turn: practice task</h3>
        <span class="lc-task-badge"${tasksDone().includes(id) ? "" : " hidden"}><i class="fas fa-check"></i> Done</span>
      </div>
      <p class="lc-task-goal">${esc(task.goal)}</p>
      <div class="lc-task-grid">
        <div class="lc-task-code">
          <div class="lc-task-label">Your code</div>
          <textarea spellcheck="false" autocapitalize="off" autocomplete="off" aria-label="Your code for the task"></textarea>
        </div>
        <div class="lc-task-preview">
          <div class="lc-task-label">Result</div>
          <iframe title="Result of your task" sandbox="allow-scripts allow-modals"></iframe>
        </div>
      </div>
      <ul class="lc-steps">${task.steps.map((s, i) => `<li data-step="${i}"><i class="far fa-circle"></i> ${esc(s.label)}</li>`).join("")}</ul>
      <div class="lc-task-actions">
        <button type="button" class="lesson-done-btn lc-task-check"><i class="fas fa-play"></i> Check my code <small>+10 XP</small></button>
        <button type="button" class="lc-task-reset"><i class="fas fa-undo"></i> Start again</button>
      </div>
      <p class="lc-task-result" aria-live="polite"></p>`;

    const ta = box.querySelector("textarea");
    const frame = box.querySelector("iframe");
    ta.value = saved && saved.trim() ? saved : task.starter;

    let timer = null;
    const preview = () => { frame.srcdoc = ta.value; };
    ta.addEventListener("input", () => {
      try { localStorage.setItem(storeKey, ta.value); } catch { /* ignore */ }
      clearTimeout(timer);
      timer = setTimeout(preview, 300);
    });
    // Tab inserts spaces instead of leaving the box
    ta.addEventListener("keydown", (e) => {
      if (e.key === "Tab" && !e.shiftKey) {
        e.preventDefault();
        ta.setRangeText("  ", ta.selectionStart, ta.selectionEnd, "end");
      }
    });
    preview();

    box.querySelector(".lc-task-reset").addEventListener("click", () => {
      ta.value = task.starter;
      ta.dispatchEvent(new Event("input"));
      box.querySelectorAll(".lc-steps li").forEach((li) => { li.className = ""; li.querySelector("i").className = "far fa-circle"; });
      box.querySelector(".lc-task-result").textContent = "";
    });

    box.querySelector(".lc-task-check").addEventListener("click", () => {
      preview();
      const doc = new DOMParser().parseFromString(ta.value, "text/html");
      let ok = 0;
      task.steps.forEach((s, i) => {
        let pass = false;
        try { pass = s.test(doc, ta.value); } catch { pass = false; }
        if (pass) ok++;
        const li = box.querySelector(`.lc-steps li[data-step="${i}"]`);
        li.className = pass ? "is-right" : "is-wrong";
        li.querySelector("i").className = pass ? "fas fa-check-circle" : "fas fa-times-circle";
      });
      const result = box.querySelector(".lc-task-result");
      if (ok === task.steps.length) {
        result.textContent = "Great work! Every step is done.";
        const done = tasksDone();
        if (!done.includes(id)) {
          done.push(id);
          try { localStorage.setItem(TASKS_KEY, JSON.stringify(done)); } catch { /* ignore */ }
          window.HTMLMaster?.awardXP?.(10, "Lesson task");
          if (typeof showToast === "function") showToast("🛠️ Practice task done! +10 XP");
        }
        box.querySelector(".lc-task-badge").hidden = false;
      } else {
        result.textContent = `${ok} of ${task.steps.length} steps done. Look at the red steps and try again.`;
      }
    });

    card.insertAdjacentElement("beforebegin", box);
  }

  window.HMLessonCheck = {
    hasQuiz: (id) => !!QUIZ[id],
    renderQuiz,
    renderTask,
    tasksDone
  };
})();
