#!/usr/bin/env node
/**
 * Backend API smoke test for the RushRanks mobile app (branch: feature/v1.0-changes).
 *
 * Exercises every backend endpoint the app's current branch calls, end-to-end,
 * against the local Docker dev backend (NestJS api-server on :3000 + Postgres/Redis).
 *
 * It is a *smoke* test: it verifies each critical endpoint is reachable and returns a
 * sane (non-5xx, expected-shape) response. It is not an exhaustive assertion of business
 * logic. Zero dependencies — uses Node's global fetch (Node >= 18, repo pins v22).
 *
 * Flow (see AskUserQuestion answer: "full flow incl. follows/messages/reports"):
 *   1. Wait for the API to come up   (you start it; this polls)
 *   2. Health: /api/_health/live + /ready
 *   3. Register two throwaway users  -> capture 4-digit verificationToken
 *   4. verifyUser both               -> status Active + accessToken
 *   5. login (user A)                -> assert Active + token
 *   6. GET /api/users/me             -> own profile
 *   7. GET /api/users/:id            -> user B
 *   8. GraphQL: users / videos / chats
 *   9. follow A->B, message A->B, report A->B
 *  10. block A->B (create/list/delete), push token (create/delete), unfollow
 *  11. If a video exists in the feed: comments (list/create/delete),
 *      reactions (lookup/like/delete), track view
 *
 * Usage:
 *   node scripts/smoke/backend-smoke.mjs
 *   SMOKE_BASE_URL=http://localhost:3000 node scripts/smoke/backend-smoke.mjs
 *   npm run smoke:backend
 *
 * Env:
 *   SMOKE_BASE_URL      API origin (default http://localhost:3000)
 *   SMOKE_WAIT_MS       how long to wait for the server to come up (default 180000)
 *   SMOKE_DB_HOST/PORT  dev Postgres for verification-code fallback (default 127.0.0.1:5432)
 *   SMOKE_DB_NAME/USER/PASSWORD  default reel100/reel100/reel100
 *   SMOKE_DB_CONTAINER  docker container name to exec psql in (default: auto-detect)
 *   NO_COLOR            disable ANSI colors
 *
 * Exit code: 0 if no failures, 1 otherwise.
 */

import { execSync } from 'node:child_process';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const BASE = (process.env.SMOKE_BASE_URL || 'http://localhost:3000').replace(/\/+$/, '');
const WAIT_MS = Number(process.env.SMOKE_WAIT_MS || 180_000);
const DB = {
  host: process.env.SMOKE_DB_HOST || '127.0.0.1',
  port: process.env.SMOKE_DB_PORT || '5432',
  name: process.env.SMOKE_DB_NAME || 'reel100',
  user: process.env.SMOKE_DB_USER || 'reel100',
  password: process.env.SMOKE_DB_PASSWORD || 'reel100',
  container: process.env.SMOKE_DB_CONTAINER || '',
};
const COMMON_HEADERS = {
  'Content-Type': 'application/json',
  'X-Client': 'ReelApp',
  'x-Client-Version': '0.1',
};

// ---------------------------------------------------------------------------
// Pretty printing
// ---------------------------------------------------------------------------
const useColor = !process.env.NO_COLOR && process.stdout.isTTY;
const c = (code, s) => (useColor ? `\x1b[${code}m${s}\x1b[0m` : s);
const dim = (s) => c('2', s);
const bold = (s) => c('1', s);
const green = (s) => c('32', s);
const red = (s) => c('31', s);
const yellow = (s) => c('33', s);
const cyan = (s) => c('36', s);

// ---------------------------------------------------------------------------
// HTTP helpers
// ---------------------------------------------------------------------------
async function http(method, url, { body, token } = {}) {
  const headers = { ...COMMON_HEADERS };
  if (token) headers.Authorization = `Bearer ${token}`;
  let res;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (e) {
    throw new Error(`network error: ${e.message} (${method} ${url})`);
  }
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : undefined;
  } catch {
    data = text; // non-JSON body
  }
  return { status: res.status, ok: res.ok, data };
}

const rest = (method, path, opts) =>
  http(method, `${BASE}/api/${String(path).replace(/^\/+/, '')}`, opts);

