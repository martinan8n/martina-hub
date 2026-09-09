export const config = {
  matcher: ['/((?!api/login|_vercel|favicon.ico).*)'],
};

async function sha256Hex(input) {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export default async function middleware(request) {
  const password = process.env.SITE_PASSWORD;
  if (!password) {
    return new Response(
      'Site password not configured. Set SITE_PASSWORD in the Vercel project’s environment variables.',
      { status: 500 },
    );
  }

  const expected = await sha256Hex(password);
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/(?:^|;\s*)gate_auth=([^;]+)/);
  const token = match ? decodeURIComponent(match[1]) : null;

  if (token === expected) {
    return;
  }

  const url = new URL(request.url);
  const showError = url.searchParams.get('error') === '1';
  const redirectTo = encodeURIComponent(url.pathname + url.search.replace(/[?&]error=1/, ''));

  const html = `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Martina's Hub</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background:#f4f4f5; display:flex; align-items:center; justify-content:center; height:100vh; margin:0; }
  form { background:#fff; padding:32px; border-radius:12px; box-shadow:0 2px 12px rgba(0,0,0,0.08); width:280px; }
  h1 { font-size:16px; margin:0 0 16px; color:#111; }
  input { width:100%; box-sizing:border-box; padding:10px 12px; border:1px solid #ddd; border-radius:6px; font-size:14px; margin-bottom:12px; }
  button { width:100%; padding:10px 12px; border:none; border-radius:6px; background:#111; color:#fff; font-size:14px; cursor:pointer; }
  .err { color:#c0392b; font-size:12px; margin:-6px 0 12px; }
</style></head>
<body>
  <form method="POST" action="/api/login?redirect=${redirectTo}">
    <h1>Enter password</h1>
    ${showError ? '<div class="err">Wrong password, try again.</div>' : ''}
    <input type="password" name="password" placeholder="Password" autofocus required>
    <button type="submit">Enter</button>
  </form>
</body></html>`;

  return new Response(html, {
    status: 401,
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}
