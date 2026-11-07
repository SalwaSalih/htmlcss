/* =========================================================
   HTML MASTER – MAIN SCRIPT
   Author: You 🙂
   Purpose: Navigation, Editor, Exercises, XP, Gamification
========================================================= */

/* -----------------------------
   GLOBAL STATE (XP SYSTEM)
----------------------------- */
const HM = {
  xp: Number(localStorage.getItem("hm_xp")) || 0,
  level: Number(localStorage.getItem("hm_level")) || 1,
  xpPerLevel: 100
};

function saveXP() {
  localStorage.setItem("hm_xp", HM.xp);
  localStorage.setItem("hm_level", HM.level);
}

function addXP(amount, reason = "") {
  HM.xp += amount;

  while (HM.xp >= HM.level * HM.xpPerLevel) {
    HM.xp -= HM.level * HM.xpPerLevel;
    HM.level++;
    showToast(`🎉 Level Up! You reached Level ${HM.level}`);
  }

  saveXP();
  updateXPHUD();
  initProgressBar();
}

function updateXPHUD() {
  const levelEl = document.querySelector("[data-hm-level]");
  const xpEl = document.querySelector("[data-hm-xp]");
  const barEl = document.querySelector("[data-hm-xpbar]");

  if (!levelEl || !xpEl || !barEl) return;

  levelEl.textContent = HM.level;
  xpEl.textContent = HM.xp;

  const percent = Math.min(
    100,
    (HM.xp / (HM.level * HM.xpPerLevel)) * 100
  );
  barEl.style.width = percent + "%";
}

/* -----------------------------
   BADGES
----------------------------- */
function getBadges() {
  try {
    return JSON.parse(localStorage.getItem("htmlmaster_badges")) || [];
  } catch {
    return [];
  }
}

function grantBadge(id, label = id) {
  const badges = getBadges();
  if (badges.includes(id)) return;

  badges.push(id);
  localStorage.setItem("htmlmaster_badges", JSON.stringify(badges));
  showToast(`🏅 Badge unlocked: ${label}`);
}

/* -----------------------------
   LESSON TRACKING (visiting a lesson page counts it)
----------------------------- */
/* -----------------------------
   LESSON PROGRESS
   A lesson counts as done only when the student presses
   "I understand this lesson" at the end of it (not just by opening it).
----------------------------- */
const LESSONS = ["basics", "links-media", "tags", "forms", "advanced", "css-js"];
const LESSON_TITLES = {
  "basics": "HTML Basics",
  "links-media": "Links & Media",
  "tags": "HTML Tags",
  "forms": "Forms & Validation",
  "advanced": "HTML Advanced",
  "css-js": "CSS Basics"
};
const LESSONS_KEY = "htmlmaster_lessons_done";

