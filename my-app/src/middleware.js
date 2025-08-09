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

export function middleware(request) {
  const pathname = request.nextUrl.pathname;
  const role = request.cookies.get('userRole')?.value?.toLowerCase();

  console.log('Cookies:', request.cookies.getAll());
  console.log('Role:', role);
  console.log('Pathname:', pathname);

  if (!role) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // ✅ Check if path starts with an admin prefix
  const isAdminRoute = adminPrefixes.some(prefix =>
    pathname.startsWith(prefix)
  );

  const isManagerRoute = managerPrefixes.some(prefix =>
    pathname.startsWith(prefix)
  );

if (isAdminRoute && !isManagerRoute) {
  if (role !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }
}

if (isManagerRoute && !isAdminRoute) {
  if (role !== 'manager') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }
}

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/new-requirement',
    '/new-requirement/:path*',
    '/testing-unit',
    '/testing-unit/:path*',
    '/prev-production',
    '/prev-production/:path*',
    '/sec-operation',
    '/sec-operation/:path*',
    '/workers-allotted',
    '/workers-allotted/:path*',
    '/dispatch',
    '/dispatch/:path*',
    '/work-in-progress',
    '/work-in-progress/:path*',
    '/dashboard',
    '/notes',
    '/profile',
    '/stoppage',
    '/new-requirement-admin/:path*',
    '/testing-unit-admin/:path*',
    '/prev-production-admin',
    '/prev-production-admin/:path*',
    '/sec-operation-admin',
    '/sec-operation-admin/:path*',
    '/workers-allotted-admin',
    '/workers-allotted-admin/:path*',
    '/dispatch-admin',
    '/dispatch-admin/:path*',
    '/work-in-progress-admin',
    '/work-in-progress-admin/:path*',
    '/notes-admin',
    '/stoppage-admin'
  ],
};

