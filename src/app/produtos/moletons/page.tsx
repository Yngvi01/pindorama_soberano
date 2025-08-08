'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';

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

export default function MoletonsPage() {
  const [ordenacao, setOrdenacao] = useState('nome');
  const [filtroTamanho, setFiltroTamanho] = useState('Todos');
  const [filtroCor, setFiltroCor] = useState('Todas');
  const [moletons, setMoletons] = useState<{
    id: string
    nome: string
    preco: number
    precoOriginal: number | null
    desconto: number | null
    avaliacao: number
    parcelamento: string
    descricao: string
    imagem: string
    tamanhos: string[]
    cores: string[]
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMoletons = async () => {
      try {
        const response = await fetch('/api/products?category=Moletons&limit=50')
        if (!response.ok) {
          throw new Error('Erro ao buscar moletons')
        }
        const data: ProductsResponse = await response.json()
        
        // Converter dados da API para o formato esperado
        const moletonsConvertidos = data.products.map(product => ({
          id: product.id,
          nome: product.name,
          preco: product.price,
          precoOriginal: Math.random() > 0.5 ? product.price * 1.3 : null,
          desconto: Math.random() > 0.5 ? Math.floor(Math.random() * 30) + 10 : null,
          avaliacao: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
          parcelamento: `${Math.ceil(product.price / 50)}x de R$ ${(product.price / Math.ceil(product.price / 50)).toFixed(2)}`,
          descricao: product.description || 'Descrição não disponível',
          imagem: product.image || '/produtos/placeholder.jpg',
          tamanhos: ['P', 'M', 'G', 'GG', 'XGG'],
          cores: ['Preto', 'Verde', 'Cinza']
        }))
        
        setMoletons(moletonsConvertidos)
      } catch (err) {
        console.error('Erro ao buscar moletons:', err)
        setError('Erro ao carregar moletons.')
      } finally {
        setLoading(false)
      }
    }

    fetchMoletons()
  }, [])

  const tamanhos = ['Todos', ...Array.from(new Set(moletons.flatMap(moletom => moletom.tamanhos)))];
  const cores = ['Todas', ...Array.from(new Set(moletons.flatMap(moletom => moletom.cores)))];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Carregando moletons...</p>
        </div>
      </div>
    )
  }

  const moletonsFiltrados = moletons
    .filter(moletom => {
      const tamanhoMatch = !filtroTamanho || moletom.tamanhos.includes(filtroTamanho);
      const corMatch = !filtroCor || moletom.cores.includes(filtroCor);
      return tamanhoMatch && corMatch;
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
              Moletons Pindorama Soberano
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Moletons confortáveis e estilosos para expressar suas convicções
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Filtros e Ordenação */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtrar e ordenar produtos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-700 font-medium text-sm mb-2">Tamanho</label>
              <select
                value={filtroTamanho}
                onChange={(e) => setFiltroTamanho(e.target.value)}
                className="w-full bg-white text-gray-900 rounded-lg px-3 py-2 border border-gray-300 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                aria-label="Filtrar por tamanho"
              >
                <option value="">Todos os tamanhos</option>
                <option value="P">P</option>
                <option value="M">M</option>
                <option value="G">G</option>
                <option value="GG">GG</option>
                <option value="XGG">XGG</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium text-sm mb-2">Cor</label>
              <select
                value={filtroCor}
                onChange={(e) => setFiltroCor(e.target.value)}
                className="w-full bg-white text-gray-900 rounded-lg px-3 py-2 border border-gray-300 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                aria-label="Filtrar por cor"
              >
                <option value="">Todas as cores</option>
                <option value="Preto">Preto</option>
                <option value="Verde Militar">Verde Militar</option>
                <option value="Verde">Verde</option>
                <option value="Cinza">Cinza</option>
                <option value="Cinza Mescla">Cinza Mescla</option>
                <option value="Vermelho">Vermelho</option>
                <option value="Azul Marinho">Azul Marinho</option>
                <option value="Branco">Branco</option>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {moletonsFiltrados.map((moletom, index) => (
            <motion.div
              key={moletom.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden border border-gray-100 relative"
            >
              {/* Badge de desconto */}
              {moletom.desconto && (
                <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-md text-sm font-bold z-10">
                  {moletom.desconto}% OFF
                </div>
              )}
              
              {/* Avaliação */}
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1 z-10">
                <span className="text-yellow-400 text-sm">★</span>
                <span className="text-sm font-medium text-gray-700">{moletom.avaliacao}</span>
              </div>

              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                <div className="text-8xl opacity-80 group-hover:scale-110 transition-transform duration-300">🧥</div>
              </div>
              <div className="p-4">
                <h3 className="text-base font-medium text-gray-900 mb-3 line-clamp-2">
                  {moletom.nome}
                </h3>
                
                <div className="space-y-2 mb-4">
                  {/* Preços */}
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      R$ {moletom.preco.toFixed(2).replace('.', ',')}
                    </span>
                    {moletom.precoOriginal && (
                      <span className="text-sm text-gray-500 line-through">
                        R$ {moletom.precoOriginal.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                  </div>
                  
                  {/* Parcelamento */}
                  <p className="text-sm text-gray-600">
                    ou {moletom.parcelamento}
                  </p>
                </div>

                <Link 
                  href={`/produtos/${moletom.id}`}
                  className="block w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-md text-center"
                >
                  Ver Produto
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {moletonsFiltrados.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-gray-50 rounded-2xl mt-8"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum moletom encontrado
            </h3>
            <p className="text-gray-600">
              Tente ajustar os filtros para encontrar o que procura.
            </p>
          </motion.div>
        )}

        {/* Informações adicionais */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Informações dos Moletons</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-bold text-green-600 mb-2">Material</h4>
              <p className="text-gray-700">100% algodão premium, macio e confortável</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-bold text-green-600 mb-2">Cuidados</h4>
              <p className="text-gray-700">Lavar à máquina em água fria, não usar alvejante</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-bold text-green-600 mb-2">Entrega</h4>
              <p className="text-gray-700">Frete grátis para compras acima de R$ 150,00</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-bold text-green-600 mb-2">Garantia</h4>
              <p className="text-gray-700">30 dias para troca ou devolução</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}