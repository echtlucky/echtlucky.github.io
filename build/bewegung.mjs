/**
 * Die Scroll-Choreografie.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * Was hier NICHT neu gebaut wird
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Die Seite hatte schon Auftritte: `MOTION_JS` in `theme-extra.mjs` beobachtet
 * `main section > .wrap > *` und `main .grid > *` mit einem
 * IntersectionObserver und blendet sie ein. Das ist sauber gebaut, hat ein
 * Sicherheitsnetz und eine Regel, die man leicht übersieht:
 *
 *   **Was beim Laden schon im Bild steht, wird nicht animiert.** Sonst kommt
 *   die Seite leer an und setzt sich vor den Augen zusammen, und das liest
 *   sich langsam, wie schnell es auch ist.
 *
 * Diese Datei ersetzt das nicht. Sie übernimmt dieselben Ziele und dieselbe
 * Regel und fügt hinzu, was ein Observer nicht kann: echtes Staffeln innerhalb
 * einer Gruppe, an den Bildlauf gekoppelte Tiefe, und das Aufziehen der
 * Trennlinien. Auf Seiten mit `bewegung` schaltet `MOTION_JS` seinen eigenen
 * Auftritt ab — zwei Systeme auf derselben Deckkraft streiten sich sonst.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * Warum GSAP hier liegt und nicht von einem CDN kommt
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * `static/js/` — zwei Dateien, zusammen rund 118 KB, mit `LIZENZ.txt` daneben.
 * Ein `<script src>` auf ein fremdes CDN überträgt die IP-Adresse jedes
 * Besuchers dorthin, und genau das sagt die Seite an mehreren Stellen zu, es
 * nicht zu tun. Die Schrift liegt aus demselben Grund im Repository.
 *
 * **Damit stimmt „Zero dependencies" in der README nicht mehr.** Bewusst
 * entschieden und dort richtiggestellt.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * Die Falle, an der solche Choreografien sterben
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Man versteckt in CSS und lässt GSAP hereinholen. Lädt GSAP dann nicht — Netz
 * weg, Datei nach einem Deploy verschwunden, Skripte blockiert — bleibt die
 * **ganze Seite unsichtbar**. Aus einer Verschönerung wird ein Totalausfall.
 *
 * Drei Sicherungen, in dieser Reihenfolge:
 *
 *   1. Versteckt wird nur unter `html.bewegt`, und die Klasse setzt ein
 *      Skript. Ohne JavaScript ist nichts versteckt.
 *   2. Ein **Notaus** auf 2 Sekunden. Meldet sich die Choreografie bis dahin
 *      nicht, fällt die Klasse und alles ist sichtbar.
 *   3. `prefers-reduced-motion` wird schon im Bootskript geprüft. Wer es
 *      gesetzt hat, bekommt die Klasse nie — ScrollTrigger wird dann gar nicht
 *      erst registriert.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * Reihenfolge der Skripte — hier war ein Fehler drin
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * GSAP wird mit `defer` geladen, die Choreografie steht inline am Ende des
 * Body. **Inline-Skripte laufen vor den aufgeschobenen**, also war `window.gsap`
 * zu diesem Zeitpunkt nicht da und die Choreografie stieg jedes Mal wortlos
 * aus. Aufgeschobene Skripte sind aber garantiert fertig, bevor
 * `DOMContentLoaded` feuert — deshalb hängt alles daran.
 */

/** Läuft früh im <head>, vor dem ersten Bild. */
export const BEWEGUNG_BOOT = `
(function(){
  try {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var h = document.documentElement;
    h.classList.add('bewegt');
    window.__notaus = setTimeout(function(){ h.classList.remove('bewegt'); }, 2000);
  } catch (e) { /* kein matchMedia: dann eben ohne Bewegung */ }
})();`;

/**
 * Nur unter `html.bewegt`. Ohne Skript greift keine dieser Regeln.
 *
 * Die Ziele sind dieselben wie beim vorhandenen Observer, damit die Auszeichnung
 * der Seiten unverändert bleibt — kein `class="auftritt"` an dreißig Stellen,
 * das beim nächsten Abschnitt vergessen wird.
 *
 * `will-change` steht bewusst nicht drin: dauerhaft gesetzt hält es für jedes
 * Element eine eigene Ebene vor. GSAP setzt es selbst, solange etwas läuft.
 */
export const BEWEGUNG_CSS = `
.bewegt main section > .wrap > *,
.bewegt main .grid > * { opacity: 0; }
.bewegt main .grid > * { transform: translateY(18px); }
.bewegt main section > .wrap > * { transform: translateY(14px); }
.bewegt main hr.divider { transform: scaleX(0); transform-origin: left center; }
`;

/**
 * Die Choreografie.
 *
 * ══ Eine Kurve, drei Dauern — dieselben wie überall ═══════════════════════
 *
 * `--ease` und `--kurz/--mittel/--lang` stehen in `marke.mjs` und werden hier
 * ausgelesen statt abgeschrieben. Zwei Listen an zwei Orten laufen auseinander.
 *
 * ══ Warum alles `once: true` ist ══════════════════════════════════════════
 *
 * Ein Abschnitt, der beim Zurückscrollen wieder verschwindet und beim nächsten
 * Vorwärts erneut hereinfliegt, ist nicht elegant, sondern zappelig — und er
 * macht das Wiederfinden einer Stelle mühsam. Gezeigt wird einmal.
 */
