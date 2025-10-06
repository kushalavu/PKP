import { NextResponse } from 'next/server';

const adminPrefixes = [
  '/new-requirement-admin',
  '/testing-unit-admin',
  '/prev-production-admin',
  '/sec-operation-admin',
  '/workers-allotted-admin',
  '/dispatch-admin',
  '/work-in-progress-admin',
  '/notes-admin',
  '/stoppage-admin'
];

const managerPrefixes = [
  '/new-requirement',
  '/testing-unit',
  '/prev-production',
  '/sec-operation',
  '/workers-allotted',
  '/dispatch',
  '/work-in-progress',
  '/notes',
  '/stoppage'
];

// Public routes accessible without login
const publicRoutes = ['/', '/login', '/forgot-password'];

export function middleware(req) {
  const { nextUrl, cookies } = req;
  const pathname = nextUrl.pathname.toLowerCase();

  const token = cookies.get('next-auth.session-token')?.value;
  const role = cookies.get('userRole')?.value?.toLowerCase();

  // 1 Allow public routes regardless of session
  if (publicRoutes.includes(pathname)) {
    // If session exists, redirect away from / or /login
    if (token && role && (pathname === '/' || pathname === '/login')) {
      return NextResponse.redirect(new URL(
        role === 'admin' ? '/new-requirement-admin' : '/new-requirement',
        req.url
      ));
    }
    return NextResponse.next();
  }

  // 2 Block all other routes if session not present
  if (!token || !role) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Check if path starts with an admin prefix
  const isAdminRoute = adminPrefixes.some(prefix =>
    pathname.startsWith(prefix)
  );

  const isManagerRoute = managerPrefixes.some(prefix =>
    pathname.startsWith(prefix)
  );

if (isAdminRoute && !isManagerRoute) {
  if (role !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }
}

if (isManagerRoute && !isAdminRoute) {
  if (role !== 'manager') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }
}


  // 4 All other routes allowed
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/', '/login', '/forgot-password',
    '/new-requirement', '/new-requirement/:path*',
    '/testing-unit', '/testing-unit/:path*',
    '/prev-production', '/prev-production/:path*',
    '/sec-operation', '/sec-operation/:path*',
    '/workers-allotted', '/workers-allotted/:path*',
    '/dispatch', '/dispatch/:path*',
    '/work-in-progress', '/work-in-progress/:path*',
    '/notes', '/notes/:path*',
    '/stoppage', '/stoppage/:path*',
    '/dashboard/:path*', '/profile/:path*',
    '/new-requirement-admin/:path*',
    '/testing-unit-admin/:path*',
    '/prev-production-admin', '/prev-production-admin/:path*',
    '/sec-operation-admin', '/sec-operation-admin/:path*',
    '/workers-allotted-admin', '/workers-allotted-admin/:path*',
    '/dispatch-admin', '/dispatch-admin/:path*',
    '/work-in-progress-admin', '/work-in-progress-admin/:path*',
    '/notes-admin', '/stoppage-admin'
  ]
};
