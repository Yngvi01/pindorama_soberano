'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
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

export default function PostersPage() {
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [filtroAcabamento, setFiltroAcabamento] = useState('Todos');
  const [ordenacao, setOrdenacao] = useState('nome');
  const [posters, setPosters] = useState<{
    id: string
    nome: string
    preco: number
    precoOriginal: number | null
    desconto: number | null
    avaliacao: number
    parcelamento: string
    descricao: string
    imagem: string
    acabamento: string[]
    categoria: string
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosters = async () => {
      try {
        const response = await fetch('/api/products?category=Posters&limit=50')
        if (!response.ok) {
          throw new Error('Erro ao buscar posters')
        }
        const data: ProductsResponse = await response.json()
        
        // Converter dados da API para o formato esperado
        const postersConvertidos = data.products.map(product => ({
          id: product.id,
          nome: product.name,
          preco: product.price,
          precoOriginal: Math.random() > 0.5 ? product.price * 1.3 : null,
          desconto: Math.random() > 0.5 ? Math.floor(Math.random() * 30) + 10 : null,
          avaliacao: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
          parcelamento: `${Math.ceil(product.price / 20)}x de R$ ${(product.price / Math.ceil(product.price / 20)).toFixed(2)}`,
          descricao: product.description || 'Descrição não disponível',
          imagem: product.image || '/produtos/placeholder.jpg',
          acabamento: ['Papel Fotográfico', 'Canvas'],
          categoria: Math.random() > 0.5 ? 'arte-original' : 'politico'
        }))
        
        setPosters(postersConvertidos)
      } catch (err) {
        console.error('Erro ao buscar posters:', err)
        setError('Erro ao carregar posters.')
      } finally {
        setLoading(false)
      }
    }

    fetchPosters()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Carregando pôsteres...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-lg text-red-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  const postersFiltrados = posters
    .filter(poster => {
      const categoriaMatch = filtroCategoria === 'Todas' || poster.categoria === filtroCategoria;
      const acabamentoMatch = filtroAcabamento === 'Todos' || poster.acabamento.includes(filtroAcabamento);
      return categoriaMatch && acabamentoMatch;
    })
    .sort((a, b) => {
      if (ordenacao === 'preco-asc') return a.preco - b.preco;
      if (ordenacao === 'preco-desc') return b.preco - a.preco;
      return a.nome.localeCompare(b.nome);
    });

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
              Pôsteres Pindorama Soberano
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Arte exclusiva para decorar e expressar suas convicções políticas
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
          <h3 className="text-gray-900 font-bold mb-4">Filtros e Ordenação</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-gray-700 font-medium text-sm mb-2">Categoria</label>
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="w-full bg-white text-gray-900 rounded-lg px-3 py-2 border border-gray-300 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                aria-label="Filtrar por categoria"
              >
                <option value="">Todas as categorias</option>
                <option value="arte-original">Arte Original</option>
                <option value="memes">Memes</option>
                <option value="politico">Político</option>
                <option value="edicao-limitada">Edição Limitada</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium text-sm mb-2">Acabamento</label>
              <select
                value={filtroAcabamento}
                onChange={(e) => setFiltroAcabamento(e.target.value)}
                className="w-full bg-white text-gray-900 rounded-lg px-3 py-2 border border-gray-300 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                aria-label="Filtrar por acabamento"
              >
                <option value="">Todos os acabamentos</option>
                <option value="Papel Fotográfico">Papel Fotográfico</option>
                <option value="Canvas">Canvas</option>
                <option value="Papel Fine Art">Papel Fine Art</option>
                <option value="Canvas Premium">Canvas Premium</option>
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
              </select>
            </div>
          </div>
        </motion.div>

        {/* Grid de Produtos */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {postersFiltrados.map((poster, index) => (
            <Link href={`/produtos/${poster.id}`} key={poster.id}>
              <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden border border-gray-100 cursor-pointer"
                >
                <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden">
                  <Image
                    src={poster.imagem}
                    alt={poster.nome}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                {poster.desconto && (
                  <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    {poster.desconto}% OFF
                  </div>
                )}
                <div className="absolute top-3 right-3 flex items-center bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                  <span className="text-yellow-500 mr-1">★</span>
                  <span className="text-gray-700">{poster.avaliacao}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                  {poster.nome}
                </h3>
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                  {poster.descricao}
                </p>
                <div className="mb-3">
                  {poster.precoOriginal && (
                    <div className="text-sm text-gray-500 line-through mb-1">
                      R$ {poster.precoOriginal.toFixed(2).replace('.', ',')}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl font-bold text-green-600">
                      R$ {poster.preco.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    ou {poster.parcelamento}
                  </div>
                </div>

              </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {postersFiltrados.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-gray-50 rounded-2xl mt-8"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum pôster encontrado
            </h3>
            <p className="text-gray-600">
              Tente ajustar os filtros para encontrar o que procura.
            </p>
          </motion.div>
        )}

        {/* Seção de destaque */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-100"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">🎨 Arte com Propósito</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🖌️</div>
              <h4 className="font-bold text-green-600 mb-2">Arte Original</h4>
              <p className="text-gray-600 text-sm">Criações exclusivas dos nossos artistas</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🌱</div>
              <h4 className="font-bold text-green-600 mb-2">Sustentável</h4>
              <p className="text-gray-600 text-sm">Impressão eco-friendly com tintas vegetais</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">✊</div>
              <h4 className="font-bold text-green-600 mb-2">Engajamento</h4>
              <p className="text-gray-600 text-sm">Arte que inspira mudança social</p>
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
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Informações dos Pôsteres</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-gray-600">
            <div>
              <h4 className="font-bold text-green-600 mb-2">Papel Fotográfico</h4>
              <p className="text-sm">Papel premium 250g/m², brilho acetinado, cores vibrantes</p>
            </div>
            <div>
              <h4 className="font-bold text-green-600 mb-2">Canvas</h4>
              <p className="text-sm">Tecido 100% algodão, textura artística, durabilidade superior</p>
            </div>
            <div>
              <h4 className="font-bold text-green-600 mb-2">Fine Art</h4>
              <p className="text-sm">Papel museu 300g/m², livre de ácido, arquivo permanente</p>
            </div>
            <div>
              <h4 className="font-bold text-green-600 mb-2">Entrega</h4>
              <p className="text-sm">Embalagem protetora, tubo rígido para tamanhos grandes</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}