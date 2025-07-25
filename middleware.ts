import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/') {
    return NextResponse.rewrite(new URL('/user', request.url));
  }
  if (request.nextUrl.pathname === '/aigc') {
    return NextResponse.rewrite(new URL('/user/aigc', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
}; 