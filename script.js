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
const LESSONS = ["basics", "links-media", "tags", "forms", "advanced", "css-js", "apis"];

function getCompletedLessons() {
  try {
    return JSON.parse(localStorage.getItem("htmlmaster_completed_lessons")) || [];
  } catch {
    return [];
  }
}

function trackLessonVisit() {
  const match = location.pathname.match(/\/lessons\/([\w-]+)\.html$/);
  if (!match || !LESSONS.includes(match[1])) return;

  const done = getCompletedLessons();
  if (done.includes(match[1])) return;

  done.push(match[1]);
  localStorage.setItem("htmlmaster_completed_lessons", JSON.stringify(done));

  if (done.length >= 1) grantBadge("first-lesson", "First Lesson");
  if (done.length >= 5) grantBadge("five-lessons", "5 Lessons");
  if (done.length >= LESSONS.length) grantBadge("all-lessons", "Course Explorer");
}

function resetProgress() {
  HM.xp = 0;
  HM.level = 1;
  saveXP();
  localStorage.removeItem("htmlmaster_badges");
  localStorage.removeItem("htmlmaster_completed_lessons");
  updateXPHUD();
  initProgressBar();
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
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: #2ecc71;
    color: white;
    padding: 12px 18px;
    border-radius: 6px;
    font-size: 14px;
    z-index: 9999;
    box-shadow: 0 6px 20px rgba(0,0,0,.2);
  `;
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

  const value = Math.min(100, HM.level * 10);
  bar.style.width = value + "%";
  percent.textContent = value + "%";
}

/* -----------------------------
   INIT EVERYTHING
----------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  loadExampleFromReference();
  initProgressBar();
  updateXPHUD();
  trackLessonVisit();
});
