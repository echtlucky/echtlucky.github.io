import { href } from '../layout.mjs';

export const slug = 'api';

export const meta = {
  en: {
    title: 'API — the Skillry licence check, written out in full · Skillry',
    description:
      'One address, one method, one verdict. The request, the response, the status codes, the three arming stages, the three-day grace period — and, unvarnished, what this layer does not do.',
  },
  de: {
    title: 'API — die Skillry-Lizenzprüfung, vollständig aufgeschrieben · Skillry',
    description:
      'Eine Adresse, eine Methode, ein Urteil. Die Anfrage, die Antwort, die Statuscodes, die drei Stufen des Scharfschaltens, die dreitägige Nachfrist — und ungeschönt, was diese Schicht nicht leistet.',
  },
};

// ---------------------------------------------------------------------------
// Code, verbatim.
//
// The Lua below is the block between the two markers in baustein.lua, character
// for character. Only the comments are translated — an identifier that differs
// between the German and the English page would be a snippet that compiles on
// one of them and not on the other.
//
// Anything with a `<` in it is escaped here rather than at render time: these
// strings are written into the page as-is, and a raw `<` would open a tag.
// ---------------------------------------------------------------------------

const LUA_MANIFEST = `dependency 'skillry_lizenz'`;

const LUA_CFG = `set skillry_lizenz_key "…"`;

const LUA_EXPORTS = {
  en: `exports.skillry_lizenz:Gilt()   <span class="c">--&gt; true | false | nil</span>
exports.skillry_lizenz:Stand()  <span class="c">--&gt; table, never nil</span>`,
  de: `exports.skillry_lizenz:Gilt()   <span class="c">--&gt; true | false | nil</span>
exports.skillry_lizenz:Stand()  <span class="c">--&gt; Tabelle, nie nil</span>`,
};

const LUA_STAND = {
  en: `{
  stand      = 'aus' | 'unbekannt' | 'gilt' | 'gilt_nicht',
  bis        = 1790000000,  <span class="c">-- or nil</span>
  seit       = 1786000000,  <span class="c">-- when the grace period started</span>
  grund      = '…',         <span class="c">-- or nil</span>
  kontakt    = '…',
  anhalten   = true,        <span class="c">-- whether C.Anhalten is armed</span>
  angehalten = false,       <span class="c">-- whether it has already happened</span>
}`,
  de: `{
  stand      = 'aus' | 'unbekannt' | 'gilt' | 'gilt_nicht',
  bis        = 1790000000,  <span class="c">-- oder nil</span>
  seit       = 1786000000,  <span class="c">-- Beginn der Nachfrist</span>
  grund      = '…',         <span class="c">-- oder nil</span>
  kontakt    = '…',
  anhalten   = true,        <span class="c">-- ob C.Anhalten scharf ist</span>
  angehalten = false,       <span class="c">-- ob es schon passiert ist</span>
}`,
};

const LUA_EVENT = `AddEventHandler('skillry_lizenz:stand', function(stand) … end)`;

const LUA_BLOCK = {
  en: `<span class="c">--- Apply a verdict from skillry_lizenz to your own resource.</span>
local function skillryLizenzPruefen(stand)
  if stand and stand.stand == 'gilt_nicht' and stand.anhalten then
    StopResource(GetCurrentResourceName())
  end
end

<span class="c">-- Every change — the first answer as much as a revocation weeks later.</span>
AddEventHandler('skillry_lizenz:stand', skillryLizenzPruefen)

<span class="c">-- And one late look, in case the verdict arrived before this resource did.</span>
CreateThread(function()
  Wait(20000)
  local heil, stand = pcall(function() return exports.skillry_lizenz:Stand() end)
  if heil then skillryLizenzPruefen(stand) end
end)`,
  de: `<span class="c">--- Ein Urteil von skillry_lizenz auf die eigene Ressource anwenden.</span>
local function skillryLizenzPruefen(stand)
  if stand and stand.stand == 'gilt_nicht' and stand.anhalten then
    StopResource(GetCurrentResourceName())
  end
end

<span class="c">-- Jede Aenderung — die erste Antwort ebenso wie ein Widerruf Wochen spaeter.</span>
AddEventHandler('skillry_lizenz:stand', skillryLizenzPruefen)

<span class="c">-- Und einmal nachsehen, falls das Urteil schon vor dieser Ressource da war.</span>
CreateThread(function()
  Wait(20000)
  local heil, stand = pcall(function() return exports.skillry_lizenz:Stand() end)
  if heil then skillryLizenzPruefen(stand) end
end)`,
};

const HTTP_REQ = {
  en: `POST https://lizenz.skillry.de/v1/pruefen

Content-Type: application/json
Accept:       application/json
User-Agent:   skillry_lizenz/&lt;version from the manifest&gt;`,
  de: `POST https://lizenz.skillry.de/v1/pruefen

Content-Type: application/json
Accept:       application/json
User-Agent:   skillry_lizenz/&lt;Fassung aus dem Manifest&gt;`,
};

const HTTP_RES = `HTTP/1.1 200 OK
Content-Type: application/json

{ "stand": "gilt", "bis": 1790000000, "hinweis": "…", "kontakt": "…" }`;

// ---------------------------------------------------------------------------

