const origin = 'https://ygjangontact.github.io';
export default {
  async fetch(request, env) {
    const headers = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'no-store'
    };
    const reply = (data, status = 200) => Response.json(data, {headers, status});
    if (new URL(request.url).pathname !== '/messages') return reply({}, 404);
    if (request.method === 'OPTIONS') return new Response(null, {status: 204, headers});
    if (request.method === 'GET') {
      const {results} = await env.DB.prepare('SELECT name, message FROM messages ORDER BY id DESC LIMIT 30').all();
      return reply(results);
    }
    if (request.method !== 'POST') return reply({}, 405);
    if (request.headers.get('Origin') !== origin) return reply({}, 403);
    if (!request.headers.get('Content-Type')?.startsWith('application/json')) return reply({}, 415);
    const allowed = await env.POST_LIMIT.limit({key: request.headers.get('CF-Connecting-IP') || 'unknown'});
    if (!allowed.success) return reply({}, 429);
    const body = await request.json().catch(() => null);
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const message = typeof body?.message === 'string' ? body.message.trim() : '';
    if (!name || !message || name.length > 20 || message.length > 200) return reply({}, 400);
    await env.DB.prepare('INSERT INTO messages(name, message) VALUES (?, ?)').bind(name, message).run();
    return reply({name, message}, 201);
  }
};
