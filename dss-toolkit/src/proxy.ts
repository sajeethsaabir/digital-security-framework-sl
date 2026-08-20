import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const CSP_DIRECTIVES = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
].join('; ');

export function proxy(request: NextRequest) {
  // Static export runs without a server, so no proxy is applied.
  if (process.env.STATIC_EXPORT === 'true') {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  const pathname = request.nextUrl.pathname;

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Content-Security-Policy', CSP_DIRECTIVES);
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');

  // CSRF: origin check for state-changing API requests
  if (request.method === 'POST' && pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/')) {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json') && origin) {
      try {
        const originUrl = new URL(origin);
        if (originUrl.host !== host) {
          return NextResponse.json({ error: 'CSRF validation failed' }, { status: 403 });
        }
      } catch {
        return NextResponse.json({ error: 'Invalid origin' }, { status: 400 });
      }
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};