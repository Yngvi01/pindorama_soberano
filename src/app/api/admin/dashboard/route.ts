import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    // Buscar estatísticas do banco de dados
    const [totalUsers, totalAdmins] = await Promise.all([
      prisma.user.count({
        where: { role: 'user' }
      }),
      prisma.user.count({
        where: { role: 'admin' }
      })
    ])

    // Buscar usuários recentes (últimos 30 dias)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const recentUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    })

    // Calcular crescimento mensal (simulado)
    const previousMonthUsers = Math.max(1, totalUsers - recentUsers)
    const monthlyGrowth = Math.round(((recentUsers / previousMonthUsers) * 100))

    // Buscar atividade recente
    const recentActivity = await prisma.user.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        role: true
      }
    })

    // Formatar atividade recente
    const formattedActivity = recentActivity.map(user => ({
      id: user.id,
      type: 'user',
      description: `Novo usuário registrado: ${user.name}`,
      timestamp: formatTimeAgo(user.createdAt)
    }))

    // Adicionar algumas atividades simuladas para demonstração
    const simulatedActivities = [
      {
        id: 'sim-1',
        type: 'product',
        description: 'Produto "Açaí Premium" foi atualizado',
        timestamp: '4 horas atrás'
      },
      {
        id: 'sim-2',
        type: 'blog',
        description: 'Novo post publicado: "Sustentabilidade na Amazônia"',
        timestamp: '1 dia atrás'
      },
      {
        id: 'sim-3',
        type: 'order',
        description: 'Novo pedido #1234 recebido',
        timestamp: '2 dias atrás'
      }
    ]

    const allActivity = [...formattedActivity, ...simulatedActivities].slice(0, 10)

    const stats = {
      totalUsers: totalUsers + totalAdmins,
      totalProducts: 15, // Simulado - pode ser substituído por contagem real
      totalPosts: 8, // Simulado - pode ser substituído por contagem real
      monthlyGrowth,
      recentActivity: allActivity,
      usersByRole: {
        users: totalUsers,
        admins: totalAdmins
      },
      systemStatus: {
        server: 'online',
        database: 'connected',
        backup: 'scheduled'
      }
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Erro ao buscar estatísticas do dashboard:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Função auxiliar para formatar tempo
function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutos atrás`
  } else if (diffInHours < 24) {
    return `${diffInHours} horas atrás`
  } else if (diffInDays === 1) {
    return '1 dia atrás'
  } else {
    return `${diffInDays} dias atrás`
  }
}