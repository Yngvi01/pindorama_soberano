'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const camisas = [
  {
    id: 1,
    nome: 'Camisa Ability - Preta',
    preco: 155.40,
    precoOriginal: 259.00,
    desconto: 40,
    avaliacao: 4.9,
    parcelamento: '3x de R$ 51,80',
    descricao: 'Camisa com estampa exclusiva da capivara militar em estilo cartoon, representando a resistência popular.',
    imagem: '/produtos/camisa-capivara.jpg',
    tamanhos: ['P', 'M', 'G', 'GG'],
    cores: ['Preta', 'Branca', 'Verde Militar']
  },
  {
    id: 2,
    nome: 'Camisa Ability - Camurça',
    preco: 155.40,
    precoOriginal: 259.00,
    desconto: 40,
    avaliacao: 4.3,
    parcelamento: '3x de R$ 51,80',
    descricao: 'Design inspirado na liberdade do povo brasileiro, com elementos da fauna nacional.',
    imagem: '/produtos/camisa-pindorama.jpg',
    tamanhos: ['P', 'M', 'G', 'GG'],
    cores: ['Preta', 'Vermelha', 'Azul']
  },
  {
    id: 3,
    nome: 'Camisa de Combate Leader - Preto',
    preco: 289.00,
    precoOriginal: null,
    desconto: null,
    avaliacao: 4.7,
    parcelamento: '5x de R$ 57,80',
    descricao: 'Estampa com memes políticos e símbolos da luta pela soberania nacional.',
    imagem: '/produtos/camisa-soberania.jpg',
    tamanhos: ['P', 'M', 'G', 'GG', 'XGG'],
    cores: ['Preta', 'Branca']
  },
  {
    id: 4,
    nome: 'Camisa Lumberjack Relief - Caqui',
    preco: 220.15,
    precoOriginal: 259.00,
    desconto: 15,
    avaliacao: 5.0,
    parcelamento: '4x de R$ 55,03',
    descricao: 'Camisa estilo lumberjack com padrão xadrez em tons de caqui.',
    imagem: '/produtos/camisa-lumberjack.jpg',
    tamanhos: ['P', 'M', 'G', 'GG'],
    cores: ['Caqui', 'Verde', 'Marrom']
  },
  {
    id: 5,
    nome: 'Camisa de flanela xadrez Lumberjack OAP - Verde',
    preco: 228.05,
    precoOriginal: 259.00,
    desconto: 15,
    avaliacao: 4.4,
    parcelamento: '4x de R$ 57,16',
    descricao: 'Camisa de flanela com padrão xadrez em tons de verde.',
    imagem: '/produtos/camisa-flanela.jpg',
    tamanhos: ['P', 'M', 'G', 'GG'],
    cores: ['Verde', 'Azul', 'Preto']
  }
];

export default function CamisasPage() {
  const [filtroTamanho, setFiltroTamanho] = useState('');
  const [filtroCor, setFiltroCor] = useState('');

  const camisasFiltradas = camisas.filter(camisa => {
    const tamanhoMatch = !filtroTamanho || camisa.tamanhos.includes(filtroTamanho);
    const corMatch = !filtroCor || camisa.cores.includes(filtroCor);
    return tamanhoMatch && corMatch;
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {camisasFiltradas.map((camisa, index) => (
            <motion.div
              key={camisa.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden border border-gray-100 relative"
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

              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                <div className="text-8xl opacity-80 group-hover:scale-110 transition-transform duration-300">👕</div>
              </div>
              <div className="p-4">
                <h3 className="text-base font-medium text-gray-900 mb-3 line-clamp-2">
                  {camisa.nome}
                </h3>
                
                <div className="space-y-2 mb-4">
                  {/* Preços */}
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
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

                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-md">
                  Adicionar ao Carrinho
                </button>
              </div>
            </motion.div>
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