function storageGet(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

function getCompletedLessons() {
  try {
    const list = JSON.parse(storageGet(LESSONS_KEY)) || [];
    return list.filter(id => LESSONS.includes(id));
  } catch {
    return [];
  }
}

function getNextLesson() {
  const done = getCompletedLessons();
  return LESSONS.find(id => !done.includes(id)) || null;
}

function currentLessonId() {
  const match = location.pathname.match(/\/lessons\/([\w-]+)\.html$/);
  return match && LESSONS.includes(match[1]) ? match[1] : null;
}

function completeLesson(id) {
  const done = getCompletedLessons();
  if (done.includes(id)) return false;

  done.push(id);
  try { localStorage.setItem(LESSONS_KEY, JSON.stringify(done)); } catch {}
  addXP(20, "Lesson completed");

  if (done.length >= 1) grantBadge("first-lesson", "First Lesson");
  if (done.length >= 5) grantBadge("five-lessons", "5 Lessons");
  if (done.length >= LESSONS.length) grantBadge("all-lessons", "Course Explorer");
  return true;
}

function resetProgress() {
  HM.xp = 0;
  HM.level = 1;
  saveXP();
  localStorage.removeItem("htmlmaster_badges");
  localStorage.removeItem("htmlmaster_completed_lessons");
  localStorage.removeItem(LESSONS_KEY);
  updateXPHUD();
  initProgressBar();
}

/* Path prefix to the site root ("" on index/arcade, "../" in lessons/ and exercises/) */
function rootPrefix() {
  return /\/(lessons|exercises)\/[^/]*$/.test(location.pathname) ? "../" : "";
}

/* -----------------------------
   PUBLIC API (used by quiz.js and arcade.html)
----------------------------- */
window.HTMLMaster = {
  awardXP: addXP,
  grantBadge,
  getBadges,
  reset: resetProgress,
  updateHUD: updateXPHUD,
  updateProgressUI: () => initProgressBar()
};

/* -----------------------------
   SIMPLE TOAST (NO LIBRARY)
----------------------------- */
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "hm-toast";
  toast.setAttribute("role", "status");
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

/* -----------------------------
   NAVIGATION (MOBILE)
----------------------------- */
function initNavigation() {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });
  }

  // Mobile dropdowns
  document.querySelectorAll(".dropdown > a").forEach(link => {
    link.addEventListener("click", e => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const menu = link.nextElementSibling;
        if (menu) {
          menu.style.display =
            menu.style.display === "grid" ? "none" : "grid";
        }
      }
    });
  });
}

/* -----------------------------
   HTML EDITOR
   Run, auto-save and restore are handled by editor.js
----------------------------- */

/* -----------------------------
   LOAD EXAMPLE FROM REFERENCE
----------------------------- */
function loadExampleFromReference() {
  const editor = document.getElementById("htmlCode");
  if (!editor) return;

  const example = localStorage.getItem("tagExample");
  if (!example) return;

  // No confirm() here: HMEditor.setCode keeps Ctrl+Z, so the old code can be brought back
  const hadWork = editor.value.trim() && !window.HMEditor?.isStarter?.();
  if (window.HMEditor) window.HMEditor.setCode(example);
  else editor.value = example;
  localStorage.removeItem("tagExample");

  editor.scrollIntoView({ behavior: "smooth", block: "center" });
  showToast(hadWork ? "📘 Example loaded – press Ctrl+Z to get your old code back" : "📘 Example loaded from Reference");
}

/* -----------------------------
   EXERCISES (REAL PAGES)
----------------------------- */
window.startExercise = function (id) {
  addXP(15, "Start Exercise");

  const pages = {
    1: "exercises/exercise1.html",
    2: "exercises/exercise2.html",
    3: "exercises/exercise3.html"
  };

  if (pages[id]) {
    window.location.href = pages[id];
  }
};

/* -----------------------------
   PROGRESS BAR
----------------------------- */
function initProgressBar() {
  const bar = document.querySelector(".progress-fill");
  const percent = document.querySelector(".progress-percent");
  if (!bar || !percent) return;

  const done = getCompletedLessons();
  const value = Math.round((done.length / LESSONS.length) * 100);
  bar.style.width = value + "%";
  percent.textContent = value + "%";

  const doneEl = document.querySelector("[data-lessons-done]");
  if (doneEl) doneEl.textContent = `${done.length} of ${LESSONS.length} lessons completed`;

  const nextEl = document.querySelector("[data-next-lesson]");
  if (nextEl) {
    const next = getNextLesson();
    nextEl.innerHTML = next
      ? `<a class="continue-link" href="${rootPrefix()}lessons/${next}.html">${done.length ? "Continue" : "Start"}: ${LESSON_TITLES[next]} <i class="fas fa-arrow-right"></i></a>`
      : `<a class="continue-link" href="${rootPrefix()}practice.html#quiz">All lessons done! Take the quiz <i class="fas fa-arrow-right"></i></a>`;
  }
}