export const BEWEGUNG_JS = (stufe) => `
addEventListener('DOMContentLoaded', function(){
  var STUFE = ${stufe};
  if (!document.documentElement.classList.contains('bewegt')) return;
  if (!window.gsap || !window.ScrollTrigger) return;   // Notaus raeumt auf
  clearTimeout(window.__notaus);

  var s = getComputedStyle(document.documentElement);
  var mittel = (parseFloat(s.getPropertyValue('--mittel')) || 240) / 1000;
  var lang = (parseFloat(s.getPropertyValue('--lang')) || 380) / 1000;

  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'power2.out' });

  /* KEIN clearProps hier -- das war ein Fehler und er ist unauffaellig:
     der Versteckzustand steht in der CSS (.bewegt ... transform), nicht
     inline. clearProps raeumt den Inline-Stil weg und legt damit genau das
     wieder frei, was die Animation gerade aufgehoben hat. Die Trennlinien
     blieben dadurch auf scaleX(0), die Abschnitte 14px zu tief. Der Endwert
     MUSS inline stehen bleiben. */

  var hoehe = window.innerHeight;
  /* Dieselbe Regel wie im vorhandenen Observer: was schon im Bild steht, wird
     gesetzt und nicht animiert. */
  function schonSichtbar(el){ return el.getBoundingClientRect().top < hoehe * 0.9; }
  function sofort(els){ gsap.set(els, { opacity: 1, y: 0 }); }

  // ── Der Aufmacher kommt beim Laden ───────────────────────────────────────
  // Er steht schon im Bild; auf ein Scrollen zu warten hiesse, ihn zu
  // verstecken, bis jemand etwas tut. Er ist die eine Ausnahme von der Regel.
  var hero = document.querySelector('.hero .wrap');
  if (hero) {
    gsap.to(hero.children, {
      opacity: 1, y: 0, duration: lang, stagger: 0.07, delay: 0.04,
    });
  }

  // ── Abschnitte: staffeln, sobald sie erreicht werden ─────────────────────
  document.querySelectorAll('main section').forEach(function(sec){
    if (sec.classList.contains('hero')) return;
    var wrap = sec.querySelector(':scope > .wrap');
    if (!wrap) return;
    var teile = [].slice.call(wrap.children);
    if (!teile.length) return;
    if (schonSichtbar(sec)) return sofort(teile);
    gsap.to(teile, {
      opacity: 1, y: 0, duration: lang, stagger: 0.07,
      scrollTrigger: { trigger: sec, start: 'top 82%', once: true }
    });
  });

  // ── Karten eines Rasters staffeln sich untereinander ─────────────────────
  document.querySelectorAll('main .grid').forEach(function(raster){
    var karten = [].slice.call(raster.children);
    if (!karten.length) return;
    if (schonSichtbar(raster)) return sofort(karten);
    gsap.to(karten, {
      opacity: 1, y: 0, duration: mittel * 1.6, stagger: 0.06,
      scrollTrigger: { trigger: raster, start: 'top 86%', once: true }
    });
  });

  // ── Trennlinien ziehen sich auf ──────────────────────────────────────────
  document.querySelectorAll('main hr.divider').forEach(function(linie){
    if (schonSichtbar(linie)) return gsap.set(linie, { scaleX: 1 });
    gsap.to(linie, {
      scaleX: 1, duration: lang * 1.6,
      scrollTrigger: { trigger: linie, start: 'top 92%', once: true }
    });
  });

  // ── Tiefe im Aufmacher — NUR Stufe 3 ─────────────────────────────────────
  //
  // An den Bildlauf gekoppelte Bewegung (scrub) ist der teuerste und
  // auffaelligste Effekt, den es hier gibt: er laeuft bei jedem Scrollschritt
  // und zieht den Blick dauerhaft. Auf dem Schaufenster ist das richtig, auf
  // einer Produktseite, die jemand LIEST, nicht. Die Stufen stehen in
  // docs/UMBAU-PLAN.md.
  //
  // Nur eine Verschiebung, kein Massstab: eine skalierte Welle wird unscharf.
  var welle = STUFE >= 3 ? document.querySelector('.hero .hero-wave') : null;
  if (welle) {
    gsap.to(welle, {
      yPercent: 12, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.4 }
    });
  }

  // Schrift und Bilder kommen spaeter an und verschieben die Ausloesepunkte.
  addEventListener('load', function(){ ScrollTrigger.refresh(); });
});`;

/**
 * Die zwei Dateien — nur auf Seiten mit Bewegung.
 *
 * `defer` und nicht `async`: ScrollTrigger braucht GSAP, und `defer` haelt die
 * Reihenfolge ein. `async` laedt schneller und wuerde sie gelegentlich
 * vertauschen — ein Fehler, der nur auf langsamen Verbindungen auftritt und
 * beim Entwickeln nie.
 */
export const BEWEGUNG_SCRIPTS = `
<script defer src="/js/gsap.min.js"></script>
<script defer src="/js/ScrollTrigger.min.js"></script>`;