async function gql(query, variables, token) {
  const r = await http('POST', `${BASE}/graphql`, { body: { query, variables }, token });
  if (r.status >= 400) {
    throw new Error(`graphql HTTP ${r.status}: ${short(r.data)}`);
  }
  if (r.data && Array.isArray(r.data.errors) && r.data.errors.length) {
    throw new Error(`graphql errors: ${r.data.errors.map((e) => e.message).join('; ')}`);
  }
  return r.data && r.data.data;
}

function short(v, n = 280) {
  const s = typeof v === 'string' ? v : JSON.stringify(v);
  if (!s) return String(v);
  return s.length > n ? `${s.slice(0, n)}…` : s;
}

/** Assert helper — throws with a readable message on failure. */
function check(cond, msg) {
  if (!cond) throw new Error(msg);
}
/** Assert that an HTTP result was a success (2xx). */
function ok2xx(res, label) {
  check(res.status >= 200 && res.status < 300, `${label}: expected 2xx, got ${res.status} ${short(res.data)}`);
  return res.data;
}

// ---------------------------------------------------------------------------
// Step runner
// ---------------------------------------------------------------------------
const results = [];
let stepNo = 0;

async function step(name, fn, { skip = false, skipReason = '' } = {}) {
  stepNo += 1;
  const label = `${String(stepNo).padStart(2, '0')} ${name}`;
  if (skip) {
    results.push({ name, status: 'SKIP' });
    console.log(`${yellow('∅')}  ${label} ${dim(`— skipped: ${skipReason}`)}`);
    return undefined;
  }
  const t0 = Date.now();
  try {
    const out = await fn();
    const ms = Date.now() - t0;
    results.push({ name, status: 'PASS', ms });
    console.log(`${green('✓')}  ${label} ${dim(`(${ms}ms)`)}`);
    return out;
  } catch (e) {
    const ms = Date.now() - t0;
    results.push({ name, status: 'FAIL', ms, error: e.message });
    console.log(`${red('✗')}  ${label} ${dim(`(${ms}ms)`)}\n     ${red(e.message)}`);
    return undefined;
  }
}

