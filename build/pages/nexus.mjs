import { href, SITE } from '../layout.mjs';

export const slug = 'nexus';

export const meta = {
  en: {
    title: 'NEXUS — the control layer above your Windows · echtlucky',
    description:
      'NEXUS bundles the AI assistant, launcher, browser, code editor and broadcast studio into one native Windows app. Local first, provider-neutral, configurable down to a single file.',
  },
  de: {
    title: 'NEXUS — die Schaltzentrale über deinem Windows · echtlucky',
    description:
      'NEXUS bündelt KI-Assistent, Launcher, Browser, Code-Editor und Studio in einer nativen Windows-App. Lokal zuerst, anbieterneutral, bis auf eine Konfigurationsdatei steuerbar.',
  },
};

const T = {
  en: {
    eyebrow: 'NEXUS · v0.9.0 · in development',
    h1: 'The control layer above your Windows.',
    lede:
      'A native app that runs in the background and bundles the tools you would otherwise open half a dozen programs for: assistant, launcher, browser, code editor and broadcast studio.',
    cta: 'Follow on GitHub',
    ctaAirlock: 'See AIRLOCK instead',

    nameNoteH: 'One thing about the name',
    nameNoteP:
      'The product is called <strong>NEXUS</strong>. “NEXUS OS” is only the name of the GitHub repository. NEXUS is expressly <em>not</em> an operating system — it is a layer on top of one.',

    modulesH: 'What is in it',
    modules: [
      ['Companion', 'A voice-capable AI companion, reachable anywhere — it listens, answers, does things, and walks you through NEXUS.'],
      ['Assistant', 'Chat with an agent tool loop, its own skills, and follow-up questions — against the provider you chose.'],
      ['Launcher', 'One entry point for the applications and files you actually open.'],
      ['Browser', 'Built in, so a link from the assistant does not throw you into another window.'],
      ['Code editor', 'For the edit you want to make right now without switching context.'],
      ['Studio', 'Screen, camera, sound and encoder in one console — streaming and recording without a separate OBS.'],
    ],

    stanceH: 'Where it stands on the things that matter',
    stance: [
      ['Local first', 'The default path is local. Cloud providers are optional and switched on one at a time.'],
      ['Provider-neutral', 'NEXUS speaks any OpenAI-compatible endpoint. Which provider, which endpoint and which model is your decision, in settings or in the config file.'],
      ['Native, not a web wrapper', 'WinUI 3 on .NET 8. It behaves like a Windows application because it is one.'],
      ['Configurable to the bottom', 'Everything the interface exposes is also reachable from one configuration file.'],
    ],

    togetherH: 'Why it sits next to AIRLOCK',
    togetherP:
      'NEXUS has skills of its own — the same shape of file, the same problem. A workspace that loads instructions written by other people needs a way to check them, which is the reason AIRLOCK exists at all. The two are separate products; they just happen to answer each other.',

    statusH: 'Status',
    statusP:
      'Version 0.9.0, actively developed, Windows only, and the repository is private for now. This page will grow as it opens up — there is no sign-up form here and no waiting list, because collecting addresses for something not yet released would be a way of pretending it is.',
    statusCta: 'See AIRLOCK, which is open',
  },

  de: {
    eyebrow: 'NEXUS · v0.9.0 · in Entwicklung',
    h1: 'Die Schaltzentrale über deinem Windows.',
    lede:
      'Eine native App, die im Hintergrund läuft und die Werkzeuge bündelt, für die du sonst ein halbes Dutzend Programme öffnest: Assistent, Launcher, Browser, Code-Editor und Studio.',
    cta: 'Auf GitHub folgen',
    ctaAirlock: 'Stattdessen AIRLOCK ansehen',

    nameNoteH: 'Eine Sache zum Namen',
    nameNoteP:
      'Das Produkt heißt <strong>NEXUS</strong>. „NEXUS OS“ ist nur der Name des GitHub-Repositorys. NEXUS ist ausdrücklich <em>kein</em> Betriebssystem — es ist eine Schicht darüber.',

    modulesH: 'Was drin ist',
    modules: [
      ['Begleiter', 'Ein sprachfähiger KI-Begleiter, überall erreichbar — er hört zu, antwortet, erledigt Aufgaben und führt durch NEXUS.'],
      ['Assistent', 'Chat mit Agenten-Werkzeugschleife, eigenen Skills und Rückfragen — gegen den Anbieter deiner Wahl.'],
      ['Launcher', 'Ein Einstiegspunkt für die Programme und Dateien, die du tatsächlich öffnest.'],
      ['Browser', 'Eingebaut, damit ein Link aus dem Assistenten dich nicht in ein anderes Fenster wirft.'],
      ['Code-Editor', 'Für die Änderung, die du jetzt gerade machen willst, ohne den Kontext zu wechseln.'],
      ['Studio', 'Bildschirm, Kamera, Ton und Encoder in einer Konsole — Streamen und Aufnehmen ohne separates OBS.'],
    ],

    stanceH: 'Wie es zu den Dingen steht, auf die es ankommt',
    stance: [
      ['Lokal zuerst', 'Der voreingestellte Weg ist der lokale. Cloud-Anbieter sind optional und werden einzeln zugeschaltet.'],
      ['Anbieterneutral', 'NEXUS spricht jeden OpenAI-kompatiblen Endpunkt an. Welcher Anbieter, welcher Endpunkt und welches Modell — das entscheidest du, in den Einstellungen oder in der Konfigurationsdatei.'],
      ['Nativ, kein Web-Wrapper', 'WinUI 3 auf .NET 8. Es verhält sich wie eine Windows-Anwendung, weil es eine ist.'],
      ['Bis nach unten konfigurierbar', 'Alles, was die Oberfläche anbietet, ist auch über eine Konfigurationsdatei erreichbar.'],
    ],

    togetherH: 'Warum es neben AIRLOCK steht',
    togetherP:
      'NEXUS hat eigene Skills — dieselbe Art Datei, dasselbe Problem. Eine Arbeitsumgebung, die Anweisungen von anderen Leuten lädt, braucht eine Möglichkeit, sie zu prüfen. Genau deshalb gibt es AIRLOCK überhaupt. Es sind getrennte Produkte; sie beantworten sich nur zufällig gegenseitig.',

    statusH: 'Stand',
    statusP:
      'Version 0.9.0, in aktiver Entwicklung, nur Windows, und das Repository ist vorerst privat. Diese Seite wächst mit, sobald es sich öffnet — hier gibt es kein Anmeldeformular und keine Warteliste, denn Adressen für etwas zu sammeln, das noch nicht veröffentlicht ist, wäre eine Art so zu tun, als wäre es das.',
    statusCta: 'AIRLOCK ansehen, das offen ist',
  },
};

