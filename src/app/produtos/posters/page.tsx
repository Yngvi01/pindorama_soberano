'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const posters = [
  {
    id: 1,
    nome: 'Camisa Ability - Preta',
    preco: 155.40,
    precoOriginal: 259.00,
    desconto: 40,
    avaliacao: 4.9,
    parcelamento: '3x de R$ 51,80',
    descricao: 'Arte exclusiva da capivara militar em pose heroica, perfeita para decorar seu ambiente.',
    imagem: '/produtos/poster-capivara-comandante.jpg',
    tamanhos: ['A4 (21x30cm)', 'A3 (30x42cm)', 'A2 (42x59cm)'],
    acabamento: ['Papel Fotográfico', 'Canvas'],
    categoria: 'arte-original'
  },
  {
    id: 2,
    nome: 'Camisa Ability - Camurça',
    preco: 155.40,
    precoOriginal: 259.00,
    desconto: 40,
    avaliacao: 4.3,
    parcelamento: '3x de R$ 51,80',
    descricao: 'Releitura brasileira do clássico com animais da fauna nacional em luta pela liberdade.',
    imagem: '/produtos/poster-revolucao-bichos.jpg',
    tamanhos: ['A4 (21x30cm)', 'A3 (30x42cm)'],
    acabamento: ['Papel Fotográfico', 'Canvas'],
    categoria: 'arte-original'
  },
  {
    id: 3,
    nome: 'Camisa de Combate Leader - Preto',
    preco: 289.00,
    precoOriginal: null,
    desconto: null,
    avaliacao: 4.7,
    parcelamento: '5x de R$ 57,80',
    descricao: 'Compilação dos melhores memes políticos em formato artístico.',
    imagem: '/produtos/poster-meme-collection.jpg',
    tamanhos: ['A4 (21x30cm)', 'A3 (30x42cm)', 'A2 (42x59cm)'],
    acabamento: ['Papel Fotográfico'],
    categoria: 'memes'
  },
  {
    id: 4,
    nome: 'Camisa Lumberjack Relief - Caqui',
    preco: 220.15,
    precoOriginal: 259.00,
    desconto: 15,
    avaliacao: 5.0,
    parcelamento: '4x de R$ 55,03',
    descricao: 'Representação artística do Brasil livre e soberano com elementos da natureza.',
    imagem: '/produtos/poster-pindorama-livre.jpg',
    tamanhos: ['A3 (30x42cm)', 'A2 (42x59cm)', 'A1 (59x84cm)'],
    acabamento: ['Papel Fotográfico', 'Canvas', 'Papel Fine Art'],
    categoria: 'arte-original'
  },
  {
    id: 5,
    nome: 'Camisa de flanela xadrez Lumberjack OAP - Verde',
    preco: 228.05,
    precoOriginal: 269.00,
    desconto: 15,
    avaliacao: 4.8,
    parcelamento: '4x de R$ 57,16',
    descricao: 'Arte inspirada nos movimentos de resistência com símbolos da luta popular.',
    imagem: '/produtos/poster-resistencia.jpg',
    tamanhos: ['A4 (21x30cm)', 'A3 (30x42cm)'],
    acabamento: ['Papel Fotográfico', 'Canvas'],
    categoria: 'politico'
  },
  {
    id: 6,
    nome: 'Camisa Ability - Azul',
    preco: 155.40,
    precoOriginal: 259.00,
    desconto: 40,
    avaliacao: 4.6,
    parcelamento: '3x de R$ 51,80',
    descricao: 'Coleção de animais brasileiros em versão militante e cartoon.',
    imagem: '/produtos/poster-fauna-militante.jpg',
    tamanhos: ['A4 (21x30cm)', 'A3 (30x42cm)', 'A2 (42x59cm)'],
    acabamento: ['Papel Fotográfico', 'Canvas'],
    categoria: 'arte-original'
  },
  {
    id: 7,
    nome: 'Pôster Edição Limitada - Capivara Gold',
    preco: 59.90,
    descricao: 'Edição limitada com acabamento especial dourado e numeração.',
    imagem: '/produtos/poster-capivara-gold.jpg',
    tamanhos: ['A3 (30x42cm)', 'A2 (42x59cm)'],
    acabamento: ['Papel Fine Art', 'Canvas Premium'],
    categoria: 'edicao-limitada'
  }
];

export default function PostersPage() {
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroTamanho, setFiltroTamanho] = useState('');
  const [filtroAcabamento, setFiltroAcabamento] = useState('');
  const [ordenacao, setOrdenacao] = useState('nome');

  const postersFiltrados = posters
    .filter(poster => {
      const categoriaMatch = !filtroCategoria || poster.categoria === filtroCategoria;
      const tamanhoMatch = !filtroTamanho || poster.tamanhos.includes(filtroTamanho);
      const acabamentoMatch = !filtroAcabamento || poster.acabamento.includes(filtroAcabamento);
      return categoriaMatch && tamanhoMatch && acabamentoMatch;
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
              >
                <option value="">Todas as categorias</option>
                <option value="arte-original">Arte Original</option>
                <option value="memes">Memes</option>
                <option value="politico">Político</option>
                <option value="edicao-limitada">Edição Limitada</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium text-sm mb-2">Tamanho</label>
              <select
                value={filtroTamanho}
                onChange={(e) => setFiltroTamanho(e.target.value)}
                className="w-full bg-white text-gray-900 rounded-lg px-3 py-2 border border-gray-300 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
              >
                <option value="">Todos os tamanhos</option>
                <option value="A4 (21x30cm)">A4 (21x30cm)</option>
                <option value="A3 (30x42cm)">A3 (30x42cm)</option>
                <option value="A2 (42x59cm)">A2 (42x59cm)</option>
                <option value="A1 (59x84cm)">A1 (59x84cm)</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium text-sm mb-2">Acabamento</label>
              <select
                value={filtroAcabamento}
                onChange={(e) => setFiltroAcabamento(e.target.value)}
                className="w-full bg-white text-gray-900 rounded-lg px-3 py-2 border border-gray-300 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
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
          {postersFiltrados.map((poster, index) => (
            <motion.div
              key={poster.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden border border-gray-100"
            >
              <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                <div className="text-8xl opacity-80 group-hover:scale-110 transition-transform duration-300">🖼️</div>
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
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                  {poster.nome}
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {poster.descricao}
                </p>
                <div className="mb-4">
                  {poster.precoOriginal && (
                    <div className="text-sm text-gray-500 line-through mb-1">
                      R$ {poster.precoOriginal.toFixed(2).replace('.', ',')}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold text-green-600">
                      R$ {poster.preco.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    ou {poster.parcelamento}
                  </div>
                </div>

                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-md">
                  Adicionar ao Carrinho
                </button>
              </div>
            </motion.div>
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