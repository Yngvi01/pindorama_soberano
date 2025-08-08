import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Buscar produto por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Buscar produto por ID
    const product = await prisma.product.findUnique({
      where: {
        id: id,
        active: true // Apenas produtos ativos
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        image: true,
        category: true,
        stock: true,
        colors: true,
        sizes: true,
        specifications: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Produto não encontrado ou inativo' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Erro ao buscar produto:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}