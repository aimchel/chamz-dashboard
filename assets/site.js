// Общие части всех страниц: меню, предупреждение, подвал, форматирование, графики.
(function () {
  const PAGES = [
    ["index.html", "Сводка"],
    ["market.html", "Рынок и конкуренты"],
    ["dossier.html", "Досье ЧАМЗ"],
    ["plan.html", "План роста"],
    ["cases.html", "Кейсы"]
  ];
  const here = location.pathname.split("/").pop() || "index.html";

  const top = document.createElement("div");
  top.className = "topbar";
  top.innerHTML = '<div class="wrap"><a class="brand" href="index.html">ЧАМЗ <span>·</span> рынок клапанов</a><nav class="nav">' +
    PAGES.map(([href, t]) => `<a href="${href}"${href === here ? ' class="active"' : ""}>${t}</a>`).join("") + "</nav>" +
    '<button class="btn primary top-cases" type="button">Смотреть кейсы<small>они настоящие</small></button></div>';
  document.body.prepend(top);
  // Карусель кейсов доступна со всех страниц: подгружаем её, если страница не подключила сама
  top.querySelector(".top-cases").addEventListener("click", () => window.openCases && window.openCases(0));
  document.addEventListener("DOMContentLoaded", () => {
    if (window.openCases) return;
    const s = document.createElement("script");
    s.src = "assets/cases-modal.js?v=4";
    document.body.append(s);
  });

  const main = document.querySelector("main.wrap");
  const disc = document.createElement("p");
  disc.className = "disclaimer";
  disc.innerHTML = "<strong>⚠️ Важно.</strong> Этот анализ выполнен без глубокой проверки данных и сделан лишь для демонстрации возможностей. Все данные нужно перепроверять и анализировать глубже.";
  main.prepend(disc);

  const foot = document.createElement("footer");
  foot.className = "site wrap";
  foot.innerHTML = `<span>Данные на ${DATA.updated}. Подготовил Андриевских Иван: сбор данных и сборка сайта — в Claude Code.</span>
    <span>Этот сайт не имеет никакого отношения к ЧАМЗ и создан в демонстрационных целях — чтобы показать возможности AI. Источники: ${DATA.sources.map(s => s.split(" — ")[0]).join(", ")}.</span>`;
  document.body.append(foot);

  // «Куда смотреть дальше» — на каждой странице, ссылки на все остальные разделы
  const NEXT = {
    "index.html": ["Сводка", "Главное в шести пунктах и ключевые цифры"],
    "market.html": ["Рынок и конкуренты", "Кто давит в каждом сегменте и насколько он больше"],
    "dossier.html": ["Досье ЧАМЗ", "Финансы, владельцы, продукт и каналы сбыта"],
    "plan.html": ["План роста", "Восемь гипотез и что проверить первым"],
    "cases.html": ["Кейсы", "Десять настоящих кейсов с цифрами"]
  };
  const nextSec = document.createElement("section");
  nextSec.className = "next-steps";
  nextSec.innerHTML = "<h2>Куда смотреть дальше</h2><div class=\"grid g4\">" +
    Object.entries(NEXT).filter(([href]) => href !== here).map(([href, [t, d]]) =>
      `<a class="card next-card" href="${href}"><h3>${t} →</h3><p class="muted small">${d}</p></a>`).join("") + "</div>";
  main.append(nextSec);

  window.fmt = {
    rub: n => n.toLocaleString("ru-RU") + " ₽",
    bn: n => n.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " млрд ₽",
    mln: n => n.toLocaleString("ru-RU", { maximumFractionDigits: 1 }) + " млн ₽"
  };
  window.css = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  window.esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  window.chartDefaults = function () {
    if (!window.Chart) return;
    Chart.defaults.font.family = css("--font-body");
    Chart.defaults.color = css("--muted");
    Chart.defaults.borderColor = css("--line");
    Chart.defaults.maintainAspectRatio = false;
  };
  window.PALETTE = ["#D92D20", "#3346C4", "#F79009", "#12B76A", "#7A5AF8", "#0BA5EC", "#98A2B3", "#EE46BC"];
})();
