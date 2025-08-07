import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🗑️ Limpando produtos existentes...')
  
  // Deletar todos os produtos existentes
  await prisma.product.deleteMany({})
  console.log('✅ Produtos existentes removidos')
  
  console.log('🌱 Criando novos produtos por categoria...')
  
  // Produtos para Camisas
  const camisas = [
    {
      name: 'Camisa Ability - Preta',
      description: 'Camisa com estampa exclusiva da capivara militar em estilo cartoon, representando a resistência popular.',
      price: 155.40,
      category: 'Camisas',
      stock: 25,
      active: true,
      image: '/produtos/camisa-capivara.jpg'
    },
    {
      name: 'Camisa Ability - Camurça',
      description: 'Design inspirado na liberdade do povo brasileiro, com elementos da fauna nacional.',
      price: 155.40,
      category: 'Camisas',
      stock: 30,
      active: true,
      image: '/produtos/camisa-pindorama.jpg'
    },
    {
      name: 'Camisa de Combate Leader - Preto',
      description: 'Estampa com memes políticos e símbolos da luta pela soberania nacional.',
      price: 289.00,
      category: 'Camisas',
      stock: 15,
      active: true,
      image: '/produtos/camisa-soberania.jpg'
    },
    {
      name: 'Camisa Lumberjack Relief - Caqui',
      description: 'Camisa estilo lenhador com toque brasileiro e padrão xadrez em tons de caqui.',
      price: 220.15,
      category: 'Camisas',
      stock: 20,
      active: true,
      image: '/produtos/camisa-lumberjack.jpg'
    },
    {
      name: 'Camisa Pindorama Soberano - Branca',
      description: 'Camisa oficial com logo do Pindorama Soberano em design minimalista.',
      price: 179.90,
      category: 'Camisas',
      stock: 35,
      active: true,
      image: '/produtos/camisa-logo.jpg'
    }
  ]
  
  // Produtos para Moletons
  const moletons = [
    {
      name: 'Moletom Capivara Revolucionária',
      description: 'Moletom confortável com estampa da capivara militar em design exclusivo.',
      price: 189.90,
      category: 'Moletons',
      stock: 18,
      active: true,
      image: '/produtos/moletom-capivara.jpg'
    },
    {
      name: 'Moletom Pindorama Livre',
      description: 'Design exclusivo celebrando a liberdade nacional com elementos da fauna brasileira.',
      price: 179.90,
      category: 'Moletons',
      stock: 22,
      active: true,
      image: '/produtos/moletom-pindorama.jpg'
    },
    {
      name: 'Moletom Resistência Nacional',
      description: 'Moletom com capuz e estampa inspirada na luta pela soberania brasileira.',
      price: 219.90,
      category: 'Moletons',
      stock: 15,
      active: true,
      image: '/produtos/moletom-resistencia.jpg'
    },
    {
      name: 'Moletom Verde e Amarelo',
      description: 'Moletom nas cores nacionais com design moderno e confortável.',
      price: 199.90,
      category: 'Moletons',
      stock: 25,
      active: true,
      image: '/produtos/moletom-brasil.jpg'
    }
  ]
  
  // Produtos para Adesivos
  const adesivos = [
    {
      name: 'Pack Adesivos Capivara Militar',
      description: 'Pack com 10 adesivos da capivara em poses militares e revolucionárias.',
      price: 25.90,
      category: 'Adesivos',
      stock: 100,
      active: true,
      image: '/produtos/adesivos-capivara.jpg'
    },
    {
      name: 'Adesivo Pindorama Soberano',
      description: 'Adesivo premium com logo oficial do Pindorama Soberano em vinil resistente.',
      price: 12.90,
      category: 'Adesivos',
      stock: 150,
      active: true,
      image: '/produtos/adesivo-logo.jpg'
    },
    {
      name: 'Kit Adesivos Fauna Brasileira',
      description: 'Conjunto de 8 adesivos com animais nativos do Brasil em estilo cartoon.',
      price: 19.90,
      category: 'Adesivos',
      stock: 80,
      active: true,
      image: '/produtos/adesivos-fauna.jpg'
    },
    {
      name: 'Adesivo Revolução dos Bichos BR',
      description: 'Adesivo inspirado no clássico literário com releitura brasileira.',
      price: 15.90,
      category: 'Adesivos',
      stock: 120,
      active: true,
      image: '/produtos/adesivo-revolucao.jpg'
    },
    {
      name: 'Pack Adesivos Memes Nacionais',
      description: 'Coleção de 12 adesivos com memes políticos e culturais brasileiros.',
      price: 29.90,
      category: 'Adesivos',
      stock: 60,
      active: true,
      image: '/produtos/adesivos-memes.jpg'
    }
  ]
  
  // Produtos para Posters
  const posters = [
    {
      name: 'Pôster Capivara Comandante',
      description: 'Arte exclusiva da capivara militar em pose heroica, impressão em alta qualidade.',
      price: 45.90,
      category: 'Posters',
      stock: 40,
      active: true,
      image: '/produtos/poster-capivara.jpg'
    },
    {
      name: 'Pôster Revolução dos Bichos BR',
      description: 'Releitura brasileira do clássico com fauna nacional em arte detalhada.',
      price: 42.90,
      category: 'Posters',
      stock: 35,
      active: true,
      image: '/produtos/poster-revolucao.jpg'
    },
    {
      name: 'Pôster Pindorama Ancestral',
      description: 'Arte conceitual retratando a terra das palmeiras em estilo indigenista.',
      price: 39.90,
      category: 'Posters',
      stock: 30,
      active: true,
      image: '/produtos/poster-pindorama.jpg'
    },
    {
      name: 'Pôster Soberania Nacional',
      description: 'Design político com símbolos da independência e soberania brasileira.',
      price: 48.90,
      category: 'Posters',
      stock: 25,
      active: true,
      image: '/produtos/poster-soberania.jpg'
    },
    {
      name: 'Pôster Fauna Amazônica',
      description: 'Ilustração artística dos animais da Amazônia em estilo naturalista.',
      price: 52.90,
      category: 'Posters',
      stock: 20,
      active: true,
      image: '/produtos/poster-amazonia.jpg'
    }
  ]
  
  // Criar todos os produtos
  const allProducts = [...camisas, ...moletons, ...adesivos, ...posters]
  
  for (const product of allProducts) {
    await prisma.product.create({
      data: product
    })
  }
  
  console.log(`✅ ${allProducts.length} novos produtos criados:`)
  console.log(`   - ${camisas.length} Camisas`)
  console.log(`   - ${moletons.length} Moletons`)
  console.log(`   - ${adesivos.length} Adesivos`)
  console.log(`   - ${posters.length} Posters`)
  
  console.log('🎉 Reset de produtos concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o reset:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })