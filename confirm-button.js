/* =========================================================
   HTML MASTER – "ARE YOU SURE?" ON THE BUTTON ITSELF
   confirmButton(button, question, action)
     1st click: the button asks the question for 3 seconds
     2nd click: runs the action
   Used instead of confirm(), which browsers and embedded previews
   can block – it then returns false at once and nothing happens.
========================================================= */

(function () {
  const ORIGINAL = new WeakMap();
  const TIMERS = new WeakMap();

  function restore(button) {
    clearTimeout(TIMERS.get(button));
    if (ORIGINAL.has(button)) button.innerHTML = ORIGINAL.get(button);
    ORIGINAL.delete(button);
    button.classList.remove("is-confirming");
  }

  window.confirmButton = function (button, question, action) {
    if (!button) { action(); return; }

    if (ORIGINAL.has(button)) {
      restore(button);
      action();
      return;
    }

    ORIGINAL.set(button, button.innerHTML);
    button.classList.add("is-confirming");
    button.innerHTML = `<i class="fas fa-question-circle"></i> ${question}`;
    TIMERS.set(button, setTimeout(() => restore(button), 3000));
  };
})();
