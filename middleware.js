import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/session';
import axios from 'axios';

// Rute yang dilindungi (hanya bisa diakses jika login)
const protectedRoutes = ['/dashboard'];
// Rute publik (bisa diakses tanpa login)
const publicRoutes = ['/'];

// Middleware utama
export default async function middleware(req) {
  const path = req.nextUrl.pathname;

  try {
    // 1. Mengecek status maintenance, kecuali di /login atau /dashboard
    if (!path.startsWith('/dashboard') && path !== '/login' && path !== '/maintenance') {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/maintenance/status/check`);
      const { isActive } = res.data;

      // Redirect ke /maintenance jika maintenance aktif
      if (isActive) {
        return NextResponse.redirect(new URL('/maintenance', req.url));
      }
    }

    // 2. Cek apakah rute dilindungi atau publik
    const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
    const isPublicRoute = publicRoutes.some((route) => path === route);

    // 3. Dekripsi sesi dari cookie
    const cookie = (await cookies()).get('session')?.value;
    const session = await decrypt(cookie);

    // 4. Redirect ke / jika pengguna tidak terautentikasi di rute yang dilindungi
    if (isProtectedRoute && (!session || !session.userId)) {
      return NextResponse.redirect(new URL('/', req.url));
    }

   

    // Lanjutkan ke halaman yang diminta
    return NextResponse.next();

  } catch (error) {
    console.error('Error in middleware:', error);
    // return NextResponse.next();
    return NextResponse.redirect(new URL('/maintenance', req.url));
  }
}

// Matcher: Tentukan path mana yang terkena middleware
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
