'use client'

import { useSession } from 'next-auth/react'
import { Calendar, Clock, User, Mail, Shield, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'

export default function UserDashboard() {
  const { data: session } = useSession()
  const { itemCount } = useCart()

  if (!session) return null

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-green-600 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {session.user.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Bem-vindo, {session.user.name}!
            </h1>
            <p className="text-gray-600">
              Gerencie sua conta e acompanhe suas atividades
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Perfil</p>
              <p className="text-2xl font-bold text-gray-900">Ativo</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tipo</p>
              <p className="text-2xl font-bold text-gray-900 capitalize">{session.user.role}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Membro desde</p>
              <p className="text-lg font-bold text-gray-900">2024</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Último acesso</p>
              <p className="text-lg font-bold text-gray-900">Agora</p>
            </div>
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações da Conta</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-600">Nome</p>
                <p className="text-gray-900">{session.user.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-600">Email</p>
                <p className="text-gray-900">{session.user.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-600">Tipo de Conta</p>
                <p className="text-gray-900 capitalize">{session.user.role}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="space-y-3">
            <a
              href="/user/profile"
              className="block w-full text-left px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="font-medium">Editar Perfil</div>
              <div className="text-sm text-green-600">Atualize suas informações pessoais</div>
            </a>
            <Link
              href="/user/orders"
              className="block w-full text-left px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="font-medium">Meus Pedidos</div>
              <div className="text-sm text-blue-600">Acompanhe seus pedidos</div>
            </Link>
            <Link
              href="/user/cart"
              className="block w-full text-left px-4 py-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <div className="font-medium flex items-center justify-between">
                <span>Meu Carrinho</span>
                {itemCount > 0 && (
                  <span className="bg-orange-200 text-orange-800 text-xs px-2 py-1 rounded-full">
                    {itemCount} {itemCount === 1 ? 'item' : 'itens'}
                  </span>
                )}
              </div>
              <div className="text-sm text-orange-600">Finalize suas compras</div>
            </Link>
            <Link
              href="/user/settings"
              className="block w-full text-left px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <div className="font-medium">Configurações</div>
              <div className="text-sm text-purple-600">Gerencie suas preferências</div>
            </Link>
            <Link
              href="/"
              className="block w-full text-left px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="font-medium">Voltar ao Site</div>
              <div className="text-sm text-gray-600">Navegar pelo Pindorama Soberano</div>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">Login realizado</p>
              <p className="text-xs text-gray-500">Agora mesmo</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">Conta criada</p>
              <p className="text-xs text-gray-500">Hoje</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}