'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Package, Clock, CheckCircle, Truck, XCircle, Eye } from 'lucide-react'
import Link from 'next/link'

interface OrderItem {
  id: string
  quantity: number
  price: number
  size?: string
  color?: string
  product: {
    id: string
    name: string
    image?: string
    category: string
  }
}

interface Order {
  id: string
  status: string
  total: number
  subtotal: number
  shipping: number
  paymentStatus: string
  trackingCode?: string
  createdAt: string
  updatedAt: string
  items: OrderItem[]
}

const statusConfig = {
  pending: {
    label: 'Pendente',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock
  },
  confirmed: {
    label: 'Confirmado',
    color: 'bg-blue-100 text-blue-800',
    icon: CheckCircle
  },
  processing: {
    label: 'Processando',
    color: 'bg-purple-100 text-purple-800',
    icon: Package
  },
  shipped: {
    label: 'Enviado',
    color: 'bg-indigo-100 text-indigo-800',
    icon: Truck
  },
  delivered: {
    label: 'Entregue',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle
  },
  cancelled: {
    label: 'Cancelado',
    color: 'bg-red-100 text-red-800',
    icon: XCircle
  }
}

export default function UserOrdersPage() {
  const { data: session } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (session?.user) {
      fetchOrders()
    }
  }, [session])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/user/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true
    return order.status === filter
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!session) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Você precisa estar logado para ver seus pedidos.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Meus Pedidos</h1>
        <p className="text-gray-600">Acompanhe o status dos seus pedidos</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
          {Object.entries(statusConfig).map(([status, config]) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {config.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === 'all' ? 'Nenhum pedido encontrado' : `Nenhum pedido ${statusConfig[filter as keyof typeof statusConfig]?.label.toLowerCase()}`}
          </h3>
          <p className="text-gray-600 mb-4">
            {filter === 'all' 
              ? 'Você ainda não fez nenhum pedido. Que tal começar agora?'
              : 'Não há pedidos com este status no momento.'
            }
          </p>
          <Link
            href="/produtos"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Ver Produtos
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const StatusIcon = statusConfig[order.status as keyof typeof statusConfig]?.icon || Package
            const statusStyle = statusConfig[order.status as keyof typeof statusConfig]?.color || 'bg-gray-100 text-gray-800'
            const statusLabel = statusConfig[order.status as keyof typeof statusConfig]?.label || order.status

            return (
              <div key={order.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Package className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Pedido #{order.id.slice(-8).toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusStyle}`}>
                      <StatusIcon className="h-4 w-4 mr-1" />
                      {statusLabel}
                    </span>
                    <Link
                      href={`/user/orders/${order.id}`}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Ver detalhes"
                    >
                      <Eye className="h-5 w-5" />
                    </Link>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="border-t pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        {item.product.image && (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="h-12 w-12 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            Qtd: {item.quantity} • {formatPrice(item.price)}
                          </p>
                          {(item.size || item.color) && (
                            <p className="text-xs text-gray-500">
                              {item.size && `Tamanho: ${item.size}`}
                              {item.size && item.color && ' • '}
                              {item.color && `Cor: ${item.color}`}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="flex items-center justify-center text-sm text-gray-500">
                        +{order.items.length - 3} item(s)
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      {order.trackingCode && (
                        <p>Código de rastreamento: <span className="font-mono">{order.trackingCode}</span></p>
                      )}
                      <p>Pagamento: <span className="capitalize">{order.paymentStatus}</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {formatPrice(order.total)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.items.length} item(s)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}