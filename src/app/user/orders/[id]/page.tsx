'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Package, Clock, CheckCircle, Truck, XCircle, ArrowLeft, MapPin, CreditCard } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface OrderItem {
  id: string
  quantity: number
  price: number
  size?: string
  color?: string
  product: {
    id: string
    name: string
    description?: string
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
  tax: number
  paymentMethod?: string
  paymentStatus: string
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  billingAddress?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  trackingCode?: string
  notes?: string
  createdAt: string
  updatedAt: string
  items: OrderItem[]
}

const statusConfig = {
  pending: {
    label: 'Pendente',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock,
    description: 'Seu pedido foi recebido e está aguardando confirmação.'
  },
  confirmed: {
    label: 'Confirmado',
    color: 'bg-blue-100 text-blue-800',
    icon: CheckCircle,
    description: 'Seu pedido foi confirmado e está sendo preparado.'
  },
  processing: {
    label: 'Processando',
    color: 'bg-purple-100 text-purple-800',
    icon: Package,
    description: 'Seu pedido está sendo processado e embalado.'
  },
  shipped: {
    label: 'Enviado',
    color: 'bg-indigo-100 text-indigo-800',
    icon: Truck,
    description: 'Seu pedido foi enviado e está a caminho.'
  },
  delivered: {
    label: 'Entregue',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
    description: 'Seu pedido foi entregue com sucesso!'
  },
  cancelled: {
    label: 'Cancelado',
    color: 'bg-red-100 text-red-800',
    icon: XCircle,
    description: 'Este pedido foi cancelado.'
  }
}

export default function OrderDetailsPage() {
  const { data: session } = useSession()
  const params = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrder = useCallback(async () => {
    try {
      const response = await fetch(`/api/user/orders/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data)
      } else {
        setError('Erro ao carregar pedido')
      }
    } catch {
      setError('Erro ao carregar pedido')
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    if (session?.user && params.id) {
      fetchOrder()
    }
  }, [session, params.id, fetchOrder])

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
        <p className="text-gray-600">Você precisa estar logado para ver este pedido.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 animate-pulse">
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <Link
          href="/user/orders"
          className="inline-flex items-center mt-4 text-green-600 hover:text-green-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar aos pedidos
        </Link>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Pedido não encontrado.</p>
        <Link
          href="/user/orders"
          className="inline-flex items-center mt-4 text-green-600 hover:text-green-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar aos pedidos
        </Link>
      </div>
    )
  }

  const StatusIcon = statusConfig[order.status as keyof typeof statusConfig]?.icon || Package
  const statusStyle = statusConfig[order.status as keyof typeof statusConfig]?.color || 'bg-gray-100 text-gray-800'
  const statusLabel = statusConfig[order.status as keyof typeof statusConfig]?.label || order.status
  const statusDescription = statusConfig[order.status as keyof typeof statusConfig]?.description || ''

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/user/orders"
            className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos pedidos
          </Link>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Pedido #{order.id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-gray-600">
              Realizado em {formatDate(order.createdAt)}
            </p>
          </div>
          <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${statusStyle}`}>
            <StatusIcon className="h-4 w-4 mr-2" />
            {statusLabel}
          </span>
        </div>
        
        {statusDescription && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">{statusDescription}</p>
          </div>
        )}
      </div>

      {/* Order Status Timeline */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Status do Pedido</h2>
        <div className="flex items-center justify-between">
          {['pending', 'confirmed', 'processing', 'shipped', 'delivered'].map((status, index) => {
            const isActive = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'].indexOf(order.status) >= index
            const isCurrent = order.status === status
            const StatusIcon = statusConfig[status as keyof typeof statusConfig].icon
            
            return (
              <div key={status} className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isActive ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-400'
                } ${isCurrent ? 'ring-4 ring-green-200' : ''}`}>
                  <StatusIcon className="h-5 w-5" />
                </div>
                <p className={`text-xs mt-2 text-center ${
                  isActive ? 'text-green-600 font-medium' : 'text-gray-400'
                }`}>
                  {statusConfig[status as keyof typeof statusConfig].label}
                </p>
                {index < 4 && (
                  <div className={`h-1 w-full mt-2 ${
                    ['pending', 'confirmed', 'processing', 'shipped', 'delivered'].indexOf(order.status) > index
                      ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Itens do Pedido</h2>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
              {item.product.image && (
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  width={64}
                  height={64}
                  className="h-16 w-16 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                {item.product.description && (
                  <p className="text-sm text-gray-600 mt-1">{item.product.description}</p>
                )}
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <span>Quantidade: {item.quantity}</span>
                  {item.size && <span>Tamanho: {item.size}</span>}
                  {item.color && <span>Cor: {item.color}</span>}
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{formatPrice(item.price)}</p>
                <p className="text-sm text-gray-600">por unidade</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Pedido</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Frete</span>
              <span className="text-gray-900">{formatPrice(order.shipping)}</span>
            </div>
            {order.tax > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Impostos</span>
                <span className="text-gray-900">{formatPrice(order.tax)}</span>
              </div>
            )}
            <div className="border-t pt-3">
              <div className="flex justify-between font-semibold text-lg">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment & Shipping Info */}
        <div className="space-y-6">
          {/* Payment Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Pagamento
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Método</span>
                <span className="text-gray-900 capitalize">{order.paymentMethod || 'Não informado'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className={`capitalize ${
                  order.paymentStatus === 'paid' ? 'text-green-600' :
                  order.paymentStatus === 'failed' ? 'text-red-600' :
                  'text-yellow-600'
                }`}>
                  {order.paymentStatus === 'paid' ? 'Pago' :
                   order.paymentStatus === 'failed' ? 'Falhou' :
                   order.paymentStatus === 'refunded' ? 'Reembolsado' :
                   'Pendente'}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Endereço de Entrega
            </h2>
            <div className="text-gray-700">
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
              <p>CEP: {order.shippingAddress.zipCode}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
            
            {order.trackingCode && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900">Código de Rastreamento</p>
                <p className="text-blue-700 font-mono">{order.trackingCode}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Observações</h2>
          <p className="text-gray-700">{order.notes}</p>
        </div>
      )}
    </div>
  )
}