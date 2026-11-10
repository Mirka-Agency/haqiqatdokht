// ---------- Data ----------
const IMG = "assets/img/";
const WA_NUMBER = "989121168939";

const products = [
  { cat: "industrial", brand: "PRECIOUS", model: "V20",     name: "سردوز صنعتی پنج نخ",            img: "V-20.jpg" },
  { cat: "industrial", brand: "PRECIOUS", model: "V19",     name: "سردوز صنعتی چهار نخ",            img: "V-19.jpg" },
  { cat: "industrial", brand: "PRECIOUS", model: "V19S",    name: "سردوز صنعتی سه نخ",              img: "V-19-S.jpg" },
  { cat: "industrial", brand: "PRECIOUS", model: "V21",     name: "میان‌دوز صنعتی کامپیوتری",        img: "V-21.jpg" },
  { cat: "industrial", brand: "PRECIOUS", model: "PC9322B", name: "دو پایه ۱۲ درجه، دهانه بلند",    img: "PC9322B.jpg" },
  { cat: "industrial", brand: "PRECIOUS", model: "PC9920D", name: "بطر آسیابی دو سوزن غلطکی",       img: "PC9920D.jpg" },
  { cat: "industrial", brand: "PRECIOUS", model: "PC9910D", name: "بطر آسیابی دو سوزن غلطکی",       img: "PC9910D.jpg" },
  { cat: "home",       brand: "VESTA",    model: "4014",    name: "چرخ خانگی با ۱۴ مدل دوخت",       img: "New-Project.webp" },
  { cat: "home",       brand: "VESTA",    model: "2020",    name: "چرخ خیاطی خانگی",                img: "9893D-D4-1.jpg" },
  { cat: "home",       brand: "VESTA",    model: "2015",    name: "چرخ خیاطی خانگی",                img: "2015.jpg" },
  { cat: "home",       brand: "VESTA",    model: "2012",    name: "چرخ خیاطی خانگی",                img: "2012.jpg" },
  { cat: "home",       brand: "VESTA",    model: "2010MAX", name: "چرخ خیاطی خانگی",                img: "258-1.jpg" },
  { cat: "home",       brand: "KACHIRAN", model: "401HA",   name: "جاسمین؛ چرخ خیاطی خانگی",        img: "401HA.jpg" },
];

const CAT_LABEL = { industrial: "صنعتی", home: "خانگی" };
const toFa = (n) => String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
const faToEn = (s) => s.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
const waLink = (text) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
const norm = (s) => faToEn(s).toLowerCase().replace(/ي/g, "ی").replace(/ك/g, "ک").trim();

// ---------- Header ----------
const header = document.getElementById("header");

// ---------- Mobile menu ----------
const nav = document.getElementById("nav");
const menuBtn = document.getElementById("menuBtn");

function setMenu(open) {
  nav.classList.toggle("is-open", open);
  menuBtn.setAttribute("aria-expanded", open);
  menuBtn.setAttribute("aria-label", open ? "بستن منو" : "باز کردن منو");
  menuBtn.querySelector("use").setAttribute("href", open ? "#i-close" : "#i-menu");
}
menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

// Highlight the nav link of the section in view
const navLinks = [...nav.querySelectorAll("a")];
const spy = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    navLinks.forEach((a) => a.classList.toggle("is-active", a.hash === `#${e.target.id}`));
  });
}, { rootMargin: "-45% 0px -50% 0px" });
navLinks.forEach((a) => { const s = document.querySelector(a.hash); if (s) spy.observe(s); });

// ---------- Products ----------
const grid = document.getElementById("grid");
const empty = document.getElementById("empty");
const search = document.getElementById("search");
const state = { filter: "all", q: "" };

function render() {
  const q = norm(state.q);
  const list = products.filter((p) =>
    (state.filter === "all" || p.cat === state.filter) &&
    (!q || norm(`${p.brand} ${p.model} ${p.name} ${CAT_LABEL[p.cat]}`).includes(q))
  );
  grid.innerHTML = list.map((p, i) => `
    <article class="tag" style="animation-delay:${i * 50}ms">
      <div class="tag__in">
        <div class="tag__img">
          <span class="stamp">${CAT_LABEL[p.cat]}</span>
          <img src="${IMG + p.img}" alt="${p.brand} ${p.model}" loading="lazy" width="300" height="255">
        </div>
        <h3 class="tag__model">${p.model}</h3>
        <p class="tag__name">${p.name}</p>
        <dl class="tag__spec">
          <div><dt>برند</dt><dd>${p.brand}</dd></div>
          <div><dt>گارانتی</dt><dd>رسمی</dd></div>
        </dl>
        <a class="btn btn--red" href="${waLink(`سلام، قیمت ${p.brand} مدل ${p.model} (${p.name}) را می‌خواستم.`)}" target="_blank" rel="noopener">
          <svg class="ic"><use href="#i-wa"/></svg>استعلام قیمت
        </a>
      </div>
    </article>`).join("");
  empty.hidden = list.length > 0;
  requestAnimationFrame(layoutThread);
}

function setFilter(filter) {
  state.filter = filter;
  document.querySelectorAll(".seg__btn").forEach((b) => {
    const on = b.dataset.filter === filter;
    b.classList.toggle("is-active", on);
    b.setAttribute("aria-selected", on);
  });
  render();
}

