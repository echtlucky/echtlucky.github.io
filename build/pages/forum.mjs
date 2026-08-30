import { href, SITE, GEBIETSSCHEMA } from '../layout.mjs';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const slug = 'forum';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const FB = JSON.parse(readFileSync(join(ROOT, 'content', 'firebase.json'), 'utf8'));

/** Until a project id is filled in there is nothing to connect to, and the page says so. */
const CONFIGURED = Boolean(FB.projectId && FB.apiKey);

export const meta = {
  en: {
    title: 'Forum — ask, share and report · Skillry',
    description:
      'A forum for people using AI assistants: ask what something means, share a skill, report a false positive. Sign in with GitHub — no new password to invent.',
  },
  de: {
    title: 'Forum — fragen, teilen, melden · Skillry',
    description:
      'Ein Forum für Leute, die KI-Assistenten benutzen: fragen was etwas bedeutet, einen Skill teilen, einen False Positive melden. Anmeldung mit GitHub — kein neues Passwort nötig.',
  },
  es: {
    title: 'Foro — pregunta, comparte, informa · Skillry',
    description:
      'Un foro para gente que usa asistentes de IA: preguntar qué significa algo, compartir un skill, informar de un falso positivo. Acceso con GitHub — sin contraseña nueva que inventar.',
  },
};

export const CATEGORIES = [
  { id: 'help', en: 'Help & questions', de: 'Hilfe & Fragen', es: 'Ayuda y preguntas', tone: 'i',
    enD: 'Anything you want to understand. No question is too basic.',
    deD: 'Alles, was du verstehen willst. Keine Frage ist zu einfach.',
    esD: 'Todo lo que quieras entender. Ninguna pregunta es demasiado básica.' },
  { id: 'skills', en: 'Skills', de: 'Skills', es: 'Skills', tone: 'a',
    enD: 'Recommend one, ask whether one is any good, or submit one for the index.',
    deD: 'Einen empfehlen, fragen ob einer taugt, oder einen für den Index einreichen.',
    esD: 'Recomendar uno, preguntar si uno vale, o enviar uno para el índice.' },
  { id: 'false-positives', en: 'False positives', de: 'False Positives', es: 'Falsos positivos', tone: 'i',
    enD: 'AIRLOCK flagged something harmless. The most useful report there is.',
    deD: 'AIRLOCK hat etwas Harmloses markiert. Die nützlichste Meldung überhaupt.',
    esD: 'AIRLOCK marcó algo inofensivo. El aviso más útil que existe.' },
  { id: 'misses', en: 'Misses', de: 'Übersehenes', es: 'Pasado por alto', tone: 'a',
    enD: 'It passed something it should have caught. Worth even more.',
    deD: 'Es hat etwas durchgelassen, das es hätte fangen müssen. Noch mehr wert.',
    esD: 'Dejó pasar algo que debería haber cazado. Vale aún más.' },
  { id: 'ideas', en: 'Ideas', de: 'Ideen', es: 'Ideas', tone: 'n2',
    enD: 'Rules, features, or something the tools should do and do not.',
    deD: 'Regeln, Funktionen, oder etwas das die Werkzeuge tun sollten und nicht tun.',
    esD: 'Reglas, funciones, o algo que las herramientas deberían hacer y no hacen.' },
  { id: 'showcase', en: 'Showcase', de: 'Zeigen', es: 'Muestra tu trabajo', tone: 'n2',
    enD: 'Something you built or found. NEXUS setups welcome.',
    deD: 'Etwas, das du gebaut oder gefunden hast. NEXUS-Setups willkommen.',
    esD: 'Algo que construiste o encontraste. Los setups de NEXUS son bienvenidos.' },
];

const T = {
  en: {
    eyebrow: 'Forum',
    h1: 'Ask anything. Beginner questions are the point.',
    lede:
      'A place to ask what something means, recommend a skill, report a false positive, or say that a rule got it wrong. Nothing here assumes you already know the vocabulary.',
    leisteSub: 'ask · share · report',
    leisteNav: 'Forum areas',
    signIn: 'Sign in',
    signInGithub: 'Continue with GitHub',
    orEmail: 'or with an email address',
    signUp: 'Create account',
    signOut: 'Sign out',
    signedInAs: 'Signed in as',
    whyAccount: 'An account here is an email address and a password. Firebase stores the password, hashed — this site never sees it and cannot lose it.',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    nameLabel: 'Display name',
    namePlaceholder: 'What should appear on your posts',
    haveAccount: 'Already have an account? Sign in',
    needAccount: 'No account yet? Create one',
    forgot: 'Forgot your password?',
    resetSent: 'If that address has an account, a reset link is on its way.',
    verifyH: 'Confirm your email address',
    verifyP: 'You can read everything. To post, open the link in the email we just sent — it stops somebody signing up with an address that is not theirs.',
    verifyResend: 'Send it again',
    verifySent: 'Sent. Check your inbox, and the spam folder.',
    verifyDone: 'I have confirmed it',
    pwTooShort: 'Passwords need at least 8 characters. Length beats punctuation.',
    emailInvalid: 'That does not look like an email address.',
    errInUse: 'There is already an account with that address. Sign in instead.',
    errWrong: 'That email and password do not match an account.',
    errWeak: 'Firebase rejected that password as too weak. Try a longer one.',
    errMany: 'Too many attempts. Wait a few minutes.',
    newThread: '+ POST',
    newThreadH: 'Write a post',
    cancel: 'Cancel',
    post: 'Post',
    posting: 'Posting…',
    titleLabel: 'Title',
    titleTooShort: 'The title needs at least six characters.',
    bodyTooShort: 'At least ten characters — enough that somebody can answer.',
    titlePlaceholder: 'What is your question, in one line?',
    bodyLabel: 'Message',
    bodyPlaceholder: 'Give enough detail that somebody can actually answer. Paste the exact output if there is any.',
    categoryLabel: 'Category',
    replyPlaceholder: 'Write a reply…',
    reply: 'Reply',
    replies: 'replies',
    voteUp: 'Useful',
    voteDown: 'Not useful',
    errVote: 'The vote did not go through.',
    share: 'Share',
    linkCopied: 'Link copied.',
    fmtBold: 'Bold',
    fmtItalic: 'Italic',
    fmtUnderline: 'Underline',
    fmtCode: 'Code',
    fmtH: 'Heading',
    fmtList: 'List',
    fmtNum: 'Numbered list',
    fmtQuote: 'Quote',
    fmtLink: 'Link',
    fmtBlock: 'Code block',
    fmtStrike: 'Strikethrough',
    fmtRule: 'Divider',
    preview: 'Preview',
    write: 'Write',
    previewEmpty: 'Nothing written yet.',
    fmtHint: 'Two stars for bold, one for italic, two underscores for underline.',
    noComments: 'No answers yet. Yours would be the first.',
    answersH: 'Answers',
    pinned: 'Pinned',
    answer: 'Answer',
    replyOne: 'reply',
    back: '← All threads',
    loading: 'Loading…',
    emptyCat: 'No threads here yet. Yours would be the first.',
    signInToPost: 'Sign in to post.',
    allCats: 'All',
    deleted: '[removed]',
    delete: 'Remove',
    confirmDelete: 'Remove this? It stays in the record, marked as removed.',
    errGeneric: 'That did not work. Check your connection and try again.',
    errTooShort: 'A little more detail, please — a title needs 6 characters and a message needs 10.',

    rulesH: 'House rules, short version',
    rules: [
      'Assume the person asking is smart and new. Both at once.',
      'Answer the question that was asked before the one you wish had been.',
      'No “just google it”. If it were obvious they would not be here.',
      'Never post credentials, tokens or private files — not even redacted, not even as an example.',
      'A finding is about a file, not about the person who wrote it.',
    ],
    secH: 'Found something serious?',
    secP:
      'If you believe something is actively exploitable, do not open a public thread. Use the private security advisory form — it reaches me and nobody else until there is a fix.',
    secCta: 'Report privately',

    setupH: 'The forum is not switched on yet',
    setupP:
      'This page is built and waiting for a Firebase project to point at. Until then, nothing here loads and nothing is stored — which is also exactly what it looks like when it is misconfigured, so it says so plainly rather than showing an empty board.',
    setupCta: 'Setup guide',
    setupAlt: 'Use GitHub Discussions meanwhile',

    privacyH: 'What the forum stores',
    privacyP:
      'Your email address, a display name you choose, and what you post. The password is hashed by Firebase and never reaches this site. Posts and profiles live in Firestore in the EU; Firebase Authentication itself runs in the US, so the account record and sign-in logs are processed there. Reading the forum needs no account and writes nothing to your device — the sign-in machinery only loads when you use it.',
  },

  de: {
    eyebrow: 'Forum',
    h1: 'Frag alles. Einsteigerfragen sind der Sinn davon.',
    lede:
      'Ein Ort, um zu fragen was etwas bedeutet, einen Skill zu empfehlen, einen False Positive zu melden oder zu sagen, dass eine Regel danebenlag. Nichts hier setzt voraus, dass du das Vokabular schon kennst.',
    leisteSub: 'fragen · teilen · melden',
    leisteNav: 'Bereiche des Forums',
    signIn: 'Anmelden',
    signInGithub: 'Weiter mit GitHub',
    orEmail: 'oder mit einer E-Mail-Adresse',
    signUp: 'Konto anlegen',
    signOut: 'Abmelden',
    signedInAs: 'Angemeldet als',
    whyAccount: 'Ein Konto hier ist eine E-Mail-Adresse und ein Passwort. Firebase speichert das Passwort gehasht — diese Seite sieht es nie und kann es nicht verlieren.',
    emailLabel: 'E-Mail',
    passwordLabel: 'Passwort',
    nameLabel: 'Anzeigename',
    namePlaceholder: 'Was über deinen Beiträgen stehen soll',
    haveAccount: 'Schon ein Konto? Anmelden',
    needAccount: 'Noch kein Konto? Eines anlegen',
    forgot: 'Passwort vergessen?',
    resetSent: 'Falls es zu der Adresse ein Konto gibt, ist ein Link zum Zurücksetzen unterwegs.',
    verifyH: 'Bestätige deine E-Mail-Adresse',
    verifyP: 'Lesen kannst du alles. Zum Schreiben öffne den Link in der Mail, die gerade rausging — das verhindert, dass sich jemand mit einer fremden Adresse anmeldet.',
    verifyResend: 'Nochmal senden',
    verifySent: 'Gesendet. Schau ins Postfach und in den Spam-Ordner.',
    verifyDone: 'Ich habe bestätigt',
    pwTooShort: 'Passwörter brauchen mindestens 8 Zeichen. Länge schlägt Sonderzeichen.',
    emailInvalid: 'Das sieht nicht nach einer E-Mail-Adresse aus.',
    errInUse: 'Zu der Adresse gibt es schon ein Konto. Melde dich stattdessen an.',
    errWrong: 'E-Mail und Passwort passen zu keinem Konto.',
    errWeak: 'Firebase hat das Passwort als zu schwach abgelehnt. Nimm ein längeres.',
    errMany: 'Zu viele Versuche. Warte ein paar Minuten.',
    newThread: '+ POST',
    newThreadH: 'Beitrag schreiben',
    cancel: 'Abbrechen',
    post: 'Absenden',
    posting: 'Wird gesendet…',
    titleLabel: 'Titel',
    titleTooShort: 'Der Titel braucht mindestens sechs Zeichen.',
    bodyTooShort: 'Mindestens zehn Zeichen — genug, dass jemand antworten kann.',
    titlePlaceholder: 'Was ist deine Frage, in einer Zeile?',
    bodyLabel: 'Nachricht',
    bodyPlaceholder: 'Gib genug Details, damit jemand tatsächlich antworten kann. Füg die genaue Ausgabe ein, falls es eine gibt.',
    categoryLabel: 'Kategorie',
    replyPlaceholder: 'Antwort schreiben…',
    reply: 'Antworten',
    replies: 'Antworten',
    voteUp: 'Hilfreich',
    voteDown: 'Nicht hilfreich',
    errVote: 'Die Stimme ist nicht durchgegangen.',
    share: 'Teilen',
    linkCopied: 'Link kopiert.',
    fmtBold: 'Fett',
    fmtItalic: 'Kursiv',
    fmtUnderline: 'Unterstrichen',
    fmtCode: 'Code',
    fmtH: 'Überschrift',
    fmtList: 'Liste',
    fmtNum: 'Nummerierte Liste',
    fmtQuote: 'Zitat',
    fmtLink: 'Verweis',
    fmtBlock: 'Codeblock',
    fmtStrike: 'Durchgestrichen',
    fmtRule: 'Trennlinie',
    preview: 'Vorschau',
    write: 'Schreiben',
    previewEmpty: 'Noch nichts geschrieben.',
    fmtHint: 'Zwei Sterne fett, einer kursiv, zwei Unterstriche unterstrichen.',
    noComments: 'Noch keine Antworten. Deine wäre die erste.',
    answersH: 'Antworten',
    pinned: 'Angepinnt',
    answer: 'Antworten',
    replyOne: 'Antwort',
    back: '← Alle Themen',
    loading: 'Lädt…',
    emptyCat: 'Hier gibt es noch keine Themen. Deins wäre das erste.',
    signInToPost: 'Zum Schreiben anmelden.',
    allCats: 'Alle',
    deleted: '[entfernt]',
    delete: 'Entfernen',
    confirmDelete: 'Das hier entfernen? Es bleibt im Verlauf, als entfernt markiert.',
    errGeneric: 'Das hat nicht geklappt. Prüf die Verbindung und versuch es nochmal.',
    errTooShort: 'Etwas mehr Detail bitte — ein Titel braucht 6 Zeichen, eine Nachricht 10.',

    rulesH: 'Hausregeln, Kurzfassung',
    rules: [
      'Geh davon aus, dass die fragende Person klug und neu ist. Beides gleichzeitig.',
      'Beantworte die gestellte Frage, bevor du die beantwortest, die du lieber gehabt hättest.',
      'Kein „google doch". Wenn es offensichtlich wäre, wäre die Person nicht hier.',
      'Niemals Zugangsdaten, Token oder private Dateien posten — auch nicht geschwärzt, auch nicht als Beispiel.',
      'Ein Befund betrifft eine Datei, nicht die Person, die sie geschrieben hat.',
    ],
    secH: 'Etwas Ernstes gefunden?',
    secP:
      'Wenn du glaubst, dass etwas aktiv ausnutzbar ist, mach keinen öffentlichen Thread auf. Nimm das private Security-Advisory-Formular — das erreicht mich und sonst niemanden, bis es einen Fix gibt.',
    secCta: 'Vertraulich melden',

    setupH: 'Das Forum ist noch nicht scharf geschaltet',
    setupP:
      'Diese Seite ist fertig gebaut und wartet auf ein Firebase-Projekt. Bis dahin lädt hier nichts und wird nichts gespeichert — und genau so sieht es auch aus, wenn etwas falsch konfiguriert ist. Deshalb steht es hier im Klartext statt als leeres Board.',
    setupCta: 'Einrichtungsanleitung',
    setupAlt: 'Solange GitHub Discussions nutzen',

    privacyH: 'Was das Forum speichert',
    privacyP:
      'Deine E-Mail-Adresse, einen selbst gewählten Anzeigenamen und das, was du schreibst. Das Passwort hasht Firebase, es erreicht diese Seite nie. Beiträge und Profile liegen in Firestore in der EU; Firebase Authentication selbst läuft in den USA, dort entstehen also der Kontodatensatz und die Anmelde-Protokolle. Lesen braucht kein Konto und schreibt nichts auf dein Gerät — die Anmeldetechnik lädt erst, wenn du sie benutzt.',
  },

  es: {
    eyebrow: 'Foro',
    h1: 'Pregunta lo que sea. Las preguntas de principiante son el sentido de esto.',
    lede:
      'Un lugar para preguntar qué significa algo, recomendar un skill, informar de un falso positivo, o decir que una regla se equivocó. Nada aquí da por hecho que ya conoces el vocabulario.',
    leisteSub: 'pregunta · comparte · informa',
    leisteNav: 'Zonas del foro',
    signIn: 'Iniciar sesión',
    signInGithub: 'Continuar con GitHub',
    orEmail: 'o con un correo electrónico',
    signUp: 'Crear cuenta',
    signOut: 'Cerrar sesión',
    signedInAs: 'Sesión iniciada como',
    whyAccount: 'Una cuenta aquí es un correo y una contraseña. Firebase guarda la contraseña con hash — este sitio no la ve nunca y no puede perderla.',
    emailLabel: 'Correo',
    passwordLabel: 'Contraseña',
    nameLabel: 'Nombre visible',
    namePlaceholder: 'Lo que debe aparecer en tus publicaciones',
    haveAccount: '¿Ya tienes cuenta? Inicia sesión',
    needAccount: '¿Aún sin cuenta? Crea una',
    forgot: '¿Contraseña olvidada?',
    resetSent: 'Si esa dirección tiene una cuenta, el enlace de restablecimiento va de camino.',
    verifyH: 'Confirma tu correo electrónico',
    verifyP: 'Leer puedes leerlo todo. Para publicar, abre el enlace del correo que acabamos de enviar — evita que alguien se registre con una dirección que no es suya.',
    verifyResend: 'Enviarlo de nuevo',
    verifySent: 'Enviado. Mira tu bandeja de entrada, y la carpeta de spam.',
    verifyDone: 'Ya lo confirmé',
    pwTooShort: 'Las contraseñas necesitan al menos 8 caracteres. La longitud gana a la puntuación.',
    emailInvalid: 'Eso no parece una dirección de correo.',
    errInUse: 'Ya hay una cuenta con esa dirección. Inicia sesión con ella.',
    errWrong: 'Ese correo y esa contraseña no coinciden con ninguna cuenta.',
    errWeak: 'Firebase rechazó esa contraseña por débil. Prueba una más larga.',
    errMany: 'Demasiados intentos. Espera unos minutos.',
    newThread: '+ POST',
    newThreadH: 'Escribir una publicación',
    cancel: 'Cancelar',
    post: 'Publicar',
    posting: 'Publicando…',
    titleLabel: 'Título',
    titleTooShort: 'El título necesita al menos seis caracteres.',
    bodyTooShort: 'Al menos diez caracteres — lo bastante para que alguien pueda responder.',
    titlePlaceholder: '¿Cuál es tu pregunta, en una línea?',
    bodyLabel: 'Mensaje',
    bodyPlaceholder: 'Da suficiente detalle para que alguien pueda responder de verdad. Pega la salida exacta si la hay.',
    categoryLabel: 'Categoría',
    replyPlaceholder: 'Escribe una respuesta…',
    reply: 'Responder',
    replies: 'respuestas',
    voteUp: 'Útil',
    voteDown: 'No útil',
    errVote: 'El voto no llegó.',
    share: 'Compartir',
    linkCopied: 'Enlace copiado.',
    fmtBold: 'Negrita',
    fmtItalic: 'Cursiva',
    fmtUnderline: 'Subrayado',
    fmtCode: 'Código',
    fmtH: 'Encabezado',
    fmtList: 'Lista',
    fmtNum: 'Lista numerada',
    fmtQuote: 'Cita',
    fmtLink: 'Enlace',
    fmtBlock: 'Bloque de código',
    fmtStrike: 'Tachado',
    fmtRule: 'Separador',
    preview: 'Vista previa',
    write: 'Escribir',
    previewEmpty: 'Aún no hay nada escrito.',
    fmtHint: 'Dos asteriscos para negrita, uno para cursiva, dos guiones bajos para subrayado.',
    noComments: 'Aún no hay respuestas. La tuya sería la primera.',
    answersH: 'Respuestas',
    pinned: 'Fijado',
    answer: 'Responder',
    replyOne: 'respuesta',
    back: '← Todos los hilos',
    loading: 'Cargando…',
    emptyCat: 'Aquí aún no hay hilos. El tuyo sería el primero.',
    signInToPost: 'Inicia sesión para publicar.',
    allCats: 'Todos',
    deleted: '[retirado]',
    delete: 'Retirar',
    confirmDelete: '¿Retirar esto? Se queda en el historial, marcado como retirado.',
    errGeneric: 'Eso no ha funcionado. Comprueba la conexión e inténtalo otra vez.',
    errTooShort: 'Un poco más de detalle, por favor — un título necesita 6 caracteres y un mensaje 10.',

    rulesH: 'Reglas de la casa, versión corta',
    rules: [
      'Da por hecho que quien pregunta es inteligente y nuevo. Las dos cosas a la vez.',
      'Responde la pregunta que se hizo antes que la que te habría gustado que hicieran.',
      'Nada de «búscalo en Google». Si fuera obvio, esa persona no estaría aquí.',
      'Nunca publiques credenciales, tokens ni archivos privados — ni siquiera tachados, ni siquiera como ejemplo.',
      'Un hallazgo trata de un archivo, no de la persona que lo escribió.',
    ],
    secH: '¿Encontraste algo serio?',
    secP:
      'Si crees que algo se puede explotar activamente, no abras un hilo público. Usa el formulario privado de aviso de seguridad — me llega a mí y a nadie más hasta que haya un arreglo.',
    secCta: 'Informar en privado',

    setupH: 'El foro aún no está encendido',
    setupP:
      'Esta página está construida y espera un proyecto de Firebase al que apuntar. Hasta entonces aquí no carga nada y no se guarda nada — que es exactamente el mismo aspecto que tiene una configuración rota, así que lo dice en claro en vez de mostrar un tablón vacío.',
    setupCta: 'Guía de puesta en marcha',
    setupAlt: 'Usar GitHub Discussions mientras tanto',

    privacyH: 'Qué guarda el foro',
    privacyP:
      'Tu dirección de correo, un nombre visible que eliges tú, y lo que publicas. La contraseña la hashea Firebase y no llega nunca a este sitio. Las publicaciones y los perfiles viven en Firestore en la UE; Firebase Authentication en sí corre en EE. UU., así que el registro de la cuenta y los logs de acceso se procesan allí. Leer el foro no necesita cuenta y no escribe nada en tu dispositivo — la maquinaria de acceso solo carga cuando la usas.',
  },
};

