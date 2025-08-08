import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Buscar o usuário
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Buscar o pedido específico do usuário
    const order = await prisma.order.findFirst({
      where: {
        id: params.id,
        userId: user.id // Garantir que o pedido pertence ao usuário
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                description: true,
                image: true,
                category: true
              }
            }
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Pedido não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Erro ao buscar pedido:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Buscar o usuário
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { action } = body

    // Verificar se o pedido existe e pertence ao usuário
    const existingOrder = await prisma.order.findFirst({
      where: {
        id: params.id,
        userId: user.id
      },
      include: {
        items: true
      }
    })

    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Pedido não encontrado' },
        { status: 404 }
      )
    }

    // Permitir apenas cancelamento de pedidos pendentes ou confirmados
    if (action === 'cancel') {
      if (!['pending', 'confirmed'].includes(existingOrder.status)) {
        return NextResponse.json(
          { error: 'Este pedido não pode ser cancelado' },
          { status: 400 }
        )
      }

      // Cancelar o pedido
      const updatedOrder = await prisma.order.update({
        where: { id: params.id },
        data: {
          status: 'cancelled',
          updatedAt: new Date()
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  image: true,
                  category: true
                }
              }
            }
          }
        }
      })

      // Restaurar estoque dos produtos
      for (const item of existingOrder.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity
            }
          }
        })
      }

      return NextResponse.json(updatedOrder)
    }

    return NextResponse.json(
      { error: 'Ação não permitida' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}