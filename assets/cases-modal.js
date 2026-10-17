// Всплывающая карусель кейсов: один кейс на слайд, «Далее»/«Назад», закрытие крестиком, Esc или кнопкой.
(function () {
  const cases = DATA.cases, intro = DATA.casesIntro;
  // Слайд 0 — обращение (если есть), дальше кейсы
  const slides = intro ? [{ intro: true }, ...cases] : cases;
  let i = 0, lastFocus = null;

  const root = document.createElement("div");
  root.className = "cm-overlay";
  root.hidden = true;
  root.innerHTML = `
    <div class="cm-dialog" role="dialog" aria-modal="true" aria-labelledby="cm-title">
      <div class="cm-head">
        <div class="cm-title"><strong>Мои настоящие кейсы</strong><span class="eyebrow" id="cm-pos"></span></div>
        <button class="cm-close" type="button" aria-label="Закрыть кейсы">×</button>
      </div>
      <div class="cm-body" aria-live="polite"></div>
      <div class="cm-dots" role="tablist" aria-label="Кейсы"></div>
      <div class="cm-foot">
        <button class="btn ghost cm-prev" type="button">← Назад</button>
        <button class="btn link cm-skip" type="button">Закрыть окно</button>
        <button class="btn primary cm-next" type="button">Далее →</button>
      </div>
    </div>`;
  document.body.append(root);

  const body = root.querySelector(".cm-body"), pos = root.querySelector("#cm-pos"), head = root.querySelector(".cm-title"), xBtn = root.querySelector(".cm-close"), skipBtn = root.querySelector(".cm-skip");
  const dots = root.querySelector(".cm-dots"), prev = root.querySelector(".cm-prev"), next = root.querySelector(".cm-next");
  dots.innerHTML = slides.map((s, k) => `<button type="button" role="tab" aria-label="${s.intro ? "Обращение" : "Кейс " + (intro ? k : k + 1)}"></button>`).join("");

  function show(k) {
    i = Math.max(0, Math.min(slides.length - 1, k));
    const c = slides[i], last = slides.length - 1;
    // На обращении окно закрыть нельзя: только «Смотреть кейсы»
    head.hidden = xBtn.hidden = skipBtn.hidden = !!c.intro;
    if (c.intro) {
      body.innerHTML = `
        <div class="cm-letter">
          <h2 id="cm-title">${esc(intro.greeting)}</h2>
          ${intro.paragraphs.map(p => `<p>${esc(p)}</p>`).join("")}
          <p class="cm-sign">С уважением,<br><strong>${esc(intro.signature)}</strong></p>
        </div>`;
      pos.textContent = `${cases.length} кейсов`;
      [...dots.children].forEach((d, k) => d.setAttribute("aria-selected", k === i));
      prev.disabled = true;
      next.textContent = "Смотреть кейсы →";
      return;
    }
    body.innerHTML = `
      <span class="tag">${esc(c.tag)}</span>
      <h2 id="cm-title">${esc(c.title)}</h2>
      <div class="cm-metrics">${c.metrics.map(([v, l]) => `<div><b>${esc(v)}</b><span>${esc(l)}</span></div>`).join("")}</div>
      <p>${esc(c.body)}</p>`;
    pos.textContent = `${intro ? i : i + 1} из ${cases.length}`;
    [...dots.children].forEach((d, k) => d.setAttribute("aria-selected", k === i));
    prev.disabled = i === 0;
    next.textContent = i === last ? "Смотреть план роста →" : "Далее →";
  }
  function open(k = 0) {
    lastFocus = document.activeElement;
    root.hidden = false;
    document.body.classList.add("cm-lock");
    show(k);
    next.focus();
  }
  function close() {
    if (slides[i] && slides[i].intro && !root.hidden) return;
    root.hidden = true;
    document.body.classList.remove("cm-lock");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  next.addEventListener("click", () => { if (i === slides.length - 1) location.href = "plan.html"; else show(i + 1); });
  prev.addEventListener("click", () => show(i - 1));
  root.querySelector(".cm-close").addEventListener("click", close);
  root.querySelector(".cm-skip").addEventListener("click", close);
  dots.addEventListener("click", e => { const b = e.target.closest("button"); if (b) show([...dots.children].indexOf(b)); });
  root.addEventListener("click", e => { if (e.target === root) close(); });
  document.addEventListener("keydown", e => {
    if (root.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") show(i + 1);
    if (e.key === "ArrowLeft") show(i - 1);
    if (e.key === "Tab") {
      const f = [...root.querySelectorAll("button:not([disabled])")];
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  let x0 = null;
  root.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
  root.addEventListener("touchend", e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) show(i + (dx < 0 ? 1 : -1)); x0 = null; });

  window.openCases = open;
})();
