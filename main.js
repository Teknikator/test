/* ===================================================================
   teknikator — Interaktion
   Alles ist optional: ohne JavaScript bleibt die Seite vollständig
   lesbar, und bei "prefers-reduced-motion" läuft nichts davon an.
   =================================================================== */

(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------------------------------------------------------------
     1 — Boot-Sequenz: Zähler von 000 auf 100, dann Vorhang nach oben
     --------------------------------------------------------------- */

  var boot = document.getElementById("boot");
  var bootDone = false;

  function endBoot() {
    if (bootDone) return;
    bootDone = true;
    startReveals();
    if (!boot) return;
    boot.classList.add("is-done");
    window.setTimeout(function () {
      if (boot.parentNode) boot.parentNode.removeChild(boot);
    }, 1000);
    if (!reduced) flashGlitch();
  }

  function runBoot() {
    var fill = document.getElementById("bootFill");
    var pct = document.getElementById("bootPct");
    var log = document.getElementById("bootLog");
    var stages = [
      [0, "Verbindung wird aufgebaut"],
      [24, "Schriften werden geladen"],
      [48, "Raster wird kalibriert"],
      [74, "Tech-Stack wird indexiert"],
      [97, "Bereit"]
    ];
    var start = performance.now();
    var duration = 1500;

    (function step(now) {
      var p = Math.min(1, (now - start) / duration);
      var eased = 1 - Math.pow(1 - p, 3);
      var value = Math.round(eased * 100);

      if (pct) pct.textContent = String(value).padStart(3, "0");
      if (fill) fill.style.transform = "scaleX(" + eased + ")";
      if (log) {
        for (var i = stages.length - 1; i >= 0; i--) {
          if (value >= stages[i][0]) {
            if (log.textContent !== stages[i][1]) log.textContent = stages[i][1];
            break;
          }
        }
      }

      if (p < 1) requestAnimationFrame(step);
      else window.setTimeout(endBoot, 280);
    })(start);
  }

  if (reduced || !boot) {
    if (boot && boot.parentNode) boot.parentNode.removeChild(boot);
    endBoot();
  } else {
    runBoot();
    window.setTimeout(endBoot, 4500); // Notausstieg, falls etwas klemmt
  }

  /* ---------------------------------------------------------------
     2 — Einblenden beim Scrollen, mit gestaffelter Verzögerung
     --------------------------------------------------------------- */

  function stagger(nodes, stepMs) {
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].style.setProperty("--d", i * stepMs + "ms");
    }
  }

  stagger(document.querySelectorAll(".hero .reveal"), 90);
  stagger(document.querySelectorAll(".section__head .reveal"), 90);

  var chipGroups = document.querySelectorAll(".chips");
  for (var g = 0; g < chipGroups.length; g++) {
    stagger(chipGroups[g].children, 45);
  }

  function showAll() {
    var all = document.querySelectorAll(".reveal, .stack");
    for (var i = 0; i < all.length; i++) all[i].classList.add("is-in");
  }

  function startReveals() {
    var targets = document.querySelectorAll(".reveal, .stack");

    if (reduced || !("IntersectionObserver" in window)) {
      showAll();
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          entries[i].target.classList.add("is-in");
          io.unobserve(entries[i].target);
        }
      }
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });

    for (var j = 0; j < targets.length; j++) io.observe(targets[j]);
    window.setTimeout(showAll, 7000); // Notausstieg
  }

  /* ---------------------------------------------------------------
     3 — Hintergrund: Punktraster mit Welle, Suchscheinwerfer und
         einem Scan, der regelmäßig durchs Bild läuft
     --------------------------------------------------------------- */

  var canvas = document.getElementById("field");

  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext("2d");
    var W = 0;
    var H = 0;
    var GAP = 34;
    var RADIUS = 165;
    var px = -9999;
    var py = -9999;
    var running = false;

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      var scan = ((t * 0.05) % (H + 520)) - 260;

      for (var y = GAP / 2; y < H; y += GAP) {
        var scanDist = Math.abs(y - scan);
        var scanLift = scanDist < 78 ? 1 - scanDist / 78 : 0;

        for (var x = GAP / 2; x < W; x += GAP) {
          var wave = Math.sin(x * 0.009 + y * 0.011 - t * 0.0011);
          var alpha = 0.075 + 0.05 * wave;
          var size = 1.4;
          var hot = scanLift * 0.75;

          alpha += scanLift * 0.32;

          var dx = x - px;
          var dy = y - py;
          var d2 = dx * dx + dy * dy;

          if (d2 < RADIUS * RADIUS) {
            var f = 1 - Math.sqrt(d2) / RADIUS;
            f *= f;
            alpha += 0.5 * f;
            size += 2.4 * f;
            if (f > hot) hot = f;
          }

          if (alpha <= 0.01) continue;

          if (hot > 0.02) {
            ctx.fillStyle = "rgba(" + Math.round(120 + 100 * hot) + "," +
              Math.round(196 + 30 * hot) + ",255," + Math.min(alpha, 0.92) + ")";
          } else {
            ctx.fillStyle = "rgba(138,168,198," + alpha + ")";
          }

          ctx.fillRect(x - size / 2, y - size / 2, size, size);
        }
      }
    }

    function frame(now) {
      if (!running) return;
      draw(now);
      requestAnimationFrame(frame);
    }

    function play() {
      if (running || reduced) return;
      running = true;
      requestAnimationFrame(frame);
    }

    function pause() {
      running = false;
    }

    resize();

    if (reduced) {
      draw(0);
    } else {
      play();
      document.addEventListener("visibilitychange", function () {
        if (document.hidden) pause();
        else play();
      });
    }

    var resizeTimer;
    window.addEventListener("resize", function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        resize();
        if (reduced) draw(0);
      }, 160);
    });

    if (canHover && !reduced) {
      window.addEventListener("pointermove", function (e) {
        px = e.clientX;
        py = e.clientY;
        document.documentElement.style.setProperty("--px", px + "px");
        document.documentElement.style.setProperty("--py", py + "px");
      }, { passive: true });

      document.addEventListener("pointerleave", function () {
        px = -9999;
        py = -9999;
      });
    }
  }

  /* ---------------------------------------------------------------
     4 — Leuchten unter dem Cursor auf den Tech-Stack-Kacheln
     --------------------------------------------------------------- */

  if (canHover) {
    for (var c = 0; c < chipGroups.length; c++) {
      chipGroups[c].addEventListener("pointermove", function (e) {
        var chip = e.target.closest ? e.target.closest("li") : null;
        if (!chip) return;
        var r = chip.getBoundingClientRect();
        chip.style.setProperty("--mx", (e.clientX - r.left) + "px");
        chip.style.setProperty("--my", (e.clientY - r.top) + "px");
      }, { passive: true });
    }
  }

  /* ---------------------------------------------------------------
     5 — Scroll: Fortschrittsbalken und Parallaxe
     --------------------------------------------------------------- */

  var progressFill = document.getElementById("progressFill");
  var parallax = document.querySelectorAll("[data-parallax]");
  var queued = false;

  function applyScroll() {
    queued = false;
    var y = window.scrollY || window.pageYOffset || 0;
    var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

    if (progressFill) {
      progressFill.style.transform = "scaleX(" + Math.min(1, y / max) + ")";
    }

    if (reduced) return;

    for (var i = 0; i < parallax.length; i++) {
      var el = parallax[i];
      var speed = parseFloat(el.getAttribute("data-parallax")) || 0;
      el.style.transform = "translate3d(0," + (y * speed).toFixed(2) + "px,0)";

      var fade = parseFloat(el.getAttribute("data-fade"));
      if (fade) el.style.opacity = String(Math.max(0, 1 - y / fade));
    }
  }

  window.addEventListener("scroll", function () {
    if (queued) return;
    queued = true;
    requestAnimationFrame(applyScroll);
  }, { passive: true });

  applyScroll();

  /* ---------------------------------------------------------------
     6 — Glitch auf dem Namen: einmal beim Start, danach sporadisch
     --------------------------------------------------------------- */

  var name = document.querySelector(".glitch");

  function flashGlitch() {
    if (!name || reduced) return;
    name.classList.add("is-glitching");
    window.setTimeout(function () {
      name.classList.remove("is-glitching");
    }, 520);
  }

  if (name && !reduced) {
    (function schedule() {
      window.setTimeout(function () {
        flashGlitch();
        schedule();
      }, 5200 + Math.random() * 5200);
    })();

    name.addEventListener("pointerenter", flashGlitch);
  }

  /* ---------------------------------------------------------------
     7 — Uhr in der Kopfzeile (echte Ortszeit des Besuchers)
     --------------------------------------------------------------- */

  var clock = document.getElementById("clock");

  if (clock) {
    (function tickClock() {
      clock.textContent = new Date().toLocaleTimeString("de-DE", { hour12: false });
      window.setTimeout(tickClock, 1000);
    })();
  }
})();
