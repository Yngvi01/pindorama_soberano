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

export default function CamisasPage() {
  const [filtroTamanho, setFiltroTamanho] = useState('Todos');
  const [filtroCor, setFiltroCor] = useState('Todas');
  const [camisas, setCamisas] = useState<{
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCamisas = async () => {
      try {
        const response = await fetch('/api/products?category=Camisas&limit=50')
        if (!response.ok) {
          throw new Error('Erro ao buscar camisas')
        }
        const data: ProductsResponse = await response.json()
        
        // Converter dados da API para o formato esperado
        const camisasConvertidas = data.products.map(product => ({
          id: product.id,
          nome: product.name,
          preco: product.price,
          precoOriginal: Math.random() > 0.5 ? product.price * 1.3 : null,
          desconto: Math.random() > 0.5 ? Math.floor(Math.random() * 30) + 10 : null,
          avaliacao: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
          parcelamento: `${Math.ceil(product.price / 50)}x de R$ ${(product.price / Math.ceil(product.price / 50)).toFixed(2)}`,
          descricao: product.description || 'Descrição não disponível',
          imagem: product.image || '/produtos/placeholder.jpg',
          tamanhos: ['P', 'M', 'G', 'GG'],
          cores: ['Preta', 'Branca', 'Verde']
        }))
        
        setCamisas(camisasConvertidas)
      } catch (err) {
        console.error('Erro ao buscar camisas:', err)
        setError('Erro ao carregar camisas.')
      } finally {
        setLoading(false)
      }
    }

    fetchCamisas()
  }, [])

  const camisasFiltradas = camisas.filter(camisa => {
    const tamanhoMatch = filtroTamanho === 'Todos' || camisa.tamanhos.includes(filtroTamanho);
    const corMatch = filtroCor === 'Todas' || camisa.cores.includes(filtroCor);
    return tamanhoMatch && corMatch;
  });



  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Carregando camisas...</p>
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
              Camisas Pindorama Soberano
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Camisas exclusivas com designs únicos e mensagens de resistência
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
          className="mb-12 bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtrar produtos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Tamanho</label>
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
              <label className="block text-gray-700 mb-2 font-medium">Cor</label>
              <select
                value={filtroCor}
                onChange={(e) => setFiltroCor(e.target.value)}
                className="w-full bg-white text-gray-900 rounded-lg px-3 py-2 border border-gray-300 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                aria-label="Filtrar por cor"
              >
                <option value="">Todas as cores</option>
                <option value="Preta">Preta</option>
                <option value="Branca">Branca</option>
                <option value="Verde Militar">Verde Militar</option>
                <option value="Vermelha">Vermelha</option>
                <option value="Azul">Azul</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Grid de Produtos */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {camisasFiltradas.map((camisa, index) => (
            <Link href={`/produtos/${camisa.id}`} key={camisa.id}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden border border-gray-100 cursor-pointer"
              >
              {/* Badge de desconto */}
              {camisa.desconto && (
                <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-md text-sm font-bold z-10">
                  {camisa.desconto}% OFF
                </div>
              )}
              
              {/* Avaliação */}
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1 z-10">
                <span className="text-yellow-400 text-sm">★</span>
                <span className="text-sm font-medium text-gray-700">{camisa.avaliacao}</span>
              </div>

              <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden">
                <Image
                  src={camisa.imagem}
                  alt={camisa.nome}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                  {camisa.nome}
                </h3>
                
                <div className="mb-3">
                  {/* Preços */}
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-green-600">
                      R$ {camisa.preco.toFixed(2).replace('.', ',')}
                    </span>
                    {camisa.precoOriginal && (
                      <span className="text-sm text-gray-500 line-through">
                        R$ {camisa.precoOriginal.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                  </div>
                  
                  {/* Parcelamento */}
                  <p className="text-sm text-gray-600">
                    ou {camisa.parcelamento}
                  </p>
                </div>



              </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {camisasFiltradas.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-gray-50 rounded-2xl mt-8"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhuma camisa encontrada
            </h3>
            <p className="text-gray-600">
              Tente ajustar os filtros para encontrar o que procura.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}