import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/dashboard/:path*', // Protect the dashboard
    '/',                // Allow homepage redirection if logged in
  ],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // Redirect authenticated users away from `/sign-in` and `/sign-up` to `/dashboard`
  if (
    token && 
    (url.pathname === '/sign-in' || url.pathname === '/sign-up')
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect unauthenticated users trying to access the dashboard
  if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Allow authenticated users to access other protected routes
  return NextResponse.next();
}
