import { href, SITE } from '../layout.mjs';

export const slug = 'forum';

export const meta = {
  en: {
    title: 'Forum — ask, share and report, with an account you already control · echtlucky',
    description:
      'The forum runs on GitHub Discussions. Beginner questions welcome, skill submissions reviewed in the open, and no password of yours is ever stored here.',
  },
  de: {
    title: 'Forum — fragen, teilen, melden, mit einem Konto das dir schon gehört · echtlucky',
    description:
      'Das Forum läuft über GitHub Discussions. Einsteigerfragen willkommen, Skill-Einreichungen offen geprüft, und hier wird nie ein Passwort von dir gespeichert.',
  },
};

const T = {
  en: {
    eyebrow: 'Forum',
    h1: 'Ask anything. Beginner questions are the point.',
    lede:
      'A place to ask what something means, share a skill you wrote, report a false positive, or say that a rule got it wrong. Nothing here assumes you already know the vocabulary.',
    cta: 'Open the forum',
    ctaAlt: 'Read the basics first',

    whyH: 'Why the login is a GitHub account',
    whyP:
      'You need an account to post — but not one from me. The forum runs on GitHub Discussions, which means your login is one you already control and can already delete.',
    whyPoints: [
      ['No password of yours is stored here', 'I never see it, never hold it, and cannot lose it. A security project that rolls its own authentication has added the exact risk it claims to reduce.'],
      ['Your data stays yours', 'Posts live on GitHub under GitHub\'s terms and privacy policy. There is no second copy on some server of mine.'],
      ['Moderation and history are public', 'Edits and removals are visible. A forum where a post can quietly disappear is not one you should trust with a security report.'],
    ],
    signupNote:
      'Do not have a GitHub account? It is free, takes about a minute, and needs an email address and nothing else.',
    signupCta: 'Create a GitHub account',

    catsH: 'What goes where',
    cats: [
      ['Q&amp;A', 'Anything you want to understand. “What is a skill?” is as welcome as a question about the rule pack.', 'q-a'],
      ['Show and tell', 'A skill you wrote, a workflow you built, something you found interesting.', 'show-and-tell'],
      ['False positives', 'AIRLOCK flagged something harmless. This is the most useful report there is — the numbers exist to be checked, not believed.', 'false-positives'],
      ['Misses', 'AIRLOCK passed something it should have caught. Worth even more than a false positive.', 'misses'],
      ['Ideas', 'Rules, features, or something the tools should do and do not.', 'ideas'],
    ],

    rulesH: 'House rules, short version',
    rules: [
      'Assume the person asking is smart and new. Both at once.',
      'Answer the question that was asked before the one you wish had been.',
      'No “just google it”. If it were obvious they would not be here.',
      'Do not post credentials, tokens or private files — not even redacted, not even as an example.',
      'A finding is about a file, not about the person who wrote it.',
    ],

    secH: 'Found something serious?',
    secP:
      'If you believe something is actively exploitable, do not open a public thread. Use the private security advisory form on the repository — it reaches me and nobody else until there is a fix.',
    secCta: 'Report privately',
  },

  de: {
    eyebrow: 'Forum',
    h1: 'Frag alles. Einsteigerfragen sind der Sinn davon.',
    lede:
      'Ein Ort, um zu fragen, was etwas bedeutet, einen selbst geschriebenen Skill zu teilen, einen False Positive zu melden oder zu sagen, dass eine Regel danebenlag. Nichts hier setzt voraus, dass du das Vokabular schon kennst.',
    cta: 'Forum öffnen',
    ctaAlt: 'Erst die Grundlagen lesen',

    whyH: 'Warum der Login ein GitHub-Konto ist',
    whyP:
      'Zum Schreiben brauchst du ein Konto — aber keines von mir. Das Forum läuft über GitHub Discussions. Dein Login ist also einer, den du ohnehin kontrollierst und jederzeit löschen kannst.',
    whyPoints: [
      ['Hier wird kein Passwort von dir gespeichert', 'Ich sehe es nie, halte es nie und kann es nicht verlieren. Ein Security-Projekt, das sich eine eigene Anmeldung baut, hat genau das Risiko hinzugefügt, das es reduzieren will.'],
      ['Deine Daten bleiben deine', 'Beiträge liegen bei GitHub, unter deren Bedingungen und Datenschutzerklärung. Es gibt keine zweite Kopie auf irgendeinem Server von mir.'],
      ['Moderation und Verlauf sind öffentlich', 'Bearbeitungen und Löschungen sind sichtbar. Ein Forum, in dem ein Beitrag still verschwinden kann, ist keines, dem du eine Sicherheitsmeldung anvertrauen solltest.'],
    ],
    signupNote:
      'Kein GitHub-Konto? Ist kostenlos, dauert etwa eine Minute und braucht eine E-Mail-Adresse und sonst nichts.',
    signupCta: 'GitHub-Konto anlegen',

    catsH: 'Was gehört wohin',
    cats: [
      ['Fragen &amp; Antworten', 'Alles, was du verstehen willst. „Was ist ein Skill?" ist genauso willkommen wie eine Frage zum Regelpaket.', 'q-a'],
      ['Zeigen', 'Ein Skill, den du geschrieben hast, ein Arbeitsablauf, den du gebaut hast, etwas Interessantes, das du gefunden hast.', 'show-and-tell'],
      ['False Positives', 'AIRLOCK hat etwas Harmloses markiert. Die nützlichste Meldung überhaupt — die Zahlen gibt es, damit sie geprüft werden, nicht damit man sie glaubt.', 'false-positives'],
      ['Übersehenes', 'AIRLOCK hat etwas durchgelassen, das es hätte fangen müssen. Noch mehr wert als ein False Positive.', 'misses'],
      ['Ideen', 'Regeln, Funktionen oder etwas, das die Werkzeuge tun sollten und nicht tun.', 'ideas'],
    ],

    rulesH: 'Hausregeln, Kurzfassung',
    rules: [
      'Geh davon aus, dass die fragende Person klug und neu ist. Beides gleichzeitig.',
      'Beantworte die gestellte Frage, bevor du die beantwortest, die du lieber gehabt hättest.',
      'Kein „google doch". Wenn es offensichtlich wäre, wäre die Person nicht hier.',
      'Keine Zugangsdaten, Token oder privaten Dateien posten — auch nicht geschwärzt, auch nicht als Beispiel.',
      'Ein Befund betrifft eine Datei, nicht die Person, die sie geschrieben hat.',
    ],

    secH: 'Etwas Ernstes gefunden?',
    secP:
      'Wenn du glaubst, dass etwas aktiv ausnutzbar ist, mach keinen öffentlichen Thread auf. Nimm das private Security-Advisory-Formular am Repository — das erreicht mich und sonst niemanden, bis es einen Fix gibt.',
    secCta: 'Vertraulich melden',
  },
};

