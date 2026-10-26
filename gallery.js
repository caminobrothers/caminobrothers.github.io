/* Camino Brothers — mobile nav toggle + gallery lightbox (no dependencies) */
(function () {
  "use strict";

  /* ----- mobile nav ----- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ----- lightbox ----- */
  var gallery = document.querySelector(".gallery");
  if (!gallery) return;

  var items = Array.prototype.slice.call(gallery.querySelectorAll("button[data-full]"));
  if (!items.length) return;

  var overlay = document.createElement("div");
  overlay.className = "lightbox";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Photo viewer");
  overlay.innerHTML =
    '<button class="lb-btn lb-close" aria-label="Close photo viewer">&times;</button>' +
    '<button class="lb-btn lb-prev" aria-label="Previous photo">&#8249;</button>' +
    '<figure><img alt=""><figcaption></figcaption></figure>' +
    '<button class="lb-btn lb-next" aria-label="Next photo">&#8250;</button>' +
    '<div class="lb-count" aria-live="polite"></div>';
  document.body.appendChild(overlay);

  var img = overlay.querySelector("img");
  var caption = overlay.querySelector("figcaption");
  var count = overlay.querySelector(".lb-count");
  var current = 0;
  var lastFocus = null;

  function show(i) {
    current = (i + items.length) % items.length;
    var btn = items[current];
    img.src = btn.getAttribute("data-full");
    img.alt = btn.getAttribute("data-alt") || "";
    caption.textContent = btn.getAttribute("data-caption") || "";
    count.textContent = (current + 1) + " / " + items.length;
  }
  function open(i) {
    lastFocus = document.activeElement;
    show(i);
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    overlay.querySelector(".lb-close").focus();
  }
  function close() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
    img.removeAttribute("src");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  items.forEach(function (btn, i) {
    btn.addEventListener("click", function () { open(i); });
  });
  overlay.querySelector(".lb-close").addEventListener("click", close);
  overlay.querySelector(".lb-prev").addEventListener("click", function (e) { e.stopPropagation(); show(current - 1); });
  overlay.querySelector(".lb-next").addEventListener("click", function (e) { e.stopPropagation(); show(current + 1); });
  overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });

  document.addEventListener("keydown", function (e) {
    if (!overlay.classList.contains("open")) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") show(current - 1);
    else if (e.key === "ArrowRight") show(current + 1);
  });

  /* ----- map thumbnail lightbox (title-row) ----- */
  var mapBtn = document.querySelector(".map-thumb[data-full]");
  if (mapBtn) {
    var mov = document.createElement("div");
    mov.className = "lightbox";
    mov.setAttribute("role", "dialog");
    mov.setAttribute("aria-modal", "true");
    mov.setAttribute("aria-label", "Map viewer");
    mov.innerHTML = '<button class="lb-btn lb-close" aria-label="Close map viewer">&times;</button>' +
      '<figure><img alt=""><figcaption></figcaption></figure>';
    document.body.appendChild(mov);
    var mimg = mov.querySelector("img");
    var mcap = mov.querySelector("figcaption");
    function mclose() { mov.classList.remove("open"); document.body.style.overflow = ""; mimg.removeAttribute("src"); }
    mapBtn.addEventListener("click", function () {
      mimg.src = mapBtn.getAttribute("data-full");
      mimg.alt = mapBtn.getAttribute("data-alt") || "";
      mcap.textContent = mapBtn.getAttribute("data-caption") || "";
      mov.classList.add("open");
      document.body.style.overflow = "hidden";
      mov.querySelector(".lb-close").focus();
    });
    mov.querySelector(".lb-close").addEventListener("click", mclose);
    mov.addEventListener("click", function (e) { if (e.target === mov) mclose(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && mov.classList.contains("open")) mclose(); });
  }
})();