/**
 * Die Meldeleiste — der Ersatz für `alert()`.
 *
 * Sie gehört zur Seite und nicht zum Browser: dieselbe Kurve, dieselbe Dauer,
 * dieselben Farben wie alles andere. Und sie hält nichts an — `alert()`
 * blockiert den ganzen Ablauf, bis jemand klickt, und wer gerade eine Antwort
 * getippt hat, will nicht erst einen Knopf suchen.
 *
 * Unten und mittig, weil dort der Blick nach dem Absenden ohnehin nicht ist —
 * eine Meldung, die den Text verdeckt, um den es geht, ist keine Hilfe.
 */
/**
 * Die zweite Leiste.
 *
 * ══ Warum sie unter dem Kopf klebt und nicht mitscrollt ═══════════════════
 *
 * Ein Thema kann lang sein. Wer unten in einer Antwort steht und zurueck zur
 * Uebersicht will, scrollt sonst erst wieder ganz nach oben — und genau das
 * ist der Moment, in dem man stattdessen den Zurueck-Knopf des Browsers
 * nimmt und die Seite verlaesst.
 *
 * Der Abstand von oben ist `--hdr-h` und keine getippte Zahl: der Kopf der
 * Seite aendert seine Hoehe an einem Haltepunkt, und zwei Zahlen, die
 * dieselbe Hoehe beschreiben, gehen irgendwann auseinander.
 */
export const LEISTE_CSS = `
.fo-leiste {
  position: sticky; top: var(--hdr-h, 62px); z-index: 40;
  background: var(--bg-subtle);
  border-bottom: 1px solid var(--border);
  /* Ohne das schimmert beim Scrollen der Text darunter durch die Leiste. */
  backdrop-filter: saturate(1.4) blur(6px);
}
.fo-leiste-in {
  display: flex; align-items: center; gap: 20px; min-height: 54px;
  padding-block: 8px; flex-wrap: wrap;
}
.fo-heim { display: flex; flex-direction: column; gap: 1px; flex: none; color: var(--fg); }
.fo-heim:hover { text-decoration: none; color: var(--marke); }
.fo-heim strong { font-family: var(--anzeige); font-weight: 700; font-size: 1.02rem; letter-spacing: -0.01em; }
.fo-heim-sub { font-size: 0.72rem; color: var(--fg-subtle); letter-spacing: 0.04em; }

/*
 * Die Reiter sind LINKS und keine Knoepfe: jeder hat eine eigene Adresse, die
 * sich teilen und in einem neuen Fenster oeffnen laesst. Das Skript faengt den
 * Klick ab und tauscht nur den Inhalt — faellt es aus, funktionieren sie
 * trotzdem, nur mit einem Seitenwechsel.
 */
.fo-reiter-reihe {
  display: flex; gap: 2px; overflow-x: auto; flex: 1 1 auto;
  scrollbar-width: none; -ms-overflow-style: none;
}
.fo-reiter-reihe::-webkit-scrollbar { display: none; }
.fo-reiter {
  padding: 7px 13px; border-radius: 999px; white-space: nowrap;
  color: var(--fg-muted); font-size: 0.88rem; font-weight: 500;
  transition: background var(--kurz) var(--ease), color var(--kurz) var(--ease);
}
.fo-reiter:hover { text-decoration: none; color: var(--fg); background: var(--surface-2); }
/* Der gewaehlte Bereich traegt die Marke — dieselbe Rolle wie der aktive Punkt
   in der Navigation und der gewaehlte Filter auf der Skripteseite. */
.fo-reiter[aria-current="page"] {
  background: var(--marke-flaeche); color: var(--marke-auf-flaeche); font-weight: 650;
}
.fo-leiste-tat { flex: none; margin-left: auto; }
.fo-neu { padding: 8px 16px; font-size: 0.9rem; }

@media (max-width: 720px) {
  .fo-leiste-in { gap: 10px; }
  .fo-heim-sub { display: none; }
  .fo-reiter-reihe { order: 3; width: 100%; }
  .fo-leiste-tat { margin-left: auto; }
}
`;

export /* Ohne <style>-Huelle: head() setzt sie einmal um alle Bausteine. Eine
   zweite darin verschachtelt beendet die erste, und der Rest der Regeln
   landet als Text im Dokument statt im Stylesheet. */
