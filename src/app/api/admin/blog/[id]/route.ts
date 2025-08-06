import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updatePostSchema = z.object({
  title: z.string().min(5, 'Título deve ter pelo menos 5 caracteres').optional(),
  slug: z.string().min(3, 'Slug deve ter pelo menos 3 caracteres').optional(),
  summary: z.string().min(10, 'Resumo deve ter pelo menos 10 caracteres').optional(),
  content: z.string().min(50, 'Conteúdo deve ter pelo menos 50 caracteres').optional(),
  author: z.string().min(2, 'Autor deve ter pelo menos 2 caracteres').optional(),
  category: z.string().min(2, 'Categoria deve ter pelo menos 2 caracteres').optional(),
  readTime: z.string().min(1, 'Tempo de leitura é obrigatório').optional(),
  image: z.string().url('URL da imagem inválida').optional(),
  published: z.boolean().optional(),
  publishedAt: z.string().datetime().nullable().optional(),
})

// GET - Buscar post por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    
    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    const post = await prisma.post.findUnique({
      where: { id }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Erro ao buscar post:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PATCH - Atualizar post
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    
    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = updatePostSchema.parse(body)

    // Verificar se o post existe
    const existingPost = await prisma.post.findUnique({
      where: { id }
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post não encontrado' },
        { status: 404 }
      )
    }

    // Se está alterando o slug, verificar se não existe outro post com o mesmo slug
    if (validatedData.slug && validatedData.slug !== existingPost.slug) {
      const postWithSameSlug = await prisma.post.findUnique({
        where: { slug: validatedData.slug }
      })

      if (postWithSameSlug) {
        return NextResponse.json(
          { error: 'Já existe um post com este slug' },
          { status: 400 }
        )
      }
    }

    // Preparar dados para atualização
    const updateData: Record<string, unknown> = { ...validatedData }
    
    // Se está publicando o post pela primeira vez
    if (validatedData.published === true && !existingPost.published) {
      updateData.publishedAt = new Date()
    }
    // Se está despublicando
    else if (validatedData.published === false) {
      updateData.publishedAt = null
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(updatedPost)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Erro ao atualizar post:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Excluir post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    
    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    // Verificar se o post existe
    const existingPost = await prisma.post.findUnique({
      where: { id }
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post não encontrado' },
        { status: 404 }
      )
    }

    await prisma.post.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Post excluído com sucesso' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erro ao excluir post:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}