export function body(lang) {
  const t = T[lang];

  return `
<section class="hero" style="border-top:3px solid var(--nexus)">
  <div class="wrap stack">
    <span class="eyebrow accent-nexus">${t.eyebrow}</span>
    <h1>${t.h1}</h1>
    <p class="lede">${t.lede}</p>
    <div class="btn-row">
      <a class="btn btn-primary" href="${SITE.github}">${t.cta}</a>
      <a class="btn" href="${href(lang, 'airlock')}">${t.ctaAirlock}</a>
    </div>
  </div>
</section>

<section style="padding-top:0">
  <div class="wrap narrow">
    <div class="note"><h3>${t.nameNoteH}</h3><p>${t.nameNoteP}</p></div>
  </div>
</section>

<hr class="divider">

<section>
  <div class="wrap stack-lg">
    <h2>${t.modulesH}</h2>
    <div class="grid grid-3">
      ${t.modules
        .map(
          ([h, p]) =>
            `<article class="card"><h3><span class="accent-nexus">${h}</span></h3><p class="muted small">${p}</p></article>`,
        )
        .join('')}
    </div>
  </div>
</section>

<hr class="divider">

<section>
  <div class="wrap stack-lg">
    <h2>${t.stanceH}</h2>
    <div class="table-scroll">
      <table>
        <tbody>
          ${t.stance
            .map(([h, p]) => `<tr><td style="white-space:nowrap"><strong>${h}</strong></td><td class="muted">${p}</td></tr>`)
            .join('')}
        </tbody>
      </table>
    </div>
  </div>
</section>

<hr class="divider">

<section>
  <div class="wrap grid grid-2">
    <div class="stack">
      <h2>${t.togetherH}</h2>
      <p class="muted">${t.togetherP}</p>
      <div class="btn-row"><a class="btn" href="${href(lang, 'airlock')}">AIRLOCK →</a></div>
    </div>
    <div class="stack">
      <h2>${t.statusH}</h2>
      <p class="muted">${t.statusP}</p>
      <div class="btn-row"><a class="btn" href="${href(lang, 'airlock')}">${t.statusCta}</a></div>
    </div>
  </div>
</section>
`;
}
