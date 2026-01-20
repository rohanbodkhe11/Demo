(async function(){
  const base = process.env.BASE_URL || 'http://localhost:9002';
  const log = (label, ok, status, body) => console.log(`${label}: ${ok ? 'OK' : 'FAIL'} (status=${status})`, body || '');
  const maxRetries = 20;
  const retryDelay = 500; // ms

  async function waitForServer(url) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const r = await fetch(url, { method: 'GET' });
        if (r.ok) return true;
      } catch (e) {
        // ignore and retry
      }
      await new Promise(r => setTimeout(r, retryDelay));
    }
    return false;
  }

  const ready = await waitForServer(base);
  if (!ready) {
    console.error('Server not responding at', base);
    return;
  }

  try {
    // 1) POST /api/users with password -> expect 400
    let res = await fetch(`${base}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 'bad-user', email: 'bad@example.com', password: 'pwned', name: 'Bad' })
    });
    let body = await res.text();
    log('POST /api/users (with password) should be rejected', res.status === 400, res.status, body);

    // 2) POST /api/users with valid profile -> expect 201
    const uid = `test-user-${Date.now()}`;
    const profile = { id: uid, name: 'Test User', email: `test-${Date.now()}@example.com`, role: 'student' };
    res = await fetch(`${base}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });
    body = await res.text();
    log('POST /api/users (profile) should succeed', res.status === 201, res.status, body);

    // 3) POST /api/auth/login with email/password -> expect 400
    res = await fetch(`${base}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: profile.email, password: 'password123' })
    });
    body = await res.text();
    log('POST /api/auth/login (email+password) should be rejected', res.status === 400 || res.status === 401, res.status, body);

    // 4) POST /api/auth/login with empty body -> expect 400
    res = await fetch(`${base}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
    body = await res.text();
    log('POST /api/auth/login (no idToken) should be rejected', res.status === 400 || res.status === 401, res.status, body);

    // 5) GET /api/users/:uid without Authorization -> expect 401
    res = await fetch(`${base}/api/users/${uid}`);
    body = await res.text();
    log('GET /api/users/:uid without token should be rejected', res.status === 401, res.status, body);

    // 6) GET /api/users/:uid with fake token -> expect 401
    res = await fetch(`${base}/api/users/${uid}`, { headers: { Authorization: 'Bearer faketoken' } });
    body = await res.text();
    log('GET /api/users/:uid with invalid token should be rejected', res.status === 401, res.status, body);

    console.log('\nTest run complete.');
  } catch (err) {
    console.error('Test runner error:', err);
  }
})();
