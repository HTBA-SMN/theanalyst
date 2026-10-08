(function () {
  "use strict";
  var d = portfolioData, $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(t) { var e = document.createElement("div"); e.textContent = t == null ? "" : t; return e.innerHTML; }
  function list(a) { return "<ul>" + a.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>"; }
  function chips(a) { return a && a.length ? '<ul class="chips">' + a.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" : ""; }
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Basics */
  $("#h-name").textContent = d.displayName; $("#h-title").textContent = d.title;
  $("#h-bio").textContent = d.shortBio; $("#h-photo").src = d.photo;
  $("#h-open").textContent = d.openTo; $("#h-loc").textContent = d.location;
  $("#h-chips").innerHTML = d.chips.map(function (c, i) { return '<li class="fc fc' + (i + 1) + '">' + esc(c) + "</li>"; }).join("");
  $$("[data-linkedin]").forEach(function (a) { a.href = d.linkedin; });
  $$("[data-github]").forEach(function (a) { a.href = d.github; });
  $$("[data-email]").forEach(function (a) { a.href = "mailto:" + d.email; if (a.id === "c-email") a.textContent = d.email; });
  $$("[data-cv-text]").forEach(function (a) { a.textContent = d.resumeText; });
  $("#c-phone").textContent = d.phone; $("#c-phone").href = "tel:" + d.phone.replace(/\s/g, "");
  $("#c-loc").textContent = d.location; $("#yr").textContent = new Date().getFullYear();
  $("#form").action = d.formspreeEndpoint;
  ["about", "experience", "skills", "projects"].forEach(function (k) { $("#i-" + k).textContent = d.sectionIntro[k]; });

  /* Typing headline */
  (function () {
    var el = $("#typed"), i = 0, pos = 0, del = false, ph = d.rotating;
    if (reduce) { el.textContent = ph[0]; return; }
    (function tick() {
      var w = ph[i];
      pos += del ? -1 : 1; el.textContent = w.slice(0, pos);
      var t = del ? 28 : 55;
      if (!del && pos === w.length) { del = true; t = 1700; }
      else if (del && pos === 0) { del = false; i = (i + 1) % ph.length; t = 350; }
      setTimeout(tick, t);
    })();
  })();

  /* About */
  $("#about-text").innerHTML = d.about.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
  $("#facts").innerHTML = d.facts.map(function (f) { return "<div><dt>" + esc(f.k) + "</dt><dd>" + esc(f.v) + "</dd></div>"; }).join("");
  $("#approach").innerHTML = d.approach.map(function (a, i) { return "<li><span class=\"num\">0" + (i + 1) + "</span><h4>" + esc(a.h) + "</h4><p>" + esc(a.p) + "</p></li>"; }).join("");

  /* Experience */
  $("#timeline").innerHTML = d.experience.map(function (j) {
    var stages = j.stages ? '<ol class="stages">' + j.stages.map(function (s) {
      return "<li><span class=\"sw\">" + esc(s.when) + "</span><b>" + esc(s.what) + "</b><span>" + esc(s.detail) + "</span></li>";
    }).join("") + "</ol>" : "";
    return '<li class="job"><h3>' + esc(j.role) + '</h3><p class="co">' + esc(j.company) + " · " + esc(j.location) + '</p><p class="when">' + esc(j.dates) + "</p><p>" + esc(j.summary) + "</p>" + stages + list(j.achievements) +
      (j.impact ? '<p class="impact">' + esc(j.impact) + "</p>" : "") + chips(j.tools) + "</li>";
  }).join("");
  function pairs(a) { return a.map(function (x) { return "<li><b>" + esc(x.h) + "</b><span>" + esc(x.p) + "</span></li>"; }).join(""); }
  $("#edu").innerHTML = pairs(d.education); $("#certs").innerHTML = pairs(d.certifications);

  /* Skills */
  $("#skills-grid").innerHTML = d.competencies.map(function (g) { return '<div class="skill-group"><h3>' + esc(g.group) + "</h3>" + chips(g.items) + "</div>"; }).join("");

  /* Project cards */
  $("#cards").innerHTML = d.projects.map(function (p) {
    var meta = p.featured ? '<ul class="chips key"><li>' + esc(p.badge) + "</li><li>Team " + esc(p.teamName) + "</li><li>" + esc(p.date) + "</li></ul>" : "";
    var stats = p.featured ? '<ul class="mini-stats">' + p.stats.slice(0, 2).map(function (s) { return "<li><b>" + esc(s.v) + "</b><span>" + esc(s.l) + "</span></li>"; }).join("") + "</ul>" : "";
    return '<article class="card' + (p.featured ? " feature" : "") + '"><div class="thumb"><img src="' + esc(p.image) + '" alt="' + (p.featured ? "Cover slide of the hackathon pitch for " : "Workflow illustration for ") + esc(p.shortName) + '" loading="lazy" width="1280" height="720" data-fallback></div>' +
      '<div class="card-b">' + meta + '<p class="cat">' + esc(p.category) + "</p><h3>" + esc(p.shortName) + "</h3>" + (p.tagline ? '<p class="tagl">' + esc(p.tagline) + "</p>" : "") + "<p>" + esc(p.short) + "</p>" + stats +
      '<div><p class="lbl">Tools</p>' + chips(p.tools) + '</div><div><p class="lbl">Skills demonstrated</p>' + chips(p.skills) + "</div>" +
      '<button class="btn primary" type="button" data-case="' + esc(p.id) + '">View case study</button></div></article>';
  }).join("");
  function fallback(img) { var b = img.parentNode; b.classList.add("empty"); b.textContent = "Project image to be added"; }
  $$("img[data-fallback]").forEach(function (im) { im.addEventListener("error", function () { fallback(im); }); if (im.complete && im.naturalWidth === 0) fallback(im); });

  /* Dialog helper */
  function openDlg(m) { if (m.showModal) m.showModal(); else m.setAttribute("open", ""); document.body.style.overflow = "hidden"; m.scrollTop = 0; }
  function closeDlg(m) { if (m.close) m.close(); else m.removeAttribute("open"); }
  function wireDlg(m, closeBtn, back) {
    closeBtn.addEventListener("click", function () { closeDlg(m); });
    m.addEventListener("click", function (e) { if (e.target === m) closeDlg(m); });
    m.addEventListener("close", function () { document.body.style.overflow = ""; if (back.el) back.el.focus(); });
  }

  /* CV viewer: view only (page images, no file download) */
  var cv = $("#cv"), cvBack = {};
  $("#cv-pages").innerHTML = d.cvPages.map(function (src, i) { return '<img src="' + esc(src) + '" alt="Curriculum vitae, page ' + (i + 1) + '" draggable="false">'; }).join("");
  $("#cv-pages").addEventListener("contextmenu", function (e) { e.preventDefault(); });
  wireDlg(cv, $("#cv-close"), cvBack);
  $$("[data-cv]").forEach(function (a) { a.addEventListener("click", function (e) { e.preventDefault(); cvBack.el = a; var mb = $("#menu"); if (mb) mb.classList.remove("open"); openDlg(cv); }); });

  /* Case study modal */
  var modal = $("#modal"), body = $("#m-body"), back = {}, deck = null;
  wireDlg(modal, $("#m-close"), back);
  function sec(h, html, id) { return '<section class="cs-sec"' + (id ? ' id="' + id + '"' : "") + "><h3>" + h + "</h3>" + html + "</section>"; }
  function cards(a) { return '<div class="mini-cards">' + a.map(function (x) { return '<div class="mc' + (x.key ? " key" : "") + '"><b>' + esc(x.h) + "</b><span>" + esc(x.p) + "</span></div>"; }).join("") + "</div>"; }
  function slideFig(p, n, cap) { return '<figure class="slidefig"><img src="' + esc(p.slides[n]) + '" alt="' + esc(cap) + '" loading="lazy" draggable="false"><figcaption>' + esc(cap) + "</figcaption></figure>"; }

  function renderFeatured(p) {
    var st = p.stakeholders;
    return '<article class="cs rich"><div class="cs-hero"><ul class="chips key"><li>' + esc(p.badge) + "</li><li>Team " + esc(p.teamName) + "</li><li>" + esc(p.date) + "</li></ul>" +
      '<h2 id="m-title">' + esc(p.name) + '</h2><p class="tagl big">' + esc(p.tagline) + "</p><p>" + esc(p.pitch) + "</p>" +
      '<dl class="meta"><div><dt>My role</dt><dd>' + esc(p.role) + "</dd></div><div><dt>Team</dt><dd>" + p.team.map(esc).join(" · ") + "</dd></div><div><dt>Deliverable</dt><dd>BRD ref. " + esc(p.brdRef) + " and sponsor pitch deck</dd></div></dl>" +
      '<p class="note">' + esc(p.hackathonNote) + "</p></div>" +
      '<div class="stats">' + p.stats.map(function (s) { return "<div><b>" + esc(s.v) + "</b><span>" + esc(s.l) + "</span></div>"; }).join("") + "</div>" +
      sec("Business problem", "<p>" + esc(p.problem) + "</p>" + slideFig(p, 1, "Root-cause view from the BRD: without ownership, consistent workflows and quality data, AI follow-up cannot be deployed safely.") +
        '<ul class="tick"><li>Separate systems and patient IDs</li><li>Discharge steps differ by site</li><li>No clear owner for AI-supported decisions</li></ul>') +
      sec("Objective", "<p>" + esc(p.objective) + "</p>") +
      sec("Approach", "<p><b>Methodology</b></p>" + chips(p.methodology) + '<p class="gap"><b>Tools</b></p>' + chips(p.tools) + '<p class="gap"><b>Data considered</b></p><p>' + esc(p.dataSource) + "</p>") +
      sec("Analysis: today, where follow-up breaks", cards(p.asIs) + slideFig(p, 2, "AS-IS discharge and follow-up process across both hospitals")) +
      sec("Analysis: tomorrow, one governed flow", cards(p.toBe) + slideFig(p, 3, "TO-BE process flow with an identity gate and a human gate")) +
      sec("Analysis: who we engage, and how",
        '<div class="grid2x2"><div class="q"><h4>Keep satisfied</h4><p>' + st.satisfy.map(esc).join("<br>") + '</p></div><div class="q hot"><h4>Manage closely</h4><p>' + st.manage.map(esc).join("<br>") + '</p></div><div class="q"><h4>Monitor</h4><p>' + esc(st.monitor) + '</p></div><div class="q"><h4>Keep informed</h4><p>' + st.inform.map(esc).join("<br>") + "</p></div></div>" +
        '<p class="axis">Vertical: power (high above, low below). Horizontal: interest (low left, high right).</p>') +
      sec("Findings", list(p.findings) + '<h4 class="sub">AI predicts. People decide.</h4>' + cards(p.principles)) +
      sec("Recommendations", list(p.recommendations) +
        '<h4 class="sub">Risks, and how we control them</h4><div class="rt">' + p.risks.map(function (r) { return '<div><b>' + esc(r[0]) + "</b><span>" + esc(r[1]) + "</span></div>"; }).join("") + "</div>") +
      sec("Outcome", "<p>" + esc(p.outcome) + "</p>" + '<h4 class="sub">Our ask: discovery to pilot</h4><ol class="road">' + p.roadmap.map(function (r) { return "<li><span>" + esc(r.n) + "</span><b>" + esc(r.h) + "</b><p>" + esc(r.p) + "</p></li>"; }).join("") + "</ol><p>" + esc(p.ask) + "</p>") +
      sec("Business impact", "<p>" + esc(p.impact) + '</p><h4 class="sub">Value we will measure</h4><div class="mini-cards k3">' + p.kpis.map(function (k) { return '<div class="mc"><b>' + esc(k.h) + "</b><span>Owner: " + esc(k.o) + "</span></div>"; }).join("") + '</div><p class="note">' + esc(p.kpiNote) + '</p><h4 class="sub">Sustainable Development Goals alignment</h4>' + cards(p.sdgs)) +
      sec("Solution deck (view only)", '<div class="deck" id="deck"><div class="deck-stage"><img id="deck-img" alt="" draggable="false"></div><div class="deck-bar"><button type="button" class="btn" id="deck-prev" aria-label="Previous slide">Previous</button><span id="deck-count" aria-live="polite"></span><button type="button" class="btn" id="deck-next" aria-label="Next slide">Next</button></div><div class="deck-thumbs" id="deck-thumbs"></div></div>', "deck-sec") +
      sec("References", '<ol class="refs">' + p.references.map(function (r) { return "<li>" + esc(r.t) + (r.u ? ' <a href="' + esc(r.u) + '" target="_blank" rel="noopener">Source</a>' : "") + "</li>"; }).join("") + "</ol>") + "</article>";
  }

  function renderStandard(p) {
    return '<article class="cs"><p class="cat">' + esc(p.category) + '</p><h2 id="m-title">' + esc(p.name) + "</h2>" +
      '<dl class="meta"><div><dt>My role</dt><dd>' + esc(p.role) + "</dd></div><div><dt>Data source</dt><dd>" + esc(p.dataSource) + "</dd></div></dl>" +
      '<div class="cs-img"><img src="' + esc(p.image) + '" alt="Workflow illustration for ' + esc(p.shortName) + '" loading="lazy" draggable="false"></div>' +
      sec("Business problem", "<p>" + esc(p.problem) + "</p>") + sec("Objective", "<p>" + esc(p.objective) + "</p>") +
      sec("Approach", "<p><b>Methodology</b></p>" + chips(p.methodology) + '<p class="gap"><b>Tools</b></p>' + chips(p.tools)) +
      sec("Analysis", list(p.analysis)) + sec("Findings", list(p.findings)) + sec("Recommendations", list(p.recommendations)) +
      sec("Outcome", "<p>" + esc(p.outcome) + "</p>") + sec("Business impact", "<p>" + esc(p.impact) + "</p>") +
      (p.documentReady ? '<p class="gap"><a class="btn" href="' + esc(p.document) + '" target="_blank" rel="noopener">' + esc(p.documentLabel) + "</a></p>" : "") + "</article>";
  }

  function initDeck(p) {
    var i = 0, img = $("#deck-img"), cnt = $("#deck-count"), th = $("#deck-thumbs");
    th.innerHTML = p.slides.map(function (s, k) { return '<button type="button" class="th" data-i="' + k + '" aria-label="Slide ' + (k + 1) + ": " + esc(p.slideTitles[k]) + '"><img src="' + esc(s) + '" alt="" loading="lazy" draggable="false"></button>'; }).join("");
    function show(n) {
      i = (n + p.slides.length) % p.slides.length; img.src = p.slides[i]; img.alt = "Slide " + (i + 1) + ": " + p.slideTitles[i];
      cnt.textContent = (i + 1) + " / " + p.slides.length + " · " + p.slideTitles[i];
      $$(".th", th).forEach(function (b, k) { b.classList.toggle("on", k === i); });
    }
    $("#deck-prev").addEventListener("click", function () { show(i - 1); });
    $("#deck-next").addEventListener("click", function () { show(i + 1); });
    th.addEventListener("click", function (e) { var b = e.target.closest(".th"); if (b) show(+b.getAttribute("data-i")); });
    $("#deck").addEventListener("keydown", function (e) { if (e.key === "ArrowRight") show(i + 1); if (e.key === "ArrowLeft") show(i - 1); });
    $("#deck").addEventListener("contextmenu", function (e) { e.preventDefault(); });
    show(0);
  }

  function openCase(id, btn, jump) {
    var p = d.projects.filter(function (x) { return x.id === id; })[0]; if (!p) return;
    back.el = btn; body.innerHTML = p.featured ? renderFeatured(p) : renderStandard(p);
    if (p.featured) initDeck(p);
    openDlg(modal);
    if (jump) { var t = $("#" + jump, body); if (t) t.scrollIntoView(); }
  }
  $("#cards").addEventListener("click", function (e) { var b = e.target.closest("[data-case]"); if (b) openCase(b.getAttribute("data-case"), b); });

  /* Theme */
  var root = document.documentElement, tbtn = $("#theme");
  function isDark() { var t = root.getAttribute("data-theme"); return t ? t === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches; }
  function label() { tbtn.setAttribute("aria-label", isDark() ? "Switch to light theme" : "Switch to dark theme"); }
  tbtn.addEventListener("click", function () { var n = isDark() ? "light" : "dark"; root.setAttribute("data-theme", n); try { localStorage.setItem("theme", n); } catch (e) {} label(); });
  label();

  /* Mobile menu */
  var burger = $("#burger"), menu = $("#menu");
  function setMenu(o) { menu.classList.toggle("open", o); burger.setAttribute("aria-expanded", o); burger.setAttribute("aria-label", o ? "Close menu" : "Open menu"); }
  burger.addEventListener("click", function () { setMenu(!menu.classList.contains("open")); });
  menu.addEventListener("click", function (e) { if (e.target.tagName === "A") setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  /* Nav state, active link, reveal */
  var nav = $("#nav");
  window.addEventListener("scroll", function () { nav.classList.toggle("scrolled", window.scrollY > 8); }, { passive: true });
  var links = $$("#menu a[href^='#']").filter(function (a) { return !a.hasAttribute("data-cv"); });
  if ("IntersectionObserver" in window) {
    var so = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) links.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id); }); }); }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach(function (s) { so.observe(s); });
    var ro = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); ro.unobserve(en.target); } }); }, { threshold: 0.06 });
    $$(".sec .wrap").forEach(function (w) { w.classList.add("reveal"); ro.observe(w); });
  }

  /* Contact form */
  var form = $("#form"), status = $("#status"), send = $("#send");
  var rules = { name: "Enter your name.", email: "Enter a valid email address.", subject: "Enter a subject.", message: "Enter a message." };
  function check(el) { var bad = !el.value.trim() || (el.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim())); el.setAttribute("aria-invalid", bad); $("#e-" + el.name).textContent = bad ? rules[el.name] : ""; return !bad; }
  ["name", "email", "subject", "message"].forEach(function (n) { var el = form.elements[n]; el.addEventListener("blur", function () { check(el); }); el.addEventListener("input", function () { if (el.getAttribute("aria-invalid") === "true") check(el); }); });
  form.addEventListener("submit", function (e) {
    e.preventDefault(); status.textContent = ""; status.className = "status";
    var ok = true, first = null;
    ["name", "email", "subject", "message"].forEach(function (n) { if (!check(form.elements[n])) { ok = false; first = first || form.elements[n]; } });
    if (!ok) { first.focus(); return; }
    if (window.fetch) {
      send.disabled = true; send.textContent = "Sending…";
      fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (r) { if (r.ok) { form.reset(); status.textContent = "Thank you. Your message has been sent and I will reply by email."; status.className = "status ok"; } else throw new Error("fail"); })
        .catch(function () { status.textContent = "Your message could not be sent. Please try again, or email " + d.email + " directly."; status.className = "status bad"; })
        .then(function () { send.disabled = false; send.textContent = "Send message"; });
    } else { form.submit(); }
  });
})();
