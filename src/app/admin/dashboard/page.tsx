'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { 
  Users, 
  Package, 
  FileText, 
  TrendingUp, 
  Activity,
  Calendar,
  Eye,
  ShoppingCart
} from 'lucide-react'

interface DashboardStats {
  totalUsers: number
  totalProducts: number
  totalPosts: number
  monthlyGrowth: number
  recentActivity: Array<{
    id: string
    type: string
    description: string
    timestamp: string
  }>
}

export default function AdminDashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/dashboard', { cache: 'no-store' })
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total de Usuários',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      title: 'Produtos',
      value: stats?.totalProducts || 0,
      icon: Package,
      color: 'bg-green-500',
      change: '+8%',
    },
    {
      title: 'Posts do Blog',
      value: stats?.totalPosts || 0,
      icon: FileText,
      color: 'bg-purple-500',
      change: '+15%',
    },
    {
      title: 'Crescimento Mensal',
      value: `${stats?.monthlyGrowth || 0}%`,
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: '+3%',
    },
  ]

  const recentActivities = stats?.recentActivity || [
    {
      id: '1',
      type: 'user',
      description: 'Novo usuário registrado: João Silva',
      timestamp: '2 horas atrás'
    },
    {
      id: '2',
      type: 'product',
      description: 'Produto "Açaí Premium" foi atualizado',
      timestamp: '4 horas atrás'
    },
    {
      id: '3',
      type: 'blog',
      description: 'Novo post publicado: "Sustentabilidade na Amazônia"',
      timestamp: '1 dia atrás'
    },
    {
      id: '4',
      type: 'order',
      description: 'Novo pedido #1234 recebido',
      timestamp: '2 dias atrás'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Bem-vindo, {session?.user.name}!
            </h1>
            <p className="text-gray-600 mt-1">
              Aqui está um resumo das atividades do sistema
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Último acesso</p>
            <p className="text-lg font-semibold text-gray-900">
              {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                  <p className="text-sm text-green-600 mt-1">{card.change} este mês</p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Atividade Recente</h2>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const getIcon = (type: string) => {
                switch (type) {
                  case 'user': return <Users className="h-4 w-4 text-blue-500" />
                  case 'product': return <Package className="h-4 w-4 text-green-500" />
                  case 'blog': return <FileText className="h-4 w-4 text-purple-500" />
                  case 'order': return <ShoppingCart className="h-4 w-4 text-orange-500" />
                  default: return <Activity className="h-4 w-4 text-gray-500" />
                }
              }

              return (
                <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 mt-0.5">
                    {getIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <Users className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-blue-900">Gerenciar Usuários</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <Package className="h-8 w-8 text-green-600 mb-2" />
              <span className="text-sm font-medium text-green-900">Adicionar Produto</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <FileText className="h-8 w-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-purple-900">Novo Post</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
              <Eye className="h-8 w-8 text-orange-600 mb-2" />
              <span className="text-sm font-medium text-orange-900">Ver Site</span>
            </button>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Status do Sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <h3 className="text-sm font-medium text-gray-900">Servidor</h3>
            <p className="text-xs text-gray-500">Online</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <h3 className="text-sm font-medium text-gray-900">Banco de Dados</h3>
            <p className="text-xs text-gray-500">Conectado</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            </div>
            <h3 className="text-sm font-medium text-gray-900">Backup</h3>
            <p className="text-xs text-gray-500">Agendado</p>
          </div>
        </div>
      </div>
    </div>
  )
}