import type { NextAuthConfig } from 'next-auth';
import type { NextRequest } from 'next/server';
import type { Session } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({
      auth,
      request: { nextUrl },
    }: {
      auth: Session | null;
      request: NextRequest;
    }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard'); // 👈 corregí el typo "startsWidth"

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // redirige a usuarios no autenticados a login
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [], // vacío por ahora
} satisfies NextAuthConfig;
