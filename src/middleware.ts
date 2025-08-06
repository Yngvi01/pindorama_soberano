import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const session = await auth()
  
  // Permitir acesso às páginas de auth e API
  if (pathname.startsWith('/api') || pathname.startsWith('/auth')) {
    return NextResponse.next()
  }
  
  // Área administrativa - apenas admins
  if (pathname.startsWith('/admin')) {
    if (!session || session.user?.role?.toLowerCase() !== 'admin') {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
  }
  
  // Área do usuário - usuários logados
  if (pathname.startsWith('/user')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/user/:path*', '/admin/:path*']
}