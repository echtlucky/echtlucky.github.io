/**
 * Proves the Firestore rules against the live project.
 *
 * The forum's central claim is that reading is open and writing requires a
 * CONFIRMED email address. That claim is worth exactly as much as a test, so
 * this creates a real unverified account, tries to post with it, and asserts
 * that Firestore refuses — then deletes the account again.
 *
 * It talks to the live database on purpose. Rules are deployed server-side; a
 * local emulator would prove that the file on disk is correct, not that the
 * thing actually protecting real users is.
 *
 *   node test/rules.mjs
 *
 * Everything it creates, it removes. If it dies half way, the leftover is one
 * account named in the output.
 */

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CFG = JSON.parse(readFileSync(join(ROOT, 'content', 'firebase.json'), 'utf8'));

if (!CFG.apiKey || !CFG.projectId) {
  process.stderr.write('rules: content/firebase.json is not filled in.\n');
  process.exit(2);
}

const IDENTITY = 'https://identitytoolkit.googleapis.com/v1';
const FIRESTORE = `https://firestore.googleapis.com/v1/projects/${CFG.projectId}/databases/(default)/documents`;

// A deterministic address so a crashed run leaves something findable rather
// than an anonymous orphan.
const EMAIL = `airlock-rules-test@example.invalid`;
const PASSWORD = 'correct-horse-battery-staple-2026';

let failures = 0;
const results = [];
const check = (name, ok, detail) => {
  results.push({ name, ok: !!ok, detail });
  if (!ok) failures++;
};

async function api(url, body, token) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
  });
  return { status: res.status, json: await res.json().catch(() => ({})) };
}

// ── set up ──────────────────────────────────────────────────────────────────

let idToken = null;
let localId = null;

const signUp = await api(`${IDENTITY}/accounts:signUp?key=${CFG.apiKey}`, {
  email: EMAIL, password: PASSWORD, returnSecureToken: true,
});

if (signUp.status === 200) {
  idToken = signUp.json.idToken;
  localId = signUp.json.localId;
} else if ((signUp.json.error?.message || '').includes('EMAIL_EXISTS')) {
  const signIn = await api(`${IDENTITY}/accounts:signInWithPassword?key=${CFG.apiKey}`, {
    email: EMAIL, password: PASSWORD, returnSecureToken: true,
  });
  idToken = signIn.json.idToken;
  localId = signIn.json.localId;
} else {
  process.stderr.write(`rules: could not create a test account: ${signUp.json.error?.message}\n`);
  process.exit(2);
}

check('an account can be created', !!idToken, localId ? `uid ${localId.slice(0, 8)}…` : '');

// Confirm the account really is unverified — the whole test depends on it.
const info = await api(`${IDENTITY}/accounts:lookup?key=${CFG.apiKey}`, { idToken });
const verified = info.json.users?.[0]?.emailVerified === true;
check('the new account is unverified', verified === false, `emailVerified=${verified}`);

// ── the claims ──────────────────────────────────────────────────────────────

// 1. Reading is open to everyone, with no token at all.
const anonRead = await fetch(`${FIRESTORE}/threads?pageSize=1`);
check('anyone can read threads without signing in', anonRead.status === 200, `HTTP ${anonRead.status}`);

// 2. An unverified account must NOT be able to post. This is the one that
//    matters: without it, anybody can sign up with somebody else's address and
//    post under it.
const unverifiedWrite = await api(`${FIRESTORE}/threads`, {
  fields: {
    title: { stringValue: 'Rules test — this must never be stored' },
    body: { stringValue: 'If you are reading this in the forum, the verification gate is not working.' },
    category: { stringValue: 'help' },
    authorUid: { stringValue: localId },
    authorName: { stringValue: 'rules test' },
    replyCount: { integerValue: '0' },
    deleted: { booleanValue: false },
  },
}, idToken);

check('an unverified account CANNOT post', unverifiedWrite.status === 403,
  `HTTP ${unverifiedWrite.status}${unverifiedWrite.status === 200 ? ' — A THREAD WAS CREATED' : ''}`);

// 3. Nobody may write into somebody else's user document.
const foreignProfile = await api(`${FIRESTORE}/users?documentId=not-my-uid`, {
  fields: { displayName: { stringValue: 'impersonation attempt' } },
}, idToken);
check('nobody can write another user\'s profile', foreignProfile.status === 403, `HTTP ${foreignProfile.status}`);

// 4. Nobody may hand themselves the moderator role.
const selfPromote = await api(`${FIRESTORE}/users?documentId=${localId}`, {
  fields: { displayName: { stringValue: 'rules test' }, role: { stringValue: 'moderator' } },
}, idToken);
check('nobody can grant themselves moderator', selfPromote.status === 403, `HTTP ${selfPromote.status}`);

// 5. A collection with no rule of its own is denied, not open by default.
const undeclared = await api(`${FIRESTORE}/secrets`, {
  fields: { x: { stringValue: 'y' } },
}, idToken);
check('an undeclared collection is closed', undeclared.status === 403, `HTTP ${undeclared.status}`);

// ── clean up ────────────────────────────────────────────────────────────────

const removed = await api(`${IDENTITY}/accounts:delete?key=${CFG.apiKey}`, { idToken });
check('the test account is removed again', removed.status === 200, `HTTP ${removed.status}`);

// ── report ──────────────────────────────────────────────────────────────────

const pad = Math.max(...results.map((r) => r.name.length));
process.stdout.write(`\nFirestore rules — live project ${CFG.projectId}\n\n`);
for (const r of results) {
  process.stdout.write(`  ${r.ok ? '✓' : '✗'} ${r.name.padEnd(pad)}${r.detail ? `   ${r.detail}` : ''}\n`);
}
process.stdout.write(`\n  ${results.length - failures}/${results.length} checks passed`);
process.stdout.write(failures === 0 ? '  —  reading open, writing gated on a confirmed address\n\n' : '\n\n');

if (failures) {
  process.stdout.write('  A failing check here means the deployed rules do not match firestore.rules.\n');
  process.stdout.write('  Redeploy with: firebase deploy --only firestore:rules\n\n');
}

process.exitCode = failures === 0 ? 0 : 1;
