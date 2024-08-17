// import type { NextAuthConfig } from 'next-auth';
 
// export const authConfig = {
//   providers: [],
//   pages: {
//     signIn: '/login',
//   },
//   callbacks: {
//     authorized({ auth, request: { nextUrl } }) {
//       const isLoggedIn = !!auth?.user;      
//       const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      
//       if (isOnDashboard) {
//         if (isLoggedIn) return true;
//         return false; 
//       } else if (isLoggedIn) {
//         return Response.redirect(new URL('/dashboard', nextUrl));
//       }
//       return true;
//     },
//   },
// } satisfies NextAuthConfig;
import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  providers: [],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnBlog = nextUrl.pathname.startsWith('/blog');
      const isOnLogin = nextUrl.pathname.startsWith('/login');

      if (isLoggedIn) {
        if (isOnLogin) {
          return Response.redirect(new URL('/dashboard', nextUrl));
        }
        return true;
      }

      if (!isLoggedIn && (isOnDashboard || isOnBlog)) {
        return Response.redirect(new URL('/login', nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
