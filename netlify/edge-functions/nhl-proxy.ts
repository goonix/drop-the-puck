export default async (request: Request) => {
  const url = new URL(request.url);
  // Strip /api/nhl prefix, forward the rest (path + query) to the NHL API
  const path = url.pathname.replace('/api/nhl', '');
  const target = `https://api-web.nhle.com${path}${url.search}`;

  // fetch follows redirects by default, so /standings/now → /standings/YYYY-MM-DD is handled
  const upstream = await fetch(target, {
    headers: { 'User-Agent': 'drop-the-puck/1.0' },
  });

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      'Content-Type': upstream.headers.get('Content-Type') ?? 'application/json',
      'Cache-Control': upstream.headers.get('Cache-Control') ?? 'no-store',
    },
  });
};

export const config = { path: '/api/nhl/*' };
