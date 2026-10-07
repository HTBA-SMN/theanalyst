(function () {
  "use strict";
  var d = portfolioData, $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(t) { var e = document.createElement("div"); e.textContent = t == null ? "" : t; return e.innerHTML; }
  function list(a) { return "<ul>" + a.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>"; }
  function chips(a) { return '<ul class="chips">' + a.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>"; }
  function isPh(t) { return /\[Insert/.test(t); }

  /* Basic content and links */
  $("#h-name").textContent = d.displayName;
  $("#h-title").textContent = d.title;
  $("#h-tagline").textContent = d.tagline;
  $("#h-bio").textContent = d.shortBio;
  $("#h-photo").src = d.photo;
  $$("[data-linkedin]").forEach(function (a) { a.href = d.linkedin; });
  $$("[data-github]").forEach(function (a) { a.href = d.github; });
  $$("[data-email]").forEach(function (a) { a.href = "mailto:" + d.email; if (a.id === "c-email") a.textContent = d.email; });
  $$("[data-resume]").forEach(function (a) { a.href = d.resume; });
  $$("[data-resume-text]").forEach(function (a) { a.textContent = d.resumeText; });
  $("#c-phone").textContent = d.phone; $("#c-phone").href = "tel:" + d.phone.replace(/\s/g, "");
  $("#c-loc").textContent = d.location;
  $("#yr").textContent = new Date().getFullYear();
  $("#form").action = d.formspreeEndpoint;

  /* About */
  $("#about-text").innerHTML = d.about.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
  $("#facts").innerHTML = d.facts.map(function (f) { return "<div><dt>" + esc(f.k) + "</dt><dd>" + esc(f.v) + "</dd></div>"; }).join("");
  $("#approach").innerHTML = d.approach.map(function (a) { return "<li><h4>" + esc(a.h) + "</h4><p>" + esc(a.p) + "</p></li>"; }).join("");

  /* Experience */
  $("#timeline").innerHTML = d.experience.map(function (j) {
    return '<li class="job"><h3>' + esc(j.role) + '</h3><p class="co' + (isPh(j.company) ? " ph" : "") + '">' + esc(j.company) + " · " + esc(j.location) + "</p>" +
      '<p class="when' + (isPh(j.dates) ? " ph" : "") + '">' + esc(j.dates) + "</p><p>" + esc(j.summary) + "</p>" + list(j.achievements) +
      '<p class="impact">' + esc(j.impact) + "</p>" + chips(j.tools) + "</li>";
  }).join("");
  function pairs(a) { return a.map(function (x) { return "<li><b>" + esc(x.h) + "</b><span>" + esc(x.p) + "</span></li>"; }).join(""); }
  $("#edu").innerHTML = pairs(d.education); $("#certs").innerHTML = pairs(d.certifications);

  /* Skills */
  $("#skills-grid").innerHTML = d.competencies.map(function (g) {
    return '<div class="skill-group"><h3>' + esc(g.group) + "</h3>" + chips(g.items) + "</div>";
  }).join("");

  /* Project cards */
  $("#cards").innerHTML = d.projects.map(function (p) {
    return '<article class="card"><div class="thumb"><img src="' + esc(p.image) + '" alt="Workflow diagram for ' + esc(p.shortName) + '" loading="lazy" width="800" height="450" data-fallback></div>' +
      '<div class="card-b"><p class="cat">' + esc(p.category) + "</p><h3>" + esc(p.shortName) + "</h3><p>" + esc(p.short) + "</p>" +
      '<div><p class="lbl">Tools</p>' + chips(p.tools) + "</div><div><p class=\"lbl\">Skills demonstrated</p>" + chips(p.skills) + "</div>" +
      '<button class="btn" type="button" data-case="' + esc(p.id) + '">View case study</button></div></article>';
  }).join("");
  function fallback(img) {
    var box = img.parentNode; box.classList.add("empty");
    box.innerHTML = "Project image to be added: " + esc(img.getAttribute("src").split("/").pop());
  }
  $$("img[data-fallback]").forEach(function (im) { im.addEventListener("error", function () { fallback(im); }); if (im.complete && im.naturalWidth === 0) fallback(im); });

  /* Case-study modal */
  var modal = $("#modal"), body = $("#m-body"), lastBtn;
  function section(h, html) { return "<h3>" + h + "</h3>" + html; }
  function openCase(id, btn) {
    var p = d.projects.filter(function (x) { return x.id === id; })[0]; if (!p) return;
    lastBtn = btn;
    body.innerHTML = '<article class="cs"><p class="cat">' + esc(p.category) + '</p><h2 id="m-title">' + esc(p.name) + "</h2>" +
      '<dl class="meta"><div><dt>My role</dt><dd>' + esc(p.role) + "</dd></div><div><dt>Data source</dt><dd>" + esc(p.dataSource) + "</dd></div></dl>" +
      '<div class="cs-img"><img src="' + esc(p.image) + '" alt="Workflow diagram for ' + esc(p.shortName) + '" loading="lazy" data-fallback2></div>' +
      section("Business problem", "<p>" + esc(p.problem) + "</p>") +
      section("Objective", "<p>" + esc(p.objective) + "</p>") +
      section("Approach", "<p><b>Methodology</b></p>" + chips(p.methodology) + '<p style="margin-top:1rem"><b>Tools</b></p>' + chips(p.tools)) +
      section("Analysis", list(p.analysis)) + section("Findings", list(p.findings)) + section("Recommendations", list(p.recommendations)) +
      section("Outcome", "<p>" + esc(p.outcome) + "</p>") + section("Business impact", "<p>" + esc(p.impact) + "</p>") +
      (p.documentReady ? '<p style="margin-top:2rem"><a class="btn" href="' + esc(p.document) + '" target="_blank" rel="noopener">' + esc(p.documentLabel) + "</a></p>" : "") + "</article>";
    var im = $("[data-fallback2]", body); if (im) { var drop = function () { im.parentNode.remove(); }; im.addEventListener("error", drop); if (im.complete && im.naturalWidth === 0) drop(); }
    if (modal.showModal) modal.showModal(); else modal.setAttribute("open", "");
    modal.scrollTop = 0; document.body.style.overflow = "hidden";
  }
  function closeCase() { if (modal.close) modal.close(); else modal.removeAttribute("open"); }
  modal.addEventListener("close", function () { document.body.style.overflow = ""; if (lastBtn) lastBtn.focus(); });
  modal.addEventListener("click", function (e) { if (e.target === modal) closeCase(); });
  $("#m-close").addEventListener("click", closeCase);
  $("#cards").addEventListener("click", function (e) { var b = e.target.closest("[data-case]"); if (b) openCase(b.getAttribute("data-case"), b); });

  /* Theme */
  var root = document.documentElement, tbtn = $("#theme");
  function isDark() { var t = root.getAttribute("data-theme"); return t ? t === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches; }
  function label() { tbtn.setAttribute("aria-label", isDark() ? "Switch to light theme" : "Switch to dark theme"); }
  tbtn.addEventListener("click", function () {
    var n = isDark() ? "light" : "dark"; root.setAttribute("data-theme", n);
    try { localStorage.setItem("theme", n); } catch (e) {} label();
  });
  label();

  /* Mobile menu */
  var burger = $("#burger"), menu = $("#menu");
  function setMenu(o) { menu.classList.toggle("open", o); burger.setAttribute("aria-expanded", o); burger.setAttribute("aria-label", o ? "Close menu" : "Open menu"); }
  burger.addEventListener("click", function () { setMenu(!menu.classList.contains("open")); });
  menu.addEventListener("click", function (e) { if (e.target.tagName === "A") setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  /* Nav state + active link */
  var nav = $("#nav");
  window.addEventListener("scroll", function () { nav.classList.toggle("scrolled", window.scrollY > 8); }, { passive: true });
  var links = $$("#menu a[href^='#']");
  if ("IntersectionObserver" in window) {
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) links.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id); }); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach(function (s) { so.observe(s); });
    var ro = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); ro.unobserve(en.target); } }); }, { threshold: 0.08 });
    $$(".sec .wrap").forEach(function (w) { w.classList.add("reveal"); ro.observe(w); });
  }

  /* Contact form: validation, loading, success and error states */
  var form = $("#form"), status = $("#status"), send = $("#send");
  var rules = { name: "Enter your name.", email: "Enter a valid email address.", subject: "Enter a subject.", message: "Enter a message." };
  function check(el) {
    var bad = !el.value.trim() || (el.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim()));
    el.setAttribute("aria-invalid", bad); $("#e-" + el.name).textContent = bad ? rules[el.name] : ""; return !bad;
  }
  ["name", "email", "subject", "message"].forEach(function (n) {
    var el = form.elements[n]; el.addEventListener("blur", function () { check(el); });
    el.addEventListener("input", function () { if (el.getAttribute("aria-invalid") === "true") check(el); });
  });
  form.addEventListener("submit", function (e) {
    e.preventDefault(); status.textContent = ""; status.className = "status";
    var ok = true, first = null;
    ["name", "email", "subject", "message"].forEach(function (n) { if (!check(form.elements[n])) { ok = false; first = first || form.elements[n]; } });
    if (!ok) { first.focus(); return; }
    if (window.fetch) {
      send.disabled = true; send.textContent = "Sending…";
      fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (r) {
          if (r.ok) { form.reset(); status.textContent = "Thank you. Your message has been sent and I will reply by email."; status.className = "status ok"; }
          else throw new Error("fail");
        })
        .catch(function () { status.textContent = "Your message could not be sent. Please try again, or email " + d.email + " directly."; status.className = "status bad"; })
        .then(function () { send.disabled = false; send.textContent = "Send message"; });
    } else { form.submit(); }
  });
})();