const BEITRAG_CSS = `
/* ── Die Beitragsseite ──────────────────────────────────────────────────── */
.fo-zurueck {
  display: inline-block; margin-bottom: 18px;
  font-size: 0.86rem; color: var(--fg-muted);
}
.fo-zurueck:hover { color: var(--link); }

/*
 * Stimmspalte links, Inhalt rechts. Ein Raster und kein flex, weil die
 * Stimmspalte eine feste Breite hat und der Inhalt den Rest nimmt — mit flex
 * muesste an zwei Stellen stehen, was hier in einer Zeile steht.
 */
.fo-thema, .fo-antwort {
  display: grid; grid-template-columns: 46px minmax(0, 1fr);
  gap: 16px; align-items: start;
  border: 1px solid var(--border); border-radius: 14px;
  background: var(--surface); padding: 20px 22px;
}
.fo-thema { margin-bottom: 30px; }
.fo-antwort { padding: 15px 18px; margin-bottom: 10px; }

.fo-stimmen { display: flex; flex-direction: column; align-items: center; gap: 2px; }
/*
 * 30px hoch und 30px breit. Nicht aus Geschmack: alles darunter ist auf einem
 * Telefon mit dem Daumen nicht zuverlaessig zu treffen, und ein Pfeil, den man
 * verfehlt, setzt die falsche Stimme statt gar keiner.
 */
.fo-pfeil {
  width: 30px; height: 30px; padding: 0; line-height: 1;
  display: grid; place-items: center;
  border: 1px solid transparent; border-radius: 8px;
  background: none; color: var(--fg-subtle);
  font-size: 12px; cursor: pointer;
  transition: color var(--kurz) var(--ease), background var(--kurz) var(--ease);
}
.fo-pfeil:hover { background: var(--surface-2); color: var(--fg); }
.fo-pfeil[aria-pressed="true"] { color: var(--marke-auf-flaeche); background: var(--marke-flaeche); }
.fo-score { font-family: var(--mono); font-size: 0.9rem; font-weight: 700; color: var(--fg); }

.fo-kat {
  display: inline-block; margin-bottom: 8px;
  font-family: var(--mono); font-size: 0.64rem; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--nexus);
}
.fo-titel { font-size: 1.5rem; line-height: 1.25; margin: 0 0 12px; }
.fo-wer { display: flex; align-items: center; gap: 10px; font-size: 0.84rem; color: var(--fg-muted); margin-bottom: 14px; }
.fo-zeit { color: var(--fg-subtle); font-size: 0.78rem; }
.fo-avatar {
  width: 34px; height: 34px; border-radius: 50%; flex: none;
  display: grid; place-items: center; font-weight: 700; font-size: 12px;
  color: #04120b; background: linear-gradient(140deg, var(--airlock), var(--nexus));
}
.fo-avatar.klein { width: 24px; height: 24px; font-size: 9.5px; }
.fo-text { font-size: 0.95rem; }
.fo-text :where(p):last-child { margin-bottom: 0; }
.fo-text code {
  font-family: var(--mono); font-size: 0.88em;
  background: var(--surface-2); padding: 1px 5px; border-radius: 5px;
}

.fo-tat { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 16px; }
.fo-tat-knopf {
  border: 1px solid var(--border); border-radius: 8px;
  background: none; color: var(--fg-muted);
  padding: 5px 11px; font: inherit; font-size: 0.8rem; cursor: pointer;
}
.fo-tat-knopf:hover { border-color: var(--border-strong); color: var(--fg); }
.fo-tat-knopf.klein { margin-left: auto; padding: 2px 8px; font-size: 0.74rem; }

/* ── Die Karte in der Liste ─────────────────────────────────────────────── */
/*
 * Dieselbe Aufteilung wie beim Beitrag selbst: Stimmspalte links, Inhalt
 * rechts. Wer aus der Liste auf einen Beitrag klickt, findet die Pfeile an
 * derselben Stelle wieder — eine Oberflaeche, die ihre Teile beim Wechsel
 * verschiebt, muss zweimal gelernt werden.
 */
.fo-karte {
  display: grid; grid-template-columns: 46px minmax(0, 1fr);
  gap: 16px; align-items: start;
  border: 1px solid var(--border); border-radius: 14px;
  background: var(--surface); padding: 16px 18px; margin-bottom: 12px;
  transition: border-color var(--kurz) var(--ease);
}
.fo-karte:hover { border-color: var(--border-strong); }
/* Angepinnt bekommt eine Kante in der Markenfarbe und keinen anderen Grund:
   eine zweite Flaechenfarbe in einer Liste liest sich als anderer Inhaltstyp. */
.fo-karte.genadelt { border-left: 3px solid var(--nexus); }
.fo-karte-in { min-width: 0; }
.fo-karte-kopf { display: flex; align-items: center; gap: 9px; margin-bottom: 5px; }
.fo-nadel {
  font-family: var(--mono); font-size: 0.6rem; letter-spacing: 0.09em;
  text-transform: uppercase; color: var(--marke-auf-flaeche);
  background: var(--marke-flaeche); padding: 1px 7px; border-radius: 999px;
}
.fo-karte-titel { font-size: 1.06rem; line-height: 1.35; margin: 0 0 6px; }
.fo-karte-titel a { color: var(--fg); }
.fo-karte-titel a:hover { color: var(--link); text-decoration: none; }
/*
 * Zwei Zeilen und dann Schluss. Ein Auszug, der bei einem langen Beitrag
 * zwanzig Zeilen fuellt, ist kein Auszug mehr, und die Liste wird unlesbar —
 * man scrollt dann durch Beitraege statt durch Titel.
 */
.fo-auszug {
  font-size: 0.88rem; line-height: 1.55; color: var(--fg-muted); margin: 0 0 11px;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.fo-karte-fuss {
  display: flex; align-items: center; gap: 7px; flex-wrap: wrap;
  font-size: 0.78rem; color: var(--fg-subtle);
}
.fo-karte-wer { color: var(--fg-muted); }
.fo-karte-punkt { opacity: 0.5; }
.fo-antworten { margin-left: auto; }

.fo-abschnitt {
  display: flex; align-items: baseline; gap: 10px;
  font-size: 1.05rem; margin: 0 0 14px;
}
.fo-zahl { font-family: var(--mono); font-size: 0.8rem; color: var(--fg-subtle); }

/* ── Schreiben ──────────────────────────────────────────────────────────── */
.fo-schreiben {
  border: 1px solid var(--border); border-radius: 14px;
  background: var(--surface); padding: 16px 18px; margin-top: 20px;
}
.fo-wzleiste { display: flex; gap: 4px; margin-bottom: 8px; }
.fo-wz {
  width: 30px; height: 28px; padding: 0;
  display: grid; place-items: center;
  border: 1px solid var(--border); border-radius: 7px;
  background: none; color: var(--fg-muted); cursor: pointer;
  font-family: var(--sans); font-size: 13px;
}
.fo-wz:hover { border-color: var(--border-strong); color: var(--fg); background: var(--surface-2); }
.fo-wz code { font-family: var(--mono); font-size: 11px; }
.fo-hinweis { font-family: var(--mono); font-size: 0.7rem; color: var(--fg-subtle); margin: 0; }
.fo-schreibkopf { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.fo-wzleiste { margin-bottom: 0; flex-wrap: wrap; }
/* Ein Strich zwischen den Gruppen: umschliessende Zeichen, Zeilenanfaenge,
   Bloecke. Ohne ihn ist es eine Reihe aus elf gleich aussehenden Knoepfen. */
.fo-wztrenner { width: 1px; align-self: stretch; background: var(--border); margin: 2px 3px; }
.fo-vorschau-schalter {
  margin-left: auto; border: 1px solid var(--border); border-radius: 7px;
  background: none; color: var(--fg-muted); padding: 4px 11px;
  font: inherit; font-size: 0.78rem; cursor: pointer; white-space: nowrap;
}
.fo-vorschau-schalter:hover { border-color: var(--border-strong); color: var(--fg); }
.fo-vorschau-schalter[aria-pressed="true"] {
  background: var(--marke-flaeche); color: var(--marke-auf-flaeche); border-color: transparent;
}
/*
 * Die Vorschau bekommt dieselbe Mindesthoehe wie das Feld, das sie ersetzt.
 * Ohne das springt der Dialog beim Umschalten, und der Knopf, den man gerade
 * gedrueckt hat, wandert unter dem Zeiger weg.
 */
.fo-vorschau {
  min-height: 150px; padding: 10px 12px; margin: 4px 0 14px;
  border: 1px dashed var(--border-strong); border-radius: var(--radius);
  background: var(--bg);
}

/* ── Was mark() erzeugt ─────────────────────────────────────────────────── */
.fo-text h2, .fo-text h3, .fo-text h4 { margin: 1.1em 0 0.4em; line-height: 1.3; }
.fo-text h2 { font-size: 1.15rem; }
.fo-text h3 { font-size: 1.02rem; }
.fo-text h4 { font-size: 0.94rem; color: var(--fg-muted); }
.fo-text :where(h2, h3, h4):first-child { margin-top: 0; }
.fo-text ul, .fo-text ol { margin: 0.6em 0; padding-left: 1.4em; }
.fo-text li { margin-bottom: 0.3em; }
/*
 * Der Balken links steht in der Markenfarbe und nicht in Grau: ein Zitat ist
 * fremde Rede, und das soll man beim Ueberfliegen sehen, ohne zu lesen.
 */
.fo-text blockquote {
  margin: 0.8em 0; padding: 2px 0 2px 14px;
  border-left: 3px solid var(--nexus); color: var(--fg-muted);
}
.fo-text pre {
  margin: 0.8em 0; padding: 11px 13px; overflow-x: auto;
  border: 1px solid var(--border); border-radius: var(--radius);
  background: var(--surface-2);
}
.fo-text pre code { background: none; padding: 0; font-size: 0.84rem; line-height: 1.55; }
.fo-text hr { margin: 1.3em 0; border: 0; border-top: 1px solid var(--border); }
.fo-text a { text-decoration: underline; text-underline-offset: 0.18em; }
.fo-text s { opacity: 0.65; }

/* ── Der Dialog ─────────────────────────────────────────────────────────── */
.fo-dialog {
  width: min(640px, calc(100vw - 32px));
  padding: 0; border: 1px solid var(--border); border-radius: 16px;
  background: var(--surface); color: var(--fg);
  box-shadow: var(--e3);
}
/*
 * ::backdrop erbt NICHT vom Dokument — es haengt am Element, nicht im
 * Elementbaum. Die eigenen Farbvariablen sind hier deshalb nicht zu haben,
 * und ein var(--irgendwas) faellt still auf durchsichtig zurueck. Also ein
 * fester Wert, der in beiden Modi funktioniert.
 */
.fo-dialog::backdrop { background: rgba(5, 3, 15, 0.62); backdrop-filter: blur(2px); }
.fo-dialog-in { padding: 22px 24px 20px; }
.fo-dialog-kopf { font-size: 1.15rem; margin: 0 0 16px; }
.fo-l { display: block; font-size: 0.76rem; color: var(--fg-muted); margin-bottom: 2px; }
.fo-dialog-fuss { display: flex; justify-content: flex-end; gap: 10px; margin-top: 16px; }

@media (max-width: 620px) {
  .fo-thema, .fo-antwort { grid-template-columns: 34px minmax(0, 1fr); gap: 10px; padding: 15px 14px; }
  .fo-titel { font-size: 1.22rem; }
}
`;

const EINLADUNG_CSS = `
/*
 * Die Einladung steht an der Stelle, an der vorher ein 420px breites
 * Formular klebte — linksbuendig in einer Zeile, die sonst leer war. Genau
 * das sah schief aus. Hier steht sie mittig und ist so hoch wie ein Absatz,
 * weil sie auch nur einer ist: ein Satz und ein Weg dorthin.
 */
.fo-einladung {
  display: flex; align-items: center; justify-content: center;
  gap: 16px; flex-wrap: wrap;
  /* Der Elternteil ist ein flex-Kasten mit space-between. Dort ist width:100%
     wirkungslos, weil die Grundgroesse aus flex-basis kommt: gemessen 169px
     statt 1232. flex: 1 1 100% setzt die Grundgroesse selbst. */
  flex: 1 1 100%;
  padding: 20px 24px; margin: 0 auto;
  border: 1px solid var(--border); border-radius: 14px;
  background: var(--surface);
}
.fo-einladung p { margin: 0; color: var(--fg-muted); font-size: 0.92rem; }
`;

const MELDE_CSS = `
.fo-melde {
  position: fixed; left: 50%; bottom: 20px; z-index: 60;
  transform: translate(-50%, 12px);
  max-width: min(520px, calc(100vw - 32px));
  padding: 11px 18px;
  border: 1px solid var(--border-strong); border-radius: 999px;
  background: var(--surface); color: var(--fg);
  box-shadow: var(--e2);
  font-size: 0.92rem; line-height: 1.4; text-align: center;
  opacity: 0; pointer-events: none;
  transition: opacity var(--kurz) var(--ease), transform var(--mittel) var(--ease);
}
.fo-melde[data-da="1"] { opacity: 1; transform: translate(-50%, 0); }
.fo-melde[data-art="fehler"] { border-color: var(--danger); }
.fo-melde[data-art="gut"] { border-color: var(--marke-rand); }
`;

/** Nur das Blatt dieser Seite — der Rest kommt aus der Designsprache. */
export function head() {
  return `<style>${LEISTE_CSS}${BEITRAG_CSS}${EINLADUNG_CSS}${MELDE_CSS}</style>`;
}

