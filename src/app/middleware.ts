import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const PUBLIC_PATHS_FOR_UNAUTHENTICATED = [
    '/login',
    '/register',
    '/reset-password',
    '/forgot-password',
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/callback/google',
];

const AUTH_RESTRICTED_PUBLIC_PATHS = [
    '/login',
    '/register',
    '/reset-password',
];

const DEFAULT_AUTHENTICATED_REDIRECT = '/home';

export function middleware(req: NextRequest) {
    const token = req.cookies.get('auth-token')?.value;
    const { pathname } = req.nextUrl;

    if (pathname.startsWith('/_next/') || pathname.startsWith('/static/') || pathname.startsWith('/images/')) {
        return NextResponse.next();
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-very-secure-secret-key-for-jwt'); // PASTIKAN JWT_SECRET DISET DI .env

            if (AUTH_RESTRICTED_PUBLIC_PATHS.includes(pathname)) {
                return NextResponse.redirect(new URL(DEFAULT_AUTHENTICATED_REDIRECT, req.url));
            }
            const response = NextResponse.next();
            if (typeof decoded === 'object' && decoded) {
                // Set authentication headers that API endpoints expect
                response.headers.set('x-user-authenticated', 'true');
                if ('userId' in decoded) {
                    response.headers.set('x-user-id', String(decoded.userId));
                }
                if ('role' in decoded) {
                    response.headers.set('x-user-role', String(decoded.role));
                }
            }
            return response;

        } catch (err) {
            console.error('JWT verification failed (token was present but invalid):', (err as Error).message);
            const loginUrl = new URL('/login', req.url);
            loginUrl.searchParams.set('redirect', pathname);

            const response = NextResponse.redirect(loginUrl);
            response.cookies.delete('auth-token');
            return response;
        }
    }

    if (PUBLIC_PATHS_FOR_UNAUTHENTICATED.includes(pathname) || pathname.startsWith('/api/auth/')) { // Izinkan semua /api/auth/* untuk unauthenticated
        return NextResponse.next();
    }

    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
    ],
};