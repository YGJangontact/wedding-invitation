const origin = 'https://ygjangontact.github.io';
export default {
  async fetch(request, env) {
    const headers = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'no-store'
    };
    const reply = (data, status = 200) => Response.json(data, {headers, status});
    const path = new URL(request.url).pathname;
    const match = path.match(/^\/messages\/([1-9]\d*)$/);
    if (path !== '/messages' && !match) return reply({}, 404);
    if (request.method === 'OPTIONS') return new Response(null, {status: 204, headers});
    if (request.method === 'GET' && !match) {
      const requested = new URL(request.url).searchParams.get('page');
      if (requested !== null) {
        const number = Number(requested);
        if (!Number.isSafeInteger(number) || number < 1) return reply({}, 400);
        const pageSize = 5;
        const {total} = await env.DB.prepare('SELECT COUNT(*) AS total FROM messages').first();
        const pages = Math.max(1, Math.ceil(total / pageSize));
        const page = Math.min(number, pages);
        const {results} = await env.DB.prepare(
          'SELECT id, name, message, (password_hash IS NOT NULL) AS editable FROM messages ORDER BY id DESC LIMIT ? OFFSET ?'
        ).bind(pageSize, (page - 1) * pageSize).all();
        return reply({items: results, page, pages});
      }
      const {results} = await env.DB.prepare('SELECT id, name, message, (password_hash IS NOT NULL) AS editable FROM messages ORDER BY id DESC LIMIT 30').all();
      return reply(results);
    }
    const editing = match && ['PATCH', 'DELETE'].includes(request.method);
    if (!(request.method === 'POST' && !match) && !editing) return reply({}, 405);
    if (request.headers.get('Origin') !== origin) return reply({}, 403);
    if (!request.headers.get('Content-Type')?.startsWith('application/json')) return reply({}, 415);
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const limiter = editing ? env.AUTH_LIMIT : env.POST_LIMIT;
    if (!(await limiter.limit({key:ip})).success) return reply({}, 429);
    const raw = await request.text();
    if (raw.length > 4096) return reply({}, 413);
    let body;
    try { body = JSON.parse(raw); } catch { return reply({},400); }
    const password = typeof body?.password === 'string' ? body.password : '';
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const message = typeof body?.message === 'string' ? body.message.trim() : '';
    if (request.method !== 'DELETE' && (!name || !message || name.length > 20 || message.length > 200)) return reply({},400);
    if (editing) {
      const row = await env.DB.prepare('SELECT id, password_hash, salt FROM messages WHERE id = ?').bind(Number(match[1])).first();
      if (!row) return reply({},404);
      let valid = false;
      if (request.method === 'DELETE' && typeof body?.adminToken === 'string' && env.ADMIN_TOKEN) {
        valid = equal(await digest(body.adminToken), await digest(env.ADMIN_TOKEN));
      } else if (row.password_hash && password.length >= 6 && password.length <= 128) {
        valid = equal(await hashPassword(password,row.salt),row.password_hash);
      }
      if (!valid) return reply({},403);
      if (request.method === 'DELETE') await env.DB.prepare('DELETE FROM messages WHERE id = ?').bind(row.id).run();
      else await env.DB.prepare('UPDATE messages SET name = ?, message = ? WHERE id = ?').bind(name,message,row.id).run();
      return reply({ok:true});
    }
    if (password.length < 6 || password.length > 128) return reply({},400);
    const salt = hex(crypto.getRandomValues(new Uint8Array(16)));
    const hash = await hashPassword(password,salt);
    await env.DB.prepare('INSERT INTO messages(name,message,password_hash,salt) VALUES (?,?,?,?)').bind(name,message,hash,salt).run();
    return reply({ok:true},201);
  }
};
const hex = bytes => Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
async function digest(value) { return hex(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)))); }
function equal(a,b) { if(a.length!==b.length) return false; let diff=0; for(let i=0;i<a.length;i++) diff|=a.charCodeAt(i)^b.charCodeAt(i); return diff===0; }
async function hashPassword(password,salt) {
 const key = await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);
 return hex(new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',salt:new TextEncoder().encode(salt),iterations:100000,hash:'SHA-256'},key,256)));
}
