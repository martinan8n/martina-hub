export const config = { runtime: 'edge' };

async function sha256Hex(input) {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export default async function handler(request) {
  const url = new URL(request.url);
  const redirect = url.searchParams.get('redirect') || '/';
  const password = process.env.SITE_PASSWORD;

  const form = await request.formData();
  const submitted = form.get('password') || '';

  const headers = new Headers();

  if (password && submitted === password) {
    const token = await sha256Hex(password);
    headers.set('Location', redirect);
    headers.append(
      'Set-Cookie',
      `gate_auth=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`,
    );
    return new Response(null, { status: 302, headers });
  }

  const separator = redirect.includes('?') ? '&' : '?';
  headers.set('Location', `${redirect}${separator}error=1`);
  return new Response(null, { status: 302, headers });
}
