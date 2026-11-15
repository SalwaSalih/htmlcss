/* =========================================================
   SEND TO TEACHER
   ---------------------------------------------------------
   The student's code is packed into the link itself
   (…/index.html#share=…), so nothing is stored on a server.
   "Send to teacher" opens the teacher's Google Form with the
   name and link filled in (set in teacher-config.js).
   Opening a #share= link shows that code without touching the
   viewer's own saved code.
   Used by editor.js (HTML editor) and css-editor.js (CSS editor).
========================================================= */
(function () {
  const NAME_KEY = "htmlmaster_student_name";
  const CODE_KEY = "htmlmaster_class_code";
  const PREFIX = "#share=";
  const MAX_FORM_URL = 8000; // very long links can fail in Google Forms

  /* ---------- pack / unpack (compressed, URL-safe) ---------- */
  const toB64 = (bytes) => {
    let s = "";
    for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  };
  const fromB64 = (str) => {
    const s = atob(str.replace(/-/g, "+").replace(/_/g, "/"));
    const out = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
    return out;
  };
  const pipe = async (bytes, stream) => new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer());

  async function pack(obj) {
    const bytes = new TextEncoder().encode(JSON.stringify(obj));
    if (window.CompressionStream) return "z" + toB64(await pipe(bytes, new CompressionStream("deflate-raw")));
    return "p" + toB64(bytes);
  }

  async function unpack(str) {
    let bytes = fromB64(str.slice(1));
    if (str[0] === "z") bytes = await pipe(bytes, new DecompressionStream("deflate-raw"));
    else if (str[0] !== "p") throw new Error("unknown format");
    return JSON.parse(new TextDecoder().decode(bytes));
  }

  const pageUrl = () => location.origin + location.pathname;
  const readKey = (k) => { try { return localStorage.getItem(k) || ""; } catch { return ""; } };
  const saveKey = (k, v) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } };

  /* ---------- the teacher's Google Form link ---------- */
  // The class code is NOT stored in this site (it is public). The teacher says it in class,
  // and Google Forms checks it ("Response validation"), so strangers can't send anything.
  function formUrlFor(name, link, code) {
    const raw = (window.HM_TEACHER && window.HM_TEACHER.formLink || "").trim();
    if (!raw) return "";
    try {
      const url = new URL(raw);
      let found = false;
      for (const [key, value] of [...url.searchParams]) {
        const v = value.trim().toUpperCase();
        if (v === "NAME") url.searchParams.set(key, name);
        if (v === "CODE") url.searchParams.set(key, code || "");
        if (v === "LINK") { url.searchParams.set(key, link); found = true; }
      }
      return found ? url.toString() : "";
    } catch {
      return "";
    }
  }

  // Does the teacher's form have a class code question?
  const formWantsCode = () => /=\s*CODE\s*(&|$)/i.test((window.HM_TEACHER && window.HM_TEACHER.formLink) || "");

  /* ---------- the "Send to teacher" window ---------- */
  let modal = null;

  function buildModal() {
    const wrap = document.createElement("div");
    wrap.className = "hs-backdrop";
    wrap.hidden = true;
    wrap.innerHTML = `
      <div class="hs-modal" role="dialog" aria-modal="true" aria-labelledby="hsTitle">
        <button type="button" class="hs-close" aria-label="Close"><i class="fas fa-times"></i></button>
        <h3 id="hsTitle"><i class="fas fa-paper-plane"></i> Send to teacher</h3>
        <label class="hs-label" for="hsName">Your first name</label>
        <input type="text" id="hsName" class="hs-input" maxlength="40" autocomplete="given-name" placeholder="e.g. Sara">
        <div class="hs-code-row">
          <label class="hs-label" for="hsCode">Class code <small>(your teacher tells you)</small></label>
          <input type="text" id="hsCode" class="hs-input" maxlength="30" autocomplete="off" autocapitalize="characters" spellcheck="false">
        </div>
        <p class="hs-note"></p>
        <div class="hs-actions">
          <button type="button" class="hs-btn hs-send"><i class="fas fa-paper-plane"></i> Send to teacher</button>
          <button type="button" class="hs-btn hs-copy"><i class="fas fa-link"></i> Copy link</button>
        </div>
        <input type="text" class="hs-input hs-link" readonly hidden aria-label="Link to your code">
        <p class="hs-msg" aria-live="polite"></p>
      </div>`;
    document.body.appendChild(wrap);

    const $ = (sel) => wrap.querySelector(sel);
    const m = {
      wrap, name: $("#hsName"), code: $("#hsCode"), codeRow: $(".hs-code-row"), note: $(".hs-note"), send: $(".hs-send"),
      copy: $(".hs-copy"), linkBox: $(".hs-link"), msg: $(".hs-msg"),
      getData: null, link: "", job: 0
    };

    const close = () => { wrap.hidden = true; document.body.classList.remove("hs-open"); m.lastFocus?.focus?.(); };
    m.close = close;
    $(".hs-close").addEventListener("click", close);
    wrap.addEventListener("click", (e) => { if (e.target === wrap) close(); });
    wrap.addEventListener("keydown", (e) => { if (e.key === "Escape") { e.stopPropagation(); close(); } });

    // Rebuild the link while the name is typed, so it is ready when Send is clicked
    m.name.addEventListener("input", () => { m.msg.textContent = ""; refresh(); });

    const needName = () => {
      const n = m.name.value.trim();
      if (n) { saveKey(NAME_KEY, n); return false; }
      m.msg.textContent = "✏️ Write your first name first.";
      m.name.focus();
      return true;
    };

    m.code.addEventListener("input", () => { m.msg.textContent = ""; });

    m.send.addEventListener("click", () => {
      if (needName() || !m.link) return;
      const code = m.code.value.trim();
      if (formWantsCode()) {
        if (!code) { m.msg.textContent = "🔑 Write the class code your teacher gave you."; m.code.focus(); return; }
        saveKey(CODE_KEY, code);
      }
      const url = formUrlFor(m.name.value.trim(), m.link, code);
      if (url.length > MAX_FORM_URL) {
        m.msg.textContent = "⚠️ Your code is too long to send this way. Use Save and hand in the file.";
        return;
      }
      window.open(url, "_blank", "noopener");
      m.msg.textContent = "✅ The form opened in a new tab. Press Submit there!";
    });

    m.copy.addEventListener("click", async () => {
      if (needName() || !m.link) return;
      try {
        await navigator.clipboard.writeText(m.link);
        m.msg.textContent = "📋 Link copied. Paste it where your teacher asked.";
      } catch {
        m.linkBox.hidden = false;
        m.linkBox.value = m.link;
        m.linkBox.select();
        m.msg.textContent = "Press Ctrl+C to copy the link.";
      }
    });

    return m;
  }

  async function refresh() {
    const job = ++modal.job;
    const data = Object.assign({ v: 1, n: modal.name.value.trim() }, modal.getData());
    const link = pageUrl() + PREFIX + (await pack(data));
    if (job === modal.job) {
      modal.link = link;
      if (!modal.linkBox.hidden) modal.linkBox.value = link;
    }
  }

  function open(getData) {
    if (!modal) modal = buildModal();
    const hasForm = !!formUrlFor("x", "x");
    modal.getData = getData;
    modal.lastFocus = document.activeElement;
    modal.send.hidden = !hasForm;
    modal.copy.classList.toggle("hs-primary", !hasForm);
    modal.note.textContent = hasForm
      ? "Your teacher gets your name and a link that shows your code."
      : "Copy the link and send it to your teacher the way they asked.";
    modal.msg.textContent = "";
    modal.linkBox.hidden = true;
    modal.name.value = modal.name.value || readKey(NAME_KEY);
    modal.codeRow.hidden = !(hasForm && formWantsCode());
    modal.code.value = modal.code.value || readKey(CODE_KEY);
    modal.wrap.hidden = false;
    document.body.classList.add("hs-open");
    refresh();
    const first = !modal.name.value ? modal.name
      : !modal.codeRow.hidden && !modal.code.value ? modal.code
      : hasForm ? modal.send : modal.copy;
    first.focus();
  }

  /* ---------- opening a shared link ---------- */
  const isShared = () => location.hash.startsWith(PREFIX);

  async function readShared() {
    if (!isShared()) return null;
    try {
      const data = await unpack(decodeURIComponent(location.hash.slice(PREFIX.length)));
      return data && typeof data === "object" ? data : null;
    } catch {
      return null;
    }
  }

  // Banner above the editor: whose code this is, and the way back
  function showBanner(beforeEl, data) {
    const bar = document.createElement("div");
    bar.className = "hs-banner";
    bar.setAttribute("role", "status");
    const text = document.createElement("div");
    const strong = document.createElement("strong");
    const name = data && typeof data.n === "string" ? data.n.trim().slice(0, 40) : "";
    if (!data) {
      strong.textContent = "This link is broken.";
      text.append(strong, " Ask for a new link. Your own code is saved and safe.");
    } else {
      strong.textContent = name ? `You are looking at ${name}'s code.` : "You are looking at shared code.";
      text.append(strong, " Changes here are not saved. Your own code is saved and safe.");
    }
    const back = document.createElement("a");
    back.className = "hs-back";
    back.href = location.pathname;
    back.innerHTML = '<i class="fas fa-arrow-left"></i> Back to my code';
    const icon = document.createElement("i");
    icon.className = "fas fa-eye";
    bar.append(icon, text, back);
    beforeEl.parentNode.insertBefore(bar, beforeEl);
    // A different #share= link pasted into the same tab: load it properly
    addEventListener("hashchange", () => location.reload());
  }

  window.HMShare = { open, isShared, readShared, showBanner };
})();
