'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft, 
  CreditCard,
  Loader2,
  AlertCircle
} from 'lucide-react'

export default function CartPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const {
    cartData,
    loading,
    error,
    updateItemQuantity,
    removeItem,
    clearCart,
    itemCount,
    subtotal
  } = useCart()

  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    setUpdatingItems(prev => new Set(prev).add(itemId))
    await updateItemQuantity(itemId, newQuantity)
    setUpdatingItems(prev => {
      const newSet = new Set(prev)
      newSet.delete(itemId)
      return newSet
    })
  }

  const handleRemoveItem = async (itemId: string) => {
    setUpdatingItems(prev => new Set(prev).add(itemId))
    await removeItem(itemId)
    setUpdatingItems(prev => {
      const newSet = new Set(prev)
      newSet.delete(itemId)
      return newSet
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando carrinho...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const items = cartData?.cart?.items || []
  const shipping = 15.00 // Taxa fixa de frete
  const total = subtotal + shipping

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/produtos" 
            className="inline-flex items-center text-green-600 hover:text-green-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continuar comprando
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <ShoppingBag className="h-8 w-8 mr-3 text-green-600" />
            Meu Carrinho
            {itemCount > 0 && (
              <span className="ml-3 bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                {itemCount} {itemCount === 1 ? 'item' : 'itens'}
              </span>
            )}
          </h1>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Seu carrinho está vazio
            </h2>
            <p className="text-gray-600 mb-6">
              Adicione alguns produtos incríveis do Pindorama Soberano!
            </p>
            <Link
              href="/produtos"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Explorar Produtos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de itens */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Itens do Carrinho
                  </h2>
                  {items.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Limpar carrinho
                    </button>
                  )}
                </div>
                
                <div className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <div key={item.id} className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* Imagem do produto */}
                        <div className="flex-shrink-0">
                          <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                            {item.product.image ? (
                              <Image
                                src={item.product.image}
                                alt={item.product.name}
                                width={80}
                                height={80}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <ShoppingBag className="h-8 w-8" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Informações do produto */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-900 mb-1">
                            {item.product.name}
                          </h3>
                          <p className="text-lg font-semibold text-green-600 mb-2">
                            {formatPrice(item.product.price)}
                          </p>
                          
                          {/* Variações */}
                          {(item.size || item.color) && (
                            <div className="flex space-x-4 text-sm text-gray-600 mb-3">
                              {item.size && (
                                <span>Tamanho: <strong>{item.size}</strong></span>
                              )}
                              {item.color && (
                                <span>Cor: <strong>{item.color}</strong></span>
                              )}
                            </div>
                          )}

                          {/* Controles de quantidade */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="text-sm text-gray-600">Quantidade:</span>
                              <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                  disabled={updatingItems.has(item.id) || item.quantity <= 1}
                                  className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="px-4 py-2 text-center min-w-[3rem]">
                                  {updatingItems.has(item.id) ? (
                                    <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                                  ) : (
                                    item.quantity
                                  )}
                                </span>
                                <button
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                  disabled={updatingItems.has(item.id) || item.quantity >= item.product.stock}
                                  className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                            </div>

                            {/* Botão remover */}
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              disabled={updatingItems.has(item.id)}
                              className="text-red-600 hover:text-red-700 p-2 disabled:opacity-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Subtotal do item */}
                          <div className="mt-3 text-right">
                            <span className="text-lg font-semibold text-gray-900">
                              {formatPrice(item.product.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Resumo do pedido */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Resumo do Pedido
                </h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'itens'})</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Frete</span>
                    <span>{formatPrice(shipping)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-semibold text-gray-900">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => router.push('/user/checkout')}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Finalizar Compra
                </button>

                <p className="text-xs text-gray-500 text-center mt-3">
                  Frete calculado no checkout
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}