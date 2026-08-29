/**
 * The louder half of the design.
 *
 * theme.mjs sets the quiet foundation — GitHub-adjacent, restrained, readable.
 * This file is what stops the site reading as a documentation page: an animated
 * hero that performs the product rather than describing it, alternating section
 * grounds so the page has rhythm, and the three accents used with conviction
 * instead of apologetically.
 *
 * Deliberately NOT here: a violet-to-blue gradient hero, glassmorphism, or a
 * three-across card grid of icons. Those are the house style of every AI landing
 * page shipped this year, and looking like everyone else is the one thing a
 * project about telling things apart cannot afford.
 */

export const CSS_EXTRA = `
/* ── grounds ────────────────────────────────────────────────────────────── */
.band { background: var(--bg-subtle); border-block: 1px solid var(--border); }
.band-tight { padding-block: clamp(32px, 5vw, 56px); }

/* ── hero ───────────────────────────────────────────────────────────────── */
/*
 * The hero background is the mark at page scale.
 *
 * What was here before was a canvas of glyphs raining out of noise: forty
 * lines of JavaScript, a requestAnimationFrame loop on every page of the site,
 * and a picture of "hacking" rather than of anything this project does. It
 * also lost the argument it was making — code falling down a screen is what a
 * film uses to mean "computer", which is the exact opposite of a tool whose
 * whole claim is that it shows you what is really there.
 *
 * This is the same idea as the logo, drawn across the whole section: a page of
 * text seen from far enough away that only the lines remain, cut along one
 * diagonal, and the far side slid sideways. Nothing is hidden and nothing is
 * missing — the lines simply stop agreeing with each other halfway across.
 *
 * Two elements, no script, no animation loop, and it costs the same on a
 * phone as on a workstation.
 */
.hero-stage { position: relative; overflow: hidden; isolation: isolate; }

.hero-stage::before,
.hero-stage::after {
  content: ''; position: absolute; inset: -10% -5%; z-index: -1; pointer-events: none;
  /* Lines of "text": 2px of ink every 15px, never quite reaching the edges. */
  background-image: repeating-linear-gradient(
    180deg,
    color-mix(in srgb, var(--fg) 12%, transparent) 0 2px,
    transparent 2px 15px
  );
  /* Fades out towards the bottom right, so the headline always sits on quiet
     ground and the displacement is discovered rather than announced. */
  -webkit-mask-image: radial-gradient(115% 85% at 8% 12%, #000 12%, transparent 72%);
  mask-image: radial-gradient(115% 85% at 8% 12%, #000 12%, transparent 72%);
  opacity: 0.55;
}

/* The far side of the fault: the same lines, clipped to the other half of a
   45° cut, and moved. 13px is not arbitrary — it is just under the 15px line
   pitch, so the halves land almost but never quite back in register. */
.hero-stage::after {
  transform: translate(13px, -13px);
  -webkit-clip-path: polygon(115% -15%, 115% 115%, -15% 115%);
  clip-path: polygon(115% -15%, 115% 115%, -15% 115%);
}
.hero-stage::before {
  -webkit-clip-path: polygon(-15% -15%, 115% -15%, -15% 115%);
  clip-path: polygon(-15% -15%, 115% -15%, -15% 115%);
}

/* A product page tints its own fault in its own accent. */
.hero-stage.airlock::after { background-image: repeating-linear-gradient(180deg, color-mix(in srgb, var(--airlock) 26%, transparent) 0 2px, transparent 2px 15px); }
.hero-stage.nexus::after   { background-image: repeating-linear-gradient(180deg, color-mix(in srgb, var(--nexus) 26%, transparent) 0 2px, transparent 2px 15px); }
.hero-stage.index::after   { background-image: repeating-linear-gradient(180deg, color-mix(in srgb, var(--accent-idx) 26%, transparent) 0 2px, transparent 2px 15px); }

/* Motion here would be decoration; there is none, so nothing to disable. The
   contrast still comes down for anyone who asked for less. */
@media (prefers-reduced-motion: reduce) {
  .hero-stage::before, .hero-stage::after { opacity: 0.32; }
}

/*
 * Der eine Verlauf der Marke: Violett in Himmel in Cyan — die Schichtung, die
 * das Farbsystem ueberall sonst nur andeutet, hier einmal ausgeschrieben. Er
 * liegt auf DREI Stellen und keiner weiteren: dem einen Wort im Aufmacher,
 * der Haarlinie ueber dem Fuss und dem Lesefortschritt. Ein Verlauf, der
 * viermal auftritt, ist Dekoration; dreimal ist er eine Handschrift.
 */
.hero h1 .lit {
  background: linear-gradient(96deg, var(--marke), var(--himmel) 58%, var(--nexus));
  -webkit-background-clip: text; background-clip: text; color: transparent;
}

/* ── stat band ──────────────────────────────────────────────────────────── */
.stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--e1); }
.stats > div { background: var(--surface); padding: 20px 22px; transition: background var(--fast) var(--ease); }
.stats > div:hover { background: var(--surface-2); }
.stats .n { font-family: var(--mono); font-size: clamp(1.4rem, 1.1rem + 1vw, 2rem); font-weight: 700; letter-spacing: -0.03em; font-variant-numeric: tabular-nums; line-height: 1.1; }
.stats .l { font-size: 0.78rem; color: var(--fg-muted); margin-top: 0.35rem; }
.stats .n.a { color: var(--airlock); }
.stats .n.n2 { color: var(--nexus); }
.stats .n.i { color: var(--accent-idx); }

/*
 * Der Anschluss-Abschnitt: kein Trennstrich, aber mehr Luft.
 *
 * Wo eine Linie faellt, muss der Abstand die Arbeit uebernehmen — sonst
 * rutschen zwei Abschnitte zu einem zusammen und man liest die zweite
 * Ueberschrift als Unterpunkt der ersten.
 */
.anschluss { padding-top: clamp(56px, 7vw, 96px); }

/*
 * ══ DER WEGWEISER ═════════════════════════════════════════════════════════
 *
 * Ein Verzeichnis am Anfang einer langen Leseseite. Es ist kein Menue: es
 * sagt zuerst, WIE LANG das hier wird, und erst danach, wohin man springen
 * kann. Deshalb steht die Nummer vor dem Titel und nicht ein Aufzaehlpunkt.
 *
 * Zwei Spalten ab Tablettbreite, damit sieben Zeilen nicht selbst zu einer
 * halben Bildschirmhoehe werden — das waere derselbe Fehler wie die
 * Schlagwortwand auf der Indexseite.
 */
.wegweiser {
  margin-top: 1.6rem; padding: 18px 20px;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius-lg); box-shadow: var(--e1), var(--sheen);
  max-width: 62ch;
}
.wegweiser-titel {
  display: block; margin-bottom: 10px;
  font-family: var(--anzeige); font-size: 0.72rem; font-weight: 600;
  letter-spacing: 0.13em; text-transform: uppercase; color: var(--fg-subtle);
}
.wegweiser ol {
  list-style: none; margin: 0; padding: 0;
  display: grid; gap: 1px 26px;
}
@media (min-width: 620px) { .wegweiser ol { grid-template-columns: 1fr 1fr; } }
.wegweiser a {
  display: flex; gap: 10px; align-items: baseline;
  padding: 5px 8px; margin-inline: -8px; border-radius: var(--radius);
  color: var(--fg-muted); font-size: 0.92rem;
  transition: color var(--fast) var(--ease), background-color var(--fast) var(--ease);
}
.wegweiser a:hover { color: var(--fg); background: var(--surface-2); text-decoration: none; }
/* Tabellenziffern: sieben Nummern untereinander duerfen nicht wackeln. */
.wegweiser-n {
  font-family: var(--mono); font-size: 0.78rem; color: var(--fg-subtle);
  font-variant-numeric: tabular-nums; flex: none;
}

/*
 * ══ DAS BEWEISSTUECK ══════════════════════════════════════════════════════
 *
 * Steht hier und nicht in der CSS einer einzelnen Seite, weil es inzwischen
 * ZWEI Seiten benutzen: die Startseite und AIRLOCK. Eine zweite Kopie waere
 * die, die als erste veraltet — und es sind fuenfzehn Zeilen, die dafuer auf
 * jeder Seite mitfahren. Der Tausch lohnt sich.
 *
 * Die Kopfzeile und das <pre> teilen sich einen Rahmen — deshalb verliert das
 * <pre> hier seinen eigenen Rahmen und seine oberen Radien. Zwei Kanten
 * uebereinander, wie es ohne diese Zeile aussaehe, liest man als zwei
 * Kaesten, die zufaellig aneinanderstossen.
 *
 * Die Bildunterschrift steht AUSSERHALB des Rahmens: sie gehoert zum Leser,
 * nicht zur Ausgabe. Was im Rahmen steht, hat das Programm geschrieben; was
 * darunter steht, sage ich.
 */
.beweis { margin: 0; }
.beweis-kopf {
  display: flex; align-items: center; gap: 12px;
  padding: 9px 14px;
  background: var(--surface-2);
  border: 1px solid var(--border); border-bottom: 0;
  border-radius: var(--radius) var(--radius) 0 0;
  font-family: var(--mono); font-size: 0.74rem;
}
.beweis-marke {
  letter-spacing: 0.12em; font-weight: 700; color: var(--airlock);
}
.beweis-kopf code { color: var(--fg-subtle); background: none; padding: 0; }
.beweis .terminal { border-radius: 0 0 var(--radius) var(--radius); border-top: 0; }
.beweis-fuss {
  margin-top: 12px; color: var(--fg-muted);
  font-size: 0.88rem; line-height: 1.6; max-width: 68ch;
}


/* ── cards with presence ────────────────────────────────────────────────── */
.card {
  transition: border-color var(--fast) var(--ease), transform var(--fast) var(--ease),
              box-shadow var(--fast) var(--ease);
}
.card.lift:hover, .card.product:hover {
  border-color: var(--border-strong);
  transform: translateY(-3px);
  box-shadow: var(--e3), var(--sheen);
}
@media (prefers-reduced-motion: reduce) {
  .card, .card.lift:hover, .card.product:hover { transition: none; transform: none; }
}

/**
 * A product card carries its accent twice: as the hairline along the top, and
 * as a faint wash bleeding down from it. The wash is what stops the accent
 * reading as a stripe stuck onto a white box.
 */
.card.product { position: relative; overflow: hidden; border-top: 1px solid var(--border); }
.card.product::before { content: ''; position: absolute; inset: 0 0 auto 0; height: 3px; }
.card.product::after {
  content: ''; position: absolute; inset: 0 0 auto 0; height: 160px; z-index: -1;
  pointer-events: none;
}
.card.product > * { position: relative; }
.card.product.airlock::before { background: linear-gradient(90deg, var(--airlock), transparent 85%); }
.card.product.nexus::before   { background: linear-gradient(90deg, var(--nexus), transparent 85%); }
.card.product.index::before   { background: linear-gradient(90deg, var(--accent-idx), transparent 85%); }
.card.product.airlock::after { background: linear-gradient(180deg, color-mix(in srgb, var(--airlock) 9%, transparent), transparent); }
.card.product.nexus::after   { background: linear-gradient(180deg, color-mix(in srgb, var(--nexus) 9%, transparent), transparent); }
.card.product.index::after   { background: linear-gradient(180deg, color-mix(in srgb, var(--accent-idx) 9%, transparent), transparent); }

.accent-index { color: var(--accent-idx); }

/* ── crop-mark corners ──────────────────────────────────────────────────── */
/*
 * Die scharfe Kante im weichen System — und zwar mit Absicht NEBEN der
 * Rundung, nicht statt ihrer. Die Karte behaelt ihren Radius; zwei Winkel
 * aus je zwei geraden Strichen sitzen AUSSERHALB der Ecken, wie Schnittmarken
 * auf einem Druckbogen. Sie sind das Gegenteil der Rundung und genau deshalb
 * sichtbar: ein spitzer Winkel neben einer weichen Ecke liest sich als
 * gesetztes Zeichen, ein spitzer Winkel AUF der weichen Ecke als Fehler.
 *
 * Die Farbe kommt aus --eck und faellt auf die Marke zurueck. Eine Karte, die
 * einem Projekt gehoert, setzt --eck auf dessen Akzent — dieselbe Konstruktion
 * ueberall, die Farbe je Projekt einzigartig. Beim Ueberfahren ruecken die
 * Marken zwei Punkte nach aussen: die Karte hebt sich, die Marken spannen auf.
 */
.card.eckig { position: relative; --eck: var(--marke); }
.card.eckig::before, .card.eckig::after {
  content: ''; position: absolute; width: 18px; height: 18px;
  border: 2px solid var(--eck); border-radius: 0; pointer-events: none;
  opacity: 0.85;
  transition: transform var(--kurz) var(--ease), opacity var(--kurz) var(--ease);
}
.card.eckig::before { top: -6px; left: -6px; border-right: 0; border-bottom: 0; }
.card.eckig::after { bottom: -6px; right: -6px; border-left: 0; border-top: 0; }
.card.eckig:hover::before { transform: translate(-2px, -2px); opacity: 1; }
.card.eckig:hover::after { transform: translate(2px, 2px); opacity: 1; }
@media (prefers-reduced-motion: reduce) {
  .card.eckig:hover::before, .card.eckig:hover::after { transform: none; }
}

/* ── arriving on scroll ─────────────────────────────────────────────────── */
/*
 * Set by the script below, never in the markup: if JavaScript does not run,
 * nothing is ever hidden, and the page reads exactly as it does now. Hiding
 * first in CSS and revealing in JS is how a no-JS visitor gets a blank page.
 */
.reveal { opacity: 0; transform: translateY(14px); }
.reveal.in { opacity: 1; transform: none; transition: opacity var(--slow) var(--ease), transform var(--slow) var(--ease); }
@media (prefers-reduced-motion: reduce) {
  .reveal, .reveal.in { opacity: 1; transform: none; transition: none; }
}

/* ── section heading with a rule ────────────────────────────────────────── */
.head-rule { display: flex; align-items: baseline; gap: 16px; }
.head-rule::after { content: ''; flex: 1; height: 1px; background: var(--border); }

/* ── pill row ───────────────────────────────────────────────────────────── */
.pills { display: flex; flex-wrap: wrap; gap: 8px; }
.pill {
  font-size: 0.8rem; padding: 5px 12px; border-radius: 999px;
  border: 1px solid var(--border); background: var(--surface); color: var(--fg-muted);
}
.pill.on { border-color: currentColor; }
.pill.a { color: var(--airlock); }
.pill.n2 { color: var(--nexus); }
.pill.i { color: var(--accent-idx); }

/* ── header search button ───────────────────────────────────────────────── */
.gh-search { cursor: pointer; border: 1px solid var(--header-border); font: inherit; font-size: 13px; text-align: left; }
button.gh-search { background: rgba(255,255,255,0.06); color: var(--header-fg); }

/* ── the reveal chip, reused from the tool ──────────────────────────────── */
.chip-hidden {
  display: inline-block; font-family: var(--mono); font-size: 0.66rem; font-weight: 700;
  letter-spacing: 0.08em; text-transform: uppercase; padding: 2px 7px; margin-inline: 3px;
  border: 1px solid var(--danger); border-radius: 3px;
  background: color-mix(in srgb, var(--danger) 12%, transparent); color: var(--danger);
  vertical-align: baseline; white-space: nowrap;
}

/* ── forms ─────────────────────────────────────────────────────────────── */
.fld {
  width: 100%; padding: 10px 12px; margin: 4px 0 14px;
  border: 1px solid var(--border-strong); border-radius: var(--radius);
  background: var(--bg); color: var(--fg); font: inherit; font-size: 15px;
}
textarea.fld { resize: vertical; min-height: 96px; line-height: 1.6; }
.fld:focus { outline: 2px solid var(--link); outline-offset: 1px; border-color: var(--link); }

.prose { color: var(--fg); font-size: 0.96rem; }
.prose p { margin: 0 0 0.8em; }
.prose p:last-child { margin-bottom: 0; }
.skill h3 a { color: var(--fg); }
.skill h3 a:hover { color: var(--link); }

/* ── legal prose ────────────────────────────────────────────────────────── */
.legal h2 { font-size: 1.35rem; margin-top: 2.2rem; }
.legal h3 { font-size: 1.05rem; margin-top: 1.6rem; }
.legal h4 { font-size: 0.95rem; margin-top: 1.2rem; color: var(--fg-muted); }
.legal p, .legal li { color: var(--fg-muted); }
.legal p { margin: 0.8em 0; }
.legal ul, .legal ol { padding-left: 1.2rem; margin: 0.8em 0; }
.legal li { margin-bottom: 0.35em; }
.legal table { font-size: 0.88rem; }
.legal .note { margin: 1.2em 0; }
.legal hr.divider { margin: 2rem 0; }

/* An unfilled placeholder has to be impossible to overlook — a legal page that
   quietly ships {{NAME}} is worse than one that is obviously unfinished. */
mark.todo {
  background: var(--danger); color: #fff; font-family: var(--mono);
  font-size: 0.78em; padding: 1px 6px; border-radius: 3px; letter-spacing: 0.04em;
}

/* ── footer lift ────────────────────────────────────────────────────────── */
footer.site { position: relative; }
footer.site::before {
  content: ''; position: absolute; inset: 0 0 auto 0; height: 2px;
  background: linear-gradient(90deg, var(--marke), var(--himmel) 45%, var(--nexus) 80%, transparent);
  opacity: 0.75;
}

/* ── header, once the page has moved ────────────────────────────────────── */
/*
 * At the top the header sits flush with the hero. Once anything scrolls under
 * it, it earns a shadow — so the bar reads as being in front of the page
 * rather than painted onto it, and only when there is something to be in front
 * of.
 */
.gh-header { transition: box-shadow 200ms var(--ease), background 200ms var(--ease); }
.gh-header.stuck { box-shadow: 0 6px 24px -10px rgba(0,0,0,0.45); }

/* ── moving between pages ───────────────────────────────────────────────── */
/*
 * Two lines of CSS turn a multi-page static site into one that cross-fades
 * between its pages, in every browser that has shipped view transitions — no
 * router, no client-side navigation, no framework. The browser holds the old
 * page's pixels, fetches the new one, and animates between them.
 *
 * What matters is what does NOT move. The header carries a name, so it is one
 * continuous element across the navigation rather than something that fades
 * out and back in; the same goes for the mark. Everything else is content and
 * may cross-fade freely. Naming too much is the classic mistake — every named
 * element is an animation the browser must reconcile, and a page where six
 * things slide independently reads as a slideshow.
 */
@view-transition { navigation: auto; }

.gh-header { view-transition-name: hdr; }
.gh-logo .mark { view-transition-name: mark; }

::view-transition-old(root) { animation: vt-out 90ms var(--ease) both; }
::view-transition-new(root) { animation: vt-in 260ms var(--ease) both; }
@keyframes vt-out { to { opacity: 0; transform: translateY(-6px); } }
@keyframes vt-in { from { opacity: 0; transform: translateY(8px); } }

/* The header is a continuous object: it must not fade at all, or the join
   shows as a flicker exactly where the eye is resting. */
::view-transition-old(hdr), ::view-transition-new(hdr) { animation: none; mix-blend-mode: normal; }

@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root), ::view-transition-new(root) { animation: none; }
}

/*
 * The fallback for browsers without view transitions: vt.js fades the outgoing
 * page out before following the link. Nothing is hidden until a click actually
 * happens, so a visitor whose JavaScript never ran sees an ordinary page.
 */
html[data-leaving] main { opacity: 0; transform: translateY(-6px); }
html[data-leaving] main { transition: opacity 120ms var(--ease), transform 120ms var(--ease); }

/* ── reading progress ───────────────────────────────────────────────────── */
.progress {
  position: fixed; inset: 0 0 auto 0; height: 2px; z-index: 60;
  background: linear-gradient(90deg, var(--marke), var(--himmel) 60%, var(--nexus));
  transform-origin: 0 50%; transform: scaleX(0); pointer-events: none;
}
@media (prefers-reduced-motion: reduce) { .progress { display: none; } }
`;

