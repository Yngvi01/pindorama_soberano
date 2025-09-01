import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateCartItemSchema = z.object({
  quantity: z.number().min(0),
})

interface RouteParams {
  params: Promise<{
    itemId: string
  }>
}

// PATCH - Atualizar quantidade do item no carrinho
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { itemId } = await params
    const body = await request.json()
    const { quantity } = updateCartItemSchema.parse(body)

    // Buscar o item do carrinho
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
        product: true,
      },
    })

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Item do carrinho não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se o carrinho pertence ao usuário
    if (cartItem.cart.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 403 }
      )
    }

    // Se quantidade for 0, remover o item
    if (quantity === 0) {
      await prisma.cartItem.delete({
        where: { id: itemId },
      })

      return NextResponse.json({
        message: 'Item removido do carrinho com sucesso',
      })
    }

    // Verificar estoque
    if (cartItem.product.stock < quantity) {
      return NextResponse.json(
        { error: 'Estoque insuficiente' },
        { status: 400 }
      )
    }

    // Atualizar quantidade
    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
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

    return NextResponse.json({
      message: 'Quantidade atualizada com sucesso',
      cartItem: updatedItem,
    })
  } catch (error) {
    console.error('Erro ao atualizar item do carrinho:', error)
    
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

// DELETE - Remover item do carrinho
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { itemId } = await params

    // Buscar o item do carrinho
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
      },
    })

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Item do carrinho não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se o carrinho pertence ao usuário
    if (cartItem.cart.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 403 }
      )
    }

    // Remover o item
    await prisma.cartItem.delete({
      where: { id: itemId },
    })

    return NextResponse.json({
      message: 'Item removido do carrinho com sucesso',
    })
  } catch (error) {
    console.error('Erro ao remover item do carrinho:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}