export function body(lang) {
  const t = T[lang];
  const cats = CATEGORIES.map(
    (c) => `<article class="card lift">
      <h3><span class="accent-${c.tone === 'a' ? 'airlock' : c.tone === 'n2' ? 'nexus' : 'index'}">${c[lang]}</span></h3>
      <p class="muted small">${lang === 'en' ? c.enD : c.deD}</p>
    </article>`,
  ).join('');

  const board = CONFIGURED
    ? `
<section id="board" style="padding-top:0">
  <div class="wrap">
    <div id="authBar" class="filters" style="justify-content:space-between"></div>
    <div id="forumRoot"><p class="muted">${t.loading}</p></div>
  </div>
</section>`
    : `
<section style="padding-top:0">
  <div class="wrap narrow">
    <div class="note warn">
      <h3>${t.setupH}</h3>
      <p>${t.setupP}</p>
      <div class="btn-row">
        <a class="btn btn-primary" href="${SITE.repoSite}/blob/main/docs/SETUP-FIREBASE.md">${t.setupCta}</a>
        <a class="btn" href="${SITE.discussions}">${t.setupAlt}</a>
      </div>
    </div>
  </div>
</section>`;

  /*
   * Die Kategorien als Reiter in der zweiten Leiste. Sie sind Links und keine
   * Knoepfe: jeder hat eine eigene Adresse, die man teilen und in einem neuen
   * Fenster oeffnen kann. Das Skript faengt den Klick ab und tauscht nur den
   * Inhalt — aber wenn es nicht laedt, funktionieren sie trotzdem.
   */
  const reiter = [{ id: '', label: t.allCats }]
    .concat(CATEGORIES.map((c) => ({ id: c.id, label: c[lang] })))
    .map((c) => `<a class="fo-reiter" href="${href(lang, 'forum')}${c.id ? '?cat=' + c.id : ''}" data-cat="${c.id}">${c.label}</a>`)
    .join('');

  return `
<!--
  ═══════════════════════════════════════════════════════════════════════════
  Eine zweite Leiste statt eines Aufmachers
  ═══════════════════════════════════════════════════════════════════════════

  Hier stand ein Hero: Augenbraue, grosse Ueberschrift, Vorspann, ein Absatz
  ueber Konten. Vier Bloecke, bevor das erste Thema zu sehen war — auf einer
  Seite, zu der man kommt, um Themen zu lesen.

  Ein Forum ist kein Prospekt. Wer es aufruft, ist entweder hier, um etwas zu
  lesen, oder um etwas zu schreiben; beides steht jetzt sofort da. Der Satz
  ueber Konten ist nicht verschwunden, er steht weiter unten, wo man ihn liest,
  wenn man ihn braucht.

  Die Leiste sitzt unter dem Kopf der Seite und traegt, was das Forum ausmacht:
  wo man ist, welche Bereiche es gibt, und der Knopf zum Schreiben. Sie bleibt
  beim Scrollen stehen — wer in einem langen Thema liest, kommt ohne Rueckweg
  zurueck zur Uebersicht.

  KEINE RUECKSTRICHE IN DIESEM KOMMENTAR — er steht in einem Template-Literal.
-->
<div class="fo-leiste">
  <div class="wrap fo-leiste-in">
    <a class="fo-heim" href="${href(lang, 'forum')}">
      <strong>${t.eyebrow}</strong>
      <span class="fo-heim-sub">${t.leisteSub}</span>
    </a>
    <nav class="fo-reiter-reihe" aria-label="${t.leisteNav}">${reiter}</nav>
    <div class="fo-leiste-tat">
      <button type="button" class="btn btn-primary fo-neu js-only" id="foNeu">${t.newThread}</button>
    </div>
  </div>
</div>

${board}

<section class="band">
  <div class="wrap stack-lg">
    <h2 class="head-rule"><span>${lang === 'en' ? 'Categories' : 'Kategorien'}</span></h2>
    <div class="grid grid-3">${cats}</div>
  </div>
</section>

<section>
  <div class="wrap grid grid-2">
    <div class="stack">
      <h2>${t.rulesH}</h2>
      <ul class="muted" style="padding-left:1.1rem">
        ${t.rules.map((r) => `<li style="margin-bottom:0.45rem">${r}</li>`).join('')}
      </ul>
      <div class="note ok"><h3>${t.privacyH}</h3><p>${t.privacyP}</p></div>
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

export function script(lang) {
  if (!CONFIGURED) return '';
  const t = T[lang];

  // Built without template literals on purpose: this string is itself emitted
  // from a template literal, and nesting them is how you get a build that
  // silently interpolates half your source.
  return [
    '(function () {',
    '  var CFG = ' + JSON.stringify({
      apiKey: FB.apiKey, authDomain: FB.authDomain, projectId: FB.projectId,
      storageBucket: FB.storageBucket, messagingSenderId: FB.messagingSenderId, appId: FB.appId,
    }) + ';',
    '  var SDK = ' + JSON.stringify(FB.sdkVersion || '11.0.2') + ';',
    '  var L = ' + JSON.stringify(t) + ';',
    /* Die Adresse der Anmeldeseite kommt aus href() und wird nicht im
       Skript zusammengesetzt: sie haengt an der Sprache, und ein von Hand
       gebauter Pfad waere die eine Stelle, die beim naechsten Umbau der
       Adressen vergessen wird. So faellt sie in die Verweispruefung. */
    '  var ANMELDEN = ' + JSON.stringify(href(lang, 'signin')) + ';',
    '  var SPRACHE = ' + JSON.stringify(lang) + ';',
    '  var CATS = ' + JSON.stringify(CATEGORIES.map((c) => ({ id: c.id, label: c[lang] }))) + ';',
    '  var MODS = ' + JSON.stringify(FB.moderatorUids || []) + ';',
    '',
    '',
    '  /*',
    '   * ── Meldungen statt melde() ─────────────────────────────────────────',
    '   *',
    '   * `melde()` ist ein Fenster des Browsers: es traegt seinen eigenen',
    '   * Rahmen, seine eigene Schrift und den Titel "skillry.de enthaelt" davor.',
    '   * Auf einer Seite, die gerade eine Designsprache bekommen hat, ist das',
    '   * der einzige Ort, an dem sie aufhoert. Ausserdem haelt es den ganzen',
    '   * Ablauf an, bis jemand klickt.',
    '   *',
    '   * Die Leiste hier gehoert zur Seite: sie erscheint unten, verschwindet',
    '   * von selbst, und `role="status"` sorgt dafuer, dass ein',
    '   * Vorleseprogramm sie mitbekommt, ohne dass der Fokus springt.',
    '   */',
    '  var meldBox = null, meldZeit = null;',
    '  function melde(text, art) {',
    '    if (!meldBox) {',
    '      meldBox = document.createElement("div");',
    '      meldBox.className = "fo-melde";',
    '      meldBox.setAttribute("role", "status");',
    '      document.body.appendChild(meldBox);',
    '    }',
    '    meldBox.textContent = String(text);',
    '    meldBox.dataset.art = art || "info";',
    '    meldBox.dataset.da = "1";',
    '    clearTimeout(meldZeit);',
    '    meldZeit = setTimeout(function () { meldBox.dataset.da = "0"; }, art === "fehler" ? 7000 : 4000);',
    '  }',
    '',
    '  var root = document.getElementById("forumRoot");',
    '  var authBar = document.getElementById("authBar");',
    '  if (!root) return;',
    '',
    '  var db, auth, fb, fbApp, user = null, authReady = null;',
    '  /* Der Bereich kommt aus der Adresse und nicht aus einer leeren Zeichenkette.',
    '     Vorher fing die Seite immer bei "Alle" an, auch wenn der Link ?cat=ideas',
    '     hiess — jeder geteilte Bereichslink landete auf der Gesamtliste. */',
    '  var cat = new URLSearchParams(location.search).get("cat") || "";',
  '',
  '  // Firebase Auth writes a persistence store to the device the moment it is',
  '  // initialised. Loading it for everybody who merely reads the forum would',
  '  // store something on the machine of someone who asked for nothing — and',
  '  // would make the privacy statement on this site false. So it is loaded on',
  '  // demand: when somebody actually wants to sign in, or when they have signed',
  '  // in here before and the store already exists.',
  '  function ensureAuth() {',
  '    if (authReady) return authReady;',
  '    authReady = import(BASE + "firebase-auth.js").then(function (m) {',
  '      Object.assign(fb, m);',
  '      auth = fb.getAuth(fbApp);',
  '      return new Promise(function (resolve) {',
  '        var first = true;',
  '        fb.onAuthStateChanged(auth, function (u) {',
  '          user = u;',
  '          renderAuth();',
  '          if (u) {',
  '            fb.setDoc(fb.doc(db, "users", u.uid), {',
  '              displayName: u.displayName || (u.email || "").split("@")[0],',
  '              updatedAt: fb.serverTimestamp()',
  '            }, { merge: true }).catch(function () {});',
  '          }',
  '          route();',
  '          if (first) { first = false; resolve(); }',
  '        });',
  '      });',
  '    });',
  '    return authReady;',
  '  }',
  '',
  '  // Has this browser signed in here before? Checking for Firebase\'s own key',
  '  // reads nothing new and writes nothing; it only tells us whether loading',
  '  // Auth is restoring a session the visitor asked for.',
  '  /*',
  '   * Hat dieser Browser sich hier schon einmal angemeldet?',
  '   *',
  '   * ══ WAS HIER FALSCH WAR ═══════════════════════════════════════════════',
  '   *',
  '   * Diese Funktion durchsuchte nur den localStorage nach einem Schluessel,',
  '   * der mit "firebase:authUser" anfaengt. Das war die Ablage des alten',
  '   * Firebase-SDK. Das heutige legt die Anmeldung in die IndexedDB, in eine',
  '   * Datenbank namens firebaseLocalStorageDb — im localStorage steht dazu',
  '   * nichts mehr.',
  '   *',
  '   * Die Antwort war deshalb IMMER nein. ensureAuth() lief nie, user blieb',
  '   * fuer immer null, und das Forum zeigte einem Angemeldeten die Einladung',
  '   * zum Anmelden, den Hinweis "Zum Schreiben anmelden" und beim Klick auf',
  '   * + POST dieselbe Meldung noch einmal — waehrend oben im Kopf sein Name',
  '   * stand. Drei Symptome, ein Grund.',
  '   *',
  '   * ══ UND WARUM ES NICHT EINFACH IMMER JA HEISST ════════════════════════',
  '   *',
  '   * Weil die Frage einen Sinn hat, der bleibt: wer nur liest, soll kein',
  '   * Firebase-Auth geladen bekommen. Das legt etwas auf einem Geraet ab,',
  '   * dessen Besitzer um nichts gebeten hat, und macht den Datenschutztext',
  '   * dieser Seite falsch. Ein pauschales Ja waere bequem und unehrlich.',
  '   *',
  '   * ══ WER ES JETZT BEANTWORTET ══════════════════════════════════════════',
  '   *',
  '   * Der Kopf. Er stellt dieselbe Frage auf jeder Seite und hinterlegt seine',
  '   * Antwort unter skillry:who — eine Notiz, die er bei jedem Wechsel des',
  '   * Anmeldezustands schreibt und beim Abmelden loescht. Sie zu lesen ist',
  '   * billiger und richtiger, als die Ablagen von Firebase zu erraten: sie',
  '   * folgt dem Zustand, statt seine Bauweise nachzubilden.',
  '   *',
  '   * Der alte localStorage-Test bleibt als zweiter Weg stehen. Er kostet',
  '   * nichts und faengt den Fall ab, in dem die Notiz fehlt, die Anmeldung',
  '   * aber da ist.',
  '   */',
  '  function returningUser() {',
  '    var A = window.Skillry && window.Skillry.auth;',
  '    if (A && A.state && A.state.user) return true;',
  '    try {',
  '      if (localStorage.getItem("skillry:who")) return true;',
  '      for (var i = 0; i < localStorage.length; i++) {',
  '        if (localStorage.key(i).indexOf("firebase:authUser") === 0) return true;',
  '      }',
  '    } catch (e) {}',
  '    return false;',
  '  }',
    '',
    '  function esc(s) {',
    '    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {',
    '      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\\"": "&quot;" }[c];',
    '    });',
    '  }',
    '  function para(s) { return esc(s).split(/\\n{2,}/).map(function (p) { return "<p>" + p.replace(/\\n/g, "<br>") + "</p>"; }).join(""); }',
    '',
    '  /*',
    '   * ══ DIE AUSZEICHNUNG ══════════════════════════════════════════════════',
    '   *',
    '   * DIE REIHENFOLGE IST DIE SICHERHEIT. esc() laeuft ZUERST, danach alle',
    '   * Muster. esc() erzeugt selbst nie ein Sternchen, einen Unterstrich, eine',
    '   * Raute oder einen Backtick — wer spitze Klammern tippt, bekommt sie',
    '   * escapt zurueck und kann von da an kein Markup mehr bilden.',
    '   *',
    '   * Andersherum waere jedes Muster ein Loch: erst Tags einsetzen und dann',
    '   * escapen wuerde die eigenen Tags mit escapen; erst Tags einsetzen und',
    '   * dann NICHT escapen ist eine offene Tuer.',
    '   *',
    '   * Zeilenweise und nicht mit einem Ausdruck ueber den ganzen Text: Listen',
    '   * und Codebloecke haben einen ANFANG UND EIN ENDE, und das kann ein',
    '   * einzelner Ausdruck nicht mitzaehlen. Der Vorgaenger konnte deshalb nur,',
    '   * was innerhalb einer Zeile passt.',
    '   */',
    '  function inline(t) {',
    '    /* Verweise zuerst: sonst frisst die Kursiv-Regel Sternchen in Adressen. */',
    '    t = t.replace(/\\[([^\\]\\n]{1,120})\\]\\(([^)\\s]{1,400})\\)/g, function (ganz, text, ziel) {',
    '      /*',
    '       * NUR http und https, und der Vergleich laeuft auf der KLEINGESCHRIEBENEN',
    '       * Adresse. Ohne diese Pruefung waere [klick](javascript:...) ein',
    '       * ausfuehrbarer Verweis — die klassische Luecke jedes selbstgebauten',
    '       * Markdown. data: und vbscript: sind aus demselben Grund draussen.',
    '       *',
    '       * Das Ziel steht schon escapt hier drin, kann also kein Attribut',
    '       * aufbrechen. Trotzdem wird es geprueft und nicht bloss eingesetzt:',
    '       * escapt heisst nicht harmlos.',
    '       */',
    '      var k = ziel.toLowerCase();',
    '      if (k.indexOf("http://") !== 0 && k.indexOf("https://") !== 0) return ganz;',
    '      /* noopener, weil ein neues Fenster sonst per window.opener auf diese',
    '         Seite zurueckgreifen kann. nofollow, weil ein offenes Forum sonst',
    '         eine Empfehlungsmaschine fuer Fremde wird. */',
    '      return "<a href=\\"" + ziel + "\\" rel=\\"noopener nofollow\\" target=\\"_blank\\">" + text + "</a>";',
    '    });',
    '    t = t.replace(/`([^`\\n]+)`/g, "<code>$1</code>");',
    '    t = t.replace(/\\*\\*([^*\\n]+)\\*\\*/g, "<strong>$1</strong>");',
    '    t = t.replace(/(^|[^*\\w])\\*([^*\\n]+)\\*/g, "$1<em>$2</em>");',
    '    t = t.replace(/__([^_\\n]+)__/g, "<u>$1</u>");',
    '    /* Die Tilde kommt aus ihrem Zeichencode: sie ist beim Erzeugen',
    '       dieser Datei der Platzhalter fuer ein Anfuehrungszeichen, und',
    '       direkt hingeschrieben wurde aus dem Muster ein leeres Paar.',
    '       Ohne Zeilenumbruch in der Klasse: inline() bekommt immer nur',
    '       eine Zeile, also kann dort keiner stehen. */',
    '    var TILDE = String.fromCharCode(126);',
    '    var reDurch = new RegExp(TILDE + TILDE + "([^" + TILDE + "]+)" + TILDE + TILDE, "g");',
    '    t = t.replace(reDurch, "<s>$1</s>");',
    '    return t;',
    '  }',
    '',
    '  /*',
    '   * Der Auszug fuer die Liste: reiner Text, keine Auszeichnung.',
    '   *',
    '   * Bewusst NICHT mark() mit anschliessendem Abschneiden. Ein Auszug, der',
    '   * mitten in einer Liste oder einem Codeblock endet, reisst das Markup auf,',
    '   * und ein halb geschlossenes ul verschiebt alles darunter. Hier werden die',
    '   * Zeichen entfernt statt gedeutet.',
    '   */',
    '  function auszug(roh, laenge) {',
    '    var t = String(roh || "");',
    '    var BT = String.fromCharCode(96);',
    '    /* Codebloecke ganz weg: in einer Zeile ergeben sie Kauderwelsch. */',
    '    t = t.replace(new RegExp(BT + BT + BT + "[^" + BT + "]*" + BT + BT + BT, "g"), " ");',
    '    t = t.replace(/\\[([^\\]]{1,120})\\]\\([^)]*\\)/g, "$1");',
    '    /* Hier steht ein rohes Groesserzeichen und nicht &gt;: auszug()',
    '       bekommt den Text, wie er getippt wurde. mark() escapt zuerst,',
    '       diese Funktion nicht — und die Regel muss zu ihrer Eingabe',
    '       passen, nicht zur Eingabe der Nachbarfunktion. */',
    '    t = t.replace(/^ *(#{1,6}|>|[-*+]|\\d+[.)]) */gm, "");',
    '    /* {1,} statt einem Plus: beim Erzeugen dieser Datei ist +~ ein',
    '       Marker fuer ein escaptes Anfuehrungszeichen, und das Plus im',
    '       Muster wurde als sein Anfang gelesen. Derselbe Marker, dieselbe',
    '       Falle wie schon bei der Tilde. */',
    '    t = t.replace(new RegExp("[*_" + BT + "]{1,}", "g"), "");',
    '    t = t.replace(new RegExp(String.fromCharCode(126, 126), "g"), "");',
    '    t = t.replace(/^ *-{3,} *$/gm, " ").replace(/\\s+/g, " ").trim();',
    '    if (t.length <= laenge) return t;',
    '    /* An der Wortgrenze abschneiden. Mitten im Wort zu kappen liest sich wie',
    '       ein Fehler, nicht wie eine Kuerzung. */',
    '    var kurz = t.slice(0, laenge);',
    '    var luecke = kurz.lastIndexOf(" ");',
    '    return (luecke > laenge * 0.6 ? kurz.slice(0, luecke) : kurz) + " …";',
    '  }',
    '',
    '  function mark(s) {',
    '    var zeilen = esc(s).split(/\\r?\\n/);',
    '    var aus = [], liste = null, code = null, absatz = [];',
    '',
    '    /* Ein angefangener Absatz wird abgeschlossen, bevor etwas anderes',
    '       beginnt. Ohne das rutschte eine Ueberschrift mitten in einen <p>. */',
    '    function absatzZu() {',
    '      if (!absatz.length) return;',
    '      aus.push("<p>" + inline(absatz.join("<br>")) + "</p>");',
    '      absatz = [];',
    '    }',
    '    function listeZu() {',
    '      if (!liste) return;',
    '      aus.push("</" + liste + ">");',
    '      liste = null;',
    '    }',
    '',
    '    for (var i = 0; i < zeilen.length; i++) {',
    '      var z = zeilen[i];',
    '',
    '      /* Codeblock: alles dazwischen bleibt woertlich, ohne inline(). Sonst',
    '         wuerde ein Beispiel, das Sternchen zeigen will, formatiert statt',
    '         gezeigt — und genau dafuer schreibt man einen Codeblock. */',
    '      if (/^ {0,3}(&#96;&#96;&#96;|```)/.test(z)) {',
    '        if (code === null) { absatzZu(); listeZu(); code = []; }',
    '        else { aus.push("<pre><code>" + code.join("\\n") + "</code></pre>"); code = null; }',
    '        continue;',
    '      }',
    '      if (code !== null) { code.push(z); continue; }',
    '',
    '      if (/^ *$/.test(z)) { absatzZu(); listeZu(); continue; }',
    '',
    '      var h = /^(#{1,3}) +(.*)$/.exec(z);',
    '      if (h) {',
    '        absatzZu(); listeZu();',
    '        /* h2 bis h4 und nicht h1 bis h3: die h1 der Seite ist der Titel des',
    '           Beitrags. Zwei h1 in einem Dokument sind fuer eine Vorlesehilfe',
    '           zwei Dokumente. */',
    '        var stufe = h[1].length + 1;',
    '        aus.push("<h" + stufe + ">" + inline(h[2]) + "</h" + stufe + ">");',
    '        continue;',
    '      }',
    '',
    '      if (/^ {0,3}(-{3,}|\\*{3,}) *$/.test(z)) {',
    '        absatzZu(); listeZu(); aus.push("<hr>"); continue;',
    '      }',
    '',
    '      var zitat = /^ {0,3}&gt; ?(.*)$/.exec(z);',
    '      if (zitat) {',
    '        absatzZu(); listeZu();',
    '        aus.push("<blockquote>" + inline(zitat[1]) + "</blockquote>");',
    '        continue;',
    '      }',
    '',
    '      var punkt = /^ {0,3}[-*+] +(.*)$/.exec(z);',
    '      var zahl = /^ {0,3}\\d{1,3}[.)] +(.*)$/.exec(z);',
    '      if (punkt || zahl) {',
    '        absatzZu();',
    '        var art = punkt ? "ul" : "ol";',
    '        if (liste !== art) { listeZu(); liste = art; aus.push("<" + art + ">"); }',
    '        aus.push("<li>" + inline((punkt || zahl)[1]) + "</li>");',
    '        continue;',
    '      }',
    '',
    '      listeZu();',
    '      absatz.push(z);',
    '    }',
    '',
    '    /* Am Ende schliessen, was offen blieb. Ein Codeblock ohne Schluss ist',
    '       kein Grund, den Text zu verschlucken — er wird gezeigt, wie er ist. */',
    '    if (code !== null) aus.push("<pre><code>" + code.join("\\n") + "</code></pre>");',
    '    absatzZu(); listeZu();',
    '    return aus.join("");',
    '  }',
    '',
    '  /*',
    '   * Stimmen.',
    '   *',
    '   * Zwei Schreibvorgaenge in EINEM Stapel: das eigene Stimmdokument und die',
    '   * laufende Summe am Elterndokument. Einzeln abgeschickt koennte der zweite',
    '   * scheitern, und dann stuende eine Stimme da, die in keiner Summe auftaucht',
    '   * — ein Zaehler, der dauerhaft danebenliegt und den niemand mehr',
    '   * geradeziehen kann.',
    '   *',
    '   * Das Stimmdokument heisst wie die uid. Zweimal abstimmen ist deshalb ein',
    '   * Ueberschreiben und kein Dazuzaehlen, auch dann, wenn jemand die',
    '   * Oberflaeche umgeht. Erzwungen wird das in firestore.rules, nicht hier:',
    '   * ein versteckter Knopf ist ein Vorschlag, ein Dokumentname eine Tatsache.',
    '   */',
    '  function stimmeSetzen(pfad, alt, neu) {',
    '    if (!canPost()) { melde(L.signInToPost, "fehler"); return Promise.resolve(false); }',
    '    var elternRef = fb.doc.apply(null, [db].concat(pfad));',
    '    var stimmRef = fb.doc.apply(null, [db].concat(pfad, ["votes", user.uid]));',
    '    var stapel = fb.writeBatch(db);',
    '    if (neu === 0) stapel.delete(stimmRef); else stapel.set(stimmRef, { v: neu });',
    '    stapel.update(elternRef, { score: fb.increment(neu - alt) });',
    '    return stapel.commit().then(function () { return true; }, function () {',
    '      melde(L.errVote, "fehler"); return false;',
    '    });',
    '  }',
    '',
    '  /* aria-pressed statt nur einer Farbe: wer mit einer Vorlesehilfe unterwegs',
    '     ist, soll auch hoeren, dass die eigene Stimme sitzt. */',
    '  function stimmleiste(score, meine) {',
    '    function pfeil(v, zeichen, text) {',
    '      return "<button type=\\"button\\" class=\\"fo-pfeil\\" data-v=\\"" + v +',
    '        "\\" aria-pressed=\\"" + (meine === v) + "\\" aria-label=\\"" + esc(text) +',
    '        "\\">" + zeichen + "</button>";',
    '    }',
    '    return "<div class=\\"fo-stimmen\\">" +',
    '      pfeil(1, "&#9650;", L.voteUp) +',
    '      "<span class=\\"fo-score\\">" + (score || 0) + "</span>" +',
    '      pfeil(-1, "&#9660;", L.voteDown) + "</div>";',
    '  }',
    '',
    '  /* Teilen. navigator.share gibt es praktisch nur auf Mobilgeraeten und nur',
    '     ueber https — die Zwischenablage ist deshalb kein Notnagel, sondern der',
    '     Normalfall am Schreibtisch. Beide Wege melden zurueck: ein Knopf, der',
    '     still nichts tut, wird zweimal gedrueckt. */',
    '  function teilen(titel) {',
    '    var u = location.href;',
    '    if (navigator.share) { navigator.share({ title: titel, url: u }).catch(function () {}); return; }',
    '    if (navigator.clipboard) {',
    '      navigator.clipboard.writeText(u).then(function () { melde(L.linkCopied, "gut"); },',
    '                                            function () { melde(u, "gut"); });',
    '      return;',
    '    }',
    '    melde(u, "gut");',
    '  }',
    '',
    '  /*',
    '   * DIE FORMATIERUNGSLEISTE',
    '   *',
    '   * Sie tippt nur Zeichen. Fett ist zwei Sternchen, kursiv eines,',
    '   * unterstrichen zwei Unterstriche — dieselben Zeichen, die man auch von',
    '   * Hand schreiben kann, und dieselben, die mark() spaeter liest.',
    '   *',
    '   * Es waere verlockend gewesen, hier einen richtigen Editor einzubauen',
    '   * (contenteditable, execCommand). Das haette aber HTML aus dem Browser in',
    '   * die Datenbank gebracht, und damit stuende die Frage im Raum, welches',
    '   * HTML man wieder herauslaesst. So bleibt gespeichert, was jemand getippt',
    '   * hat: Text. Die Auszeichnung entsteht erst beim Anzeigen, an genau einer',
    '   * Stelle, und die ist geprueft.',
    '   */',
    '  /*',
    '   * DIE WERKZEUGLEISTE',
    '   *',
    '   * Sie tippt nur Zeichen — dieselben, die man auch von Hand schreiben kann,',
    '   * und dieselben, die mark() spaeter liest. Kein contenteditable: das',
    '   * haette HTML aus dem Browser in die Datenbank gebracht, und damit die',
    '   * Frage, welches HTML man wieder herauslaesst. So bleibt gespeichert, was',
    '   * jemand getippt hat: Text.',
    '   *',
    '   * Zwei Arten von Knopf, und der Unterschied steht in den Daten, nicht im',
    '   * Code: `wz` umschliesst die Auswahl (fett, kursiv), `pre` stellt sich vor',
    '   * die Zeile (Ueberschrift, Liste, Zitat). Ein Zeilenanfang laesst sich',
    '   * nicht umschliessen, und eine Auswahl nicht voranstellen.',
    '   */',
    '  function werkzeugleiste(zielId) {',
    '    function knopf(art, marke, titel, inhalt) {',
    '      return "<button type=\\"button\\" class=\\"fo-wz\\" data-" + art + "=\\"" + marke +',
    '        "\\" data-ziel=\\"" + zielId + "\\" title=\\"" + esc(titel) + "\\">" + inhalt + "</button>";',
    '    }',
    '    return "<div class=\\"fo-wzleiste\\">" +',
    '      knopf("wz", "**", L.fmtBold, "<strong>B</strong>") +',
    '      knopf("wz", "*", L.fmtItalic, "<em>I</em>") +',
    '      knopf("wz", "__", L.fmtUnderline, "<u>U</u>") +',
    '      knopf("wz", String.fromCharCode(126, 126), L.fmtStrike, "<s>S</s>") +',
    '      "<span class=\\"fo-wztrenner\\" aria-hidden=\\"true\\"></span>" +',
    '      knopf("pre", "## ", L.fmtH, "H") +',
    '      knopf("pre", "- ", L.fmtList, "&bull;") +',
    '      knopf("pre", "1. ", L.fmtNum, "1.") +',
    '      knopf("pre", "&gt; ", L.fmtQuote, "&rdquo;") +',
    '      "<span class=\\"fo-wztrenner\\" aria-hidden=\\"true\\"></span>" +',
    '      knopf("wz", String.fromCharCode(96), L.fmtCode, "<code>&lt;&gt;</code>") +',
    '      knopf("block", "x", L.fmtBlock, "<code>{}</code>") +',
    '      knopf("link", "x", L.fmtLink, "&#128279;") +',
    '      knopf("rule", "x", L.fmtRule, "&mdash;") +',
    '      "</div>";',
    '  }',
    '',
    '  /*',
    '   * Einmal binden, fuer alle Leisten unter der uebergebenen Wurzel.',
    '   *',
    '   * setRangeText statt value neu zu setzen: das erhaelt die',
    '   * Rueckgaengig-Kette des Browsers. Wer sich vertippt und Strg+Z drueckt,',
    '   * bekommt sonst nicht den Schritt davor zurueck, sondern gar nichts — der',
    '   * Kasten wurde ja komplett neu beschrieben.',
    '   */',
    '  function werkzeugeVerdrahten(wurzel) {',
    '    [].forEach.call(wurzel.querySelectorAll(".fo-wz"), function (kn) {',
    '      kn.addEventListener("click", function () {',
    '        var feld = document.getElementById(kn.dataset.ziel);',
    '        if (!feld) return;',
    '        var a = feld.selectionStart, b = feld.selectionEnd;',
    '        var wert = feld.value;',
    '',
    '        function setzen(neu, zeigerAuf) {',
    '          if (feld.setRangeText) feld.setRangeText(neu, a, b, "end");',
    '          else feld.value = wert.slice(0, a) + neu + wert.slice(b);',
    '          if (zeigerAuf !== undefined) feld.setSelectionRange(zeigerAuf, zeigerAuf);',
    '          feld.focus();',
    '          /* Die Vorschau muss es erfahren. input feuert bei setRangeText',
    '             NICHT von selbst — das tut nur echtes Tippen. */',
    '          feld.dispatchEvent(new Event("input", { bubbles: true }));',
    '        }',
    '',
    '        if (kn.dataset.wz) {',
    '          var m = kn.dataset.wz;',
    '          setzen(m + wert.slice(a, b) + m, a === b ? a + m.length : undefined);',
    '          return;',
    '        }',
    '',
    '        if (kn.dataset.pre) {',
    '          /*',
    '           * Vor JEDE Zeile der Auswahl, nicht nur vor die erste. Wer drei',
    '           * Zeilen markiert und auf Liste drueckt, will drei Punkte — und',
    '           * nicht einen Punkt und zwei Fortsetzungen.',
    '           *',
    '           * Und vom Zeilenanfang aus, nicht von der Auswahl: ein Strich',
    '           * mitten im Wort ist keine Liste.',
    '           */',
    '          var vor = wert.lastIndexOf(String.fromCharCode(10), a - 1) + 1;',
    '          a = vor;',
    '          var stueck = wert.slice(a, b) || "";',
    '          var mark = kn.dataset.pre === "&gt; " ? String.fromCharCode(62) + " " : kn.dataset.pre;',
    '          var zeilen = stueck.split(String.fromCharCode(10));',
    '          setzen(zeilen.map(function (zl, k) {',
    '            /* Nummerierte Liste zaehlt mit, statt viermal 1. zu schreiben. */',
    '            if (/^\\d+\\. $/.test(mark)) return (k + 1) + ". " + zl;',
    '            return mark + zl;',
    '          }).join(String.fromCharCode(10)), stueck ? undefined : a + mark.length);',
    '          return;',
    '        }',
    '',
    '        if (kn.dataset.block) {',
    '          var z3 = String.fromCharCode(96, 96, 96);',
    '          var nl = String.fromCharCode(10);',
    '          var inhalt = wert.slice(a, b);',
    '          setzen(z3 + nl + inhalt + nl + z3 + nl, inhalt ? undefined : a + z3.length + 1);',
    '          return;',
    '        }',
    '',
    '        if (kn.dataset.link) {',
    '          var text = wert.slice(a, b) || L.fmtLink;',
    '          /* Der Zeiger landet zwischen den Klammern, wo die Adresse hin',
    '             gehoert. Wer erst den Text markiert hat, will als naechstes',
    '             genau das tippen. */',
    '          var neu = "[" + text + "](https://)";',
    '          setzen(neu, a + neu.length - 1);',
    '          return;',
    '        }',
    '',
    '        if (kn.dataset.rule) {',
    '          var nl2 = String.fromCharCode(10);',
    '          setzen(nl2 + "---" + nl2);',
    '        }',
    '      });',
    '    });',
    '  }',
    '',
    '  /*',
    '   * DIE VORSCHAU',
    '   *',
    '   * Sie benutzt dieselbe mark()-Funktion wie die Anzeige des Beitrags. Eine',
    '   * zweite, eigene Vorschau-Aufbereitung waere der Fehler, der sich selbst',
    '   * versteckt: sie zeigte etwas anderes als das Ergebnis, und man merkt es',
    '   * erst nach dem Absenden.',
    '   */',
    '  function vorschauVerdrahten(wurzel, feldId, schalterId, flaecheId) {',
    '    var schalter = wurzel.querySelector("#" + schalterId);',
    '    var flaeche = wurzel.querySelector("#" + flaecheId);',
    '    var feld = wurzel.querySelector("#" + feldId);',
    '    if (!schalter || !flaeche || !feld) return;',
    '    var an = false;',
    '',
    '    function malen() {',
    '      var t = feld.value.trim();',
    '      flaeche.innerHTML = t ? mark(t)',
    '        : "<p class=\\"muted\\">" + esc(L.previewEmpty) + "</p>";',
    '    }',
    '    schalter.addEventListener("click", function () {',
    '      an = !an;',
    '      schalter.textContent = an ? L.write : L.preview;',
    '      schalter.setAttribute("aria-pressed", String(an));',
    '      flaeche.hidden = !an;',
    '      feld.hidden = an;',
    '      /* Die Leiste geht mit dem Feld: Knoepfe, die in ein verstecktes Feld',
    '         schreiben, tun sichtbar nichts. */',
    '      var leiste = wurzel.querySelector(".fo-wzleiste");',
    '      if (leiste) leiste.hidden = an;',
    '      if (an) malen();',
    '    });',
    '    feld.addEventListener("input", function () { if (an) malen(); });',
    '  }',
    '',
    '  /*',
    '   * Einmal binden, fuer alle Leisten unter der uebergebenen Wurzel.',
    '   *',
    '   * setRangeText statt value neu zu setzen: das erhaelt die Rueckgaengig-Kette',
    '   * des Browsers. Wer sich vertippt und Strg+Z drueckt, bekommt sonst nicht',
    '   * den Schritt davor zurueck, sondern gar nichts — der Kasten wurde ja',
    '   * komplett neu beschrieben.',
    '   */',
    '  function werkzeugeVerdrahten(wurzel) {',
    '    [].forEach.call(wurzel.querySelectorAll(".fo-wz"), function (kn) {',
    '      kn.addEventListener("click", function () {',
    '        var feld = document.getElementById(kn.dataset.ziel);',
    '        if (!feld) return;',
    '        var m = kn.dataset.wz;',
    '        var a = feld.selectionStart, b = feld.selectionEnd;',
    '        var text = feld.value.slice(a, b);',
    '        if (feld.setRangeText) feld.setRangeText(m + text + m, a, b, "end");',
    '        else feld.value = feld.value.slice(0, a) + m + text + m + feld.value.slice(b);',
    '        /* Ohne Markierung steht der Zeiger jetzt hinter den schliessenden',
    '           Zeichen. Dann gehoert er dazwischen — sonst tippt man neben die',
    '           Auszeichnung statt hinein. */',
    '        if (a === b) { var pos = a + m.length; feld.setSelectionRange(pos, pos); }',
    '        feld.focus();',
    '      });',
    '    });',
    '  }',
    '  function when(ts) {',
    '    if (!ts || !ts.toDate) return "";',
    '    var d = ts.toDate();',
    '    return d.toLocaleDateString(' + JSON.stringify(GEBIETSSCHEMA[lang]) + ', { year: "numeric", month: "short", day: "numeric" }) + ", " + d.toLocaleTimeString(' + JSON.stringify(GEBIETSSCHEMA[lang]) + ', { hour: "2-digit", minute: "2-digit" });',
    '  }',
    '  function threadId() { return new URLSearchParams(location.search).get("t"); }',
    '  function canModerate() { return user && MODS.indexOf(user.uid) !== -1; }',
    '',
  '  // Reading is open to everyone. Posting needs a confirmed address, because',
  '  // an unconfirmed one is a stranger who typed somebody else\'s email into a box.',
  '  function canPost() { return !!(user && user.emailVerified); }',
  '',
  '  function field(id, type, label, placeholder) {',
  '    return \'<label class="small muted" for="\' + id + \'">\' + esc(label) + \'</label>\' +',
  '      \'<input class="fld" id="\' + id + \'" type="\' + type + \'" placeholder="\' + esc(placeholder || \'\') + \'" autocomplete="\' +',
  '      (type === "password" ? "current-password" : type === "email" ? "email" : "nickname") + \'">\';',
  '  }',
  '',
  '  function authError(e) {',
  '    var c = (e && e.code) || "";',
  '    if (c.indexOf("email-already-in-use") !== -1) return L.errInUse;',
  '    if (c.indexOf("weak-password") !== -1) return L.errWeak;',
  '    if (c.indexOf("too-many-requests") !== -1) return L.errMany;',
  '    if (c.indexOf("invalid-email") !== -1) return L.emailInvalid;',
  '    // Firebase deliberately returns one code for a wrong password AND an',
  '    // unknown account, so an attacker cannot use the form to discover which',
  '    // addresses are registered. Report it the same way.',
  '    if (c.indexOf("invalid-credential") !== -1 || c.indexOf("wrong-password") !== -1',
  '        || c.indexOf("user-not-found") !== -1) return L.errWrong;',
  '    return L.errGeneric;',
  '  }',
  '',
  '  var mode = "in";',
  '',
  '  /*',
  '   * DIE DRITTE ANMELDUNG IST WEG',
  '   *',
  '   * Hier stand ein vollstaendiges Anmeldeformular: GitHub-Knopf, E-Mail,',
  '   * Passwort, Umschalten auf Registrieren, Passwort vergessen — rund',
  '   * neunzig Zeilen, die dasselbe taten wie der Kopf und dasselbe wie das',
  '   * Kundenportal, nur in einer dritten Gestalt und mit einer dritten',
  '   * Fehlerbehandlung. Drei Anmeldungen fuer ein Konto sind fuer den, der',
  '   * sie benutzt, drei verschiedene Firmen — und fuer den, der sie pflegt,',
  '   * drei Stellen, an denen eine Verbesserung vergessen werden kann.',
  '   *',
  '   * Was bleibt, ist die Einladung samt Ziel: die Anmeldeseite mit',
  '   * ?weiter=hier. Wer dort fertig ist, kommt genau hierher zurueck.',
  '   */',
  '  function renderAuth() {',
  '    if (!authBar) return;',
  '    if (user) {',
  '      authBar.innerHTML =',
  '        \'<span class="small muted">\' + esc(L.signedInAs) + \' <strong>\' + esc(user.displayName || user.email) + \'</strong></span>\' +',
  '        \'<button class="btn" id="signOutBtn">\' + esc(L.signOut) + \'</button>\';',
  '      document.getElementById("signOutBtn").addEventListener("click", function () { fb.signOut(auth); });',
  '      return;',
  '    }',
  '    var ziel = ANMELDEN + "?weiter=" + encodeURIComponent(location.pathname + location.search);',
  '    authBar.innerHTML =',
  '      \'<div class="fo-einladung"><p>\' + esc(L.signInToPost) + \'</p>\' +',
  '      \'<a class="btn btn-primary" href="\' + ziel + \'">\' + esc(L.signIn) + \'</a></div>\';',
  '  }',
  '',
    '  // ── list ────────────────────────────────────────────────────────────',
    '',
    '  /*',
    '   * Die Reiter stehen jetzt in der zweiten Leiste und nicht mehr in der',
    '   * Liste. Zwei Reihen mit denselben Kategorien uebereinander waren eine zu',
    '   * viel — und die obere bleibt beim Scrollen stehen, die untere nicht.',
    '   *',
    '   * Sie sind Links mit echten Adressen. Der Klick wird abgefangen und nur',
    '   * der Inhalt getauscht; faellt das Skript aus, laedt der Link die Seite',
    '   * neu und der Bereich stimmt trotzdem.',
    '   */',
    '  function reiterSetzen() {',
    '    [].forEach.call(document.querySelectorAll(".fo-reiter"), function (a) {',
    '      if (a.dataset.cat === cat) a.setAttribute("aria-current", "page");',
    '      else a.removeAttribute("aria-current");',
    '    });',
    '  }',
    '  [].forEach.call(document.querySelectorAll(".fo-reiter"), function (a) {',
    '    a.addEventListener("click", function (e) {',
    '      /* Nur den einfachen Klick abfangen. Wer mit Strg oder der mittleren',
    '         Taste klickt, will einen neuen Tab — den nimmt man ihm nicht weg. */',
    '      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;',
    '      e.preventDefault();',
    '      cat = a.dataset.cat;',
    '      var u = new URL(location.href);',
    '      if (cat) u.searchParams.set("cat", cat); else u.searchParams.delete("cat");',
    '      u.searchParams.delete("t");',
    '      history.pushState(null, "", u.pathname + u.search);',
    '      renderList();',
    '    });',
    '  });',
    '',
    '  var neuKnopf = document.getElementById("foNeu");',
    '  if (neuKnopf) neuKnopf.addEventListener("click", function () {',
    '    if (!user) { melde(L.signInToPost, "fehler"); return; }',
    '    if (threadId()) { location.search = cat ? "?cat=" + cat : ""; return; }',
    '    composer();',
    '  });',
    '',
    '  function renderList() {',
    '    reiterSetzen();',
    '    if (neuKnopf) neuKnopf.hidden = false;',
    '    root.innerHTML =',
    '      /* Der Satz stand hier ein zweites Mal — einmal in der Einladung',
    '         darueber und einmal rechts daneben. Zweimal dieselbe Aufforderung',
    '         liest sich nicht als Nachdruck, sondern als Fehler. Die Einladung',
    '         hat den Knopf dabei, also bleibt sie. */',
    '      "<div id=\\"composer\\"></div><div class=\\"skill-list\\" id=\\"threads\\"><p class=\\"muted\\">" + esc(L.loading) + "</p></div>";',
    '',
    '    var col = fb.collection(db, "threads");',
    '    var q = cat',
    '      ? fb.query(col, fb.where("category", "==", cat), fb.orderBy("lastActivity", "desc"), fb.limit(50))',
    '      : fb.query(col, fb.orderBy("lastActivity", "desc"), fb.limit(50));',
    '',
    '    fb.onSnapshot(q, function (snap) {',
    '      var box = document.getElementById("threads");',
    '      if (!box) return;',
    '      if (snap.empty) { box.innerHTML = "<div class=\\"empty\\">" + esc(L.emptyCat) + "</div>"; return; }',
    '      var html = "";',
    '      /*',
    '       * ANGEPINNTES ZUERST — und zwar hier, nicht in der Abfrage.',
    '       *',
    '       * orderBy(pinned) zusammen mit orderBy(lastActivity) verlangt in',
    '       * Firestore einen zusammengesetzten Index, der angelegt und',
    '       * ausgeliefert werden muss. Fuer eine Handvoll Beitraege ist das',
    '       * Aufwand ohne Gegenwert.',
    '       *',
    '       * Ehrlich zur Grenze: sortiert wird nur innerhalb der geladenen',
    '       * fuenfzig. Ein angepinnter Beitrag, der aus diesem Fenster',
    '       * herausfaellt, kommt nicht mehr nach oben — dann braucht es den',
    '       * Index. Bis dahin waere er eine Vorsorge fuer einen Fall, den es',
    '       * noch nicht gibt.',
    '       */',
    '      /*',
    '       * NUR die Beitraege dieser Sprache.',
    '       *',
    '       * Beide Foren lesen dieselbe Sammlung. Ohne diesen Filter stehen',
    '       * englische Beitraege im deutschen Forum und umgekehrt — zwanzig',
    '       * Eintraege, von denen die Haelfte niemanden angeht.',
    '       *',
    '       * Gefiltert wird hier und nicht in der Abfrage: ein where auf lang',
    '       * zusammen mit dem where auf die Kategorie und dem orderBy verlangt',
    '       * einen zusammengesetzten Index je Kombination. Der Preis ist, dass',
    '       * die geladenen fuenfzig sich auf beide Sprachen aufteilen.',
    '       *',
    '       * Ein Beitrag OHNE Sprachangabe erscheint in beiden. Das ist die',
    '       * sichere Richtung: etwas doppelt zu zeigen ist ein Schoenheitsfehler,',
    '       * etwas zu verschlucken ein Datenverlust aus Sicht dessen, der es',
    '       * geschrieben hat.',
    '       */',
    '      var reihe = [];',
    '      snap.forEach(function (doc) {',
    '        var l = doc.data().lang;',
    '        if (!l || l === SPRACHE) reihe.push(doc);',
    '      });',
    '      reihe.sort(function (x, y) {',
    '        var px = x.data().pinned ? 1 : 0, py = y.data().pinned ? 1 : 0;',
    '        return py - px;',
    '      });',
    '',
    '      var ids = [];',
    '      reihe.forEach(function (doc) {',
    '        var d = doc.data();',
    '        var n = d.replyCount || 0;',
    '        var label = (CATS.filter(function (c) { return c.id === d.category; })[0] || {}).label || d.category;',
    '        var wer = d.authorName || "?";',
    '        var text = d.deleted ? "" : auszug(d.body, 180);',
    '        ids.push(doc.id);',
    '',
    '        html += "<article class=\\"fo-karte" + (d.pinned ? " genadelt" : "") + "\\" data-thread=\\"" + esc(doc.id) + "\\">" +',
    '          stimmleiste(d.score, 0) +',
    '          "<div class=\\"fo-karte-in\\">" +',
    '          "<div class=\\"fo-karte-kopf\\"><span class=\\"fo-kat\\">" + esc(label) + "</span>" +',
    '          (d.pinned ? "<span class=\\"fo-nadel\\">" + esc(L.pinned) + "</span>" : "") +',
    '          "</div>" +',
    '          "<h3 class=\\"fo-karte-titel\\"><a href=\\"?t=" + esc(doc.id) + "\\">" +',
    '          esc(d.deleted ? L.deleted : d.title) + "</a></h3>" +',
    '          (text ? "<p class=\\"fo-auszug\\">" + esc(text) + "</p>" : "") +',
    '          "<div class=\\"fo-karte-fuss\\">" +',
    '          "<span class=\\"fo-avatar klein\\" aria-hidden=\\"true\\">" + esc(wer.slice(0, 2).toUpperCase()) + "</span>" +',
    '          "<span class=\\"fo-karte-wer\\">" + esc(wer) + "</span>" +',
    '          "<span class=\\"fo-karte-punkt\\">&middot;</span>" + when(d.createdAt) +',
    '          "<span class=\\"fo-karte-punkt\\">&middot;</span>" + n + " " + esc(n === 1 ? L.replyOne : L.replies) +',
    '          /* Der Antworten-Knopf traegt #schreiben mit. Auf der Beitragsseite',
    '             springt der Zeiger damit gleich ins Feld — ein Knopf, der nur zur',
    '             Seite fuehrt und einen dort suchen laesst, ist ein halber Knopf. */',
    '          "<a class=\\"fo-tat-knopf fo-antworten\\" href=\\"?t=" + esc(doc.id) + "#schreiben\\">" + esc(L.answer) + "</a>" +',
    '          "</div></div></article>";',
    '      });',
    '      box.innerHTML = html;',
    '',
    '      /* Stimmen auch in der Liste. Die eigenen Stimmen kommen in EINEM Rutsch',
    '         fuer alle sichtbaren Karten — nacheinander waeren es gleich viele',
    '         Abfragen, aber die Pfeile sprangen sichtbar einer nach dem anderen. */',
    '      [].forEach.call(box.querySelectorAll(".fo-karte"), function (art) {',
    '        var id = art.dataset.thread;',
    '        var leiste = art.querySelector(".fo-stimmen");',
    '        if (!leiste) return;',
    '        var stand = { wert: 0 };',
    '        [].forEach.call(leiste.querySelectorAll(".fo-pfeil"), function (kn) {',
    '          kn.addEventListener("click", function () {',
    '            var wunsch = Number(kn.dataset.v);',
    '            var neu = stand.wert === wunsch ? 0 : wunsch;',
    '            var alt = stand.wert;',
    '            stimmeSetzen(["threads", id], alt, neu).then(function (ok) {',
    '              if (!ok) return;',
    '              stand.wert = neu;',
    '              [].forEach.call(leiste.querySelectorAll(".fo-pfeil"), function (x) {',
    '                x.setAttribute("aria-pressed", String(Number(x.dataset.v) === neu));',
    '              });',
    '            });',
    '          });',
    '        });',
    '        if (user) {',
    '          fb.getDoc(fb.doc(db, "threads", id, "votes", user.uid)).then(function (dd) {',
    '            stand.wert = dd.exists() ? (dd.data().v || 0) : 0;',
    '            [].forEach.call(leiste.querySelectorAll(".fo-pfeil"), function (x) {',
    '              x.setAttribute("aria-pressed", String(Number(x.dataset.v) === stand.wert));',
    '            });',
    '          }, function () {});',
    '        }',
    '      });',
    '    }, function () {',
    '      var box = document.getElementById("threads");',
    '      if (box) box.innerHTML = "<div class=\\"empty\\">" + esc(L.errGeneric) + "</div>";',
    '    });',
    '  }',
    '',
    '  /*',
    '   * VERFASSEN ALS DIALOG',
    '   *',
    '   * Vorher klappte das Formular oben in der Liste auf. Das hatte zwei',
    '   * Nachteile, die man erst merkt, wenn man es benutzt: die Liste sprang',
    '   * nach unten weg, und auf einem Telefon stand das Feld ausserhalb des',
    '   * Bildes, weil oben die Reiterleiste klebt.',
    '   *',
    '   * <dialog> und nicht ein selbstgebauter Kasten mit position: fixed. Das',
    '   * Element bringt mit, was man sonst von Hand nachbaut und dabei vergisst:',
    '   * Escape schliesst, der Tastaturweg bleibt im Dialog gefangen, alles',
    '   * dahinter ist fuer Vorlesehilfen inaktiv, und der Hintergrund kommt vom',
    '   * Browser statt von einem zusaetzlichen Element.',
    '   */',
    '  function composer() {',
    '    if (!canPost()) { melde(L.signInToPost, "fehler"); return; }',
    '    var alt = document.getElementById("foDialog");',
    '    if (alt) alt.remove();',
    '',
    '    var opts = CATS.map(function (c) {',
    '      return "<option value=\\"" + esc(c.id) + "\\"" + (c.id === cat ? " selected" : "") + ">" + esc(c.label) + "</option>";',
    '    }).join("");',
    '',
    '    var dlg = document.createElement("dialog");',
    '    dlg.id = "foDialog";',
    '    dlg.className = "fo-dialog";',
    '    dlg.innerHTML =',
    '      "<form method=\\"dialog\\" class=\\"fo-dialog-in\\">" +',
    '      "<h2 class=\\"fo-dialog-kopf\\">" + esc(L.newThreadH) + "</h2>" +',
    '      "<label class=\\"fo-l\\" for=\\"nt\\">" + esc(L.titleLabel) + "</label>" +',
    '      "<input id=\\"nt\\" class=\\"fld\\" maxlength=\\"140\\" placeholder=\\"" + esc(L.titlePlaceholder) + "\\">" +',
    '      "<label class=\\"fo-l\\" for=\\"nc\\">" + esc(L.categoryLabel) + "</label>" +',
    '      "<select id=\\"nc\\" class=\\"fld\\">" + opts + "</select>" +',
    '      "<label class=\\"fo-l\\" for=\\"nb2\\">" + esc(L.bodyLabel) + "</label>" +',
    '      "<div class=\\"fo-schreibkopf\\">" +',
    '      werkzeugleiste("nb2") +',
    '      "<button type=\\"button\\" class=\\"fo-vorschau-schalter\\" id=\\"nbVor\\" aria-pressed=\\"false\\">" + esc(L.preview) + "</button></div>" +',
    '      "<textarea id=\\"nb2\\" class=\\"fld\\" rows=\\"8\\" maxlength=\\"8000\\" placeholder=\\"" + esc(L.bodyPlaceholder) + "\\"></textarea>" +',
    '      "<div class=\\"fo-vorschau prose fo-text\\" id=\\"nbVorFlaeche\\" hidden></div>" +',
    '      "<p class=\\"fo-hinweis\\">" + esc(L.fmtHint) + "</p>" +',
    '      "<div class=\\"fo-dialog-fuss\\">" +',
    '      "<button type=\\"button\\" class=\\"btn\\" id=\\"cancelBtn\\">" + esc(L.cancel) + "</button>" +',
    '      "<button type=\\"button\\" class=\\"btn btn-primary\\" id=\\"submitBtn\\">" + esc(L.post) + "</button>" +',
    '      "</div></form>";',
    '    document.body.appendChild(dlg);',
    '    werkzeugeVerdrahten(dlg);',
    '    vorschauVerdrahten(dlg, "nb2", "nbVor", "nbVorFlaeche");',
    '    dlg.showModal();',
    '    document.getElementById("nt").focus();',
    '',
    '    /* Beim Schliessen wieder abraeumen. Sonst sammeln sich bei jedem Oeffnen',
    '       weitere Dialoge im Dokument an, alle mit denselben ids — und',
    '       getElementById findet dann den erstbesten, nicht den sichtbaren. */',
    '    dlg.addEventListener("close", function () { dlg.remove(); });',
    '    document.getElementById("cancelBtn").addEventListener("click", function () { dlg.close(); });',
    '',
    '    document.getElementById("submitBtn").addEventListener("click", function (e) {',
    '      var btn = e.currentTarget;',
    '      var titel = document.getElementById("nt").value.trim();',
    '      var kategorie = document.getElementById("nc").value;',
    '      var text = document.getElementById("nb2").value.trim();',
    '      /* Dieselben Grenzen wie in firestore.rules. Hier stehen sie, damit man',
    '         eine Antwort bekommt, bevor man absendet — nicht, weil sie hier',
    '         durchgesetzt wuerden. Durchgesetzt werden sie dort. */',
    '      if (titel.length < 6) { melde(L.titleTooShort, "fehler"); return; }',
    '      if (text.length < 10) { melde(L.bodyTooShort, "fehler"); return; }',
    '      btn.disabled = true; btn.textContent = L.posting;',
    '      fb.addDoc(fb.collection(db, "threads"), {',
    '        title: titel, body: text, category: kategorie,',
    '        authorUid: user.uid, authorName: user.displayName || "anon",',
    '        createdAt: fb.serverTimestamp(), lastActivity: fb.serverTimestamp(),',
    '        replyCount: 0, score: 0, deleted: false, lang: SPRACHE',
    '      }).then(',
    '        function (r) { dlg.close(); location.search = "?t=" + r.id; },',
    '        /* Zwei Argumente und kein .catch dahinter: mit einem angehaengten',
    '           .catch faengt man auch die Fehler des Erfolgszweigs und meldet',
    '           einen gespeicherten Beitrag als misslungen. */',
    '        function () { btn.disabled = false; btn.textContent = L.post; melde(L.errGeneric, "fehler"); }',
    '      );',
    '    });',
    '  }',
    '',
    '  // ── thread ──────────────────────────────────────────────────────────',
    '  /*',
    '   * DIE BEITRAGSSEITE',
    '   *',
    '   * Vorher waren das drei Karten untereinander: Titel, Text, Antworten. Das',
    '   * las sich wie ein aufgeklappter Listeneintrag und nicht wie ein Ort, auf',
    '   * den man verlinkt. Jetzt hat der Beitrag einen Kopf, eine Stimmspalte an',
    '   * der Seite und darunter die Antworten als eigenen Abschnitt mit eigener',
    '   * Ueberschrift und Zaehler.',
    '   *',
    '   * Die Adresse ?t=<id> gab es vorher schon. Was gefehlt hat, war die Gestalt,',
    '   * die dazu passt.',
    '   */',
    '  var gesprungen = false;',
    '  function renderThread(id) {',
    '    root.innerHTML = "<p class=\\"muted\\">" + esc(L.loading) + "</p>";',
    '    var ref = fb.doc(db, "threads", id);',
    '',
    '    /* Die eigene Stimme steht in einem Dokument, das wie die uid heisst.',
    '       Abgemeldet wird gar nicht erst gelesen — es gaebe keinen Pfad dahin. */',
    '    function meineStimme(pfad) {',
    '      if (!user) return Promise.resolve(0);',
    '      return fb.getDoc(fb.doc.apply(null, [db].concat(pfad, ["votes", user.uid])))',
    '        .then(function (d) { return d.exists() ? (d.data().v || 0) : 0; }, function () { return 0; });',
    '    }',
    '',
    '    /* Ein zweiter Klick auf denselben Pfeil nimmt die Stimme zurueck. Ohne das',
    '       gaebe es keinen Weg heraus, und wer sich verklickt hat, bliebe fuer',
    '       immer dabei. */',
    '    function pfeileVerdrahten(leiste, pfad, stand) {',
    '      [].forEach.call(leiste.querySelectorAll(".fo-pfeil"), function (kn) {',
    '        kn.addEventListener("click", function () {',
    '          var wunsch = Number(kn.dataset.v);',
    '          var neu = stand.wert === wunsch ? 0 : wunsch;',
    '          var alt = stand.wert;',
    '          stimmeSetzen(pfad, alt, neu).then(function (ok) {',
    '            if (!ok) return;',
    '            stand.wert = neu;',
    '            malen(leiste, neu);',
    '          });',
    '        });',
    '      });',
    '    }',
    '    function malen(leiste, v) {',
    '      [].forEach.call(leiste.querySelectorAll(".fo-pfeil"), function (x) {',
    '        x.setAttribute("aria-pressed", String(Number(x.dataset.v) === v));',
    '      });',
    '    }',
    '',
    '    var meinThema = { wert: 0 };',
    '',
    '    fb.onSnapshot(ref, function (snap) {',
    '      if (!snap.exists()) { root.innerHTML = "<div class=\\"empty\\">404</div>"; return; }',
    '      var d = snap.data();',
    '      var label = (CATS.filter(function (c) { return c.id === d.category; })[0] || {}).label || d.category;',
    '      var wer = d.authorName || "?";',
    '      var meins = user && d.authorUid === user.uid;',
    '',
    '      root.innerHTML =',
    '        "<a class=\\"fo-zurueck\\" href=\\"./\\">" + esc(L.back) + "</a>" +',
    '        "<article class=\\"fo-thema\\">" +',
    '        stimmleiste(d.score, meinThema.wert) +',
    '        "<div class=\\"fo-thema-in\\">" +',
    '        "<span class=\\"fo-kat\\">" + esc(label) + "</span>" +',
    '        "<h1 class=\\"fo-titel\\">" + esc(d.deleted ? L.deleted : d.title) + "</h1>" +',
    '        "<div class=\\"fo-wer\\"><span class=\\"fo-avatar\\" aria-hidden=\\"true\\">" +',
    '        esc(wer.slice(0, 2).toUpperCase()) + "</span><span>" + esc(wer) +',
    '        "<br><span class=\\"fo-zeit\\">" + when(d.createdAt) + "</span></span></div>" +',
    '        "<div class=\\"prose fo-text\\">" + (d.deleted ? "" : mark(d.body)) + "</div>" +',
    '        "<div class=\\"fo-tat\\">" +',
    '        "<button type=\\"button\\" class=\\"fo-tat-knopf\\" id=\\"foTeilen\\">" + esc(L.share) + "</button>" +',
    '        ((meins || canModerate()) && !d.deleted',
    '          ? "<button type=\\"button\\" class=\\"fo-tat-knopf\\" id=\\"foLoeschen\\">" + esc(L.delete) + "</button>" : "") +',
    '        "</div></div></article>" +',
    '        "<h2 class=\\"fo-abschnitt\\" id=\\"foAntworten\\">" + esc(L.answersH) +',
    '        " <span class=\\"fo-zahl\\">" + (d.replyCount || 0) + "</span></h2>" +',
    '        "<div id=\\"posts\\"></div>" +',
    '        (canPost()',
    '          ? "<div class=\\"fo-schreiben\\"><div class=\\"fo-schreibkopf\\">" + werkzeugleiste("rb") +',
    '            "<button type=\\"button\\" class=\\"fo-vorschau-schalter\\" id=\\"rbVor\\" aria-pressed=\\"false\\">" + esc(L.preview) + "</button></div>" +',
    '            "<textarea id=\\"rb\\" class=\\"fld\\" rows=\\"4\\" maxlength=\\"8000\\" placeholder=\\"" + esc(L.replyPlaceholder) + "\\"></textarea>" +',
    '            "<div class=\\"fo-vorschau prose fo-text\\" id=\\"rbVorFlaeche\\" hidden></div>" +',
    '            "<div class=\\"btn-row\\"><button class=\\"btn btn-primary\\" id=\\"replyBtn\\">" + esc(L.reply) + "</button>" +',
    '            "<span class=\\"fo-hinweis\\">" + esc(L.fmtHint) + "</span></div></div>"',
    '          : "<div class=\\"fo-einladung\\"><p>" + esc(L.signInToPost) + "</p>" +',
    '            "<a class=\\"btn btn-primary\\" href=\\"" + ANMELDEN + "?weiter=" +',
    '            encodeURIComponent(location.pathname + location.search) + "\\">" + esc(L.signIn) + "</a></div>");',
    '',
    '      meineStimme(["threads", id]).then(function (v) {',
    '        meinThema.wert = v;',
    '        var leiste = root.querySelector(".fo-stimmen");',
    '        if (!leiste) return;',
    '        malen(leiste, v);',
    '        pfeileVerdrahten(leiste, ["threads", id], meinThema);',
    '      });',
    '',
    '      var tl = document.getElementById("foTeilen");',
    '      if (tl) tl.addEventListener("click", function () { teilen(d.title); });',
    '',
    '      var lo = document.getElementById("foLoeschen");',
    '      if (lo) lo.addEventListener("click", function () {',
    '        if (!confirm(L.confirmDelete)) return;',
    '        fb.updateDoc(ref, { deleted: true }).catch(function () { melde(L.errGeneric, "fehler"); });',
    '      });',
    '',
    '      werkzeugeVerdrahten(root);',
    '      vorschauVerdrahten(root, "rb", "rbVor", "rbVorFlaeche");',
    '      /* Wer aus der Liste auf Antworten geklickt hat, will tippen und nicht',
    '         suchen. #schreiben steht dann in der Adresse und der Zeiger landet',
    '         im Feld — einmal, nicht bei jedem Neuzeichnen des Themas. */',
    '      if (location.hash === "#schreiben" && !gesprungen) {',
    '        gesprungen = true;',
    '        var feld = document.getElementById("rb");',
    '        if (feld) {',
    '          feld.scrollIntoView({ block: "center", behavior: "smooth" });',
    '          feld.focus({ preventScroll: true });',
    '        }',
    '      }',
    '',
    '      var rb = document.getElementById("replyBtn");',
    '      if (rb) rb.addEventListener("click", function (e) {',
    '        var btn = e.currentTarget;',
    '        var txt = document.getElementById("rb").value.trim();',
    '        if (!txt) return;',
    '        btn.disabled = true; btn.textContent = L.posting;',
    '        fb.addDoc(fb.collection(db, "threads", id, "posts"), {',
    '          body: txt, authorUid: user.uid, authorName: user.displayName || "anon",',
    '          authorAvatar: user.photoURL || "", createdAt: fb.serverTimestamp(), deleted: false, score: 0',
    '        }).then(',
    '          function () {',
    '            document.getElementById("rb").value = "";',
    '            btn.disabled = false; btn.textContent = L.reply;',
    '            /* Der Zaehler wird NACHGEZOGEN und nicht mitgemeldet: schlaegt er',
    '               fehl, ist eine Zahl schief. Meldete man ihn mit, waere eine',
    '               gespeicherte Antwort als misslungen ausgewiesen. */',
    '            fb.updateDoc(ref, { replyCount: (d.replyCount || 0) + 1, lastActivity: fb.serverTimestamp() })',
    '              .catch(function () {});',
    '          },',
    '          function () { btn.disabled = false; btn.textContent = L.reply; melde(L.errGeneric, "fehler"); }',
    '        );',
    '      });',
    '',
    '      fb.onSnapshot(fb.query(fb.collection(db, "threads", id, "posts"), fb.orderBy("createdAt", "asc")), function (ps) {',
    '        var box = document.getElementById("posts");',
    '        if (!box) return;',
    '        if (ps.empty) { box.innerHTML = "<div class=\\"empty\\">" + esc(L.noComments) + "</div>"; return; }',
    '        var html = "", ids = [];',
    '        ps.forEach(function (pp) {',
    '          var pd = pp.data();',
    '          var mine = user && pd.authorUid === user.uid;',
    '          var nam = pd.authorName || "?";',
    '          ids.push(pp.id);',
    '          html += "<article class=\\"fo-antwort\\" data-post=\\"" + esc(pp.id) + "\\">" +',
    '            stimmleiste(pd.score, 0) +',
    '            "<div class=\\"fo-antwort-in\\">" +',
    '            "<div class=\\"fo-wer\\"><span class=\\"fo-avatar klein\\" aria-hidden=\\"true\\">" +',
    '            esc(nam.slice(0, 2).toUpperCase()) + "</span><span>" + esc(nam) +',
    '            " <span class=\\"fo-zeit\\">" + when(pd.createdAt) + "</span></span>" +',
    '            ((mine || canModerate()) && !pd.deleted',
    '              ? "<button type=\\"button\\" class=\\"fo-tat-knopf klein\\" data-del=\\"" + esc(pp.id) + "\\">" + esc(L.delete) + "</button>" : "") +',
    '            "</div><div class=\\"prose fo-text\\">" +',
    '            (pd.deleted ? "<em>" + esc(L.deleted) + "</em>" : mark(pd.body)) + "</div></div></article>";',
    '        });',
    '        box.innerHTML = html;',
    '',
    '        [].forEach.call(box.querySelectorAll("[data-del]"), function (kn) {',
    '          kn.addEventListener("click", function () {',
    '            if (!confirm(L.confirmDelete)) return;',
    '            fb.updateDoc(fb.doc(db, "threads", id, "posts", kn.dataset.del), { deleted: true, body: "" })',
    '              .catch(function () { melde(L.errGeneric, "fehler"); });',
    '          });',
    '        });',
    '',
    '        /* Die eigenen Stimmen fuer alle Antworten in EINEM Rutsch. Nacheinander',
    '           waeren es gleich viele Abfragen, aber die Pfeile wuerden sichtbar',
    '           einer nach dem anderen umspringen. */',
    '        if (user) Promise.all(ids.map(function (pid) { return meineStimme(["threads", id, "posts", pid]); }))',
    '          .then(function (werte) {',
    '            ids.forEach(function (pid, k) {',
    '              var art = box.querySelector("[data-post=\\"" + pid + "\\"]");',
    '              if (!art) return;',
    '              var stand = { wert: werte[k] };',
    '              var leiste = art.querySelector(".fo-stimmen");',
    '              malen(leiste, stand.wert);',
    '              pfeileVerdrahten(leiste, ["threads", id, "posts", pid], stand);',
    '            });',
    '          });',
    '      });',
    '    }, function () { root.innerHTML = "<div class=\\"empty\\">" + esc(L.errGeneric) + "</div>"; });',
    '  }',
    '',
    '  function route() {',
    '    cat = new URLSearchParams(location.search).get("cat") || cat;',
    '    var id = threadId();',
    '    if (id) {',
    '      /* Im Thema heisst der Knopf etwas anderes, also verschwindet er.',
    '         Ein "Neues Thema" ueber einer Antwort ist ein Angebot am falschen',
    '         Ort — man will antworten, nicht ein zweites Thema aufmachen. */',
    '      if (neuKnopf) neuKnopf.hidden = true;',
    '      renderThread(id);',
    '    } else renderList();',
    '  }',
    '  /* Vor und Zurueck im Browser muessen wirken: die Reiter schreiben jetzt',
    '     in die Geschichte (pushState), und ohne diesen Horcher fuehrte der',
    '     Zurueck-Knopf zwar die Adresse zurueck, aber nicht den Inhalt. */',
    '  window.addEventListener("popstate", route);',
    '',
    '  // ── boot ────────────────────────────────────────────────────────────',
    '  var BASE = "https://www.gstatic.com/firebasejs/" + SDK + "/";',
    '  Promise.all([',
    '    import(BASE + "firebase-app.js"),',
    '    import(BASE + "firebase-firestore.js")',
    '  ]).then(function (mods) {',
    '    fb = Object.assign({}, mods[0], mods[1]);',
    '    fbApp = fb.initializeApp(CFG);',
    '    db = fb.getFirestore(fbApp);',
    '',
    '    // Reading needs no account, so nothing loads for it beyond the database',
    '    // client. Somebody who has signed in here before gets their session back;',
    '    // a first-time reader has nothing written to their device at all.',
    '    if (returningUser()) { ensureAuth(); return; }',
    '    renderAuth();',
    '    route();',
    '  }).catch(function () {',
    '    root.innerHTML = "<div class=\\"empty\\">" + esc(L.errGeneric) + "</div>";',
    '  });',
    '})();',
  ].join('\n');
}
