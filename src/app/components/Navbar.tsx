'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { User, LogOut, Settings, Shield } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-black/90 sticky top-0 z-20">
      {/* Barra superior */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between relative">
        {/* Logo */}
        <Link href="/">
          <span className="text-2xl font-bold bg-gradient-to-r from-[#017500] to-[#FDC72C] bg-clip-text text-transparent">
            Pindorama Soberano
          </span>
        </Link>

        {/* Menu principal */}
        <div className="flex items-center space-x-8">
          <ul className="flex items-center space-x-8 text-white font-medium">
            <li><Link href="/" className="hover:text-gray-300 transition duration-200">Início</Link></li>
            <li>
              <button
                type="button"
                onClick={() => setOpen((x) => !x)}
                aria-expanded="false"
                className="hover:text-gray-300 transition duration-200 flex items-center gap-1"
              >
                Produtos
                <svg
                  className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </li>
            <li><Link href="/blog" className="hover:text-gray-300 transition duration-200">Blog</Link></li>
            <li><Link href="/sobre" className="hover:text-gray-300 transition duration-200">Sobre</Link></li>
          </ul>
          
          {/* Auth Section */}
          <AuthSection />
        </div>
      </div>

      {/* Menu dropdown ocupando toda a largura */}
      {open && (
        <div className="absolute left-0 w-full bg-black/90 z-10">
          <div className="container mx-auto px-4 py-6 grid grid-cols-4 gap-8">
            <div className="text-white">
              <h3 className="font-bold mb-4">Roupas</h3>
              <ul className="space-y-2">
                <li><Link href="/produtos/camisas" className="text-gray-300 hover:text-white transition duration-200">Camisas</Link></li>
                <li><Link href="/produtos/moletons" className="text-gray-300 hover:text-white transition duration-200">Moletons</Link></li>
              </ul>
            </div>
            <div className="text-white">
              <h3 className="font-bold mb-4">Arte</h3>
              <ul className="space-y-2">
                <li><Link href="/produtos/adesivos" className="text-gray-300 hover:text-white transition duration-200">Adesivos</Link></li>
                <li><Link href="/produtos/posters" className="text-gray-300 hover:text-white transition duration-200">Pôsteres</Link></li>
              </ul>
            </div>
            <div className="text-white">
              <h3 className="font-bold mb-4">Geral</h3>
              <ul className="space-y-2">
                <li><Link href="/produtos" className="text-gray-300 hover:text-white transition duration-200">Todos os Produtos</Link></li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

function AuthSection() {
  const { data: session, status } = useSession()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  if (status === 'loading') {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-20 bg-gray-600 rounded"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex items-center space-x-4">
        <Link 
          href="/auth/login" 
          className="text-white hover:text-gray-300 transition duration-200 flex items-center space-x-1"
        >
          <User className="h-4 w-4" />
          <span>Entrar</span>
        </Link>
        <Link 
          href="/auth/register" 
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
        >
          Cadastrar
        </Link>
      </div>
    )
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setUserMenuOpen(!userMenuOpen)}
        aria-expanded="false"
        className="flex items-center space-x-2 text-white hover:text-gray-300 transition duration-200"
      >
        <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center">
          <span className="text-sm font-medium">
            {session.user.name?.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="hidden md:block">{session.user.name}</span>
        {session.user.role?.toLowerCase() === 'admin' && (
          <span title="Administrador">
            <Shield className="h-4 w-4 text-yellow-400" />
          </span>
        )}
      </button>

      {userMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
            <p className="text-xs text-gray-500">{session.user.email}</p>
            <p className="text-xs text-gray-500 capitalize">{session.user.role}</p>
          </div>
          
          {session.user.role?.toLowerCase() === 'admin' ? (
            <Link
              href="/admin/dashboard"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setUserMenuOpen(false)}
            >
              <Shield className="h-4 w-4 mr-2" />
              Painel Admin
            </Link>
          ) : (
            <Link
              href="/user/dashboard"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setUserMenuOpen(false)}
            >
              <User className="h-4 w-4 mr-2" />
              Minha Conta
            </Link>
          )}
          
          <Link
            href={session.user.role?.toLowerCase() === 'admin' ? '/admin/dashboard' : '/user/profile'}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setUserMenuOpen(false)}
          >
            <Settings className="h-4 w-4 mr-2" />
            {session.user.role?.toLowerCase() === 'admin' ? 'Configurações' : 'Perfil'}
          </Link>
          
          <button
            type="button"
            onClick={() => {
              setUserMenuOpen(false)
              handleSignOut()
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </button>
        </div>
      )}
    </div>
  )
}
