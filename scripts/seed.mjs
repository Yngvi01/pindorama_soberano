import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

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
  } else {
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
  }

  // Verificar e criar usuários de exemplo
  const existingUsers = await prisma.user.count({
    where: {
      email: {
        in: ['joao@exemplo.com', 'maria@exemplo.com', 'pedro@exemplo.com']
      }
    }
  })

  if (existingUsers === 0) {
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
  } else {
    console.log('✅ Usuários de exemplo já existem')
  }

  // Verificar e criar produtos de exemplo
  const existingProducts = await prisma.product.count()

  if (existingProducts === 0) {
    const products = await prisma.product.createMany({
      data: [
        {
          name: 'Açaí Premium 500ml',
          description: 'Açaí natural premium, sem conservantes, direto da Amazônia',
          price: 15.90,
          category: 'Açaí',
          stock: 50,
          active: true,
        },
        {
          name: 'Cupuaçu Polpa 1kg',
          description: 'Polpa de cupuaçu 100% natural, rica em vitaminas',
          price: 25.50,
          category: 'Frutas',
          stock: 30,
          active: true,
        },
        {
          name: 'Guaraná em Pó 100g',
          description: 'Guaraná em pó natural, energético da Amazônia',
          price: 18.00,
          category: 'Suplementos',
          stock: 25,
          active: true,
        },
        {
          name: 'Castanha do Pará 200g',
          description: 'Castanha do Pará selecionada, rica em selênio',
          price: 22.90,
          category: 'Castanhas',
          stock: 40,
          active: true,
        },
        {
          name: 'Mel de Abelha Silvestre 300g',
          description: 'Mel puro de abelhas silvestres da região amazônica',
          price: 28.00,
          category: 'Mel',
          stock: 20,
          active: true,
        },
        {
          name: 'Farinha de Tapioca 500g',
          description: 'Farinha de tapioca tradicional, sem glúten',
          price: 8.50,
          category: 'Farinhas',
          stock: 60,
          active: true,
        },
      ],
    })

    console.log(`✅ ${products.count} produtos de exemplo criados`)
  } else {
    console.log('✅ Produtos de exemplo já existem')
  }

  // Verificar e criar posts de exemplo
  const existingPosts = await prisma.post.count()

  if (existingPosts === 0) {
    const posts = await prisma.post.createMany({
      data: [
        {
          title: 'A Capivara Revolucionária: Símbolo da Resistência Brasileira',
          slug: 'capivara-revolucionaria',
          summary: 'Descubra como a capivara se tornou um ícone da luta pela soberania nacional e liberdade do povo brasileiro.',
          content: 'A capivara, maior roedor do mundo e símbolo da fauna brasileira, transcendeu sua natureza pacífica para se tornar um ícone revolucionário. Este artigo explora como este animal genuinamente brasileiro representa a resistência cultural e a luta pela soberania nacional. Através de sua presença marcante na cultura popular e nas redes sociais, a capivara simboliza a tranquilidade e determinação do povo brasileiro diante dos desafios. Sua capacidade de adaptação e convivência harmoniosa com outras espécies reflete os valores de diversidade e inclusão que caracterizam nossa nação.',
          author: 'Equipe Pindorama',
          category: 'História',
          readTime: '5 min',
          published: true,
          publishedAt: new Date('2024-01-15'),
        },
        {
          title: 'Pindorama: O Nome Verdadeiro da Nossa Terra',
          slug: 'pindorama-origem',
          summary: 'Explore a origem indígena do nome Pindorama e seu significado profundo para a identidade nacional.',
          content: 'Pindorama, palavra de origem tupi que significa "terra das palmeiras", é o nome ancestral do território que hoje conhecemos como Brasil. Este artigo mergulha nas raízes etimológicas e culturais deste termo, revelando como os povos originários já possuíam uma visão integrada e sustentável do território. O nome Pindorama carrega em si a sabedoria milenar dos povos indígenas, que viam a terra não como propriedade, mas como lar compartilhado. Compreender este conceito é fundamental para resgatar nossa verdadeira identidade nacional e construir um futuro mais justo e sustentável.',
          author: 'Dr. João Silva',
          category: 'Cultura',
          readTime: '7 min',
          published: true,
          publishedAt: new Date('2024-01-10'),
        },
        {
          title: 'Soberania Nacional: Construindo um Brasil Independente',
          slug: 'soberania-nacional',
          summary: 'Reflexões sobre a importância da soberania nacional e como cada cidadão pode contribuir para um país mais livre.',
          content: 'A soberania nacional vai além da independência política formal. Este artigo analisa os pilares fundamentais da verdadeira soberania: econômica, cultural, tecnológica e alimentar. Discutimos como o fortalecimento das instituições democráticas, o desenvolvimento de tecnologias nacionais e a valorização da cultura brasileira são essenciais para construir um país verdadeiramente independente. Cada cidadão tem papel fundamental neste processo, seja através do consumo consciente, da participação política ativa ou da preservação de nossas tradições culturais.',
          author: 'Maria Santos',
          category: 'Política',
          readTime: '8 min',
          published: true,
          publishedAt: new Date('2024-01-05'),
        },
        {
          title: 'Arte como Forma de Resistência Cultural',
          slug: 'arte-resistencia',
          summary: 'Como a arte e o design podem ser ferramentas poderosas na preservação e promoção da cultura brasileira.',
          content: 'A arte sempre foi uma forma de resistência e expressão cultural. No contexto brasileiro, manifestações artísticas como o grafite, a música popular, a literatura de cordel e as artes visuais desempenham papel crucial na preservação da identidade nacional. Este artigo explora como artistas contemporâneos utilizam suas obras para questionar estruturas de poder, celebrar a diversidade cultural e promover a consciência social. A arte brasileira é um patrimônio vivo que conecta passado e futuro, tradição e inovação.',
          author: 'Carlos Artista',
          category: 'Arte',
          readTime: '6 min',
          published: false,
        },
      ],
    })

    console.log(`✅ ${posts.count} posts de exemplo criados`)
  } else {
    console.log('✅ Posts de exemplo já existem')
  }

  // Criar pedidos de exemplo
  const existingOrders = await prisma.order.count()
  if (existingOrders === 0) {
    // Buscar usuários e produtos para criar pedidos
    const users = await prisma.user.findMany({
      where: { role: 'user' },
      take: 2
    })
    
    const products = await prisma.product.findMany({ take: 4 })
    
    if (users.length > 0 && products.length > 0) {
      // Pedido 1 - Entregue
      await prisma.order.create({
        data: {
          userId: users[0].id,
          status: 'delivered',
          subtotal: 189.90,
          shipping: 15.90,
          tax: 0,
          total: 205.80,
          paymentMethod: 'credit_card',
          paymentStatus: 'paid',
          shippingAddress: {
            street: 'Rua das Flores, 123',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01234-567',
            country: 'Brasil'
          },
          trackingCode: 'BR123456789',
          notes: 'Entrega rápida solicitada',
          items: {
            create: [
              {
                productId: products[0].id,
                quantity: 1,
                price: products[0].price,
                size: 'M',
                color: 'Azul'
              },
              {
                productId: products[1].id,
                quantity: 2,
                price: products[1].price,
                size: 'G',
                color: 'Preto'
              }
            ]
          }
        }
      })

      // Pedido 2 - Em trânsito
      await prisma.order.create({
        data: {
          userId: users[0].id,
          status: 'shipped',
          subtotal: 299.90,
          shipping: 0,
          tax: 0,
          total: 299.90,
          paymentMethod: 'pix',
          paymentStatus: 'paid',
          shippingAddress: {
            street: 'Av. Paulista, 1000',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01310-100',
            country: 'Brasil'
          },
          trackingCode: 'BR987654321',
          items: {
            create: [
              {
                productId: products[2].id,
                quantity: 1,
                price: products[2].price,
                size: 'P',
                color: 'Verde'
              }
            ]
          }
        }
      })

      // Pedido 3 - Processando
      if (users.length > 1) {
        await prisma.order.create({
          data: {
            userId: users[1].id,
            status: 'processing',
            subtotal: 159.90,
            shipping: 15.90,
            tax: 0,
            total: 175.80,
            paymentMethod: 'credit_card',
            paymentStatus: 'paid',
            shippingAddress: {
              street: 'Rua do Comércio, 456',
              city: 'Rio de Janeiro',
              state: 'RJ',
              zipCode: '20040-020',
              country: 'Brasil'
            },
            items: {
              create: [
                {
                  productId: products[3].id,
                  quantity: 1,
                  price: products[3].price,
                  size: 'M',
                  color: 'Branco'
                }
              ]
            }
          }
        })
      }

      console.log('✅ 3 pedidos de exemplo criados')
    }
  } else {
    console.log('✅ Pedidos de exemplo já existem')
  }
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })