/* =========================================================
   ROJ INSTITUTE – PROGRESS REPORT (practice.html)
   Progress is only saved in this browser, so the teacher cannot
   see it. This report lets the student show it: on screen,
   printed, or saved as a PDF from the print dialog.
   Uses data saved by script.js, lesson-check.js, quiz.js and
   the exercise pages. Styles: style.css ("pr-").
========================================================= */

(function () {
  const NAME_KEY = "htmlmaster_student_name";
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const read = (key, fallback) => {
    try { const v = JSON.parse(localStorage.getItem(key)); return v == null ? fallback : v; } catch { return fallback; }
  };
  const get = (key) => { try { return localStorage.getItem(key); } catch { return null; } };

  function collect() {
    const lessonsDone = read("htmlmaster_lessons_done", []);
    const tasksDone = read("htmlmaster_lesson_tasks", []);
    const badges = read("htmlmaster_badges", []);
    const exercises = [1, 2, 3].map((n) => get(`exercise${n}_completed`) === "true");
    return {
      lessons: LESSONS.map((id) => ({ id, title: LESSON_TITLES[id], done: lessonsDone.includes(id), task: tasksDone.includes(id) })),
      exercises,
      quizPassed: badges.includes("quiz-80"),
      quizPerfect: badges.includes("quiz-perfect"),
      level: Number(get("hm_level")) || 1,
      xp: Number(get("hm_xp")) || 0,
      badges: badges.length
    };
  }

  function open() {
    const d = collect();
    const lessonsCount = d.lessons.filter((l) => l.done).length;
    const tasksCount = d.lessons.filter((l) => l.task).length;
    const exCount = d.exercises.filter(Boolean).length;
    const certificate = lessonsCount === d.lessons.length && d.quizPassed && exCount === 3;
    const exNames = ["Create Your First Page", "Build a Form", "Responsive Layout"];
    const date = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
    const name = get(NAME_KEY) || "";

    const overlay = document.createElement("div");
    overlay.className = "pr-overlay";
    overlay.innerHTML = `
      <div class="pr-dialog" role="dialog" aria-modal="true" aria-labelledby="prTitle">
        <div class="pr-report">
          <div class="pr-top">
            <img src="images/roj-logo.png" alt="" class="pr-logo">
            <div>
              <h2 id="prTitle">Progress Report – HTML</h2>
              <p class="pr-date">ROJ Institute · ${esc(date)}</p>
            </div>
          </div>

          <label class="pr-name">Student name
            <input type="text" id="prName" value="${esc(name)}" placeholder="Write your name" autocomplete="name">
          </label>

          <div class="pr-stats">
            <div><strong>${lessonsCount}/${d.lessons.length}</strong><span>Lessons</span></div>
            <div><strong>${tasksCount}/${d.lessons.length}</strong><span>Practice tasks</span></div>
            <div><strong>${exCount}/3</strong><span>Exercises</span></div>
            <div><strong>${d.quizPassed ? "Passed" : "Not yet"}</strong><span>Quiz (80%+)</span></div>
            <div><strong>Level ${d.level}</strong><span>${d.badges} badge${d.badges === 1 ? "" : "s"}</span></div>
          </div>

          <table class="pr-table">
            <thead><tr><th>Lesson</th><th>Quiz</th><th>Task</th></tr></thead>
            <tbody>
              ${d.lessons.map((l, i) => `<tr>
                <td>${i + 1}. ${esc(l.title)}</td>
                <td>${l.done ? '<span class="pr-yes">✓ Done</span>' : '<span class="pr-no">–</span>'}</td>
                <td>${l.task ? '<span class="pr-yes">✓ Done</span>' : '<span class="pr-no">–</span>'}</td>
              </tr>`).join("")}
            </tbody>
          </table>

          <table class="pr-table">
            <thead><tr><th>Exercise</th><th colspan="2">Status</th></tr></thead>
            <tbody>
              ${exNames.map((n, i) => `<tr><td>${esc(n)}</td><td colspan="2">${d.exercises[i] ? '<span class="pr-yes">✓ Done</span>' : '<span class="pr-no">–</span>'}</td></tr>`).join("")}
            </tbody>
          </table>

          <p class="pr-cert ${certificate ? "is-yes" : ""}">
            ${certificate
              ? '<i class="fas fa-award"></i> All requirements done – ready for the certificate!'
              : `<i class="fas fa-route"></i> Certificate: finish all ${d.lessons.length} lessons, pass the quiz (80%+) and all 3 exercises.`}
          </p>
        </div>

        <div class="pr-actions">
          <button type="button" class="pr-btn pr-print"><i class="fas fa-print"></i> Print / Save as PDF</button>
          <button type="button" class="pr-btn pr-close">Close</button>
        </div>
      </div>`;

    const close = () => { overlay.remove(); document.body.classList.remove("pr-open"); document.removeEventListener("keydown", onKey); };
    const onKey = (e) => { if (e.key === "Escape") close(); };
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
    overlay.querySelector(".pr-close").addEventListener("click", close);
    overlay.querySelector(".pr-print").addEventListener("click", () => window.print());
    overlay.querySelector("#prName").addEventListener("input", (e) => {
      try { localStorage.setItem(NAME_KEY, e.target.value); } catch { /* ignore */ }
    });
    document.addEventListener("keydown", onKey);

    document.body.appendChild(overlay);
    document.body.classList.add("pr-open");
    overlay.querySelector(name ? ".pr-print" : "#prName").focus();
  }

  window.showProgressReport = open;
})();