document.querySelectorAll(".seg__btn").forEach((b) => b.addEventListener("click", () => setFilter(b.dataset.filter)));
search.addEventListener("input", () => { state.q = search.value; render(); });
document.getElementById("clearSearch").addEventListener("click", () => {
  search.value = state.q = "";
  setFilter("all");
});

// Category shortcuts (hero cards, footer links) jump to the filtered grid
document.querySelectorAll("[data-go]").forEach((el) => el.addEventListener("click", (e) => {
  e.preventDefault();
  setFilter(el.dataset.go);
  document.getElementById("products").scrollIntoView({ behavior: "smooth" });
}));

// Model counts next to category names
const counts = { all: products.length };
products.forEach((p) => (counts[p.cat] = (counts[p.cat] || 0) + 1));
document.querySelectorAll("[data-count-cat]").forEach((el) => {
  const n = toFa(counts[el.dataset.countCat] || 0);
  el.textContent = el.closest(".cat") ? `${n} مدل` : `(${n})`;
});

// ---------- FAQ: one open at a time ----------
const faqs = document.querySelectorAll(".faq details");
faqs.forEach((d) => d.addEventListener("toggle", () => {
  if (d.open) faqs.forEach((o) => o !== d && (o.open = false));
}));

// ---------- Wholesale form → WhatsApp ----------
const form = document.getElementById("wholesaleForm");
function showErr(name, on) {
  const err = form.querySelector(`[data-for="${name}"]`);
  err.classList.toggle("is-on", on);
  err.parentElement.classList.toggle("is-bad", on);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const type = form.querySelector("input[name=type]:checked");
  const count = +faToEn(form.count.value.trim());
  const mobile = faToEn(form.mobile.value.replace(/[\s-]/g, ""));

  const bad = {
    type: !type,
    count: !(Number.isInteger(count) && count > 0),
    mobile: !/^(\+98|0)?9\d{9}$/.test(mobile),
  };
  Object.entries(bad).forEach(([k, v]) => showErr(k, v));
  const first = Object.keys(bad).find((k) => bad[k]);
  if (first) { form.querySelector(`[name="${first}"]`).focus(); return; }

  const msg = `سلام، درخواست استعلام قیمت عمده:\nنوع کارگاه: ${type.value}\nتعداد دستگاه: ${count}\nموبایل: ${mobile}`;
  window.open(waLink(msg), "_blank", "noopener");
  form.reset();
});
form.addEventListener("input", (e) => e.target.name && showErr(e.target.name, false));
form.addEventListener("change", (e) => e.target.name && showErr(e.target.name, false));

// ---------- Measuring tape: cm numbers, fills with scroll progress ----------
const tapeRuler = document.getElementById("tapeRuler");
const tapeFill = document.getElementById("tapeFill");

function layoutTape() {
  const cm = Math.ceil(tapeRuler.offsetWidth / 50);
  tapeRuler.innerHTML = Array.from({ length: cm }, (_, i) =>
    i ? `<span style="right:${i * 50}px">${i}</span>` : "").join("");
}

// ---------- Red thread: a wavy seam drawn down the page as you scroll ----------
const main = document.getElementById("top");
const threadPath = document.getElementById("threadPath");
const threadGhost = document.getElementById("threadGhost");
const threadRect = document.getElementById("threadRect");
const needle = document.getElementById("needle");
let threadPts = [];

function layoutThread() {
  const w = main.offsetWidth, h = main.offsetHeight;
  // swing between the two page edges, one bend per ~640px;
  // on phones keep it as a narrow seam along the right edge so it never crosses text
  const mobile = w < 700;
  const left = mobile ? w - 30 : Math.max(18, (w - 1248) / 2 - 10);
  const right = mobile ? w - 4 : w - left;
  const bend = mobile ? 260 : 640;
  let d = `M ${right - 20} 0`;
  for (let y = 0, i = 0; y < h; y += bend, i++) {
    const x = i % 2 ? right - 20 : left + 20;
    const cx = i % 2 ? left : right;
    d += ` C ${cx} ${y + bend * 0.35}, ${x} ${y + bend * 0.55}, ${x} ${y + bend}`;
  }
  threadPath.setAttribute("d", d);
  threadGhost.setAttribute("d", d);

  // sample the path once so the needle can follow it cheaply
  const len = threadPath.getTotalLength();
  threadPts = Array.from({ length: 600 }, (_, i) => threadPath.getPointAtLength((len * i) / 599));
  onScroll();
}

function stitchThread() {
  const top = main.getBoundingClientRect().top;
  const tipY = Math.max(0, innerHeight * 0.6 - top);
  threadRect.setAttribute("height", tipY);

  const i = threadPts.findIndex((p) => p.y >= tipY);
  const p = threadPts[i] || threadPts[threadPts.length - 1];
  const prev = threadPts[Math.max(i - 3, 0)] || p;
  if (!p) return;
  const angle = (Math.atan2(p.y - prev.y, p.x - prev.x) * 180) / Math.PI - 90;
  needle.setAttribute("transform", `translate(${p.x} ${p.y}) rotate(${angle})`);
  needle.style.display = i < 0 ? "none" : "";
}

function onScroll() {
  header.classList.toggle("is-scrolled", window.scrollY > 8);
  const max = document.documentElement.scrollHeight - innerHeight;
  tapeFill.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  if (threadPts.length) stitchThread();
}

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", () => { layoutTape(); layoutThread(); });
window.addEventListener("load", layoutThread);
if (document.fonts) document.fonts.ready.then(layoutThread);

// ---------- Init ----------
layoutTape();
render();