const T = {
  en: {
    eyebrow: 'Licence API · POST · JSON',
    h1: 'One address, one method, one verdict.',
    lede:
      'The Skillry licence API answers exactly one question: <strong>may this server still run the Skillry resources today?</strong> The <code>skillry_lizenz</code> resource asks once an hour, and everything that goes over the wire is written out below — including the places where the check achieves nothing at all.',
    endpoint: 'POST https://lizenz.skillry.de/v1/pruefen',

    flowH: 'How the check runs',
    flow: [
      [
        'The server asks',
        'Once an hour, <code>skillry_lizenz</code> sends a POST with the key and a handful of facts about the server. No player sees any of it: the resource has no <code>client_script</code> at all, and a set of directions to the licence API is not something you hand to everyone who connects.',
      ],
      [
        'The API answers',
        'JSON with a <code>stand</code> field: <code>gilt</code> or <code>gilt_nicht</code>. Anything else — a 500, a timeout, an empty body, JSON without <code>stand</code> — is explicitly <em>not knowing</em>, and not a refusal.',
      ],
      [
        'The resource acts',
        'A refusal is checked a second time ten minutes later before anything happens, and a stop only follows if <code>C.Anhalten</code> is armed. Not knowing leads into the grace period: three days in which nothing happens.',
      ],
    ],

    wireH: 'How a script is wired to it',
    wireP:
      'Anyone running the Skillry package as a whole has nothing to do here: <code>skillry_lizenz</code> stops everything whose name begins with <code>skillry_</code> by itself. The block below is for the two other cases — a single script sold on its own, and resources that are named differently.',

    keyH: '1 — The key goes into server.cfg',
    keyP:
      'The key belongs on the customer’s server, not in the source. The environment variable <code>SKILLRY_LIZENZ_KEY</code> does the same job, for anyone who keeps their <code>server.cfg</code> in a repository.',
    keyNoteH: '<code>set</code>, not <code>sets</code> or <code>setr</code>',
    keyNoteP:
      '<code>sets</code> would write the key into the server info, where every server browser can read it. <code>setr</code> would send it to every connected client.',

    manifestH: '2 — The line in your own manifest',
    manifestP:
      'This line is part of the block and not a formality. Without it your resource starts even when <code>skillry_lizenz</code> is missing, and <code>exports.skillry_lizenz</code> throws on first access. With it, it does not start at all — which is the right answer here: a resource whose licence check is absent is a resource running unchecked.',

    blockH: '3 — The block goes into a server file',
    blockP:
      'Into a <strong>server</strong> file of the resource you want to protect. Not into a client file and not into a <code>shared_script</code>: the exports exist on the server only, and a call from the other side returns <code>nil</code> — with no error and no line in the log. The check would then look like a check and never find anything.',
    blockWhy: [
      [
        'Why the event and not a loop',
        '<code>Gilt()</code> returns <code>nil</code> while the first answer is outstanding — and if the API is unreachable, it stays outstanding for three days. A start-up loop would run for three days at one call a second for an answer that does not exist. The event fires on every <em>change</em>, and the first answer is always a change.',
      ],
      [
        'Why the twenty seconds',
        'The event does not reach a resource that starts <em>after</em> the verdict. <code>skillry_lizenz</code> waits five seconds and then up to two minutes for the Cfx identifier; look earlier and you only learn that nobody has asked yet, look later and the resource runs unchecked for longer than it needs to.',
      ],
      [
        'Why the pcall, given the dependency',
        '<code>dependency</code> covers the moment of starting and nothing else. If <code>skillry_lizenz</code> is stopped while the server is running, the export throws on access — an error in a customer’s console, caused by our licence check, at exactly the moment it cannot answer anyway. If the look fails, nothing happens and the next verdict catches the resource up.',
      ],
      [
        'What it deliberately does not do',
        'It does not stop on the absence of knowledge: <code>stand</code> has to be <code>gilt_nicht</code> explicitly. <code>if not gilt then</code> would be wrong, because <code>nil</code> is falsy in Lua and the resource would stop itself in the first seconds after every start. It respects <code>C.Anhalten</code>, so stage 2 stays a dry run. And it starts nothing again by itself.',
      ],
    ],

    exportsH: 'The exports and the event',
    exportsP:
      'Both exist on the server only. A call on the client returns <code>nil</code>, with no error and no line in the log.',
    exportsNoteH: '<code>nil</code> is one of three answers, not a "no"',
    exportsNoteP:
      '<code>Gilt()</code> returns <code>nil</code> while the first answer is outstanding. Writing <code>if not Gilt() then StopResource(…)</code> stops your resource in the first seconds after every start. <code>true</code> also comes back when the check is switched off entirely — if nothing is being checked, everything is allowed, and an embedded block has no business noticing.',
    standP: '<code>Stand()</code> always returns a table:',
    eventP:
      'The event fires on every <em>change</em> of state, not on every check — otherwise it would be the same message twenty-four times a day, and a listener that acts on it would act twenty-four times.',
    eventNoteH: 'A <code>TriggerEvent</code>, and deliberately no <code>RegisterNetEvent</code>',
    eventNoteP:
      'A net event under this name could be raised by any player, telling every resource that the licence is valid. A check the checked party can answer for itself is not a check.',

    stagesH: 'The three arming stages',
    stagesP0:
      '<strong>Stage 1 is the default.</strong> A freshly installed <code>skillry_lizenz</code> checks nothing and contacts nobody until somebody deliberately arms it — everything above describes what happens after that decision, not before it.',
    stagesWarn: 'Skip stage 2 and you are testing your licence API for the first time on a server with players on it.',
    stagesHead: ['Stage', '<code>C.An</code>', '<code>C.Anhalten</code>', 'What happens'],
    stages: [
      ['1', '<code>false</code>', '<code>false</code>', 'Nothing. No request, no waiting thread, one line in the console. <code>Gilt()</code> returns <code>true</code>.'],
      ['2', '<code>true</code>', '<code>false</code>', 'It checks and logs <strong>what would happen</strong>. Nothing is stopped; the message says out loud that it has no consequences.'],
      ['3', '<code>true</code>', '<code>true</code>', 'Armed.'],
    ],
    stagesP:
      'You stay at stage 2 until you have <strong>a week of logs without a false refusal</strong>. A week, because only a week contains a weekend, a restart, a release, and a night on which something of ours was broken.',

    contractH: 'The contract: the request',
    sourceNoteH: 'This page is the copy, not the original',
    sourceNoteP:
      'The binding text is the README shipped alongside <code>skillry_lizenz</code>. This page reproduces it. Two descriptions of the same contract drift apart, and then you believe the wrong one — so if these two ever disagree, the README is right and this page is wrong.',
    reqHead: ['Field', 'Type', 'Meaning'],
    req: [
      [
        'schluessel',
        'text',
        'The licence key. <strong>In the body, not in the address</strong> — addresses end up in the access log of every intermediary, in the referrer field, and in every screenshot of an error message. Not in a header either: headers get logged at almost every reverse proxy the moment somebody turns on debugging.',
      ],
      [
        'kennung',
        'text',
        'The server’s <code>web_baseUrl</code>. Unique per server, derived from the Cfx licence key, public in the server list anyway — and worthless to anyone who steals it. <strong>May be empty</strong>: not available yet at startup, and never with <code>sv_lan 1</code>.',
      ],
      ['name', 'text', '<code>sv_hostname</code>.'],
      ['spiel', 'text', '<code>gamename</code>, in practice always <code>gta5</code>.'],
      ['plaetze', 'number', '<code>sv_maxclients</code>.'],
      ['laufzeit', 'number', 'Seconds since this server started. Not decoration: a key that keeps reappearing with a small uptime and days between its requests is a pattern, not a coincidence.'],
      ['fassung', 'text', 'The version from the manifest, so the log shows who is still on an old build without a customer having to report anything.'],
      ['lizenz', 'text', 'Only when <code>C.LizenzMitschicken = true</code>: the real <code>sv_licenseKey</code>. <strong>Off by default</strong>, and it should stay that way.'],
    ],
    reqNoteP:
      '<strong>Not in the body: the address of the server.</strong> It comes from the connection, and the API sees it for itself. A field <code>adresse</code> would be an assertion by the very server being checked, and worth nothing as evidence.',
    kennungNoteH: '<code>kennung</code> must never be checked against a format',
    kennungNoteP:
      'Cfx.re is changing the scheme and prefixes the old identifier with <code>deprecated-</code>. A check against <code>^[0-9a-z]{8}\\.users\\.cfx\\.re$</code> would silently discard every identifier — and with it the one feature that shows whether a key is running on two servers. What is needed is a string that is unique per server and does not change. That is all it has to be.',

    resH: 'The contract: the response',
    resP: 'HTTP 200 with JSON:',
    resHead: ['Field', 'Required', 'Meaning'],
    res: [
      ['stand', 'yes', '<code>"gilt"</code> or <code>"gilt_nicht"</code>. <strong>Anything else is treated as not knowing</strong>, not as a refusal.'],
      ['bis', 'no', 'Unix time at which the licence expires. Absent means open-ended. It is also the ceiling on the grace period: a licence that expires on Tuesday does not run until Friday because somebody cut the connection on Monday.'],
      ['grund', 'on <code>gilt_nicht</code>', 'Plain text for the operator’s console. They read it, so it is a sentence and not an error number.'],
      ['kontakt', 'no', 'Overrides <code>C.Kontakt</code>, so a reseller’s contact appears in the message instead of ours.'],
      ['hinweis', 'no', 'One line that appears in the console even on <code>gilt</code> — "your subscription ends in 5 days". Printed only on <em>change</em>, so it is not there twenty-four times a day.'],
    ],

    codesH: 'The status codes',
    codesP:
      'Only two things are a no: <code>stand = "gilt_nicht"</code> with HTTP 200, and <strong>401, 402, 403</strong> — unknown or revoked key, unpaid, suspended.',
    codesP2:
      'Everything else is not knowing, and not knowing gets the grace period: a timeout, a 500, a 404, an intermediary’s error page, an empty body, JSON without the <code>stand</code> field. An outage is not allowed to end anyone’s evening.',
    ruleH: 'The one rule on the API side',
    ruleP:
      'A fault of ours must never go out as a refusal. Answering 403 when in doubt stops every paying server at once, and that is the only outcome that could genuinely end this project.',
    rule: [
      'A broken database query becomes <strong>503</strong>, never 403.',
      'An unreadable body becomes <strong>400</strong>, never 401. An oversized one <strong>413</strong>.',
      'Too many requests become <strong>429</strong>, never 403.',
      'A query that does not answer within five seconds becomes <strong>503</strong>.',
      'An <strong>empty licence table</strong> becomes 503, never 401 — otherwise a wrong database name or an empty restore would make every key look unknown, and every paying server would stop within the hour without anything looking broken.',
      'If the database is missing, the service <strong>does not start at all</strong>, rather than coming up and quietly answering 503.',
    ],

    revokeH: 'What a revocation actually does',
    revokeP:
      'There is no back channel — the API cannot poke a server. A revocation takes effect the next time the server asks, so <strong>after an hour at the latest</strong> (<code>C.TaktMinuten</code>), plus ten minutes for the second look (<code>C.NegativTaktMinuten</code>).',
    revokeP2:
      'That second look is the reason a revocation is not immediate, and it is deliberate: <strong>a single refusal can be our mistake.</strong> A migration that renames a column; a cache that serves the neighbour’s answer; a typo that sets every row to revoked. In all three cases the API answers cleanly, quickly and with HTTP 200 — and without the second look it would stop every customer simultaneously. A revocation is never in a hurry; a false alarm that hits everyone at once is an evening you do not want to repeat.',

    outageH: 'What happens when the API is down',
    outageP:
      'Nothing, for three days. The grace period runs from the <strong>last successful check</strong>, not from the customer’s server start.',
    outageHead: ['After', 'What the operator notices'],
    outage: [
      ['1 hour', 'Nothing. A line in the console and otherwise nothing at all. That is exactly the point — the most likely outage, our own restart or release, must not be noticeable.'],
      ['1 day', 'Still nothing but console lines. A third of the grace period is used up and the game runs unchanged.'],
      ['36 hours', 'A warning at every check that <strong>names the time</strong> at which the stop will happen. A day and a half of notice, not a second and a half.'],
      ['72 hours', 'The resources stop — with a reason and a contact.'],
    ],
    whyP:
      'The 72 hours are not a feeling. The case that sets the number is the Friday evening: an expired certificate, a DNS record, a lapsed domain — noticed through a customer report, fixed by a human being who is asleep, at work, or on a train. That is a little under 60 hours. 72 covers it with air, and air is cheap here.',
    stopH: 'What a stop does, and what it does not',
    stopP:
      'It stops, and nothing else. <strong>No hidden sabotage</strong>: nothing that alters database rows, makes money disappear, deletes vehicles, or only starts biting days later. Damage that is not immediately visible will certainly hit a paying customer eventually, through a mistake on <em>our</em> side — and a script that quietly changes data on suspicion makes every debugging session impossible, including our own. Nothing restarts by itself either: when the licence is valid again the console says so, and the stopped resources come back on the next server restart, triggered by a human who knows who is online.',
    honestH: 'The honest downside',
    honestP:
      '<strong>The grace period is not remembered across a restart.</strong> Restart, and you get a fresh one. This is known and accepted: a file or a KVP entry on a thief’s machine is exactly as easy to delete as this check itself. State that does not protect but can break is one piece of state too many. What is left is the pattern in the API — the uptime in every request, the sender address recorded by the API itself, the identifier, the version.',

    limitsH: 'What this layer does not do',
    limitsLede:
      'It is a threshold, not a lock. This section is here for the same reason it opens the resource’s own README: it sets the expectation everything above should be read with.',
    limitsP1:
      'A Lua file on somebody else’s server is plain text. Whoever has the files also has <code>config.lua</code> — and <code>C.An = false</code> is a line you delete before the coffee goes cold. Someone more thorough deletes the block from the server file; someone in a hurry renames <code>skillry_lizenz</code> until the <code>dependency</code> entry no longer bites.',
    limitsP2:
      'That is not a weakness of this implementation, it is the situation: <strong>the server has to execute the code, so the server has to have the code.</strong> Every check that lives inside the shipped script can be bypassed with one changed line. A check that could not be bypassed would have to live outside the shipped code — and for that there is exactly one tool, below.',
    limitsP3:
      'The common denominator: it works on <strong>customers, not thieves</strong>. A customer who cancels and keeps playing stops. A thief who reads the file does not.',
    doesH: 'What it does do',
    does: [
      ['Knowledge', 'Which server is running the scripts, since when, with how many slots, on which build. That is support and sales, not defence — and it is the part that pays off daily.'],
      ['A kill switch', 'A revoked key stops the <em>honest</em> operation: a chargeback, a cancelled subscription, a copy handed to a second server.'],
      ['An expiry date', 'A subscription is a point in time. The Cfx.re entitlement itself knows none.'],
    ],
    escrowH: 'And if you want more: Asset Escrow',
    escrowP:
      'Cfx.re encrypts resources at delivery. The customer then gets no readable Lua files, but a resource that only runs on a server the entitlement has been assigned to. That is the only stage which genuinely stops an attacker, and it sits with Cfx.re rather than with us.',
    escrowP2:
      'The two answer different questions. <strong>Escrow</strong> answers "may this server execute the code at all" — hard, unbypassable, and with no notion of time. <strong>This layer</strong> answers "is the subscription still paid, and what do I know about this server" — soft, bypassable, but with an expiry date, a revocation and a log. If you can only have one, take escrow. If you sell, you need both: escrow alone cannot end a subscription.',
    escrowNoteH: 'The <code>sv_licenseKey</code> is not collected',
    escrowNoteP:
      'It is the customer’s credential at Cfx.re, not ours. Whoever holds it can run a server under someone else’s identity. Collecting it would turn our licence API into a place worth breaking into, and every customer into somebody who entrusted us with something we never asked for. It is not needed either: <code>web_baseUrl</code> does the same job and is harmless.',

    askH: 'Questions about wiring it in',
    askP: 'Ask in the forum. A contract only its sender understands is not one.',
    askBtn: 'Go to the forum',
    contactH: 'Who to reach, and where',
    contactP:
      'The contact in the console comes from <code>C.Kontakt</code>, or from the <code>kontakt</code> field of the response when a reseller sets one. For everything else, the site notice has the details.',
    contactBtn: 'Site notice and contact',
  },

  de: {
    eyebrow: 'Lizenz-API · POST · JSON',
    h1: 'Eine Adresse, eine Methode, ein Urteil.',
    lede:
      'Die Skillry-Lizenz-API beantwortet genau eine Frage: <strong>Darf dieser Server die Skillry-Ressourcen heute noch laufen lassen?</strong> Die Ressource <code>skillry_lizenz</code> fragt einmal je Stunde nach — und was dabei über die Leitung geht, steht unten vollständig, samt der Stellen, an denen die Prüfung überhaupt nichts ausrichtet.',
    endpoint: 'POST https://lizenz.skillry.de/v1/pruefen',

    flowH: 'Wie die Prüfung abläuft',
    flow: [
      [
        'Der Server fragt',
        'Einmal je Stunde schickt <code>skillry_lizenz</code> einen POST mit dem Schlüssel und einer Handvoll Angaben über den Server. Kein Spieler sieht davon etwas: die Ressource hat kein einziges <code>client_script</code>, und eine Wegbeschreibung zur Lizenz-API verteilt man nicht an jeden, der sich verbindet.',
      ],
      [
        'Die API antwortet',
        'JSON mit dem Feld <code>stand</code>: <code>gilt</code> oder <code>gilt_nicht</code>. Alles andere — ein 500er, ein Zeitablauf, ein leerer Körper, ein JSON ohne <code>stand</code> — ist ausdrücklich <em>Nichtwissen</em> und keine Absage.',
      ],
      [
        'Die Ressource handelt',
        'Eine Absage wird zehn Minuten später gegengeprüft, bevor irgendetwas passiert, und angehalten wird nur, wenn <code>C.Anhalten</code> scharf ist. Nichtwissen führt in die Nachfrist: drei Tage, in denen nichts geschieht.',
      ],
    ],

    wireH: 'Wie ein Skript damit verbunden wird',
    wireP:
      'Wer das Skillry-Paket als Ganzes betreibt, muss dafür nichts tun: <code>skillry_lizenz</code> hält von sich aus alles an, dessen Name mit <code>skillry_</code> beginnt. Der Baustein unten ist für die beiden anderen Fälle da — für ein einzeln verkauftes Skript und für Ressourcen, die anders heißen.',

    keyH: '1 — Der Schlüssel in die server.cfg',
    keyP:
      'Der Schlüssel gehört auf den Server des Kunden und nicht in den Quelltext. Die Umgebungsvariable <code>SKILLRY_LIZENZ_KEY</code> leistet dasselbe — für alle, die ihre <code>server.cfg</code> ins Repository legen.',
    keyNoteH: '<code>set</code>, nicht <code>sets</code> oder <code>setr</code>',
    keyNoteP:
      '<code>sets</code> schriebe den Schlüssel in die Serverinfo, wo ihn jeder Serverbrowser sieht. <code>setr</code> schickte ihn an jeden verbundenen Client.',

    manifestH: '2 — Die Zeile im eigenen Manifest',
    manifestP:
      'Diese Zeile ist Teil des Bausteins und keine Formalität. Ohne sie startet die eigene Ressource auch dann, wenn <code>skillry_lizenz</code> fehlt, und <code>exports.skillry_lizenz</code> wirft beim ersten Zugriff. Mit ihr startet sie gar nicht erst — was hier die richtige Antwort ist: eine Ressource, deren Lizenzprüfung nicht da ist, ist eine ungeprüft laufende Ressource.',

    blockH: '3 — Der Baustein in eine Server-Datei',
    blockP:
      'In eine <strong>Server</strong>-Datei der Ressource, die geschützt werden soll. Nicht in eine Client-Datei und nicht in ein <code>shared_script</code>: die Exporte gibt es nur auf dem Server, und ein Aufruf auf der anderen Seite liefert <code>nil</code> — ohne Fehler und ohne Zeile im Log. Die Prüfung sähe dann aus wie eine und fände nie etwas.',
    blockWhy: [
      [
        'Warum das Ereignis und keine Schleife',
        '<code>Gilt()</code> gibt <code>nil</code> zurück, solange die erste Antwort aussteht — und wenn die API nicht erreichbar ist, steht sie drei Tage lang aus. Eine Startschleife liefe dann drei Tage im Sekundentakt für eine Auskunft, die es nicht gibt. Das Ereignis fliegt bei jeder <em>Änderung</em>, und die erste Antwort ist immer eine.',
      ],
      [
        'Warum die zwanzig Sekunden',
        'Das Ereignis erreicht nicht, wer <em>nach</em> dem Urteil startet. <code>skillry_lizenz</code> wartet fünf Sekunden und dann bis zu zwei Minuten auf die Cfx-Kennung; wer früher nachsieht, erfährt nur, dass noch niemand gefragt hat, und wer später nachsieht, lässt die Ressource unnötig lange ungeprüft laufen.',
      ],
      [
        'Warum der pcall, obwohl die Abhängigkeit dasteht',
        '<code>dependency</code> deckt den Augenblick des Startens ab und sonst nichts. Wird <code>skillry_lizenz</code> im laufenden Betrieb gestoppt, wirft der Export beim Zugriff — ein Fehler in der Konsole eines Kunden, verursacht von unserer Lizenzprüfung, und zwar genau dann, wenn sie ohnehin nicht antworten kann. Fällt der Blick aus, passiert nichts: das nächste Urteil holt die Ressource ein.',
      ],
      [
        'Was er absichtlich nicht tut',
        'Er hält nicht an, wenn nichts bekannt ist: <code>stand</code> muss ausdrücklich <code>gilt_nicht</code> sein. <code>if not gilt then</code> wäre falsch, weil <code>nil</code> in Lua falsch ist — die Ressource hielte sich in den ersten Sekunden nach jedem Start selbst an. Er respektiert <code>C.Anhalten</code>, damit Stufe 2 ein Probelauf bleibt. Und er startet nichts wieder.',
      ],
    ],

    exportsH: 'Die Exporte und das Ereignis',
    exportsP:
      'Beide gibt es nur auf dem Server. Ein Aufruf auf dem Client liefert <code>nil</code>, ohne Fehler und ohne Zeile im Log.',
    exportsNoteH: '<code>nil</code> ist eine von drei Antworten und kein Nein',
    exportsNoteP:
      '<code>Gilt()</code> gibt <code>nil</code> zurück, solange die erste Antwort aussteht. Wer <code>if not Gilt() then StopResource(…)</code> schreibt, hält seine Ressource in den ersten Sekunden nach jedem Start an. <code>true</code> kommt auch, wenn die Prüfung ganz aus ist — wenn nicht geprüft wird, ist alles erlaubt, und ein eingebauter Baustein darf davon nichts merken.',
    standP: '<code>Stand()</code> gibt immer eine Tabelle:',
    eventP:
      'Das Ereignis fliegt bei jeder <em>Änderung</em> des Zustands, nicht bei jeder Prüfung — sonst wäre es 24-mal am Tag dieselbe Nachricht, und ein Empfänger, der daraufhin etwas tut, täte es 24-mal.',
    eventNoteH: 'Ein <code>TriggerEvent</code> und ausdrücklich kein <code>RegisterNetEvent</code>',
    eventNoteP:
      'Ein Netz-Ereignis mit diesem Namen könnte jeder Spieler auslösen und damit jeder Ressource erzählen, die Lizenz gelte. Eine Prüfung, die der Geprüfte selbst beantworten kann, ist keine.',

    stagesH: 'Die drei Stufen des Scharfschaltens',
    stagesP0:
      '<strong>Stufe 1 ist die Voreinstellung.</strong> Ein frisch installiertes <code>skillry_lizenz</code> prüft nichts und spricht mit niemandem, bis jemand es bewusst scharf schaltet — alles oben beschreibt, was nach dieser Entscheidung passiert, nicht davor.',
    stagesWarn: 'Wer Stufe 2 überspringt, testet seine Lizenz-API zum ersten Mal an einem Server mit Spielern darauf.',
    stagesHead: ['Stufe', '<code>C.An</code>', '<code>C.Anhalten</code>', 'Was passiert'],
    stages: [
      ['1', '<code>false</code>', '<code>false</code>', 'Gar nichts. Keine Anfrage, kein Wartefaden, eine Zeile in der Konsole. <code>Gilt()</code> gibt <code>true</code>.'],
      ['2', '<code>true</code>', '<code>false</code>', 'Es wird geprüft und protokolliert, <strong>was passieren würde</strong>. Nichts wird angehalten; die Meldung sagt ausdrücklich dazu, dass sie folgenlos ist.'],
      ['3', '<code>true</code>', '<code>true</code>', 'Scharf.'],
    ],
    stagesP:
      'In Stufe 2 bleibt man, bis <strong>eine Woche Protokoll ohne falsche Absage</strong> vorliegt. Eine Woche, weil erst darin ein Wochenende steckt, ein Neustart, eine Auslieferung und eine Nacht, in der bei uns etwas kaputt war.',

    contractH: 'Der Vertrag: die Anfrage',
    sourceNoteH: 'Diese Seite ist die Abschrift, nicht das Original',
    sourceNoteP:
      'Verbindlich ist die README, die neben <code>skillry_lizenz</code> ausgeliefert wird. Diese Seite gibt sie wieder. Zwei Beschreibungen desselben Vertrags gehen auseinander, und dann glaubt man der falschen — sollten die beiden je nicht übereinstimmen, gilt die README und nicht diese Seite.',
    reqHead: ['Feld', 'Typ', 'Bedeutung'],
    req: [
      [
        'schluessel',
        'Text',
        'Der Lizenzschlüssel. <strong>Im Körper und nicht in der Adresse</strong> — Adressen landen im Zugriffsprotokoll jedes Zwischenrechners, im Verweis-Feld und in jedem Screenshot einer Fehlermeldung. Auch nicht im Kopf: Kopfzeilen werden bei fast jedem Vorschaltserver mitprotokolliert, sobald jemand die Fehlersuche einschaltet.',
      ],
      [
        'kennung',
        'Text',
        'Die <code>web_baseUrl</code> des Servers. Je Server eindeutig, aus dem Cfx-Lizenzschlüssel abgeleitet, ohnehin öffentlich in der Serverliste — und wertlos für jeden, der sie stiehlt. <strong>Kann leer sein</strong>: beim Start noch nicht da, bei <code>sv_lan 1</code> nie.',
      ],
      ['name', 'Text', '<code>sv_hostname</code>.'],
      ['spiel', 'Text', '<code>gamename</code>, praktisch immer <code>gta5</code>.'],
      ['plaetze', 'Zahl', '<code>sv_maxclients</code>.'],
      ['laufzeit', 'Zahl', 'Sekunden seit dem Start dieses Servers. Kein Beiwerk: eine Kennung, die immer wieder mit kleiner Laufzeit auftaucht und zwischen deren Anfragen Tage liegen, ist ein Muster und kein Zufall.'],
      ['fassung', 'Text', 'Die Version aus dem Manifest. Damit im Protokoll steht, wer noch auf einem alten Stand läuft, ohne dass ein Kunde etwas melden muss.'],
      ['lizenz', 'Text', 'Nur wenn <code>C.LizenzMitschicken = true</code>: der echte <code>sv_licenseKey</code>. <strong>Voreingestellt aus</strong>, und das sollte so bleiben.'],
    ],
    reqNoteP:
      '<strong>Nicht im Körper: die Adresse des Servers.</strong> Sie kommt aus der Verbindung, die API sieht sie selbst. Ein Feld <code>adresse</code> wäre eine Behauptung desselben Servers, der geprüft wird, und als Nachweis nichts wert.',
    kennungNoteH: '<code>kennung</code> darf nirgends auf ein Format geprüft werden',
    kennungNoteP:
      'Cfx.re stellt das Schema um und stellt der alten Kennung ein <code>deprecated-</code> voran. Eine Prüfung auf <code>^[0-9a-z]{8}\\.users\\.cfx\\.re$</code> verwürfe stillschweigend jede Kennung — und damit genau das Merkmal, an dem man sieht, ob ein Schlüssel auf zwei Servern läuft. Gebraucht wird eine Zeichenkette, die je Server eindeutig ist und sich nicht ändert. Mehr muss sie nicht sein.',

    resH: 'Der Vertrag: die Antwort',
    resP: 'HTTP 200 mit JSON:',
    resHead: ['Feld', 'Pflicht', 'Bedeutung'],
    res: [
      ['stand', 'ja', '<code>"gilt"</code> oder <code>"gilt_nicht"</code>. <strong>Alles andere wird als Nichtwissen behandelt</strong>, nicht als Absage.'],
      ['bis', 'nein', 'Unix-Zeit, wann die Lizenz abläuft. Fehlt sie, gilt sie unbefristet. Sie ist zugleich die Obergrenze der Nachfrist: eine Lizenz, die dienstags abläuft, läuft nicht bis freitags weiter, weil montags jemand die Verbindung gekappt hat.'],
      ['grund', 'bei <code>gilt_nicht</code>', 'Klartext für die Konsole des Betreibers. Er liest ihn, also ist er ein Satz und keine Fehlernummer.'],
      ['kontakt', 'nein', 'Überschreibt <code>C.Kontakt</code>. Damit bei einem Wiederverkäufer sein Kontakt in der Meldung steht und nicht unserer.'],
      ['hinweis', 'nein', 'Eine Zeile, die auch bei <code>gilt</code> in der Konsole erscheint — „Dein Abo läuft in 5 Tagen aus". Sie wird nur bei <em>Änderung</em> ausgegeben, steht also nicht 24-mal am Tag da.'],
    ],

    codesH: 'Die Statuscodes',
    codesP:
      'Nur zwei Dinge sind ein Nein: <code>stand = "gilt_nicht"</code> bei HTTP 200, und <strong>401, 402, 403</strong> — unbekannter oder widerrufener Schlüssel, nicht bezahlt, gesperrt.',
    codesP2:
      'Alles andere ist Nichtwissen, und Nichtwissen bekommt die Nachfrist: ein Zeitablauf, ein 500er, ein 404, die Fehlerseite eines Zwischenrechners, ein leerer Körper, ein JSON ohne das Feld <code>stand</code>. Eine Störung darf niemandem den Abend beenden.',
    ruleH: 'Die eine Regel auf der Seite der API',
    ruleP:
      'Ein Fehler auf unserer Seite darf niemals als Absage herausgehen. Wer im Zweifel 403 antwortet, hält jeden zahlenden Server gleichzeitig an — und das ist der einzige Ausgang, der dieses Vorhaben wirklich beenden kann.',
    rule: [
      'Eine kaputte Datenbankabfrage wird <strong>503</strong>, nie 403.',
      'Ein unlesbarer Körper wird <strong>400</strong>, nie 401. Ein zu großer <strong>413</strong>.',
      'Zu viele Anfragen werden <strong>429</strong>, nie 403.',
      'Eine Abfrage, die nicht innerhalb von fünf Sekunden antwortet, wird <strong>503</strong>.',
      'Ein <strong>leerer Lizenzbestand</strong> wird 503, nie 401 — sonst ließe ein falscher Datenbankname oder ein leer eingespieltes Backup jeden Schlüssel unbekannt aussehen, und jeder zahlende Server hielte binnen gut einer Stunde an, ohne dass irgendetwas kaputt aussähe.',
      'Fehlt die Datenbank, startet der Dienst <strong>gar nicht erst</strong>, statt hochzufahren und stumm 503 zu antworten.',
    ],

    revokeH: 'Was ein Widerruf auslöst',
    revokeP:
      'Es gibt keinen Rückkanal — die API kann einen Server nicht anstoßen. Ein Widerruf wirkt, wenn der Server das nächste Mal fragt, also <strong>spätestens nach einer Stunde</strong> (<code>C.TaktMinuten</code>), plus zehn Minuten für die Gegenprobe (<code>C.NegativTaktMinuten</code>).',
    revokeP2:
      'Die Gegenprobe ist der Grund, warum ein Widerruf nicht sofort wirkt, und sie ist Absicht: <strong>eine einzelne Absage kann unser Fehler sein.</strong> Eine Datenwanderung, die eine Spalte umbenennt; ein Zwischenspeicher, der die Antwort des Nachbarn ausliefert; ein Tippfehler, der alle Zeilen auf „widerrufen" setzt. In allen drei Fällen antwortet die API sauber, schnell und mit HTTP 200 — und hielte ohne Gegenprobe jeden Kunden gleichzeitig an. Ein Widerruf hat es nie eilig; ein Fehlalarm, der alle auf einmal trifft, ist ein Abend, den man nicht wiederholen will.',

    outageH: 'Was passiert, wenn die API ausfällt',
    outageP:
      'Drei Tage lang nichts. Die Nachfrist läuft ab der <strong>letzten gelungenen Prüfung</strong>, nicht ab dem Serverstart des Kunden.',
    outageHead: ['Nach', 'Was der Betreiber merkt'],
    outage: [
      ['1 Stunde', 'Nichts. Eine Zeile in der Konsole, sonst gar nichts. Genau das ist der Zweck — der wahrscheinlichste Ausfall, unser eigener Neustart oder unsere Auslieferung, darf nicht auffallen.'],
      ['1 Tag', 'Immer noch nichts außer Konsolenzeilen. Ein Drittel der Nachfrist ist verbraucht, das Spiel läuft unverändert.'],
      ['36 Stunden', 'Bei jeder Prüfung eine Warnung, die <strong>die Uhrzeit nennt</strong>, zu der angehalten wird. Anderthalb Tage Vorwarnung, nicht anderthalb Sekunden.'],
      ['72 Stunden', 'Die Ressourcen halten an — mit Grund und Kontakt.'],
    ],
    whyP:
      'Die 72 Stunden kommen nicht aus dem Gefühl. Der Fall, der die Zahl setzt, ist der Freitagabend: ein abgelaufenes Zertifikat, ein DNS-Eintrag, eine gekündigte Domain — bemerkt durch eine Kundenmeldung, behoben von einem Menschen, der schläft, arbeitet oder im Zug sitzt. Das sind knapp 60 Stunden. 72 deckt ihn mit Luft, und Luft ist hier billig.',
    stopH: 'Was beim Anhalten passiert — und was nicht',
    stopP:
      'Angehalten wird, und sonst nichts. <strong>Keine versteckte Sabotage</strong>: nichts, was Datenbankzeilen verändert, Geld verschwinden lässt, Fahrzeuge löscht oder erst nach Tagen zu wirken beginnt. Ein Schaden, der nicht sofort sichtbar ist, trifft mit Sicherheit irgendwann einen zahlenden Kunden — durch einen Fehler auf <em>unserer</em> Seite. Und ein Skript, das im Verdachtsfall heimlich Daten verändert, macht jede Fehlersuche unmöglich, auch die eigene. Es wird auch nichts von selbst wieder gestartet: gilt die Lizenz wieder, sagt die Konsole das, und die angehaltenen Ressourcen laufen erst nach einem Neustart — ausgelöst von einem Menschen, der weiß, wer online ist.',
    honestH: 'Die ehrliche Kehrseite',
    honestP:
      '<strong>Die Nachfrist wird über einen Neustart hinweg nicht gemerkt.</strong> Wer neu startet, bekommt sie neu. Das ist bekannt und hingenommen: eine Datei oder ein KVP-Eintrag auf dem Rechner des Diebes ist genauso leicht zu löschen wie diese Prüfung selbst. Ein Zustand, der nicht schützt, aber kaputtgehen kann, ist ein Zustand zu viel. Was bleibt, ist das Muster in der API — die Laufzeit in jeder Anfrage, die von der API selbst festgehaltene Absenderadresse, die Kennung, die Fassung.',

    limitsH: 'Was diese Schicht nicht leistet',
    limitsLede:
      'Sie ist eine Schwelle und kein Schloss. Dieser Abschnitt steht hier aus demselben Grund, aus dem er die README der Ressource eröffnet: er setzt die Erwartung, mit der alles Obige zu lesen ist.',
    limitsP1:
      'Eine Lua-Datei auf einem fremden Server ist Klartext. Wer die Dateien hat, hat auch <code>config.lua</code> — und <code>C.An = false</code> ist eine Zeile, die man löscht, bevor der Kaffee kalt wird. Wer etwas gründlicher vorgeht, löscht den Baustein aus der Server-Datei; wer es eilig hat, benennt <code>skillry_lizenz</code> um, bis der <code>dependency</code>-Eintrag nicht mehr greift.',
    limitsP2:
      'Das ist keine Schwäche dieser Umsetzung, sondern die Lage: <strong>der Server muss den Code ausführen, also muss der Server den Code haben.</strong> Jede Prüfung, die im ausgelieferten Skript steht, lässt sich mit einer geänderten Zeile umgehen. Eine Prüfung, die sich nicht umgehen ließe, müsste außerhalb des ausgelieferten Codes liegen — und dafür gibt es genau ein Werkzeug, weiter unten.',
    limitsP3:
      'Der gemeinsame Nenner: sie wirkt auf <strong>Kunden, nicht auf Diebe</strong>. Ein Kunde, der kündigt und weiterspielt, hört auf. Ein Dieb, der die Datei liest, nicht.',
    doesH: 'Was sie dafür leistet',
    does: [
      ['Wissen', 'Welcher Server lässt die Skripte laufen, seit wann, mit wie vielen Plätzen, auf welchem Stand. Das ist Kundendienst und Vertrieb, nicht Abwehr — und der Teil, der sich täglich auszahlt.'],
      ['Ein Notausschalter', 'Ein Schlüssel, der widerrufen wird, hält den <em>ehrlichen</em> Betrieb an: bei einer Rückbuchung, einem gekündigten Abo, einer Weitergabe an einen zweiten Server.'],
      ['Ein Ablaufdatum', 'Ein Abo ist eine Zeitangabe. Die eigene Berechtigung von Cfx.re kennt keine.'],
    ],
    escrowH: 'Und wenn man mehr will: Asset Escrow',
    escrowP:
      'Cfx.re verschlüsselt Ressourcen bei der Auslieferung. Der Kunde bekommt dann keine lesbaren Lua-Dateien, sondern eine Ressource, die nur auf einem Server läuft, dem die Berechtigung zugewiesen ist. Das ist die einzige Stufe, die einen Angreifer wirklich aufhält, und sie liegt bei Cfx.re und nicht bei uns.',
    escrowP2:
      'Die beiden beantworten verschiedene Fragen. <strong>Escrow</strong> beantwortet „darf dieser Server den Code überhaupt ausführen" — hart, unumgehbar, und ohne jede Zeitangabe. <strong>Diese Schicht</strong> beantwortet „ist das Abo noch bezahlt, und was weiß ich über diesen Server" — weich, umgehbar, aber mit Ablaufdatum, Widerruf und Protokoll. Wer nur eines von beiden haben kann, nimmt Escrow. Wer verkauft, braucht beides: Escrow allein kann kein Abo beenden.',
    escrowNoteH: 'Der <code>sv_licenseKey</code> wird nicht eingesammelt',
    escrowNoteP:
      'Er ist die Zugangskennung des Kunden bei Cfx.re, nicht unsere. Wer ihn hat, kann einen Server unter fremder Kennung betreiben. Ihn einzusammeln machte aus unserer Lizenz-API einen Ort, an dem sich ein Einbruch lohnt — und aus jedem Kunden jemanden, der uns etwas anvertraut hat, um das wir nie gebeten haben. Gebraucht wird er auch nicht: <code>web_baseUrl</code> leistet dasselbe und ist harmlos.',

    askH: 'Fragen zur Einbindung',
    askP: 'Frag im Forum. Ein Vertrag, den nur der Absender versteht, ist keiner.',
    askBtn: 'Zum Forum',
    contactH: 'Wen man erreicht, und wo',
    contactP:
      'Der Kontakt in der Konsole kommt aus <code>C.Kontakt</code> oder aus dem Feld <code>kontakt</code> der Antwort, wenn ein Wiederverkäufer einen setzt. Für alles andere stehen die Angaben im Impressum.',
    contactBtn: 'Impressum und Kontakt',
  },
};

