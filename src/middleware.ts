import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
    const isAdminPage = req.nextUrl.pathname.startsWith('/admin')

    // Rediriger les utilisateurs connectés qui tentent d'accéder aux pages d'auth
    if (isAuthPage && isAuth) {
      if (token.role === 'ADMIN' || token.role === 'RECRUITER') {
        return NextResponse.redirect(new URL('/admin', req.url))
      }
      return NextResponse.redirect(new URL('/', req.url))
    }

    // Protéger les pages admin
    if (isAdminPage && (!isAuth || (token.role !== 'ADMIN' && token.role !== 'RECRUITER'))) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Toujours autoriser les routes API NextAuth
        if (pathname.startsWith('/api/auth')) {
          return true
        }

        // Autoriser les autres routes API publiques
        if (pathname.startsWith('/api')) {
          return true
        }

        // Autoriser les pages d'authentification
        if (pathname.startsWith('/auth')) {
          return true
        }

        // Autoriser les pages publiques (accueil, etc.)
        if (pathname === '/' || pathname.startsWith('/_next') || pathname === '/favicon.ico') {
          return true
        }

        // Protéger les pages admin
        if (pathname.startsWith('/admin')) {
          return !!token && (token.role === 'ADMIN' || token.role === 'RECRUITER')
        }

        // Autoriser toutes les autres pages publiques
        return true
      }
    }
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
}