/**
 * Two small behaviours, one observer and one scroll handler between them.
 *
 * The reveal deliberately marks elements from script rather than from the
 * markup: anything hidden by a stylesheet and shown by JavaScript is a blank
 * page for anyone whose JavaScript did not arrive.
 */
export const MOTION_JS = `
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- header shadow + reading progress -----------------------------------
  var header = document.querySelector('.gh-header');
  var bar = null;
  if (!reduce) {
    bar = document.createElement('div');
    bar.className = 'progress';
    document.body.appendChild(bar);
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY || 0;
      if (header) header.classList.toggle('stuck', y > 8);
      if (bar) {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
      }
      ticking = false;
    });
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- reveal on approach --------------------------------------------------
  // Auf Seiten mit GSAP macht bewegung.mjs die Auftritte, und zwar mit echtem
  // Staffeln. Zwei Systeme auf derselben Deckkraft streiten sich.
  if (document.documentElement.classList.contains('bewegt')) return;
  if (reduce || !('IntersectionObserver' in window)) return;

  var targets = document.querySelectorAll('main section > .wrap > *, main .grid > *, main .stats');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

  var hidden = [];
  targets.forEach(function (el, i) {
    // Anything already on screen at load stays put: animating the first view
    // means the page arrives empty and then assembles itself, which reads as
    // slow however fast it is.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 3) * 60 + 'ms';
    io.observe(el);
    hidden.push(el);
  });

  /**
   * The safety net, and the reason this is worth ten lines.
   *
   * Everything above hides content and relies on one callback to bring it
   * back. If that callback never arrives — an embedded view that reports a
   * viewport it does not lay out to, a browser that throttles observers in a
   * background tab, an extension that breaks the API — the page keeps text
   * that is present, indexed and read aloud by a screen reader, but invisible.
   *
   * A visible page with no animation is a worse-looking page. An invisible one
   * is a broken site. So after eight seconds, whatever is still hidden simply
   * appears.
   */
  setTimeout(function () {
    hidden.forEach(function (el) {
      if (!el.classList.contains('in')) {
        el.style.transitionDelay = '0ms';
        el.classList.add('in');
      }
    });
  }, 8000);
})();`;


