/*
  HTML Master Quiz (Upgraded)
  - Question bank + random selection
  - Instant feedback + explanation
  - Streak bonus + XP awards via window.HTMLMaster (script.js)
*/

document.addEventListener('DOMContentLoaded', function () {
  const BANK = [
    {
      q: "What does HTML stand for?",
      o: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"],
      a: 0,
      why: "HTML stands for Hyper Text Markup Language — the standard markup language for web pages."
    },
    {
      q: "Which tag creates a hyperlink?",
      o: ["<link>", "<a>", "<href>", "<hyper>"],
      a: 1,
      why: "Use <a href=...> for links. <link> is for relationships in <head>."
    },
    {
      q: "Which element is the largest heading?",
      o: ["<head>", "<h1>", "<header>", "<h6>"],
      a: 1,
      why: "<h1> is the largest heading; <h6> is the smallest."
    },
    {
      q: "Which attribute is used for inline CSS?",
      o: ["class", "style", "styles", "font"],
      a: 1,
      why: "The style attribute applies CSS directly to an element."
    },
    {
      q: "Which element indicates strong importance?",
      o: ["<strong>", "<b>", "<i>", "<important>"],
      a: 0,
      why: "<strong> carries semantic importance (screen readers announce it differently)."
    },
    {
      q: "What does the alt attribute do on <img>?",
      o: ["Adds a tooltip", "Provides alternative text", "Makes the image larger", "Links the image"],
      a: 1,
      why: "alt provides text for accessibility and when the image fails to load."
    },
    {
      q: "Which tag is best for navigation links?",
      o: ["<nav>", "<div>", "<section>", "<aside>"],
      a: 0,
      why: "<nav> is semantic: it tells browsers and assistive tech that this is navigation."
    },
    {
      q: "Which is a valid HTML5 doctype?",
      o: ["<!DOCTYPE html>", "<!DOCTYPE HTML5>", "<!DOCTYPE web>", "<!DOCTYPE document>"],
      a: 0,
      why: "HTML5 uses a short doctype: <!DOCTYPE html>."
    },
    {
      q: "Which input type helps validate email format?",
      o: ["type='text'", "type='mail'", "type='email'", "type='validate'"],
      a: 2,
      why: "type='email' enables basic email format validation."
    },
    {
      q: "Which tag is used for an ordered list?",
      o: ["<ul>", "<ol>", "<li>", "<list>"],
      a: 1,
      why: "<ol> is ordered (1,2,3). <ul> is unordered (bullets)."
    },
    {
      q: "Which attribute must be unique on the page?",
      o: ["class", "id", "name", "style"],
      a: 1,
      why: "id values must be unique within a document."
    },
    {
      q: "What does <label for='x'> connect to?",
      o: ["Any element with class x", "The element with id='x'", "The element with name='x'", "The next input"],
      a: 1,
      why: "label[for] must match an input id to improve usability and accessibility."
    },
    {
      q: "Which tag is inline by default?",
      o: ["<div>", "<p>", "<span>", "<section>"],
      a: 2,
      why: "<span> is inline. <div>/<p>/<section> are block-level by default."
    },
    {
      q: "Which is a semantic element?",
      o: ["<div>", "<span>", "<header>", "<b>"],
      a: 2,
      why: "<header> communicates meaning; div/span are generic containers."
    },
    {
      q: "What does 'defer' do on a <script> tag?",
      o: ["Runs script immediately", "Delays until after HTML is parsed", "Blocks rendering forever", "Only runs on mobile"],
      a: 1,
      why: "defer downloads in parallel but executes after HTML parsing is complete."
    },
    {
      q: "Which element is best for main page content?",
      o: ["<main>", "<article>", "<div>", "<footer>"],
      a: 0,
      why: "<main> represents the dominant content of the <body> (one per page)."
    },
    {
      q: "Which attribute opens a link in a new tab?",
      o: ["newtab", "open", "target='_blank'", "rel='blank'"],
      a: 2,
      why: "Use target='_blank' (and ideally rel='noopener noreferrer' for security)."
    },
    {
      q: "Which tag embeds audio?",
      o: ["<sound>", "<audio>", "<music>", "<mp3>"],
      a: 1,
      why: "<audio> is the native HTML element for audio playback."
    },
    {
      q: "What does ARIA stand for?",
      o: ["Accessible Rich Internet Applications", "Advanced Responsive Interface Attributes", "Automatic Reader Integration API", "Accessible Remote Interaction"],
      a: 0,
      why: "ARIA = Accessible Rich Internet Applications — attributes that help accessibility when native semantics aren't enough."
    },
    {
      q: "Which is best for a page footer?",
      o: ["<footer>", "<bottom>", "<end>", "<section class='footer'>"],
      a: 0,
      why: "Use <footer> for semantic footers; a class-based footer is still valid but less semantic."
    }
  ];

  // ---- Config ----
  const QUIZ_LEN = 8; // per attempt
  const XP_PER_CORRECT = 20;
  const XP_FINISH_BONUS = 40;
  const STREAK_BONUS = 15; // awarded on 3+ streak milestones

  // ---- DOM ----
  const questionContainer = document.getElementById('questionContainer');
  const optionsContainer = document.getElementById('optionsContainer');
  const currentQuestionEl = document.getElementById('currentQuestion');
  const totalQuestionsEl = document.getElementById('totalQuestions');
  const scoreEl = document.getElementById('score');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const submitBtn = document.getElementById('submitBtn');

  if (!questionContainer || !optionsContainer || !currentQuestionEl || !totalQuestionsEl) {
    return;
  }

  // Questions mention tags like <img> and <script>; show them as text, not markup
  const escapeHTML = (s) => String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  // ---- State ----
  const pickRandom = (arr, n) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, Math.min(n, copy.length));
  };

  const quiz = pickRandom(BANK, QUIZ_LEN);
  let i = 0;
  let score = 0;
  let streak = 0;
  let answered = new Array(quiz.length).fill(null);
  let locked = new Array(quiz.length).fill(false);

  totalQuestionsEl.textContent = String(quiz.length);

  function setButtons() {
    if (prevBtn) prevBtn.disabled = i === 0;
    if (nextBtn) nextBtn.disabled = i === quiz.length - 1;

    const isLast = i === quiz.length - 1;
    if (submitBtn) submitBtn.style.display = isLast ? 'block' : 'none';
    if (nextBtn) nextBtn.style.display = isLast ? 'none' : 'block';
  }

  function render() {
    const q = quiz[i];
    currentQuestionEl.textContent = String(i + 1);

    const ans = answered[i];
    const isLocked = locked[i];

    const streakText = streak > 0 ? `<span style="margin-left:10px; font-weight:800;">🔥 Streak: ${streak}</span>` : '';

    questionContainer.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
        <p style="margin:0; font-weight:800;">${escapeHTML(q.q)}</p>
        <div style="color: var(--gray-color); font-weight:700;">Score: <span id="scoreInline">${score}</span>${streakText}</div>
      </div>
      ${isLocked ? `
        <div class="explanation" style="margin-top: 14px; padding: 12px; background: #f8f9fa; border-radius: 10px; border-left: 4px solid var(--primary-color);">
          <strong>Why:</strong> ${escapeHTML(q.why)}
        </div>
      ` : ''}
    `;

    optionsContainer.innerHTML = '';

    q.o.forEach((opt, idx) => {
      const div = document.createElement('div');
      div.className = 'quiz-option';
      div.style.cursor = isLocked ? 'default' : 'pointer';

      if (ans === idx) div.classList.add('selected');
      if (isLocked && idx === q.a) div.classList.add('correct');
      if (isLocked && ans === idx && ans !== q.a) div.classList.add('incorrect');

      div.innerHTML = `
        <input type="radio" name="q${i}" id="q${i}_${idx}" ${ans === idx ? 'checked' : ''} ${isLocked ? 'disabled' : ''} />
        <label for="q${i}_${idx}">${escapeHTML(opt)}</label>
      `;

      div.addEventListener('click', () => {
        if (isLocked) return;
        select(idx);
      });

      optionsContainer.appendChild(div);
    });

    if (scoreEl) scoreEl.textContent = String(score);
    setButtons();
  }

  function select(choice) {
    answered[i] = choice;
    locked[i] = true;

    const q = quiz[i];
    const correct = choice === q.a;

    if (correct) {
      score++;
      streak++;
      if (window.HTMLMaster?.awardXP) window.HTMLMaster.awardXP(XP_PER_CORRECT, 'Quiz correct');

      // Streak bonus every 3
      if (streak > 0 && streak % 3 === 0) {
        if (window.HTMLMaster?.awardXP) window.HTMLMaster.awardXP(STREAK_BONUS, `Streak x${streak}`);
        if (window.HTMLMaster?.grantBadge && streak === 3) window.HTMLMaster.grantBadge('streak-3', 'Hot Streak');
      }
    } else {
      streak = 0;
    }

    render();
  }

  function showResults() {
    const pct = Math.round((score / quiz.length) * 100);

    let msg = 'Keep going — re-try and beat your score!';
    if (pct >= 90) msg = 'Legendary! You are HTML-ready 🔥';
    else if (pct >= 75) msg = 'Great work! Strong fundamentals ✅';
    else if (pct >= 55) msg = 'Nice! Review a bit and try again.';

    // XP finish bonus
    if (window.HTMLMaster?.awardXP) window.HTMLMaster.awardXP(XP_FINISH_BONUS, 'Quiz completed');

    if (window.HTMLMaster?.grantBadge) {
      // Badge ids match BADGE_DEFS in arcade.html
      if (pct >= 80) window.HTMLMaster.grantBadge('quiz-80', 'Quiz 80%+');
      if (pct === 100) window.HTMLMaster.grantBadge('quiz-perfect', 'Perfect Quiz');
    }

    questionContainer.innerHTML = `
      <div style="text-align:center; padding: 40px 10px;">
        <h2 style="color: var(--primary-color); margin-bottom: 14px;">Quiz Completed!</h2>
        <div style="font-size: 3rem; color: var(--secondary-color); margin: 10px 0;">${score}/${quiz.length}</div>
        <div style="font-size: 1.5rem; color: var(--dark-color); margin-bottom: 12px;">${pct}%</div>
        <p style="color: var(--gray-color); margin-bottom: 22px;">${msg}</p>
        <div style="display:flex; flex-wrap:wrap; gap:10px; justify-content:center;">
          <button class="btn btn-primary" onclick="location.reload()"><i class="fas fa-redo"></i> Try Again</button>
          <a class="btn btn-secondary" href="arcade.html"><i class="fas fa-gamepad"></i> Play Arcade</a>
        </div>
      </div>
    `;

    optionsContainer.innerHTML = '';
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    if (submitBtn) submitBtn.style.display = 'none';
  }

  // ---- Wire buttons ----
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (i > 0) {
        i--;
        render();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (i < quiz.length - 1) {
        i++;
        render();
      }
    });
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const unanswered = answered.filter(v => v === null).length;
      if (unanswered > 0) {
        window.confirmButton(submitBtn, `${unanswered} unanswered – click again to submit`, showResults);
        return;
      }
      showResults();
    });
  }

  render();
});
