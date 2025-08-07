'use client';

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

export default function AdesivosPage() {
  const [ordenacao, setOrdenacao] = useState('nome');
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [adesivos, setAdesivos] = useState<{
    id: string
    nome: string
    preco: number
    precoOriginal: number | null
    desconto: number | null
    avaliacao: number
    parcelamento: string
    descricao: string
    imagem: string
    tamanho: string
    quantidade: number
    categoria: string
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdesivos = async () => {
      try {
        const response = await fetch('/api/products?category=Adesivos&limit=50')
        if (!response.ok) {
          throw new Error('Erro ao buscar adesivos')
        }
        const data: ProductsResponse = await response.json()
        
        // Converter dados da API para o formato esperado
        const adesivosConvertidos = data.products.map(product => ({
          id: product.id,
          nome: product.name,
          preco: product.price,
          precoOriginal: Math.random() > 0.5 ? product.price * 1.3 : null,
          desconto: Math.random() > 0.5 ? Math.floor(Math.random() * 30) + 10 : null,
          avaliacao: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
          parcelamento: `${Math.ceil(product.price / 15)}x de R$ ${(product.price / Math.ceil(product.price / 15)).toFixed(2)}`,
          descricao: product.description || 'Descrição não disponível',
          imagem: product.image || '/produtos/placeholder.jpg',
          tamanho: '10x10cm',
          quantidade: Math.floor(Math.random() * 8) + 1,
          categoria: Math.random() > 0.5 ? 'pack' : 'individual'
        }))
        
        setAdesivos(adesivosConvertidos)
      } catch (err) {
        console.error('Erro ao buscar adesivos:', err)
        setError('Erro ao carregar adesivos.')
      } finally {
        setLoading(false)
      }
    }

    fetchAdesivos()
  }, [])

  const adesivosFiltrados = adesivos.filter(adesivo => {
    return filtroCategoria === 'Todas' || adesivo.categoria === filtroCategoria;
  });

  const adesivosOrdenados = [...adesivosFiltrados].sort((a, b) => {
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
          <div className="text-6xl mb-4">⏳</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Carregando adesivos...
          </h3>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Erro ao carregar adesivos
          </h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Adesivos Pindorama Soberano
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Adesivos resistentes para expressar suas ideias em qualquer lugar
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtros e Ordenação</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium text-sm mb-2">Categoria</label>
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="w-full bg-white text-gray-900 rounded-lg px-3 py-2 border border-gray-300 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                aria-label="Filtrar por categoria"
              >
                <option value="Todas">Todas as categorias</option>
                <option value="individual">Individual</option>
                <option value="pack">Packs</option>
                <option value="premium">Premium</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium text-sm mb-2">Ordenar por</label>
              <select
                value={ordenacao}
                onChange={(e) => setOrdenacao(e.target.value)}
                className="w-full bg-white text-gray-900 rounded-lg px-3 py-2 border border-gray-300 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                aria-label="Ordenar produtos"
              >
                <option value="nome">Nome</option>
                <option value="preco-asc">Menor preço</option>
                <option value="preco-desc">Maior preço</option>
                <option value="quantidade">Mais itens</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Grid de Produtos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {adesivosOrdenados.map((adesivo, index) => (
            <motion.div
              key={adesivo.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden border border-gray-100 relative"
            >
              {/* Badge de desconto */}
              {adesivo.desconto && (
                <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-md text-sm font-bold z-10">
                  {adesivo.desconto}% OFF
                </div>
              )}
              
              {/* Avaliação */}
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1 z-10">
                <span className="text-yellow-400 text-sm">★</span>
                <span className="text-sm font-medium text-gray-700">{adesivo.avaliacao}</span>
              </div>

              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                <div className="text-6xl opacity-80 group-hover:scale-110 transition-transform duration-300">🏷️</div>
              </div>
              <div className="p-4">
                <h3 className="text-base font-medium text-gray-900 mb-3 line-clamp-2">
                  {adesivo.nome}
                </h3>
                
                <div className="space-y-2 mb-4">
                  {/* Preços */}
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      R$ {adesivo.preco.toFixed(2).replace('.', ',')}
                    </span>
                    {adesivo.precoOriginal && (
                      <span className="text-sm text-gray-500 line-through">
                        R$ {adesivo.precoOriginal.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                  </div>
                  
                  {/* Parcelamento */}
                  <p className="text-sm text-gray-600">
                    ou {adesivo.parcelamento}
                  </p>
                </div>

                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-md">
                  Adicionar ao Carrinho
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {adesivosOrdenados.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-gray-50 rounded-2xl mt-8"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum adesivo encontrado
            </h3>
            <p className="text-gray-600">
              Tente ajustar os filtros para encontrar o que procura.
            </p>
          </motion.div>
        )}

        {/* Promoções */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-8 border border-green-200"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">🎉 Promoções Especiais</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <div className="text-3xl mb-3">📦</div>
              <h4 className="font-bold text-green-600 mb-2">Frete Grátis</h4>
              <p className="text-gray-600 text-sm">Compras acima de R$ 50,00</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <div className="text-3xl mb-3">🎁</div>
              <h4 className="font-bold text-green-600 mb-2">Leve 3 Pague 2</h4>
              <p className="text-gray-600 text-sm">Em adesivos individuais</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <div className="text-3xl mb-3">⭐</div>
              <h4 className="font-bold text-green-600 mb-2">Adesivo Brinde</h4>
              <p className="text-gray-600 text-sm">Em toda compra de pack</p>
            </div>
          </div>
        </motion.div>

        {/* Informações técnicas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-8 bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Informações dos Adesivos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-bold text-green-600 mb-2">Material</h4>
              <p className="text-gray-700">Vinil adesivo de alta qualidade, resistente à água</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-bold text-green-600 mb-2">Durabilidade</h4>
              <p className="text-gray-700">Até 5 anos em uso externo, permanente em uso interno</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-bold text-green-600 mb-2">Aplicação</h4>
              <p className="text-gray-700">Superfícies lisas: notebooks, carros, geladeiras, etc.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-bold text-green-600 mb-2">Impressão</h4>
              <p className="text-gray-700">Impressão digital em alta resolução com cores vibrantes</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}