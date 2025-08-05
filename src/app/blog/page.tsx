'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';

// Posts do blog (em uma aplicação real, isso viria de um CMS ou API)
const blogPosts = [
  {
    id: 'capivara-revolucionaria',
    titulo: 'A Capivara Revolucionária: Símbolo da Resistência Brasileira',
    resumo: 'Descubra como a capivara se tornou um ícone da luta pela soberania nacional e liberdade do povo brasileiro.',
    autor: 'Equipe Pindorama',
    data: '2024-01-15',
    categoria: 'História',
    tempoLeitura: '5 min',
    imagem: '/blog/capivara-revolucionaria.jpg',
    slug: 'capivara-revolucionaria'
  },
  {
    id: 'pindorama-origem',
    titulo: 'Pindorama: O Nome Verdadeiro da Nossa Terra',
    resumo: 'Explore a origem indígena do nome Pindorama e seu significado profundo para a identidade nacional.',
    autor: 'Dr. João Silva',
    data: '2024-01-10',
    categoria: 'Cultura',
    tempoLeitura: '7 min',
    imagem: '/blog/pindorama-origem.jpg',
    slug: 'pindorama-origem'
  },
  {
    id: 'soberania-nacional',
    titulo: 'Soberania Nacional: Construindo um Brasil Independente',
    resumo: 'Reflexões sobre a importância da soberania nacional e como cada cidadão pode contribuir para um país mais livre.',
    autor: 'Maria Santos',
    data: '2024-01-05',
    categoria: 'Política',
    tempoLeitura: '8 min',
    imagem: '/blog/soberania-nacional.jpg',
    slug: 'soberania-nacional'
  },
  {
    id: 'arte-resistencia',
    titulo: 'Arte como Forma de Resistência Cultural',
    resumo: 'Como a arte e o design podem ser ferramentas poderosas na preservação e promoção da cultura brasileira.',
    autor: 'Carlos Artista',
    data: '2023-12-28',
    categoria: 'Arte',
    tempoLeitura: '6 min',
    imagem: '/blog/arte-resistencia.jpg',
    slug: 'arte-resistencia'
  },
  {
    id: 'economia-local',
    titulo: 'Fortalecendo a Economia Local: O Poder do Consumo Consciente',
    resumo: 'Entenda como apoiar negócios locais contribui para a independência econômica e fortalecimento das comunidades.',
    autor: 'Ana Economia',
    data: '2023-12-20',
    categoria: 'Economia',
    tempoLeitura: '9 min',
    imagem: '/blog/economia-local.jpg',
    slug: 'economia-local'
  },
  {
    id: 'educacao-libertadora',
    titulo: 'Educação Libertadora: Formando Cidadãos Críticos',
    resumo: 'A importância de uma educação que desenvolva o pensamento crítico e a consciência social dos brasileiros.',
    autor: 'Prof. Roberto',
    data: '2023-12-15',
    categoria: 'Educação',
    tempoLeitura: '10 min',
    imagem: '/blog/educacao-libertadora.jpg',
    slug: 'educacao-libertadora'
  }
];

const categorias = ['Todas', 'História', 'Cultura', 'Política', 'Arte', 'Economia', 'Educação'];

export default function BlogPage() {
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [ordenacao, setOrdenacao] = useState('data-desc');
  
  const postsFiltrados = blogPosts.filter(post => 
    filtroCategoria === 'Todas' || post.categoria === filtroCategoria
  );
  
  const postsOrdenados = [...postsFiltrados].sort((a, b) => {
    switch (ordenacao) {
      case 'data-asc':
        return new Date(a.data).getTime() - new Date(b.data).getTime();
      case 'data-desc':
        return new Date(b.data).getTime() - new Date(a.data).getTime();
      case 'titulo':
        return a.titulo.localeCompare(b.titulo);
      default:
        return new Date(b.data).getTime() - new Date(a.data).getTime();
    }
  });

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-50 to-yellow-50 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Blog Pindorama Soberano
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Reflexões, análises e conteúdos sobre soberania nacional, cultura brasileira e construção de um país verdadeiramente livre
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filtros e Ordenação */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
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
              className="w-full bg-white text-gray-900 rounded-lg px-3 py-2 border border-gray-300 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
            >
              <option value="data-desc">Mais recentes</option>
              <option value="data-asc">Mais antigos</option>
              <option value="titulo">Título A-Z</option>
            </select>
          </div>
        </motion.div>

        {/* Grid de Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {postsOrdenados.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden border border-gray-100"
            >
              <div className="aspect-[16/10] bg-gradient-to-br from-green-100 to-yellow-100 flex items-center justify-center relative overflow-hidden">
                <div className="text-6xl opacity-80 group-hover:scale-110 transition-transform duration-300">
                  {post.categoria === 'História' ? '📚' : 
                   post.categoria === 'Cultura' ? '🎭' :
                   post.categoria === 'Política' ? '🏛️' :
                   post.categoria === 'Arte' ? '🎨' :
                   post.categoria === 'Economia' ? '💰' :
                   post.categoria === 'Educação' ? '🎓' : '📝'}
                </div>
                <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  {post.categoria}
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                  {post.tempoLeitura}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <span>{post.autor}</span>
                  <span>•</span>
                  <span>{formatarData(post.data)}</span>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors leading-tight">
                  {post.titulo}
                </h2>
                
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {post.resumo}
                </p>
                
                <Link 
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center text-green-600 hover:text-green-700 font-medium text-sm transition-colors"
                >
                  Ler artigo completo
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {postsOrdenados.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-gray-50 rounded-2xl mt-8"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum artigo encontrado
            </h3>
            <p className="text-gray-600">
              Tente ajustar os filtros para encontrar o conteúdo que procura.
            </p>
          </motion.div>
        )}
      </div>

      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-green-50 to-yellow-50 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center bg-white rounded-2xl p-8 shadow-lg border border-green-100 max-w-2xl mx-auto"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              📧 Receba nossos artigos por email
            </h3>
            <p className="text-gray-600 mb-6">
              Fique por dentro das novidades e reflexões sobre soberania nacional e cultura brasileira
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Seu melhor email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
              />
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap">
                Inscrever-se
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}