/* -----------------------------
   MOBILE BOTTOM NAVIGATION (app-style tab bar, shown only on phones via CSS)
----------------------------- */
function initBottomNav() {
  if (document.querySelector(".bottom-nav")) return;
  const r = rootPrefix();
  const page = location.pathname.split("/").pop() || "index.html";
  // Section links stay on the page only on the home page itself (arcade, examples… link back to it)
  const onHome = !r && page === "index.html";
  const home = onHome ? "" : r + "index.html";
  const inLessons = /\/lessons\//.test(location.pathname);
  const inExercises = /\/exercises\//.test(location.pathname);

  const items = [
    { href: home + "#home", icon: "fa-home", label: "Home", key: "home" },
    { href: home + "#examples", icon: "fa-laptop-code", label: "Editor", key: "examples" },
    { href: home + "#lessons", icon: "fa-graduation-cap", label: "Lessons", key: "lessons" },
    { href: r + "practice.html", icon: "fa-dumbbell", label: "Practice", key: "exercises" },
    { href: r + "arcade.html", icon: "fa-gamepad", label: "Arcade", key: "arcade" }
  ];

  let active = "home";
  if (inLessons) active = "lessons";
  else if (inExercises) active = "exercises";
  else if (page === "arcade.html") active = "arcade";
  else if (page === "examples.html") active = "examples";
  else if (page === "tutorials.html") active = "lessons";
  else if (page === "practice.html") active = "exercises";

  const nav = document.createElement("nav");
  nav.className = "bottom-nav";
  nav.setAttribute("aria-label", "Main");
  nav.innerHTML = items.map(it => `
    <a href="${it.href}" data-key="${it.key}"${it.key === active ? ' class="active" aria-current="page"' : ""}>
      <i class="fas ${it.icon}" aria-hidden="true"></i><span>${it.label}</span>
    </a>`).join("");
  document.body.appendChild(nav);
  document.body.classList.add("has-bottom-nav");

  // On the home page, highlight the tab for the section you are reading
  const isHome = onHome;
  if (isHome && "IntersectionObserver" in window) {
    const links = nav.querySelectorAll("a");
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        links.forEach(a => {
          const on = a.dataset.key === e.target.id;
          a.classList.toggle("active", on);
          if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["home", "lessons", "examples"].forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
  }

  // Close the hamburger menu when a link inside it is tapped
  document.querySelectorAll(".nav-menu a[href]:not([href='#'])").forEach(a => {
    a.addEventListener("click", () => document.querySelector(".nav-menu")?.classList.remove("active"));
  });
}

/* -----------------------------
   LESSON PAGES: goals, reading progress, "I understand" button
----------------------------- */
function initLessonPage() {
  const id = currentLessonId();
  const content = document.querySelector(".lesson-content");
  if (!id || !content) return;

  const index = LESSONS.indexOf(id);

  // Reading progress bar under the navbar
  const bar = document.createElement("div");
  bar.className = "reading-progress";
  bar.innerHTML = "<div></div>";
  document.body.appendChild(bar);
  const fill = bar.firstElementChild;
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    fill.style.width = (max > 0 ? Math.min(100, (scrollY / max) * 100) : 0) + "%";
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // "In this lesson you will learn" box, built from the lesson's contents list
  const h1 = content.querySelector("h1");
  const topics = [...document.querySelectorAll(".lesson-nav a")].map(a => a.textContent.trim()).filter(Boolean);
  const words = content.textContent.trim().split(/\s+/).length;
  const minutes = Math.max(3, Math.round(words / 150));
  if (h1 && !content.querySelector(".lesson-goals")) {
    const goals = document.createElement("div");
    goals.className = "lesson-goals";
    goals.innerHTML = `
      <div class="lesson-goals-meta">
        <span><i class="fas fa-layer-group"></i> Lesson ${index + 1} of ${LESSONS.length}</span>
        <span><i class="far fa-clock"></i> About ${minutes} min</span>
      </div>
      ${topics.length ? `<h3><i class="fas fa-bullseye"></i> In this lesson you will learn</h3>
      <ul>${topics.map(t => `<li>${t.replace(/</g, "&lt;")}</li>`).join("")}</ul>` : ""}
      <p class="lesson-goals-tip"><i class="fas fa-lightbulb"></i> Tip: try every example yourself. Change the code and see what happens.</p>`;
    // Place after the subtitle paragraph if there is one
    const after = h1.nextElementSibling && h1.nextElementSibling.tagName === "P" ? h1.nextElementSibling : h1;
    after.insertAdjacentElement("afterend", goals);
  }

  // "I understand this lesson" card before the previous/next buttons
  const navRow = content.querySelector(".lesson-navigation");
  const card = document.createElement("div");
  card.className = "lesson-done-card";
  const next = LESSONS[index + 1];
  const render = () => {
    const isDone = getCompletedLessons().includes(id);
    card.classList.toggle("is-done", isDone);
    card.classList.remove("lc-quiz-card");
    card.innerHTML = isDone
      ? `<div class="lesson-done-icon"><i class="fas fa-check"></i></div>
         <div class="lesson-done-text"><strong>Lesson completed!</strong>
         <span>${next ? `Ready for the next step: <b>${LESSON_TITLES[next]}</b>.` : "You finished every lesson. Test yourself in the quiz!"}</span></div>
         <a class="lesson-done-btn" href="${next ? next + ".html" : "../practice.html#quiz"}">${next ? "Next lesson" : "Take the quiz"} <i class="fas fa-arrow-right"></i></a>`
      : `<div class="lesson-done-icon"><i class="fas fa-flag-checkered"></i></div>
         <div class="lesson-done-text"><strong>Finished reading?</strong>
         <span>Check yourself: can you explain the main ideas to a classmate? Then mark the lesson as done.</span></div>
         <button type="button" class="lesson-done-btn"><i class="fas fa-check"></i> I understand this lesson <small>+20 XP</small></button>`;
    // With lesson-check.js loaded, the student must pass a short quiz first
    if (!isDone && window.HMLessonCheck?.hasQuiz(id)) {
      window.HMLessonCheck.renderQuiz(card, id, () => {
        if (completeLesson(id)) showToast(`✅ ${LESSON_TITLES[id]} completed! +20 XP`);
        render();
      });
      return;
    }
    const btn = card.querySelector("button");
    if (btn) btn.addEventListener("click", () => {
      if (completeLesson(id)) showToast(`✅ ${LESSON_TITLES[id]} completed! +20 XP`);
      render();
    });
  };
  render();
  if (navRow) navRow.insertAdjacentElement("beforebegin", card);
  else content.appendChild(card);

  // Optional hands-on task just above the quiz (lesson-check.js)
  window.HMLessonCheck?.renderTask?.(card, id);

  // Mobile: keep the active "contents" chip visible in the swipeable bar
  const navList = document.querySelector(".lesson-sidebar .lesson-nav");
  if (navList) {
    let last = null;
    addEventListener("scroll", () => {
      const a = navList.querySelector("a.active");
      if (a && a !== last && navList.scrollWidth > navList.clientWidth) {
        last = a;
        navList.scrollTo({ left: a.offsetLeft - navList.clientWidth / 2 + a.offsetWidth / 2, behavior: "smooth" });
      }
    }, { passive: true });
  }
}

/* -----------------------------
   HOME PAGE: learning path status, certificate checklist, mobile tidy-up
----------------------------- */
function initHomePage() {
  const done = getCompletedLessons();
  const next = getNextLesson();

  // Learning path cards: show done / next
  document.querySelectorAll(".learning-path .lesson-card").forEach(card => {
    const link = card.querySelector(".lesson-btn");
    const m = link && link.getAttribute("href").match(/lessons\/([\w-]+)\.html/);
    if (!m) return;
    const id = m[1];
    card.classList.remove("is-done", "is-next");
    if (done.includes(id)) {
      card.classList.add("is-done");
      link.innerHTML = '<i class="fas fa-redo"></i> Review';
    } else if (id === next) {
      card.classList.add("is-next");
      link.innerHTML = (done.length ? "Continue" : "Start here") + ' <i class="fas fa-arrow-right"></i>';
    } else {
      link.textContent = "Open lesson";
    }
  });

  // Certificate checklist from real progress
  const items = document.querySelectorAll(".certificate-progress .progress-item");
  if (items.length === 3) {
    const exercisesDone = [1, 2, 3].filter(n => storageGet(`exercise${n}_completed`) === "true").length;
    const states = [
      done.length === LESSONS.length,
      getBadges().includes("quiz-80"),
      exercisesDone === 3
    ];
    const labels = [
      `Complete Lessons (${done.length}/${LESSONS.length})`,
      "Pass the Quiz (80%+)",
      `Finish Exercises (${exercisesDone}/3)`
    ];
    items.forEach((item, i) => {
      item.classList.toggle("is-done", states[i]);
      item.querySelector("i").className = states[i] ? "fas fa-check-circle" : "far fa-circle";
      item.querySelector("span").textContent = labels[i];
    });
  }

  // Exercise cards: show which ones are done
  document.querySelectorAll(".exercise-card").forEach((card, i) => {
    if (storageGet(`exercise${i + 1}_completed`) === "true") {
      card.classList.add("is-done");
      const btn = card.querySelector(".btn-small");
      if (btn) btn.innerHTML = '<i class="fas fa-check"></i> Done – try again';
    }
  });


  // Phones: long lists become tap-to-open cards so the page is not endless
  const mobile = matchMedia("(max-width: 768px)");
  document.querySelectorAll(".category-card, .resource-card, .cheatsheet-category").forEach(card => {
    const head = card.querySelector("h3");
    if (!head || card.dataset.collapsible) return;
    card.dataset.collapsible = "1";
    head.setAttribute("role", "button");
    head.setAttribute("tabindex", "0");
    const toggle = () => {
      if (!mobile.matches) return;
      const open = card.classList.toggle("is-open");
      head.setAttribute("aria-expanded", open);
    };
    head.addEventListener("click", toggle);
    head.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });
    head.setAttribute("aria-expanded", "false");
  });

}

