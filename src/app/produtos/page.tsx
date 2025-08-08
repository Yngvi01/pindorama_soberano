'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Product {
  id: string
  name: string
  description?: string
  price: number
  image?: string
  category: string
  stock: number
  colors?: string[]
  sizes?: string[]
  specifications?: Record<string, any>
  createdAt: string
  updatedAt: string
}

interface ProductsResponse {
  products: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

// Produtos estáticos como fallback
const produtosEstaticos = [
  // Camisas
  {
    id: '68961ed2cf4cea023b42542e',
    nome: 'Camisa Pindorama Soberano',
    preco: 89.90,
    precoOriginal: 120.00,
    desconto: 25,
    avaliacao: 4.8,
    parcelamento: '3x de R$ 29,97',
    descricao: 'Camisa premium com estampa exclusiva da capivara revolucionária.',
    categoria: 'Camisas',
    imagem: '/produtos/camisa-capivara.jpg'
  },
  {
    id: '68961ed2cf4cea023b42542f',
    nome: 'Camisa Brasil Livre',
    preco: 79.90,
    precoOriginal: 99.90,
    desconto: 20,
    avaliacao: 4.6,
    parcelamento: '3x de R$ 26,63',
    descricao: 'Design patriótico com elementos da cultura brasileira.',
    categoria: 'Camisas',
    imagem: '/produtos/camisa-pindorama.jpg'
  },
  {
    id: '68961ed2cf4cea023b425430',
    nome: 'Camisa Resistência Verde',
    preco: 85.90,
    precoOriginal: null,
    desconto: null,
    avaliacao: 4.9,
    parcelamento: '3x de R$ 28,63',
    descricao: 'Símbolo da luta ambiental e consciência ecológica.',
    categoria: 'Camisas',
    imagem: '/produtos/camisa-verde.jpg'
  },
  {
    id: '68961ed2cf4cea023b425431',
    nome: 'Camisa Clássica Nacional',
    preco: 75.90,
    precoOriginal: 95.90,
    desconto: 21,
    avaliacao: 4.7,
    parcelamento: '3x de R$ 25,30',
    descricao: 'Design atemporal com símbolos da soberania nacional.',
    categoria: 'Camisas',
    imagem: '/produtos/camisa-classica.jpg'
  },
  // Moletons
  {
    id: '68961ed2cf4cea023b425431',
    nome: 'Moletom Pindorama Resistência',
    preco: 149.90,
    precoOriginal: 199.90,
    desconto: 25,
    avaliacao: 4.8,
    parcelamento: '5x de R$ 29,98',
    descricao: 'Moletom confortável com capuz e estampa revolucionária.',
    categoria: 'Moletons',
    imagem: '/produtos/moletom-resistencia.jpg'
  },
  {
    id: '68961ed2cf4cea023b425432',
    nome: 'Moletom Verde Esperança',
    preco: 139.90,
    precoOriginal: null,
    desconto: null,
    avaliacao: 4.6,
    parcelamento: '4x de R$ 34,98',
    descricao: 'Cor verde vibrante simbolizando a natureza brasileira.',
    categoria: 'Moletons',
    imagem: '/produtos/moletom-verde.jpg'
  },
  // Adesivos
  {
    id: '68961ed2cf4cea023b425433',
    nome: 'Adesivo Capivara Comandante',
    preco: 8.90,
    precoOriginal: null,
    desconto: null,
    avaliacao: 4.9,
    parcelamento: 'À vista',
    descricao: 'Adesivo resistente com a icônica capivara militar.',
    categoria: 'Adesivos',
    imagem: '/produtos/adesivo-capivara.jpg'
  },
  {
    id: '68961ed2cf4cea023b425434',
    nome: 'Adesivo Pindorama Soberano',
    preco: 12.90,
    precoOriginal: null,
    desconto: null,
    avaliacao: 4.7,
    parcelamento: 'À vista',
    descricao: 'Adesivo premium com logo do Pindorama Soberano.',
    categoria: 'Adesivos',
    imagem: '/produtos/adesivo-logo.jpg'
  },
  // Posters
  {
    id: '68961ed2cf4cea023b425435',
    nome: 'Pôster Capivara Comandante',
    preco: 45.90,
    precoOriginal: 65.90,
    desconto: 30,
    avaliacao: 4.8,
    parcelamento: '3x de R$ 15,30',
    descricao: 'Arte exclusiva da capivara militar em pose heroica.',
    categoria: 'Posters',
    imagem: '/produtos/poster-capivara.jpg'
  },
  {
    id: '68961ed2cf4cea023b425436',
    nome: 'Pôster Revolução dos Bichos BR',
    preco: 42.90,
    precoOriginal: 59.90,
    desconto: 28,
    avaliacao: 4.6,
    parcelamento: '3x de R$ 14,30',
    descricao: 'Releitura brasileira do clássico com fauna nacional.',
    categoria: 'Posters',
    imagem: '/produtos/poster-revolucao.jpg'
  }
];

export default function ProdutosPage() {
  const [filtroCategoria, setFiltroCategoria] = useState('Todos');
  const [ordenacao, setOrdenacao] = useState('nome');
  const [produtos, setProdutos] = useState<{
    id: string
    nome: string
    preco: number
    precoOriginal: number | null
    desconto: number | null
    avaliacao: number
    parcelamento: string
    descricao: string
    categoria: string
    imagem: string
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Buscar produtos do banco de dados
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/products?limit=50')
        
        if (!response.ok) {
          throw new Error('Erro ao carregar produtos')
        }
        
        const data: ProductsResponse = await response.json()
        
        // Converter produtos do banco para o formato esperado
        const produtosConvertidos = data.products.map(product => ({
          id: product.id,
          nome: product.name,
          preco: product.price,
          precoOriginal: null,
          desconto: null,
          avaliacao: 4.5, // Valor padrão
          parcelamento: `3x de R$ ${(product.price / 3).toFixed(2)}`,
          descricao: product.description || 'Produto de qualidade',
          categoria: product.category,
          imagem: product.image || '/produtos/placeholder.jpg'
        }))
        
        setProdutos(produtosConvertidos)
      } catch (err) {
        console.error('Erro ao buscar produtos:', err)
        setError('Erro ao carregar produtos. Usando dados de exemplo.')
        // Usar produtos estáticos como fallback
        setProdutos(produtosEstaticos)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])


  
  const categorias = ['Todos', ...Array.from(new Set(produtos.map(produto => produto.categoria)))];
  