export function body(lang) {
  const t = T[lang];

  return `
<section class="hero">
  <div class="wrap stack">
    <span class="eyebrow">${t.eyebrow}</span>
    <h1>${t.h1}</h1>
    <p class="lede">${t.lede}</p>
    <div class="btn-row">
      <a class="btn btn-primary" href="${SITE.discussions}">${t.cta}</a>
      <a class="btn" href="${href(lang, 'learn')}">${t.ctaAlt}</a>
    </div>
  </div>
</section>

<hr class="divider">

<section>
  <div class="wrap stack-lg">
    <div class="stack narrow">
      <h2>${t.whyH}</h2>
      <p class="muted">${t.whyP}</p>
    </div>
    <div class="grid grid-3">
      ${t.whyPoints.map(([h, p]) => `<div class="note ok"><h3>${h}</h3><p>${p}</p></div>`).join('')}
    </div>
    <p class="small muted">${t.signupNote} <a href="https://github.com/signup">${t.signupCta} →</a></p>
  </div>
</section>

<hr class="divider">

<section>
  <div class="wrap stack-lg">
    <h2>${t.catsH}</h2>
    <div class="table-scroll">
      <table>
        <tbody>
          ${t.cats
            .map(
              ([h, p, cat]) =>
                `<tr><td style="white-space:nowrap"><strong>${h}</strong></td><td class="muted">${p}</td><td style="white-space:nowrap"><a href="${SITE.discussions}/categories/${cat}">→</a></td></tr>`,
            )
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
      <h2>${t.rulesH}</h2>
      <ul class="muted" style="padding-left:1.1rem">
        ${t.rules.map((r) => `<li style="margin-bottom:0.45rem">${r}</li>`).join('')}
      </ul>
    </div>
    <div class="stack">
      <h2>${t.secH}</h2>
      <div class="note danger"><p>${t.secP}</p></div>
      <div class="btn-row"><a class="btn" href="${SITE.repoAirlock}/security/advisories/new">${t.secCta}</a></div>
    </div>
  </div>
</section>
`;
}