// ---------------------------------------------------------------------------
// Wait for server (you start it; we poll)
// ---------------------------------------------------------------------------
async function waitForServer() {
  const deadline = Date.now() + WAIT_MS;
  const url = `${BASE}/api/_health/live`;
  process.stdout.write(`${cyan('⏳')} Waiting for API at ${bold(BASE)} — start it now `);
  process.stdout.write(dim('(cd api-server && npm start)\n   '));
  let attempt = 0;
  for (;;) {
    attempt += 1;
    try {
      // Any HTTP response (even 401/404) means the server is up and listening.
      await fetch(url, { headers: COMMON_HEADERS });
      process.stdout.write(green(' up!\n'));
      return true;
    } catch {
      if (Date.now() > deadline) {
        process.stdout.write(red(' timed out.\n'));
        return false;
      }
      process.stdout.write(dim('.'));
      await sleep(2000);
    }
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------------------
// Verification-code retrieval (response first, then dev DB fallback)
// ---------------------------------------------------------------------------
function detectDbContainer() {
  if (DB.container) return DB.container;
  try {
    const out = execSync(
      `docker ps --format '{{.Names}}\t{{.Image}}\t{{.Ports}}'`,
      { encoding: 'utf8' },
    );
    for (const line of out.split('\n')) {
      const [name = '', image = '', ports = ''] = line.split('\t');
      if (/postgres/i.test(image) && (ports.includes(`:${DB.port}->`) || /db-1$/.test(name))) {
        return name;
      }
    }
  } catch {
    /* docker not available */
  }
  return '';
}

function readCodeFromDb(username) {
  const sql = `SELECT "verificationToken" FROM "User" WHERE username='${username.replace(/'/g, "''")}' LIMIT 1;`;
  // 1) local psql
  try {
    const out = execSync(
      `PGPASSWORD='${DB.password}' psql -h ${DB.host} -p ${DB.port} -U ${DB.user} -d ${DB.name} -tAc "${sql}"`,
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    ).trim();
    if (out) return out;
  } catch {
    /* psql not installed / not reachable */
  }
  // 2) psql inside the db container
  const container = detectDbContainer();
  if (container) {
    try {
      const out = execSync(
        `docker exec ${container} psql -U ${DB.user} -d ${DB.name} -tAc "${sql}"`,
        { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
      ).trim();
      if (out) return out;
    } catch {
      /* container psql failed */
    }
  }
  return '';
}

/** register -> returns { username, password, code, id, accessToken } */
async function registerUser(tag) {
  const stamp = `${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}`;
  const username = `smoke.${tag}.${stamp}@example.com`;
  const password = 'Smoke!Pass123';
  const body = {
    username,
    password,
    confirmPassword: password,
    firstName: 'Smoke',
    lastName: tag.toUpperCase(),
    nickname: `smoke_${tag}_${stamp}`,
  };
  const res = await rest('POST', 'register', { body });
  ok2xx(res, 'register');
  const data = res.data || {};
  let code = data.verificationToken != null ? String(data.verificationToken) : '';
  if (!code) code = readCodeFromDb(username);
  check(!!code, `could not obtain verificationToken from register response or dev DB for ${username}`);
  return { username, password, code, id: data.id, accessToken: data.accessToken };
}

// ---------------------------------------------------------------------------
// GraphQL documents (copied from the app's hooks)
// ---------------------------------------------------------------------------
const GQL_VIDEOS = `query($orderBy:[VideoOrderByInput!] $skip:Float $take:Float $where:VideoWhereInput){
  videos(where:$where skip:$skip orderBy:$orderBy take:$take){
    id label slug createdAt updatedAt file status processingStep
    likesCount commentsCount viewsCount description
    user { id firstName lastName avatar nickname whoms { id who { id } } }
    states { id slug label } top_100Position top_100Date
  }
}`;
const GQL_USERS = `query($orderBy:[UserOrderByInput!] $skip:Float $take:Float $where:UserWhereInput){
  users(where:$where skip:$skip orderBy:$orderBy take:$take){
    id firstName lastName nickname avatar username createdAt updatedAt
  }
}`;
const GQL_CHATS = `query($orderBy:[ChatOrderByInput!]){
  chats(orderBy:$orderBy){
    id user1 { id firstName } user2 { id firstName } createdAt
    unreadMessagesCount1 unreadMessagesCount2
    lastMessage { id text createdAt isRead } updatedAt
  }
}`;
const GQL_MESSAGES = `query($chatId:String!){
  messages(where:{ chat:{ id:$chatId } } orderBy:{ createdAt:Desc }){
    id chat { id } fromField { id firstName } to { id firstName } text isRead createdAt updatedAt
  }
}`;

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log(bold(`\nRushRanks backend API smoke test`));
  console.log(dim(`base: ${BASE}/api  •  graphql: ${BASE}/graphql\n`));

  const up = await waitForServer();
  if (!up) {
    console.log(red(`\nServer never came up at ${BASE} within ${WAIT_MS}ms. Start the api-server and retry.`));
    summarize();
    process.exit(1);
  }
  console.log('');

  // --- Health -------------------------------------------------------------
  await step('GET /_health/live', async () => {
    const r = await rest('GET', '_health/live');
    ok2xx(r, 'health/live');
  });
  await step('GET /_health/ready', async () => {
    const r = await rest('GET', '_health/ready');
    ok2xx(r, 'health/ready');
  });

  // --- Auth: register + verify two users ----------------------------------
  const A = await step('POST /register (user A)', () => registerUser('a'));
  const B = await step('POST /register (user B)', () => registerUser('b'));

  const verifiedA = await step('POST /verifyUser (user A)', async () => {
    check(A, 'user A registration failed');
    const r = await rest('POST', 'verifyUser', { body: { username: A.username, token: A.code } });
    const data = ok2xx(r, 'verifyUser A');
    check(!!data.accessToken, 'verifyUser A: missing accessToken');
    return { token: data.accessToken, id: data.id ?? A.id };
  }, { skip: !A, skipReason: 'register A failed' });

  const verifiedB = await step('POST /verifyUser (user B)', async () => {
    check(B, 'user B registration failed');
    const r = await rest('POST', 'verifyUser', { body: { username: B.username, token: B.code } });
    const data = ok2xx(r, 'verifyUser B');
    return { token: data.accessToken, id: data.id ?? B.id };
  }, { skip: !B, skipReason: 'register B failed' });

  const tokenA = verifiedA?.token;
  const authed = !!tokenA;

  // --- Auth: login --------------------------------------------------------
  await step('POST /login (user A, now Active)', async () => {
    const r = await rest('POST', 'login', { body: { username: A.username, password: A.password } });
    const data = ok2xx(r, 'login');
    check(data.status === 'Active', `login: expected status Active, got ${data.status}`);
    check(!!data.accessToken, 'login: missing accessToken');
  }, { skip: !A, skipReason: 'register A failed' });

  // --- Identity -----------------------------------------------------------
  const me = await step('GET /users/me', async () => {
    const r = await rest('GET', 'users/me', { token: tokenA });
    const data = ok2xx(r, 'users/me');
    check(!!data.id, 'users/me: missing id');
    return data;
  }, { skip: !authed, skipReason: 'no auth token' });

  const userAId = me?.id ?? verifiedA?.id;
  const userBId = verifiedB?.id;

  await step('GET /users/:id (user B)', async () => {
    check(userBId, 'no user B id');
    const r = await rest('GET', `users/${userBId}`, { token: tokenA });
    ok2xx(r, 'users/:id');
  }, { skip: !authed || !userBId, skipReason: 'no auth token / user B' });

  // --- GraphQL ------------------------------------------------------------
  await step('GraphQL users { }', async () => {
    const data = await gql(GQL_USERS, { take: 10 }, tokenA);
    check(Array.isArray(data?.users), 'graphql users: not an array');
  }, { skip: !authed, skipReason: 'no auth token' });

  const feed = await step('GraphQL videos { } (feed)', async () => {
    const data = await gql(GQL_VIDEOS, { take: 10, skip: 0, orderBy: [{ createdAt: 'Desc' }] }, tokenA);
    check(Array.isArray(data?.videos), 'graphql videos: not an array');
    return data.videos;
  }, { skip: !authed, skipReason: 'no auth token' });

  await step('GraphQL chats { }', async () => {
    const data = await gql(GQL_CHATS, { orderBy: [{ updatedAt: 'Desc' }] }, tokenA);
    check(Array.isArray(data?.chats), 'graphql chats: not an array');
  }, { skip: !authed, skipReason: 'no auth token' });

  // --- Social: follow / message / report ----------------------------------
  const followId = await step('POST /follows (A -> B)', async () => {
    const r = await rest('POST', 'follows', {
      token: tokenA,
      body: { who: { id: userAId }, whom: { id: userBId } },
    });
    const data = ok2xx(r, 'follows');
    return data?.id;
  }, { skip: !authed || !userAId || !userBId, skipReason: 'missing auth/user ids' });

  await step('POST /messages (A -> B)', async () => {
    const r = await rest('POST', 'messages', {
      token: tokenA,
      body: { fromField: { id: userAId }, to: { id: userBId }, text: 'smoke test message' },
    });
    ok2xx(r, 'messages');
  }, { skip: !authed || !userAId || !userBId, skipReason: 'missing auth/user ids' });

  await step('GraphQL chats -> messages (A<->B)', async () => {
    const data = await gql(GQL_CHATS, { orderBy: [{ updatedAt: 'Desc' }] }, tokenA);
    const chat = (data?.chats || []).find(
      (ch) => [ch.user1?.id, ch.user2?.id].includes(userAId) && [ch.user1?.id, ch.user2?.id].includes(userBId),
    );
    check(chat?.id, 'no chat found between A and B after sending a message');
    const msgs = await gql(GQL_MESSAGES, { chatId: chat.id }, tokenA);
    check(Array.isArray(msgs?.messages) && msgs.messages.length >= 1, 'messages query returned no rows');
  }, { skip: !authed || !userAId || !userBId, skipReason: 'missing auth/user ids' });

  await step('POST /reports (A reports B)', async () => {
    const r = await rest('POST', 'reports', {
      token: tokenA,
      body: {
        description: 'smoke test report',
        reason: 'Other',
        owner: { id: userAId },
        wasReviewed: false,
        user: { id: userBId },
      },
    });
    ok2xx(r, 'reports');
  }, { skip: !authed || !userAId || !userBId, skipReason: 'missing auth/user ids' });

  // --- Blocking (create / list / delete) ----------------------------------
  await step('POST+GET+DELETE /blockedUsers (A blocks B)', async () => {
    const create = await rest('POST', 'blockedUsers', {
      token: tokenA,
      body: { user: { id: userAId }, userToBlock: { id: userBId } },
    });
    const created = ok2xx(create, 'blockedUsers create');
    const list = await rest(
      'GET',
      `blockedUsers?where[userToBlock][id][equals]=${userBId}`,
      { token: tokenA },
    );
    ok2xx(list, 'blockedUsers list');
    const id = created?.id ?? (Array.isArray(list.data) && list.data[0]?.id);
    if (id) {
      const del = await rest('DELETE', `blockedUsers/${id}`, { token: tokenA });
      ok2xx(del, 'blockedUsers delete');
    }
  }, { skip: !authed || !userAId || !userBId, skipReason: 'missing auth/user ids' });

  // --- Push notification token (create / delete) --------------------------
  await step('POST+DELETE /pushNotificationTokens', async () => {
    const create = await rest('POST', 'pushNotificationTokens', {
      token: tokenA,
      body: { isActive: true, token: `smoke-fake-token-${Date.now()}`, user: { id: userAId } },
    });
    const created = ok2xx(create, 'pushNotificationTokens create');
    if (created?.id) {
      const del = await rest('DELETE', `pushNotificationTokens/${created.id}`, { token: tokenA });
      ok2xx(del, 'pushNotificationTokens delete');
    }
  }, { skip: !authed || !userAId, skipReason: 'missing auth/user id' });

  // --- Unfollow -----------------------------------------------------------
  await step('DELETE /follows/:id (unfollow)', async () => {
    check(followId, 'no follow id to delete');
    const r = await rest('DELETE', `follows/${followId}`, { token: tokenA });
    ok2xx(r, 'follows delete');
  }, { skip: !authed || !followId, skipReason: 'follow was not created' });

  // --- Video-dependent endpoints (only if a video exists) -----------------
  const video = Array.isArray(feed) && feed.length ? feed[0] : null;
  const vSkip = !authed || !video;
  const vReason = !authed ? 'no auth token' : 'no videos in dev DB (feed empty)';

  await step('GET /videos/:id/comments', async () => {
    const r = await rest('GET', `videos/${video.id}/comments?skip=0&take=10`, { token: tokenA });
    ok2xx(r, 'comments list');
  }, { skip: vSkip, skipReason: vReason });

  await step('POST+DELETE /comments', async () => {
    const create = await rest('POST', 'comments', {
      token: tokenA,
      body: { replyTo: '', text: 'smoke test comment', user: { id: userAId }, video: { id: video.id } },
    });
    const created = ok2xx(create, 'comment create');
    if (created?.id) {
      const del = await rest('DELETE', `comments/${created.id}`, { token: tokenA });
      ok2xx(del, 'comment delete');
    }
  }, { skip: vSkip || !userAId, skipReason: vReason });

  await step('GET /reactions (like lookup)', async () => {
    const r = await rest(
      'GET',
      `reactions?where[typeField]=Like&where[video][id]=${video.id}&where[user][id]=${userAId}`,
      { token: tokenA },
    );
    // 200 (found) or 404/empty are both acceptable for a lookup; just must not be 5xx.
    check(r.status < 500, `reactions lookup: server error ${r.status} ${short(r.data)}`);
  }, { skip: vSkip || !userAId, skipReason: vReason });

  await step('POST+DELETE /reactions (like)', async () => {
    const create = await rest('POST', 'reactions', {
      token: tokenA,
      body: { typeField: 'Like', video: { id: video.id }, user: { id: userAId } },
    });
    const created = ok2xx(create, 'reaction create');
    if (created?.id) {
      const del = await rest('DELETE', `reactions/${created.id}`, { token: tokenA });
      ok2xx(del, 'reaction delete');
    }
  }, { skip: vSkip || !userAId, skipReason: vReason });

  await step('PATCH /videos/:id/track', async () => {
    const r = await rest('PATCH', `videos/${video.id}/track`, { token: tokenA });
    ok2xx(r, 'track view');
  }, { skip: vSkip, skipReason: vReason });

  summarize();
  const failed = results.filter((r) => r.status === 'FAIL').length;
  process.exit(failed ? 1 : 0);
}

function summarize() {
  const pass = results.filter((r) => r.status === 'PASS').length;
  const fail = results.filter((r) => r.status === 'FAIL').length;
  const skip = results.filter((r) => r.status === 'SKIP').length;
  console.log(bold('\n──────── summary ────────'));
  console.log(`${green(`${pass} passed`)}  •  ${fail ? red(`${fail} failed`) : dim('0 failed')}  •  ${yellow(`${skip} skipped`)}`);
  if (fail) {
    console.log(red('\nFailures:'));
    for (const r of results.filter((x) => x.status === 'FAIL')) {
      console.log(`  ${red('✗')} ${r.name}\n      ${dim(r.error)}`);
    }
  }
  console.log('');
}

main().catch((e) => {
  console.error(red(`\nFatal: ${e?.stack || e?.message || e}`));
  summarize();
  process.exit(1);
});
