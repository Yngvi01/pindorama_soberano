import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const addToCartSchema = z.object({
  productId: z.string(),
  quantity: z.number().min(1),
  size: z.string().optional(),
  color: z.string().optional(),
})

const updateCartItemSchema = z.object({
  quantity: z.number().min(0),
})

// GET - Buscar carrinho do usuário
export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Buscar ou criar carrinho do usuário
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                image: true,
                stock: true,
                active: true,
              },
            },
          },
        },
      },
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.user.id },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  image: true,
                  stock: true,
                  active: true,
                },
              },
            },
          },
        },
      })
    }

    // Calcular totais
    const subtotal = cart.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    )
    const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0)

    return NextResponse.json({
      cart,
      subtotal,
      itemCount,
    })
  } catch (error) {
    console.error('Erro ao buscar carrinho:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Adicionar item ao carrinho
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { productId, quantity, size, color } = addToCartSchema.parse(body)

    // Verificar se o produto existe e está ativo
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product || !product.active) {
      return NextResponse.json(
        { error: 'Produto não encontrado ou inativo' },
        { status: 404 }
      )
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { error: 'Estoque insuficiente' },
        { status: 400 }
      )
    }

    // Buscar ou criar carrinho
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.user.id },
      })
    }

    // Verificar se o item já existe no carrinho
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId_size_color: {
          cartId: cart.id,
          productId,
          size: size || '',
          color: color || '',
        },
      },
    })

    let cartItem
    if (existingItem) {
      // Atualizar quantidade
      const newQuantity = existingItem.quantity + quantity
      
      if (product.stock < newQuantity) {
        return NextResponse.json(
          { error: 'Estoque insuficiente para a quantidade solicitada' },
          { status: 400 }
        )
      }

      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              image: true,
              stock: true,
            },
          },
        },
      })
    } else {
      // Criar novo item
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          size: size || null,
          color: color || null,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              image: true,
              stock: true,
            },
          },
        },
      })
    }

    return NextResponse.json({
      message: 'Item adicionado ao carrinho com sucesso',
      cartItem,
    })
  } catch (error) {
    console.error('Erro ao adicionar item ao carrinho:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Limpar carrinho
export async function DELETE() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    })

    if (!cart) {
      return NextResponse.json(
        { error: 'Carrinho não encontrado' },
        { status: 404 }
      )
    }

    // Remover todos os itens do carrinho
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    })

    return NextResponse.json({
      message: 'Carrinho limpo com sucesso',
    })
  } catch (error) {
    console.error('Erro ao limpar carrinho:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}