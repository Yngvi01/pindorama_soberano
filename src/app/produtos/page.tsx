'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

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
  specifications?: Record<string, string | number | boolean>
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



function ProdutosPageContent() {
  const searchParams = useSearchParams();
  const categoriaParam = searchParams.get('categoria');
  
  // Mapear categorias da URL para categorias do sistema
  const mapearCategoria = (categoria: string | null) => {
    if (!categoria) return 'Todos';
    
    const mapeamento: { [key: string]: string } = {
      'camisetas': 'Camisas',
      'moletons': 'Moletons', 
      'adesivos': 'Adesivos'
    };
    
    return mapeamento[categoria.toLowerCase()] || 'Todos';
  };
  
  const [filtroCategoria, setFiltroCategoria] = useState(() => mapearCategoria(categoriaParam));
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
    tamanhos: string[]
    cores: string[]
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          imagem: product.image || '/produtos/placeholder.jpg',
          tamanhos: product.category === 'Camisas' || product.category === 'Moletons' ? (product.sizes || ['P', 'M', 'G', 'GG']) : [],
          cores: product.category === 'Camisas' || product.category === 'Moletons' ? (product.colors || ['Preta', 'Branca', 'Verde']) : []
        }))
        
        setProdutos(produtosConvertidos)
      } catch (err) {
        console.error('Erro ao buscar produtos:', err)
        setError('Erro ao carregar produtos do banco de dados.')
        setProdutos([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Atualizar filtro quando parâmetros da URL mudarem
  useEffect(() => {
    const novaCategoria = mapearCategoria(categoriaParam);
    setFiltroCategoria(novaCategoria);
  }, [categoriaParam]);

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
      {/* Hero Section para Categorias Específicas */}
      {filtroCategoria === 'Camisas' && (
        <div className="relative h-96 overflow-hidden" style={{background: 'linear-gradient(to right, #3b82f6, #4f46e5)'}}>
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white max-w-2xl"
            >
              <h1 className="text-5xl font-bold mb-4">Camisas Exclusivas</h1>
              <p className="text-xl mb-6">Descubra nossa coleção de camisas com designs únicos e qualidade premium</p>
              <div className="flex flex-wrap items-center gap-3">
                 <div className="bg-white bg-opacity-90 px-4 py-2 rounded-full backdrop-blur-sm">
                   <span className="text-sm font-medium text-gray-800">✨ Designs Únicos</span>
                 </div>
                 <div className="bg-white bg-opacity-90 px-4 py-2 rounded-full backdrop-blur-sm">
                   <span className="text-sm font-medium text-gray-800">🎨 Alta Qualidade</span>
                 </div>
               </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute right-10 top-1/2 transform -translate-y-1/2"
            >
              <div className="w-64 h-64 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
                <span className="text-8xl">👕</span>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {filtroCategoria === 'Moletons' && (
         <div className="relative h-96 overflow-hidden" style={{background: 'linear-gradient(to right, #10b981, #0d9488)'}}>
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white max-w-2xl"
            >
              <h1 className="text-5xl font-bold mb-4">Moletons Confortáveis</h1>
              <p className="text-xl mb-6">Conforto e estilo em cada peça. Perfeitos para qualquer ocasião</p>
              <div className="flex flex-wrap items-center gap-3">
                 <div className="bg-white bg-opacity-90 px-4 py-2 rounded-full backdrop-blur-sm">
                   <span className="text-sm font-medium text-gray-800">🔥 Super Confortáveis</span>
                 </div>
                 <div className="bg-white bg-opacity-90 px-4 py-2 rounded-full backdrop-blur-sm">
                   <span className="text-sm font-medium text-gray-800">❄️ Para Todas as Estações</span>
                 </div>
               </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute right-10 top-1/2 transform -translate-y-1/2"
            >
              <div className="w-64 h-64 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
                <span className="text-8xl">🧥</span>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {filtroCategoria === 'Adesivos' && (
         <div className="relative h-96 overflow-hidden" style={{background: 'linear-gradient(to right, #8b5cf6, #ec4899)'}}>
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white max-w-2xl"
            >
              <h1 className="text-5xl font-bold mb-4">Adesivos Criativos</h1>
              <p className="text-xl mb-6">Personalize seu mundo com nossos adesivos únicos e resistentes</p>
              <div className="flex flex-wrap items-center gap-3">
                 <div className="bg-white bg-opacity-90 px-4 py-2 rounded-full backdrop-blur-sm">
                   <span className="text-sm font-medium text-gray-800">🎨 Designs Exclusivos</span>
                 </div>
                 <div className="bg-white bg-opacity-90 px-4 py-2 rounded-full backdrop-blur-sm">
                   <span className="text-sm font-medium text-gray-800">💪 Alta Durabilidade</span>
                 </div>
               </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute right-10 top-1/2 transform -translate-y-1/2"
            >
              <div className="w-64 h-64 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
                <span className="text-8xl">🏷️</span>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Hero Section para Todos os Produtos */}
      {filtroCategoria === 'Todos' && (
        <div className="relative h-96 overflow-hidden" style={{background: 'linear-gradient(to right, #f97316, #dc2626)'}}>
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white max-w-3xl mx-auto text-center"
            >
              <h1 className="text-6xl font-bold mb-6">Todos os Produtos</h1>
              <p className="text-2xl mb-8">Explore nossa coleção completa de produtos exclusivos e únicos</p>
              <div className="flex flex-wrap justify-center items-center gap-4">
                <div className="bg-white bg-opacity-90 px-4 py-2 rounded-full backdrop-blur-sm">
                  <span className="text-sm font-medium text-gray-800">🎨 Design Exclusivo</span>
                </div>
                <div className="bg-white bg-opacity-90 px-4 py-2 rounded-full backdrop-blur-sm">
                  <span className="text-sm font-medium text-gray-800">⚡ Entrega Rápida</span>
                </div>
                <div className="bg-white bg-opacity-90 px-4 py-2 rounded-full backdrop-blur-sm">
                  <span className="text-sm font-medium text-gray-800">💎 Qualidade Premium</span>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="absolute top-10 right-10"
            >
              <div className="w-32 h-32 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
                <span className="text-5xl">🛍️</span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute bottom-10 left-10"
            >
              <div className="w-24 h-24 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
                <span className="text-3xl">✨</span>
              </div>
            </motion.div>
          </div>
        </div>
      )}

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
              {filtroCategoria === 'Todos' ? 'Todos os Produtos' : filtroCategoria}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {filtroCategoria === 'Todos' 
                ? 'Explore nossa coleção completa de produtos exclusivos'
                : `Confira nossa seleção de ${filtroCategoria.toLowerCase()}`
              }
            </p>
          </motion.div>

          {/* Filtros e Ordenação - Só mostrar quando for "Todos" */}
          {filtroCategoria === 'Todos' && (
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
           )}

          {/* Grid de Todos os Produtos */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {produtosOrdenados.map((produto, index) => (
              <Link href={`/produtos/${produto.id}`} key={produto.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden border border-gray-100 cursor-pointer"
                >
                <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden">
                  <Image
                    src={produto.imagem}
                    alt={produto.nome}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
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
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                    {produto.nome}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                    {produto.descricao}
                  </p>
                  <div className="mb-3">
                    {produto.precoOriginal && (
                      <div className="text-sm text-gray-500 line-through mb-1">
                        R$ {produto.precoOriginal.toFixed(2).replace('.', ',')}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl font-bold text-green-600">
                        R$ {produto.preco.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      ou {produto.parcelamento}
                    </div>
                </div>
                

                
                </div>
                </motion.div>
              </Link>
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

export default function ProdutosPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Carregando produtos...</p>
        </div>
      </div>
    }>
      <ProdutosPageContent />
    </Suspense>
  );
}