/* -----------------------------
   PHONES: every code box gets the same app-style layout as the main
   editor – a Code / Result switch, and Run jumps to the result.
   (CSS in style.css, "mc-". Desktop is unchanged.)
----------------------------- */
function initMobileCodeBoxes() {
  const boxes = [];
  const add = (box, code, out, toResult = [], toCode = [], autoRun = true) => {
    if (box && code && out && !box.classList.contains("mc-box")) boxes.push({ box, code, out, toResult, toCode, autoRun });
  };

  // Lesson "try it" examples
  document.querySelectorAll(".interactive-example").forEach(ie =>
    add(ie, ie.querySelector(".example-code"), ie.querySelector(".example-output"), ie.querySelectorAll(".example-code button")));

  // Lesson practice task (lesson-check.js)
  document.querySelectorAll(".lc-task").forEach(t =>
    add(t.querySelector(".lc-task-grid"), t.querySelector(".lc-task-code"), t.querySelector(".lc-task-preview"),
        t.querySelectorAll(".lc-task-check"), t.querySelectorAll(".lc-task-reset"), false)); // preview is live already

  // Exercise pages with a preview
  document.querySelectorAll(".exercise-editor").forEach(ed =>
    add(ed.querySelector(".editor-body"), ed.querySelector(".code-editor-area"), ed.querySelector(".output-area"),
        ed.querySelectorAll(".editor-action-btn.run, .editor-action-btn.check"),
        ed.querySelectorAll(".editor-action-btn.reset, .editor-action-btn.solution")));

  // CSS editor (CSS Properties page)
  const ce = document.getElementById("cssEditor");
  if (ce) add(ce.querySelector(".ce-body"), ce.querySelector(".ce-files"), ce.querySelector(".ce-side"),
              ce.querySelectorAll("#ceRun"), ce.querySelectorAll("#ceReset"));

  boxes.forEach(({ box, code, out, toResult, toCode, autoRun }) => {
    box.classList.add("mc-box");
    code.classList.add("mc-code");
    out.classList.add("mc-result");

    const sw = document.createElement("div");
    sw.className = "mc-view";
    sw.setAttribute("role", "tablist");
    sw.setAttribute("aria-label", "Show code or result");
    sw.innerHTML = `
      <button type="button" role="tab" data-view="code" aria-selected="true"><i class="fas fa-code"></i> Code</button>
      <button type="button" role="tab" data-view="result" aria-selected="false"><i class="fas fa-eye"></i> Result</button>`;
    box.insertAdjacentElement("beforebegin", sw);

    const show = (view) => {
      box.classList.toggle("mc-show-result", view === "result");
      sw.querySelectorAll("button").forEach(b => b.setAttribute("aria-selected", String(b.dataset.view === view)));
    };
    sw.querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
      // Switching to Result runs the code first, like pressing Run
      if (b.dataset.view === "result" && autoRun && toResult[0]) toResult[0].click();
      show(b.dataset.view);
    }));
    // Let the page's own handler run first, then switch
    toResult.forEach(btn => btn.addEventListener("click", () => setTimeout(() => show("result"), 0)));
    toCode.forEach(btn => btn.addEventListener("click", () => setTimeout(() => show("code"), 0)));
  });
}

