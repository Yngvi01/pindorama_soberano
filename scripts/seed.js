const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Verificar se já existe um admin
  const existingAdmin = await prisma.user.findFirst({
    where: { role: 'admin' }
  })

  if (existingAdmin) {
    console.log('✅ Administrador já existe no sistema')
    console.log(`📧 Email: ${existingAdmin.email}`)
    return
  }

  // Criar usuário administrador padrão
  const adminPassword = 'admin123'
  const hashedPassword = await bcrypt.hash(adminPassword, 12)

  const admin = await prisma.user.create({
    data: {
      name: 'Administrador',
      email: 'admin@pindorama.com',
      password: hashedPassword,
      role: 'admin',
    },
  })

  console.log('✅ Usuário administrador criado com sucesso!')
  console.log('📧 Email: admin@pindorama.com')
  console.log('🔑 Senha: admin123')
  console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro login!')

  // Criar alguns usuários de exemplo
  const userPassword = 'user123'
  const hashedUserPassword = await bcrypt.hash(userPassword, 12)

  const users = await prisma.user.createMany({
    data: [
      {
        name: 'João Silva',
        email: 'joao@exemplo.com',
        password: hashedUserPassword,
        role: 'user',
      },
      {
        name: 'Maria Santos',
        email: 'maria@exemplo.com',
        password: hashedUserPassword,
        role: 'user',
      },
      {
        name: 'Pedro Oliveira',
        email: 'pedro@exemplo.com',
        password: hashedUserPassword,
        role: 'user',
      },
    ],
  })

  console.log(`✅ ${users.count} usuários de exemplo criados`)
  console.log('🔑 Senha para todos os usuários de exemplo: user123')
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })