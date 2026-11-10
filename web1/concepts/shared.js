// Shared data and behavior for the homepage style concepts.
// Each concept page calls initPage({ card }) with its own product card template.

const IMG = "../assets/img/";
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
const priceLink = (p) => waLink(`سلام، قیمت ${p.brand} مدل ${p.model} (${p.name}) را می‌خواستم.`);

function initPage({ card }) {
  // Products + category filter
  const grid = document.getElementById("grid");
  const render = (filter) => {
    const list = filter === "all" ? products : products.filter((p) => p.cat === filter);
    grid.innerHTML = list.map((p, i) => card(p, i)).join("");
  };
  const buttons = document.querySelectorAll("[data-filter]");
  buttons.forEach((b) => b.addEventListener("click", () => {
    buttons.forEach((o) => {
      o.classList.toggle("is-active", o === b);
      o.setAttribute("aria-selected", o === b);
    });
    render(b.dataset.filter);
  }));
  render("all");

  const counts = { all: products.length };
  products.forEach((p) => (counts[p.cat] = (counts[p.cat] || 0) + 1));
  document.querySelectorAll("[data-count-cat]").forEach((el) => (el.textContent = toFa(counts[el.dataset.countCat])));

  // Mobile menu
  const nav = document.getElementById("nav");
  const menuBtn = document.getElementById("menuBtn");
  const setMenu = (open) => {
    nav.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", open);
  };
  menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

  // FAQ: one open at a time
  const faqs = document.querySelectorAll("details");
  faqs.forEach((d) => d.addEventListener("toggle", () => {
    if (d.open) faqs.forEach((o) => o !== d && (o.open = false));
  }));

  // Wholesale form → WhatsApp
  const form = document.getElementById("wholesaleForm");
  const showErr = (name, on) => {
    const err = form.querySelector(`[data-for="${name}"]`);
    err.classList.toggle("is-on", on);
    err.parentElement.classList.toggle("is-bad", on);
  };
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
}
