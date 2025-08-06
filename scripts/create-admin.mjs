import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    // Verificar se já existe um admin
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'admin' }
    })

    if (existingAdmin) {
      console.log('✅ Usuário admin já existe:', existingAdmin.email)
      return
    }

    // Verificar se existe usuário com email admin@pindorama.com
    const existingUser = await prisma.user.findUnique({
      where: { email: 'admin@pindorama.com' }
    })

    if (existingUser) {
      // Promover usuário existente a admin
      const admin = await prisma.user.update({
        where: { email: 'admin@pindorama.com' },
        data: { role: 'admin' }
      })
      console.log('✅ Usuário promovido a admin:', admin.email)
      return
    }

    // Criar usuário admin
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    const admin = await prisma.user.create({
      data: {
        name: 'Administrador',
        email: 'admin@pindorama.com',
        password: hashedPassword,
        role: 'admin'
      }
    })

    console.log('✅ Usuário admin criado com sucesso!')
    console.log('📧 Email: admin@pindorama.com')
    console.log('🔑 Senha: admin123')
    console.log('👤 ID:', admin.id)
    
  } catch (error) {
    console.error('❌ Erro ao criar admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()