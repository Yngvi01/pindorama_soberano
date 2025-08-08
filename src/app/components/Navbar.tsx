'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useCart } from '@/contexts/CartContext'
import { User, LogOut, Settings, Shield, Menu, X, ChevronDown, Search, ShoppingBag, Heart } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { itemCount } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-green-100' 
        : 'bg-gradient-to-r from-green-900/95 via-green-800/95 to-green-900/95 backdrop-blur-md'
    }`}>
      {/* Barra superior */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 group">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
                <span className="text-green-900 font-bold text-lg lg:text-xl">P</span>
              </div>
              <span className={`text-xl lg:text-2xl font-bold transition-colors duration-300 ${
                scrolled 
                  ? 'bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent'
                  : 'text-white'
              }`}>
                Pindorama <span className={scrolled ? 'text-yellow-600' : 'text-yellow-400'}>Soberano</span>
              </span>
            </div>
          </Link>

          {/* Menu principal - Desktop */}
          <div className="hidden lg:flex items-center space-x-8">
            <ul className="flex items-center space-x-6">
              <li>
                <Link 
                  href="/" 
                  className={`font-medium transition-all duration-200 hover:scale-105 ${
                    scrolled 
                      ? 'text-gray-700 hover:text-green-600'
                      : 'text-white hover:text-yellow-400'
                  }`}
                >
                  Início
                </Link>
              </li>
              <li className="relative">
                <button
                  type="button"
                  onClick={() => setOpen((x) => !x)}
                  className={`font-medium transition-all duration-200 flex items-center gap-1 hover:scale-105 ${
                    scrolled 
                      ? 'text-gray-700 hover:text-green-600'
                      : 'text-white hover:text-yellow-400'
                  }`}
                >
                  Produtos
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                </button>
              </li>
              <li>
                <Link 
                  href="/blog" 
                  className={`font-medium transition-all duration-200 hover:scale-105 ${
                    scrolled 
                      ? 'text-gray-700 hover:text-green-600'
                      : 'text-white hover:text-yellow-400'
                  }`}
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  href="/sobre" 
                  className={`font-medium transition-all duration-200 hover:scale-105 ${
                    scrolled 
                      ? 'text-gray-700 hover:text-green-600'
                      : 'text-white hover:text-yellow-400'
                  }`}
                >
                  Sobre
                </Link>
              </li>
            </ul>
            
            {/* Ações rápidas */}
            <div className="flex items-center space-x-3">
              <button className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                scrolled 
                  ? 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                  : 'text-white hover:text-yellow-400 hover:bg-white/10'
              }`}>
                <Search className="h-5 w-5" />
              </button>
              <button className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                scrolled 
                  ? 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                  : 'text-white hover:text-yellow-400 hover:bg-white/10'
              }`}>
                <Heart className="h-5 w-5" />
              </button>
              <Link href="/user/cart" className={`p-2 rounded-full transition-all duration-200 hover:scale-110 relative ${
                scrolled 
                  ? 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                  : 'text-white hover:text-yellow-400 hover:bg-white/10'
              }`}>
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </Link>
            </div>
            
            {/* Auth Section */}
            <AuthSection scrolled={scrolled} />
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                scrolled 
                  ? 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                  : 'text-white hover:text-yellow-400 hover:bg-white/10'
              }`}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu dropdown - Desktop */}
      {open && (
        <div className="absolute left-0 w-full bg-white/95 backdrop-blur-md shadow-xl border-t border-green-100 z-40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-center">
              <div className="grid grid-cols-4 gap-12">
                <div className="text-center">
                  <Link href="/produtos?categoria=camisetas" onClick={() => setOpen(false)} className="group block">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center group-hover:from-green-200 group-hover:to-green-300 transition-all duration-200">
                      <span className="text-2xl">👕</span>
                    </div>
                    <h3 className="font-bold text-green-800 text-lg mb-2 group-hover:text-green-600 transition-colors duration-200">Camisetas</h3>
                    <p className="text-sm text-gray-600">Camisetas confortáveis e estilosas</p>
                  </Link>
                </div>
                <div className="text-center">
                  <Link href="/produtos?categoria=moletons" onClick={() => setOpen(false)} className="group block">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center group-hover:from-green-200 group-hover:to-green-300 transition-all duration-200">
                      <span className="text-2xl">🧥</span>
                    </div>
                    <h3 className="font-bold text-green-800 text-lg mb-2 group-hover:text-green-600 transition-colors duration-200">Moletons</h3>
                    <p className="text-sm text-gray-600">Moletons quentinhos e modernos</p>
                  </Link>
                </div>
                <div className="text-center">
                  <Link href="/produtos?categoria=adesivos" onClick={() => setOpen(false)} className="group block">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center group-hover:from-green-200 group-hover:to-green-300 transition-all duration-200">
                      <span className="text-2xl">🏷️</span>
                    </div>
                    <h3 className="font-bold text-green-800 text-lg mb-2 group-hover:text-green-600 transition-colors duration-200">Adesivos</h3>
                    <p className="text-sm text-gray-600">Adesivos únicos e criativos</p>
                  </Link>
                </div>
                <div className="text-center">
                  <Link href="/produtos" onClick={() => setOpen(false)} className="group block">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center group-hover:from-yellow-200 group-hover:to-yellow-300 transition-all duration-200">
                      <span className="text-2xl">🛍️</span>
                    </div>
                    <h3 className="font-bold text-green-800 text-lg mb-2 group-hover:text-green-600 transition-colors duration-200">Todos os Produtos</h3>
                    <p className="text-sm text-gray-600">Veja toda nossa coleção</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-green-100">
          <div className="px-4 py-6 space-y-4">
            <Link href="/" className="block text-gray-700 hover:text-green-600 font-medium py-2">Início</Link>
            <Link href="/produtos" className="block text-gray-700 hover:text-green-600 font-medium py-2">Produtos</Link>
            <Link href="/blog" className="block text-gray-700 hover:text-green-600 font-medium py-2">Blog</Link>
            <Link href="/sobre" className="block text-gray-700 hover:text-green-600 font-medium py-2">Sobre</Link>
            <div className="pt-4 border-t border-green-100">
              <AuthSection scrolled={true} mobile={true} />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

function AuthSection({ scrolled, mobile = false }: { scrolled: boolean; mobile?: boolean }) {
  const { data: session, status } = useSession()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  if (status === 'loading') {
    return (
      <div className="animate-pulse">
        <div className={`h-8 w-20 rounded ${scrolled ? 'bg-gray-300' : 'bg-gray-600'}`}></div>
      </div>
    )
  }

  if (!session) {
    if (mobile) {
      return (
        <div className="space-y-3">
          <Link 
            href="/auth/login" 
            className="flex items-center space-x-2 text-gray-700 hover:text-green-600 font-medium py-2"
          >
            <User className="h-4 w-4" />
            <span>Entrar</span>
          </Link>
          <Link 
            href="/auth/register" 
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
          >
            Cadastrar
          </Link>
        </div>
      )
    }

    return (
      <div className="flex items-center space-x-3">
        <Link 
          href="/auth/login" 
          className={`flex items-center space-x-2 transition-all duration-200 hover:scale-105 ${
            scrolled 
              ? 'text-gray-700 hover:text-green-600'
              : 'text-white hover:text-yellow-400'
          }`}
        >
          <User className="h-4 w-4" />
          <span className="font-medium">Entrar</span>
        </Link>
        <Link 
          href="/auth/register" 
          className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl hover:scale-105"
        >
          Cadastrar
        </Link>
      </div>
    )
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  if (mobile) {
    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-3 py-2">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold">
              {session.user.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{session.user.name}</p>
            <p className="text-sm text-gray-500">{session.user.email}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          {session.user.role?.toLowerCase() === 'admin' ? (
            <Link
              href="/admin/dashboard"
              className="flex items-center space-x-2 text-gray-700 hover:text-green-600 py-2"
            >
              <Shield className="h-4 w-4" />
              <span>Painel Admin</span>
            </Link>
          ) : (
            <Link
              href="/user/dashboard"
              className="flex items-center space-x-2 text-gray-700 hover:text-green-600 py-2"
            >
              <User className="h-4 w-4" />
              <span>Minha Conta</span>
            </Link>
          )}
          
          <Link
            href={session.user.role?.toLowerCase() === 'admin' ? '/admin/dashboard' : '/user/profile'}
            className="flex items-center space-x-2 text-gray-700 hover:text-green-600 py-2"
          >
            <Settings className="h-4 w-4" />
            <span>{session.user.role?.toLowerCase() === 'admin' ? 'Configurações' : 'Perfil'}</span>
          </Link>
          
          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center space-x-2 text-red-600 hover:text-red-700 py-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Sair</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setUserMenuOpen(!userMenuOpen)}
        className={`flex items-center space-x-3 transition-all duration-200 hover:scale-105 ${
          scrolled 
            ? 'text-gray-700 hover:text-green-600'
            : 'text-white hover:text-yellow-400'
        }`}
      >
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-200">
          <span className="text-white font-bold">
            {session.user.name?.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="hidden lg:block text-left">
          <p className="font-medium text-sm">{session.user.name}</p>
          <p className={`text-xs ${
            scrolled ? 'text-gray-500' : 'text-green-200'
          }`}>
            {session.user.role}
          </p>
        </div>
        {session.user.role?.toLowerCase() === 'admin' && (
          <Shield className={`h-4 w-4 ${
            scrolled ? 'text-yellow-600' : 'text-yellow-400'
          }`} />
        )}
      </button>

      {userMenuOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-green-100 py-2 z-50">
          <div className="px-4 py-3 border-b border-green-100">
            <p className="font-medium text-gray-900">{session.user.name}</p>
            <p className="text-sm text-gray-500">{session.user.email}</p>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
              {session.user.role}
            </span>
          </div>
          
          {session.user.role?.toLowerCase() === 'admin' ? (
            <Link
              href="/admin/dashboard"
              className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200"
              onClick={() => setUserMenuOpen(false)}
            >
              <Shield className="h-4 w-4 mr-3 text-green-600" />
              Painel Admin
            </Link>
          ) : (
            <Link
              href="/user/dashboard"
              className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200"
              onClick={() => setUserMenuOpen(false)}
            >
              <User className="h-4 w-4 mr-3 text-green-600" />
              Minha Conta
            </Link>
          )}
          
          <Link
            href={session.user.role?.toLowerCase() === 'admin' ? '/admin/dashboard' : '/user/profile'}
            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200"
            onClick={() => setUserMenuOpen(false)}
          >
            <Settings className="h-4 w-4 mr-3 text-green-600" />
            {session.user.role?.toLowerCase() === 'admin' ? 'Configurações' : 'Perfil'}
          </Link>
          
          <div className="border-t border-green-100 mt-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setUserMenuOpen(false)
                handleSignOut()
              }}
              className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