// ---------------------------------------------------------------------------

/**
 * @param {string[]} head
 * @param {string[][]} rows
 * @param {boolean} keyColumn whether the first column holds identifiers
 *
 * `th` is uppercased site-wide, which is right for a word and wrong for a Lua
 * identifier: a header reading C.ANHALTEN describes a convar that does not
 * exist. Any header carrying a `code` element keeps its own case.
 */
const table = (head, rows, keyColumn = true) => `<div class="table-scroll"><table>
  <thead><tr>${head
    .map((h) => `<th${h.includes('<code>') ? ' style="text-transform:none"' : ''}>${h}</th>`)
    .join('')}</tr></thead>
  <tbody>${rows
    .map((r) => `<tr>${r.map((c, i) => `<td${i === 0 && keyColumn ? ' class="mono"' : ''}>${c}</td>`).join('')}</tr>`)
    .join('')}</tbody>
</table></div>`;

export function body(lang) {
  const t = T[lang];

  return `
<section class="hero hero-stage nexus" style="border-top:3px solid var(--nexus)">
  <div class="wrap stack">
    <span class="eyebrow accent-nexus">${t.eyebrow}</span>
    <h1>${t.h1}</h1>
    <p class="lede">${t.lede}</p>
    <p class="small muted mono">${t.endpoint}</p>
  </div>
</section>

<section style="padding-top:0">
  <div class="wrap stack">
    <h2>${t.flowH}</h2>
    <div class="grid grid-3">
      ${t.flow
        .map(([h, p]) => `<article class="card"><h3>${h}</h3><p class="muted small">${p}</p></article>`)
        .join('')}
    </div>
  </div>
</section>

<hr class="divider">

<section>
  <div class="wrap stack-lg">
    <h2>${t.wireH}</h2>
    <p class="muted narrow">${t.wireP}</p>

    <div class="stack">
      <h3>${t.keyH}</h3>
      <p class="muted narrow">${t.keyP}</p>
      <pre>${LUA_CFG}</pre>
      <div class="note warn">
        <h3>${t.keyNoteH}</h3>
        <p>${t.keyNoteP}</p>
      </div>
    </div>

    <div class="stack">
      <h3>${t.manifestH}</h3>
      <p class="muted narrow">${t.manifestP}</p>
      <pre>${LUA_MANIFEST}</pre>
    </div>

    <div class="stack">
      <h3>${t.blockH}</h3>
      <p class="muted narrow">${t.blockP}</p>
      <pre>${LUA_BLOCK[lang]}</pre>
      <div class="grid grid-2">
        ${t.blockWhy
          .map(([h, p]) => `<article class="card"><h3>${h}</h3><p class="muted small">${p}</p></article>`)
          .join('')}
      </div>
    </div>
  </div>
</section>

<section class="anschluss">
  <div class="wrap stack">
    <h2>${t.exportsH}</h2>
    <p class="muted narrow">${t.exportsP}</p>
    <pre>${LUA_EXPORTS[lang]}</pre>
    <div class="note warn">
      <h3>${t.exportsNoteH}</h3>
      <p>${t.exportsNoteP}</p>
    </div>
    <p class="muted narrow">${t.standP}</p>
    <pre>${LUA_STAND[lang]}</pre>
    <p class="muted narrow">${t.eventP}</p>
    <pre>${LUA_EVENT}</pre>
    <div class="note danger">
      <h3>${t.eventNoteH}</h3>
      <p>${t.eventNoteP}</p>
    </div>
  </div>
</section>

<section class="anschluss">
  <div class="wrap stack">
    <h2>${t.stagesH}</h2>
    <p class="muted narrow">${t.stagesP0}</p>
    <div class="note warn"><p>${t.stagesWarn}</p></div>
    ${table(t.stagesHead, t.stages)}
    <p class="muted narrow">${t.stagesP}</p>
  </div>
</section>

<hr class="divider">

<section>
  <div class="wrap stack">
    <h2>${t.contractH}</h2>
    <div class="note">
      <h3>${t.sourceNoteH}</h3>
      <p>${t.sourceNoteP}</p>
    </div>
    <pre>${HTTP_REQ[lang]}</pre>
    ${table(t.reqHead, t.req)}
    <p class="muted narrow">${t.reqNoteP}</p>
    <div class="note warn">
      <h3>${t.kennungNoteH}</h3>
      <p>${t.kennungNoteP}</p>
    </div>
  </div>
</section>

<section style="padding-top:0">
  <div class="wrap stack">
    <h2>${t.resH}</h2>
    <p class="muted narrow">${t.resP}</p>
    <pre>${HTTP_RES}</pre>
    ${table(t.resHead, t.res)}
  </div>
</section>

<section style="padding-top:0">
  <div class="wrap stack">
    <h2>${t.codesH}</h2>
    <p class="muted narrow">${t.codesP}</p>
    <p class="muted narrow">${t.codesP2}</p>
    <div class="note ok">
      <h3>${t.ruleH}</h3>
      <p>${t.ruleP}</p>
      <ul class="muted">${t.rule.map((r) => `<li>${r}</li>`).join('')}</ul>
    </div>
  </div>
</section>

<section style="padding-top:0">
  <div class="wrap stack narrow">
    <h2>${t.revokeH}</h2>
    <p class="muted">${t.revokeP}</p>
    <p class="muted">${t.revokeP2}</p>
  </div>
</section>

<hr class="divider">

<section>
  <div class="wrap stack">
    <h2>${t.outageH}</h2>
    <p class="muted narrow">${t.outageP}</p>
    ${table(t.outageHead, t.outage, false)}
    <p class="muted narrow">${t.whyP}</p>
    <div class="note">
      <h3>${t.stopH}</h3>
      <p>${t.stopP}</p>
    </div>
    <div class="note warn">
      <h3>${t.honestH}</h3>
      <p>${t.honestP}</p>
    </div>
  </div>
</section>

<hr class="divider">

<section>
  <div class="wrap stack-lg">
    <h2>${t.limitsH}</h2>
    <div class="stack narrow">
      <p class="lede">${t.limitsLede}</p>
      <p class="muted">${t.limitsP1}</p>
      <p class="muted">${t.limitsP2}</p>
      <p class="muted">${t.limitsP3}</p>
    </div>

    <div class="stack">
      <h3>${t.doesH}</h3>
      <div class="grid grid-3">
        ${t.does
          .map(([h, p]) => `<article class="card"><h3>${h}</h3><p class="muted small">${p}</p></article>`)
          .join('')}
      </div>
    </div>

    <div class="stack narrow">
      <h3>${t.escrowH}</h3>
      <p class="muted">${t.escrowP}</p>
      <p class="muted">${t.escrowP2}</p>
    </div>

    <div class="note danger">
      <h3>${t.escrowNoteH}</h3>
      <p>${t.escrowNoteP}</p>
    </div>
  </div>
</section>

<hr class="divider">

<section>
  <div class="wrap grid grid-2">
    <div class="stack">
      <h2>${t.askH}</h2>
      <p class="muted">${t.askP}</p>
      <div class="btn-row"><a class="btn btn-primary" href="${href(lang, 'forum')}?cat=help">${t.askBtn}</a></div>
    </div>
    <div class="stack">
      <h2>${t.contactH}</h2>
      <p class="muted">${t.contactP}</p>
      <div class="btn-row"><a class="btn" href="${href(lang, 'impressum')}">${t.contactBtn}</a></div>
    </div>
  </div>
</section>
`;
}
