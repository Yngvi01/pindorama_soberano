'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'

interface CartItem {
  id: string
  cartId: string
  productId: string
  quantity: number
  size?: string
  color?: string
  product: {
    id: string
    name: string
    price: number
    image?: string
    stock: number
    active: boolean
  }
}

interface Cart {
  id: string
  userId: string
  items: CartItem[]
}

interface CartData {
  cart: Cart
  subtotal: number
  itemCount: number
}

interface AddToCartData {
  productId: string
  quantity: number
  size?: string
  color?: string
}

export function useCart() {
  const { data: session } = useSession()
  const [cartData, setCartData] = useState<CartData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Buscar carrinho
  const fetchCart = useCallback(async () => {
    if (!session?.user) {
      setCartData(null)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/user/cart')
      
      if (!response.ok) {
        throw new Error('Erro ao buscar carrinho')
      }
      
      const data = await response.json()
      setCartData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao buscar carrinho:', err)
    } finally {
      setLoading(false)
    }
  }, [session?.user])

  // Adicionar item ao carrinho
  const addToCart = useCallback(async (data: AddToCartData) => {
    if (!session?.user) {
      setError('Você precisa estar logado para adicionar itens ao carrinho')
      return false
    }

    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/user/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao adicionar item ao carrinho')
      }
      
      // Atualizar carrinho após adicionar item
      await fetchCart()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao adicionar item ao carrinho:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [session?.user, fetchCart])

  // Atualizar quantidade do item
  const updateItemQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (!session?.user) {
      setError('Você precisa estar logado')
      return false
    }

    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/user/cart/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao atualizar item')
      }
      
      // Atualizar carrinho após atualizar item
      await fetchCart()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao atualizar item:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [session?.user, fetchCart])

  // Remover item do carrinho
  const removeItem = useCallback(async (itemId: string) => {
    if (!session?.user) {
      setError('Você precisa estar logado')
      return false
    }

    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/user/cart/${itemId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao remover item')
      }
      
      // Atualizar carrinho após remover item
      await fetchCart()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao remover item:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [session?.user, fetchCart])

  // Limpar carrinho
  const clearCart = useCallback(async () => {
    if (!session?.user) {
      setError('Você precisa estar logado')
      return false
    }

    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/user/cart', {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao limpar carrinho')
      }
      
      // Atualizar carrinho após limpar
      await fetchCart()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao limpar carrinho:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [session?.user, fetchCart])

  // Buscar carrinho quando o usuário fizer login
  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  return {
    cartData,
    loading,
    error,
    fetchCart,
    addToCart,
    updateItemQuantity,
    removeItem,
    clearCart,
    itemCount: cartData?.itemCount || 0,
    subtotal: cartData?.subtotal || 0,
    items: cartData?.cart?.items || [],
  }
}