/* -----------------------------
   PHONES, HOME PAGE: the learning path is its own screen ("Lessons" tab).
   index.html#lessons shows only the path; any other address shows the
   rest of the home page without it. CSS does the hiding (phones only),
   so the desktop page is unchanged.
----------------------------- */
function initMobileLessonsView() {
  if (!document.getElementById("lessons") || !document.getElementById("examples")) return; // home page only
  const apply = () => document.body.classList.toggle("view-lessons", location.hash === "#lessons");
  addEventListener("hashchange", () => {
    apply();
    // The browser jumped while the target may still have been hidden: jump again now it is shown
    let target = null;
    try { target = location.hash && document.querySelector(location.hash); } catch { /* not a valid selector */ }
    requestAnimationFrame(() => (target ? target.scrollIntoView() : scrollTo(0, 0)));
  });
  apply();
}

/* -----------------------------
   INSTALL AS AN APP (PWA): service worker + "Install app" button
----------------------------- */
function initInstallApp() {
  const r = rootPrefix();
  if ("serviceWorker" in navigator && /^https:|^http:\/\/(localhost|127\.0\.0\.1)/.test(location.href)) {
    navigator.serviceWorker.register(r + "sw.js").catch(() => { /* offline support is optional */ });
  }

  const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  const slot = document.querySelector("[data-install-app]");
  if (!slot || standalone) return;

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  let deferred = null;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "install-app-btn";
  btn.innerHTML = '<i class="fas fa-mobile-alt"></i> Install the app';

  btn.addEventListener("click", async () => {
    if (deferred) {
      deferred.prompt();
      try { await deferred.userChoice; } catch { /* ignore */ }
      deferred = null;
      btn.hidden = true;
    } else if (isIOS) {
      showToast("On iPhone/iPad: tap the Share button, then \"Add to Home Screen\"");
    } else {
      showToast("Open the browser menu (⋮) and choose \"Install app\" or \"Add to Home screen\"");
    }
  });

  // Chrome / Edge / Android: show the button when the browser allows installing
  addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferred = e;
    btn.hidden = false;
  });
  addEventListener("appinstalled", () => { btn.hidden = true; showToast("✅ App installed! Find ROJ Institute on your home screen."); });

  // iPhone has no install event, so show the button with instructions there
  btn.hidden = !isIOS;
  slot.appendChild(btn);
}

/* -----------------------------
   INIT EVERYTHING
----------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  loadExampleFromReference();
  initProgressBar();
  updateXPHUD();
  initBottomNav();
  initLessonPage();
  initHomePage();
  initMobileCodeBoxes();
  initInstallApp();
  initMobileLessonsView();
});
