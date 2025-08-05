import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Área administrativa - apenas admins
    if (pathname.startsWith('/admin')) {
      if (token?.role !== 'admin') {
        return NextResponse.redirect(new URL('/auth/login', req.url))
      }
    }

    // Área do usuário - usuários logados
    if (pathname.startsWith('/user')) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/login', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Permitir acesso às páginas de auth
        if (pathname.startsWith('/auth')) {
          return true
        }
        
        // Área administrativa - apenas admins
        if (pathname.startsWith('/admin')) {
          return token?.role === 'admin'
        }
        
        // Área do usuário - usuários logados
        if (pathname.startsWith('/user')) {
          return !!token
        }
        
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/user/:path*', '/admin/:path*', '/auth/:path*']
}