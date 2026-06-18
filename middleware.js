import { next } from '@vercel/functions';

// Server-side password gate (real, not cosmetic).
// The password is unchanged: this SHA-256 is the same hash the site already used.
const HASH = 'cbba7f209d8529e80a21be0d6feec3d3cefee93261d88be5dbd2bb62307b075f';

// Runs on every request.
export const config = { matcher: '/(.*)' };

async function sha256hex(s) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function loginPage(showError) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Geotab · Operating Room · Impactable</title>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Inter',sans-serif;background:#0A0A0C;color:#F4F1EA;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}.box{background:#15151A;border:1px solid #22222A;border-radius:4px;padding:52px 56px;max-width:400px;width:100%;text-align:center}.logo{font-family:'Archivo Black',sans-serif;font-size:26px;margin-bottom:4px}.logo span{color:#1B9BD1}.client{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:#C8C4B8;margin-bottom:40px;opacity:.6}.hint{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#C8C4B8;opacity:.5;margin-bottom:14px}input{width:100%;background:#0A0A0C;border:1px solid #22222A;border-radius:2px;padding:15px 18px;font-size:16px;color:#F4F1EA;outline:none;margin-bottom:12px;letter-spacing:.12em;text-align:center;font-family:'Inter',sans-serif}input:focus{border-color:#1B9BD1}button{width:100%;background:#1B9BD1;border:none;border-radius:2px;padding:15px;font-size:11px;font-weight:700;color:#fff;cursor:pointer;font-family:'JetBrains Mono',monospace;letter-spacing:.18em;text-transform:uppercase}button:hover{opacity:.85}.err{font-family:'JetBrains Mono',monospace;font-size:10px;color:#C4521F;margin-top:12px;${showError ? '' : 'display:none'}}</style></head>
<body><form class="box" method="POST" autocomplete="off"><div class="logo">impact<span>able</span></div><div class="client">Geotab · Operating Room</div><div class="hint">Access Password</div><input type="password" name="password" autofocus placeholder="········"><button type="submit">Enter →</button><div class="err">Incorrect password</div></form></body></html>`;
}

export default async function middleware(request) {
  const SECRET = process.env.GATE_SECRET;

  // Fail open until the secret is configured, so deploying this can never lock
  // the site by itself. Once GATE_SECRET is set in Vercel, the gate is enforced.
  if (!SECRET) return next();

  const cookie = request.headers.get('cookie') || '';
  const authed = cookie.split(';').some((c) => c.trim() === 'gtab_auth=' + SECRET);
  if (authed) return next();

  if (request.method === 'POST') {
    let pw = '';
    try {
      const form = await request.formData();
      pw = (form.get('password') || '').toString();
    } catch (e) { /* fall through to login */ }

    if (pw && (await sha256hex(pw)) === HASH) {
      const url = new URL(request.url);
      return new Response(null, {
        status: 303,
        headers: {
          Location: url.pathname + url.search,
          'Set-Cookie': 'gtab_auth=' + SECRET + '; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000',
        },
      });
    }
    return new Response(loginPage(true), { status: 401, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }

  return new Response(loginPage(false), { status: 401, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
