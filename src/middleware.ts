import { auth } from '@/app/api/auth/[...nextauth]/route'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const session = await auth()
  
  // Permitir acesso às páginas de auth e API
  if (pathname.startsWith('/api') || pathname.startsWith('/login') || pathname.startsWith('/register')) {
    return NextResponse.next()
  }
  
  // Área administrativa - apenas admins
  if (pathname.startsWith('/admin')) {
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }
  
  // Área do usuário - usuários logados
  if (pathname.startsWith('/user')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/user/:path*', '/admin/:path*']
}