  const produtosFiltrados = produtos.filter(produto => 
    filtroCategoria === 'Todos' || produto.categoria === filtroCategoria
  );
  
  const produtosOrdenados = [...produtosFiltrados].sort((a, b) => {
    switch (ordenacao) {
      case 'preco-asc':
        return a.preco - b.preco;
      case 'preco-desc':
        return b.preco - a.preco;
      case 'avaliacao':
        return b.avaliacao - a.avaliacao;
      default:
        return a.nome.localeCompare(b.nome);
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Carregando produtos...</p>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-white">




      {/* Seção Todos os Produtos */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Todos os Produtos
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore nossa coleção completa de produtos exclusivos
            </p>
          </motion.div>

          {/* Filtros e Ordenação */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm"
          >
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por categoria:
              </label>
              <div className="flex flex-wrap gap-2">
                {categorias.map(categoria => (
                  <button
                    key={categoria}
                    onClick={() => setFiltroCategoria(categoria)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      filtroCategoria === categoria
                        ? 'bg-green-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {categoria}
                  </button>
                ))}
              </div>
            </div>
            <div className="md:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ordenar por:
              </label>
              <select
                value={ordenacao}
                onChange={(e) => setOrdenacao(e.target.value)}
                aria-label="Ordenar produtos"
                className="w-full bg-white text-gray-900 rounded-lg px-3 py-2 border border-gray-300 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
              >
                <option value="nome">Nome</option>
                <option value="preco-asc">Menor preço</option>
                <option value="preco-desc">Maior preço</option>
                <option value="avaliacao">Melhor avaliação</option>
              </select>
            </div>
          </motion.div>

          {/* Grid de Todos os Produtos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {produtosOrdenados.map((produto, index) => (
              <motion.div
                key={produto.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden border border-gray-100"
              >
                <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                  <div className="text-8xl opacity-80 group-hover:scale-110 transition-transform duration-300">
                    {produto.categoria === 'Camisas' ? '👕' : 
                     produto.categoria === 'Moletons' ? '🧥' :
                     produto.categoria === 'Adesivos' ? '🏷️' : '🖼️'}
                  </div>
                  {produto.desconto && (
                    <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      {produto.desconto}% OFF
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex items-center bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span className="text-gray-700">{produto.avaliacao}</span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-gray-900/80 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {produto.categoria}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                    {produto.nome}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {produto.descricao}
                  </p>
                  <div className="mb-4">
                    {produto.precoOriginal && (
                      <div className="text-sm text-gray-500 line-through mb-1">
                        R$ {produto.precoOriginal.toFixed(2).replace('.', ',')}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-bold text-green-600">
                        R$ {produto.preco.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      ou {produto.parcelamento}
                    </div>
                  </div>
                  <Link 
                    href={`/produtos/${produto.id}`}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-md flex items-center justify-center"
                  >
                    Ver Produto
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {produtosOrdenados.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white rounded-2xl mt-8"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-gray-600">
                Tente ajustar os filtros para encontrar o que procura.
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Call to Action */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center bg-gradient-to-r from-green-50 to-yellow-50 rounded-2xl p-8 border border-green-100"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Mais novidades em breve!
          </h3>
          <p className="text-gray-600 mb-4">
            Fique por dentro dos lançamentos e promoções exclusivas
          </p>
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Cadastrar para Newsletter
          </button>
        </motion.div>
      </div>
    </div>
  );
}