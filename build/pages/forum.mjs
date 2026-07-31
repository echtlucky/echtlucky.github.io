import { href, SITE } from '../layout.mjs';
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
};

export const CATEGORIES = [
  { id: 'help', en: 'Help & questions', de: 'Hilfe & Fragen', tone: 'i',
    enD: 'Anything you want to understand. No question is too basic.',
    deD: 'Alles, was du verstehen willst. Keine Frage ist zu einfach.' },
  { id: 'skills', en: 'Skills', de: 'Skills', tone: 'a',
    enD: 'Recommend one, ask whether one is any good, or submit one for the index.',
    deD: 'Einen empfehlen, fragen ob einer taugt, oder einen für den Index einreichen.' },
  { id: 'false-positives', en: 'False positives', de: 'False Positives', tone: 'i',
    enD: 'AIRLOCK flagged something harmless. The most useful report there is.',
    deD: 'AIRLOCK hat etwas Harmloses markiert. Die nützlichste Meldung überhaupt.' },
  { id: 'misses', en: 'Misses', de: 'Übersehenes', tone: 'a',
    enD: 'It passed something it should have caught. Worth even more.',
    deD: 'Es hat etwas durchgelassen, das es hätte fangen müssen. Noch mehr wert.' },
  { id: 'ideas', en: 'Ideas', de: 'Ideen', tone: 'n2',
    enD: 'Rules, features, or something the tools should do and do not.',
    deD: 'Regeln, Funktionen, oder etwas das die Werkzeuge tun sollten und nicht tun.' },
  { id: 'showcase', en: 'Showcase', de: 'Zeigen', tone: 'n2',
    enD: 'Something you built or found. NEXUS setups welcome.',
    deD: 'Etwas, das du gebaut oder gefunden hast. NEXUS-Setups willkommen.' },
];

