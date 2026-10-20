/**
 * Cloudflare Worker: Portfolio Edge API
 * Serves projects, credentials, and release status from Cloudflare D1.
 * Bound to env.DB (Cloudflare D1 Database).
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Set up standard CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Cache-Control': 'public, max-age=60, s-maxage=300' // Edge cache 5 min
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // 1. Health check
      if (path === '/api/health') {
        return Response.json({ status: 'ok', provider: 'cloudflare-d1', timestamp: new Date().toISOString() }, { headers: corsHeaders });
      }

      // 2. GET /api/projects
      if (path === '/api/projects' && request.method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM projects ORDER BY sort_order ASC').all();
        const formatted = results.map(r => ({
          ...r,
          stack: JSON.parse(r.stack_json || '[]'),
          links: JSON.parse(r.links_json || '[]'),
          sources: JSON.parse(r.sources_json || '[]')
        }));
        return Response.json(formatted, { headers: corsHeaders });
      }

      // 3. GET /api/credentials
      if (path === '/api/credentials' && request.method === 'GET') {
        const category = url.searchParams.get('category');
        let query = 'SELECT * FROM credentials';
        let params = [];
        if (category && category !== 'all') {
          query += ' WHERE category = ?';
          params.push(category);
        }
        query += ' ORDER BY sort_order ASC';
        
        const { results } = await env.DB.prepare(query).bind(...params).all();
        return Response.json(results, { headers: corsHeaders });
      }

      // 4. GET /api/credentials/categories
      if (path === '/api/credentials/categories' && request.method === 'GET') {
        const { results } = await env.DB.prepare('SELECT DISTINCT category, category_label FROM credentials ORDER BY category_label ASC').all();
        return Response.json(results, { headers: corsHeaders });
      }

      // 5. GET /api/releases/latest
      if (path === '/api/releases/latest' && request.method === 'GET') {
        const row = await env.DB.prepare('SELECT * FROM releases WHERE is_active = 1 ORDER BY created_at DESC LIMIT 1').first();
        if (!row) {
          return Response.json({ available: false }, { status: 404, headers: corsHeaders });
        }
        return Response.json(row, { headers: corsHeaders });
      }

      return new Response('Not Found', { status: 404, headers: corsHeaders });
    } catch (err) {
      return Response.json({ error: err.message }, { status: 500, headers: corsHeaders });
    }
  }
};
