/*
 * Skunkworks Academy OWASP Top 10:2025 local training lab server.
 * Local educational use only. Do not expose this server publicly.
 */

const http = require('http');
const crypto = require('crypto');
const { URL } = require('url');

const port = Number(process.env.PORT || 3025);

const users = [
  { id: 1, owner: 'alice', email: 'alice@example.test', role: 'learner', displayName: 'Alice Learner', balance: 1000 },
  { id: 2, owner: 'bob', email: 'bob@example.test', role: 'learner', displayName: 'Bob Learner', balance: 800 },
  { id: 3, owner: 'admin', email: 'admin@example.test', role: 'admin', displayName: 'Admin User', balance: 0 }
];

const orders = [
  { id: 101, customer: 'alice', item: 'Cloud lab voucher', amount: 120 },
  { id: 102, customer: 'alice', item: 'Security workshop', amount: 250 },
  { id: 201, customer: 'bob', item: 'Linux lab voucher', amount: 90 }
];

function send(res, status, payload, headers = {}) {
  const body = typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2);
  res.writeHead(status, {
    'Content-Type': typeof payload === 'string' ? 'text/html; charset=utf-8' : 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'X-Content-Type-Options': 'nosniff',
    ...headers
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try { resolve(body ? JSON.parse(body) : {}); }
      catch { resolve({ parseError: true, rawLength: body.length }); }
    });
  });
}

function normalise(value) {
  return String(value || 'unknown').replace(/[\r\n\t]/g, '_').slice(0, 120);
}

function tokenFor(user) {
  return crypto.createHash('sha256').update(`training-static-seed:${user}`).digest('hex').slice(0, 24);
}

function home(res) {
  send(res, 200, `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Skunkworks OWASP Local Lab</title><style>body{font-family:system-ui;margin:2rem;max-width:920px;line-height:1.5}.card{border:1px solid #ddd;border-radius:12px;padding:1rem;margin:1rem 0}code{background:#f4f4f5;padding:.15rem .3rem;border-radius:6px}</style></head><body><h1>Skunkworks OWASP Top 10:2025 Local Lab</h1><p>This server supports the self-paced course at <code>/self-paced/security/skw-owasp-top10-2025/</code>. It is for local training only.</p><div class="card"><h2>Useful routes</h2><ul><li><a href="/api/health">/api/health</a></li><li><a href="/api/profile/1?viewer=alice">/api/profile/1?viewer=alice</a></li><li><a href="/api/debug">/api/debug</a></li><li><a href="/api/orders?customer=alice">/api/orders?customer=alice</a></li><li><a href="/api/token-demo?user=alice">/api/token-demo?user=alice</a></li><li><a href="/api/session-demo">/api/session-demo</a></li><li><a href="/api/log?event=login_failed">/api/log?event=login_failed</a></li><li><a href="/api/calculate?items=abc">/api/calculate?items=abc</a></li></ul></div></body></html>`);
}

async function router(req, res) {
  if (req.method === 'OPTIONS') return send(res, 204, '');
  const url = new URL(req.url, `http://localhost:${port}`);
  const path = url.pathname;

  if (path === '/') return home(res);
  if (path === '/api/health') return send(res, 200, { status: 'online', name: 'skw-owasp10-2025-local-lab', port });

  if (path.startsWith('/api/profile/')) {
    const id = Number(path.split('/').pop());
    const viewer = normalise(url.searchParams.get('viewer'));
    const user = users.find(item => item.id === id);
    if (!user) return send(res, 404, { error: 'Profile not found' });
    return send(res, 200, {
      lab: 'A01 Broken Access Control',
      viewer,
      record: user,
      teachingPoint: 'The course asks learners to define the server-side owner and role checks that should protect this record.'
    });
  }

  if (path === '/api/debug') {
    return send(res, 200, {
      lab: 'A02 Security Misconfiguration',
      node: process.version,
      platform: process.platform,
      cwd: process.cwd(),
      teachingPoint: 'Diagnostic endpoints must be environment-gated and authorized before production deployment.'
    });
  }

  if (path === '/api/orders') {
    const customer = normalise(url.searchParams.get('customer'));
    const result = customer === 'all_demo_records' ? orders : orders.filter(item => item.customer === customer);
    return send(res, 200, {
      lab: 'A05 Injection and data/syntax separation',
      simulatedQuery: 'SELECT * FROM orders WHERE customer = :customer',
      boundValue: customer,
      result,
      teachingPoint: 'Use parameterized query APIs and separate data values from interpreter syntax.'
    });
  }

  if (path === '/api/token-demo') {
    const user = normalise(url.searchParams.get('user'));
    return send(res, 200, {
      lab: 'A04 Cryptographic Failures',
      user,
      demoToken: tokenFor(user),
      teachingPoint: 'This predictable training token illustrates why real tokens require strong randomness, signing, expiry and rotation.'
    });
  }

  if (path === '/api/session-demo') {
    return send(res, 200, {
      lab: 'A07 Authentication Failures',
      encodedClaim: Buffer.from(JSON.stringify({ sub: 'alice', role: 'learner' })).toString('base64'),
      teachingPoint: 'Encoding is not integrity protection. Real sessions require signing, expiry and server-side validation.'
    });
  }

  if (path === '/api/log') {
    const event = normalise(url.searchParams.get('event'));
    console.log(JSON.stringify({ level: 'info', event, source: 'skw-owasp10-2025-local-lab' }));
    return send(res, 200, { status: 'logged', teachingPoint: 'Log fields are normalized and structured before being written.' });
  }

  if (path === '/api/calculate') {
    const raw = String(url.searchParams.get('items') || '');
    const nums = raw.split(',').filter(Boolean).map(Number);
    if (!nums.length || nums.some(Number.isNaN)) {
      console.error(JSON.stringify({ level: 'error', route: '/api/calculate', reason: 'invalid_numeric_input', rawLength: raw.length }));
      return send(res, 400, { error: 'Invalid item list', teachingPoint: 'User responses should be safe while diagnostics remain server-side.' });
    }
    return send(res, 200, { total: nums.reduce((sum, value) => sum + value, 0) });
  }

  if (path === '/api/authorize') {
    const mode = normalise(url.searchParams.get('mode'));
    if (mode === 'dependency_timeout') return send(res, 503, { authorized: false, teachingPoint: 'Security decisions should fail closed or require retry when dependencies fail.' });
    return send(res, 200, { authorized: false });
  }

  if (path === '/api/transfer' && req.method === 'POST') {
    const body = await readBody(req);
    return send(res, 200, {
      lab: 'A06 Insecure Design',
      received: body,
      teachingPoint: 'Learners must define ownership, amount, balance, velocity and approval rules before accepting transfers.'
    });
  }

  if (path === '/api/import-profile' && req.method === 'POST') {
    const body = await readBody(req);
    const allowed = { displayName: body.displayName, preferredLanguage: body.preferredLanguage };
    return send(res, 200, {
      lab: 'A08 Software or Data Integrity Failures',
      acceptedFields: allowed,
      rejectedProtectedFields: Object.keys(body).filter(key => !['displayName', 'preferredLanguage'].includes(key)),
      teachingPoint: 'Only allow-listed fields should be accepted from client-submitted profile imports.'
    });
  }

  return send(res, 404, { error: 'Route not found' });
}

http.createServer((req, res) => {
  router(req, res).catch(error => {
    console.error(error);
    send(res, 500, { error: 'Internal server error' });
  });
}).listen(port, () => {
  console.log(`Skunkworks OWASP local lab running at http://localhost:${port}`);
  console.log('Local training use only. Do not expose publicly.');
});