const T = {
  en: {
    eyebrow: 'Forum',
    h1: 'Ask anything. Beginner questions are the point.',
    lede:
      'A place to ask what something means, recommend a skill, report a false positive, or say that a rule got it wrong. Nothing here assumes you already know the vocabulary.',
    signIn: 'Sign in with GitHub',
    signOut: 'Sign out',
    signedInAs: 'Signed in as',
    whyGithub: 'Why GitHub? Because then there is no new password to invent, and none for me to lose.',
    newThread: 'New thread',
    cancel: 'Cancel',
    post: 'Post',
    posting: 'Posting…',
    titleLabel: 'Title',
    titlePlaceholder: 'What is your question, in one line?',
    bodyLabel: 'Message',
    bodyPlaceholder: 'Give enough detail that somebody can actually answer. Paste the exact output if there is any.',
    categoryLabel: 'Category',
    replyPlaceholder: 'Write a reply…',
    reply: 'Reply',
    replies: 'replies',
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
      'Your GitHub display name, avatar URL and account id, plus what you post. That is all, and it lives in Firebase rather than on this page. Everywhere else on this site still stores nothing at all.',
  },

  de: {
    eyebrow: 'Forum',
    h1: 'Frag alles. Einsteigerfragen sind der Sinn davon.',
    lede:
      'Ein Ort, um zu fragen was etwas bedeutet, einen Skill zu empfehlen, einen False Positive zu melden oder zu sagen, dass eine Regel danebenlag. Nichts hier setzt voraus, dass du das Vokabular schon kennst.',
    signIn: 'Mit GitHub anmelden',
    signOut: 'Abmelden',
    signedInAs: 'Angemeldet als',
    whyGithub: 'Warum GitHub? Weil du dir dann kein neues Passwort ausdenken musst — und ich keines verlieren kann.',
    newThread: 'Neues Thema',
    cancel: 'Abbrechen',
    post: 'Absenden',
    posting: 'Wird gesendet…',
    titleLabel: 'Titel',
    titlePlaceholder: 'Was ist deine Frage, in einer Zeile?',
    bodyLabel: 'Nachricht',
    bodyPlaceholder: 'Gib genug Details, damit jemand tatsächlich antworten kann. Füg die genaue Ausgabe ein, falls es eine gibt.',
    categoryLabel: 'Kategorie',
    replyPlaceholder: 'Antwort schreiben…',
    reply: 'Antworten',
    replies: 'Antworten',
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
      'Deinen GitHub-Anzeigenamen, die Avatar-URL und die Konto-ID, plus das, was du schreibst. Mehr nicht, und es liegt bei Firebase, nicht auf dieser Seite. Überall sonst auf dieser Seite wird weiterhin gar nichts gespeichert.',
  },
};

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

  return `
<section class="hero hero-stage">
  <canvas id="heroCanvas" aria-hidden="true"></canvas>
  <div class="wrap stack">
    <span class="eyebrow">${t.eyebrow}</span>
    <h1>${t.h1}</h1>
    <p class="lede">${t.lede}</p>
    <p class="small muted">${t.whyGithub}</p>
  </div>
</section>

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
    '  var CATS = ' + JSON.stringify(CATEGORIES.map((c) => ({ id: c.id, label: c[lang] }))) + ';',
    '  var MODS = ' + JSON.stringify(FB.moderatorUids || []) + ';',
    '',
    '  var root = document.getElementById("forumRoot");',
    '  var authBar = document.getElementById("authBar");',
    '  if (!root) return;',
    '',
    '  var db, auth, fb, user = null, cat = "";',
    '',
    '  function esc(s) {',
    '    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {',
    '      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\\"": "&quot;" }[c];',
    '    });',
    '  }',
    '  function para(s) { return esc(s).split(/\\n{2,}/).map(function (p) { return "<p>" + p.replace(/\\n/g, "<br>") + "</p>"; }).join(""); }',
    '  function when(ts) {',
    '    if (!ts || !ts.toDate) return "";',
    '    var d = ts.toDate();',
    '    return d.toLocaleDateString(' + JSON.stringify(lang === 'de' ? 'de-DE' : 'en-GB') + ', { year: "numeric", month: "short", day: "numeric" }) + ", " + d.toLocaleTimeString(' + JSON.stringify(lang === 'de' ? 'de-DE' : 'en-GB') + ', { hour: "2-digit", minute: "2-digit" });',
    '  }',
    '  function threadId() { return new URLSearchParams(location.search).get("t"); }',
    '  function canModerate() { return user && MODS.indexOf(user.uid) !== -1; }',
    '',
    '  function renderAuth() {',
    '    if (!user) {',
    '      authBar.innerHTML = "<button class=\\"btn btn-primary\\" id=\\"signInBtn\\">" + esc(L.signIn) + "</button>";',
    '      document.getElementById("signInBtn").addEventListener("click", signIn);',
    '      return;',
    '    }',
    '    authBar.innerHTML =',
    '      "<span class=\\"small muted\\">" + esc(L.signedInAs) + " <strong>" + esc(user.displayName || "?") + "</strong></span>" +',
    '      "<button class=\\"btn\\" id=\\"signOutBtn\\">" + esc(L.signOut) + "</button>";',
    '    document.getElementById("signOutBtn").addEventListener("click", function () { fb.signOut(auth); });',
    '  }',
    '',
    '  function signIn() {',
    '    var provider = new fb.GithubAuthProvider();',
    '    fb.signInWithPopup(auth, provider).catch(function (e) {',
    '      alert(L.errGeneric + "\\n\\n" + (e && e.code ? e.code : ""));',
    '    });',
    '  }',
    '',
    '  // ── list ────────────────────────────────────────────────────────────',
    '  function renderList() {',
    '    var chips = [{ id: "", label: L.allCats }].concat(CATS).map(function (c) {',
    '      return "<button class=\\"chip\\" data-cat=\\"" + esc(c.id) + "\\" aria-pressed=\\"" + (c.id === cat) + "\\">" + esc(c.label) + "</button>";',
    '    }).join("");',
    '',
    '    root.innerHTML =',
    '      "<div class=\\"filters\\">" + chips +',
    '      (user ? "<button class=\\"btn btn-primary\\" id=\\"newBtn\\" style=\\"margin-left:auto\\">" + esc(L.newThread) + "</button>"',
    '            : "<span class=\\"small muted\\" style=\\"margin-left:auto\\">" + esc(L.signInToPost) + "</span>") +',
    '      "</div><div id=\\"composer\\"></div><div class=\\"skill-list\\" id=\\"threads\\"><p class=\\"muted\\">" + esc(L.loading) + "</p></div>";',
    '',
    '    [].forEach.call(root.querySelectorAll(".chip"), function (c) {',
    '      c.addEventListener("click", function () { cat = c.dataset.cat; renderList(); });',
    '    });',
    '    var nb = document.getElementById("newBtn");',
    '    if (nb) nb.addEventListener("click", composer);',
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
    '      snap.forEach(function (doc) {',
    '        var d = doc.data();',
    '        var n = d.replyCount || 0;',
    '        var label = (CATS.filter(function (c) { return c.id === d.category; })[0] || {}).label || d.category;',
    '        html += "<article class=\\"skill\\">" +',
    '          "<div><h3><a href=\\"?t=" + esc(doc.id) + "\\">" + esc(d.deleted ? L.deleted : d.title) + "</a></h3></div>" +',
    '          "<span class=\\"verdict v-unscanned\\">" + esc(label) + "</span>" +',
    '          "<div class=\\"meta\\">" + esc(d.authorName || "?") + "<span>·</span>" + when(d.createdAt) +',
    '          "<span>·</span>" + n + " " + esc(n === 1 ? L.replyOne : L.replies) + "</div></article>";',
    '      });',
    '      box.innerHTML = html;',
    '    }, function () {',
    '      var box = document.getElementById("threads");',
    '      if (box) box.innerHTML = "<div class=\\"empty\\">" + esc(L.errGeneric) + "</div>";',
    '    });',
    '  }',
    '',
    '  function composer() {',
    '    var host = document.getElementById("composer");',
    '    var opts = CATS.map(function (c) { return "<option value=\\"" + esc(c.id) + "\\">" + esc(c.label) + "</option>"; }).join("");',
    '    host.innerHTML =',
    '      "<div class=\\"card\\" style=\\"margin-bottom:16px\\">" +',
    '      "<label class=\\"small muted\\">" + esc(L.titleLabel) + "</label>" +',
    '      "<input id=\\"nt\\" class=\\"fld\\" maxlength=\\"140\\" placeholder=\\"" + esc(L.titlePlaceholder) + "\\">" +',
    '      "<label class=\\"small muted\\">" + esc(L.categoryLabel) + "</label>" +',
    '      "<select id=\\"nc\\" class=\\"fld\\">" + opts + "</select>" +',
    '      "<label class=\\"small muted\\">" + esc(L.bodyLabel) + "</label>" +',
    '      "<textarea id=\\"nb2\\" class=\\"fld\\" rows=\\"6\\" maxlength=\\"8000\\" placeholder=\\"" + esc(L.bodyPlaceholder) + "\\"></textarea>" +',
    '      "<div class=\\"btn-row\\"><button class=\\"btn btn-primary\\" id=\\"submitBtn\\">" + esc(L.post) + "</button>" +',
    '      "<button class=\\"btn\\" id=\\"cancelBtn\\">" + esc(L.cancel) + "</button></div></div>";',
    '',
    '    document.getElementById("cancelBtn").addEventListener("click", function () { host.innerHTML = ""; });',
    '    document.getElementById("submitBtn").addEventListener("click", function (e) {',
    '      var btn = e.currentTarget;',
    '      var title = document.getElementById("nt").value.trim();',
    '      var bodyTxt = document.getElementById("nb2").value.trim();',
    '      if (title.length < 6 || bodyTxt.length < 10) { alert(L.errTooShort); return; }',
    '      btn.disabled = true; btn.textContent = L.posting;',
    '      fb.addDoc(fb.collection(db, "threads"), {',
    '        title: title, body: bodyTxt, category: document.getElementById("nc").value,',
    '        authorUid: user.uid, authorName: user.displayName || "anon", authorAvatar: user.photoURL || "",',
    '        createdAt: fb.serverTimestamp(), lastActivity: fb.serverTimestamp(),',
    '        replyCount: 0, deleted: false',
    '      }).then(function (ref) { location.search = "?t=" + ref.id; })',
    '        .catch(function () { btn.disabled = false; btn.textContent = L.post; alert(L.errGeneric); });',
    '    });',
    '  }',
    '',
    '  // ── thread ──────────────────────────────────────────────────────────',
    '  function renderThread(id) {',
    '    root.innerHTML = "<p class=\\"muted\\">" + esc(L.loading) + "</p>";',
    '    var ref = fb.doc(db, "threads", id);',
    '',
    '    fb.onSnapshot(ref, function (snap) {',
    '      if (!snap.exists()) { root.innerHTML = "<div class=\\"empty\\">404</div>"; return; }',
    '      var d = snap.data();',
    '      root.innerHTML =',
    '        "<p><a href=\\"./\\">" + esc(L.back) + "</a></p>" +',
    '        "<article class=\\"card\\" style=\\"margin-bottom:18px\\"><h2>" + esc(d.deleted ? L.deleted : d.title) + "</h2>" +',
    '        "<div class=\\"meta small muted\\">" + esc(d.authorName || "?") + " · " + when(d.createdAt) + "</div>" +',
    '        "<div class=\\"prose\\">" + (d.deleted ? "" : para(d.body)) + "</div></article>" +',
    '        "<div id=\\"posts\\"></div>" +',
    '        (user',
    '          ? "<div class=\\"card\\" style=\\"margin-top:16px\\"><textarea id=\\"rb\\" class=\\"fld\\" rows=\\"4\\" maxlength=\\"8000\\" placeholder=\\"" + esc(L.replyPlaceholder) + "\\"></textarea>" +',
    '            "<div class=\\"btn-row\\"><button class=\\"btn btn-primary\\" id=\\"replyBtn\\">" + esc(L.reply) + "</button></div></div>"',
    '          : "<p class=\\"small muted\\" style=\\"margin-top:16px\\">" + esc(L.signInToPost) + "</p>");',
    '',
    '      var rb = document.getElementById("replyBtn");',
    '      if (rb) rb.addEventListener("click", function (e) {',
    '        var btn = e.currentTarget;',
    '        var txt = document.getElementById("rb").value.trim();',
    '        if (!txt) return;',
    '        btn.disabled = true; btn.textContent = L.posting;',
    '        fb.addDoc(fb.collection(db, "threads", id, "posts"), {',
    '          body: txt, authorUid: user.uid, authorName: user.displayName || "anon",',
    '          authorAvatar: user.photoURL || "", createdAt: fb.serverTimestamp(), deleted: false',
    '        }).then(function () {',
    '          document.getElementById("rb").value = "";',
    '          btn.disabled = false; btn.textContent = L.reply;',
    '          return fb.updateDoc(ref, { replyCount: (d.replyCount || 0) + 1, lastActivity: fb.serverTimestamp() });',
    '        }).catch(function () { btn.disabled = false; btn.textContent = L.reply; alert(L.errGeneric); });',
    '      });',
    '',
    '      fb.onSnapshot(fb.query(fb.collection(db, "threads", id, "posts"), fb.orderBy("createdAt", "asc")), function (ps) {',
    '        var box = document.getElementById("posts");',
    '        if (!box) return;',
    '        var html = "";',
    '        ps.forEach(function (p) {',
    '          var pd = p.data();',
    '          var mine = user && pd.authorUid === user.uid;',
    '          html += "<article class=\\"card\\" style=\\"margin-bottom:10px\\">" +',
    '            "<div class=\\"meta small muted\\">" + esc(pd.authorName || "?") + " · " + when(pd.createdAt) +',
    '            ((mine || canModerate()) && !pd.deleted',
    '              ? " · <a href=\\"#\\" data-del=\\"" + esc(p.id) + "\\">" + esc(L.delete) + "</a>" : "") +',
    '            "</div><div class=\\"prose\\">" + (pd.deleted ? "<em>" + esc(L.deleted) + "</em>" : para(pd.body)) + "</div></article>";',
    '        });',
    '        box.innerHTML = html;',
    '        [].forEach.call(box.querySelectorAll("[data-del]"), function (a) {',
    '          a.addEventListener("click", function (ev) {',
    '            ev.preventDefault();',
    '            if (!confirm(L.confirmDelete)) return;',
    '            fb.updateDoc(fb.doc(db, "threads", id, "posts", a.dataset.del), { deleted: true, body: "" })',
    '              .catch(function () { alert(L.errGeneric); });',
    '          });',
    '        });',
    '      });',
    '    });',
    '  }',
    '',
    '  function route() { var id = threadId(); if (id) renderThread(id); else renderList(); }',
    '',
    '  // ── boot ────────────────────────────────────────────────────────────',
    '  var BASE = "https://www.gstatic.com/firebasejs/" + SDK + "/";',
    '  Promise.all([',
    '    import(BASE + "firebase-app.js"),',
    '    import(BASE + "firebase-auth.js"),',
    '    import(BASE + "firebase-firestore.js")',
    '  ]).then(function (mods) {',
    '    fb = Object.assign({}, mods[0], mods[1], mods[2]);',
    '    var app = fb.initializeApp(CFG);',
    '    auth = fb.getAuth(app);',
    '    db = fb.getFirestore(app);',
    '    fb.onAuthStateChanged(auth, function (u) {',
    '      user = u;',
    '      renderAuth();',
    '      if (u) {',
    '        fb.setDoc(fb.doc(db, "users", u.uid), {',
    '          displayName: u.displayName || "anon", photoURL: u.photoURL || "", updatedAt: fb.serverTimestamp()',
    '        }, { merge: true }).catch(function () {});',
    '      }',
    '      route();',
    '    });',
    '  }).catch(function () {',
    '    root.innerHTML = "<div class=\\"empty\\">" + esc(L.errGeneric) + "</div>";',
    '  });',
    '})();',
  ].join('\n');
}
