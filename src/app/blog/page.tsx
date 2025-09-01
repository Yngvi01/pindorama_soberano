'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Search, Filter, BookOpen, Heart, Share2 } from 'lucide-react';

interface Post {
  id: string
  title: string
  slug: string
  summary: string
  author: string
  category: string
  readTime: string
  image?: string
  createdAt: string
  updatedAt: string
}

interface PostsResponse {
  posts: Post[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

// Posts estáticos como fallback
const postsEstaticos = [
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

export default function BlogPage() {
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [ordenacao, setOrdenacao] = useState('data-desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState<{
    id: string
    titulo: string
    resumo: string
    autor: string
    data: string
    categoria: string
    tempoLeitura: string
    imagem: string
    slug: string
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar posts do banco de dados
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/blog?limit=50')
        
        if (!response.ok) {
          throw new Error('Erro ao carregar posts')
        }
        
        const data: PostsResponse = await response.json()
        
        // Converter posts do banco para o formato esperado
        const postsConvertidos = data.posts.map(post => ({
          id: post.id,
          titulo: post.title,
          resumo: post.summary,
          autor: post.author,
          data: new Date(post.createdAt).toISOString().split('T')[0],
          categoria: post.category,
          tempoLeitura: post.readTime,
          imagem: post.image || '/blog/placeholder.jpg',
          slug: post.slug
        }))
        
        setPosts(postsConvertidos)
      } catch (err) {
        console.error('Erro ao buscar posts:', err)
        setError('Erro ao carregar posts. Usando dados de exemplo.')
        // Usar posts estáticos como fallback
        setPosts(postsEstaticos)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  // Obter todas as categorias únicas
  const categorias = ['Todas', ...Array.from(new Set(posts.map(post => post.categoria)))];
  
  const postsFiltrados = posts.filter(post => {
    const matchCategoria = filtroCategoria === 'Todas' || post.categoria === filtroCategoria;
    const matchSearch = searchTerm === '' || 
      post.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.resumo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.autor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategoria && matchSearch;
  });
  
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📚</div>
          <p className="text-gray-600">Carregando posts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-600 via-green-500 to-yellow-400 py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-24 h-24 bg-yellow-200 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-green-200 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-28 h-28 bg-white rounded-full animate-bounce"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block mb-6"
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 border border-white/30">
                <BookOpen className="w-12 h-12 text-white" />
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Blog <span className="text-yellow-200">Pindorama</span>
              <br />
              <span className="text-green-100">Soberano</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl md:text-2xl text-green-50 max-w-4xl mx-auto leading-relaxed"
            >
              Reflexões, análises e conteúdos sobre soberania nacional, cultura brasileira e construção de um país verdadeiramente livre
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-8 flex flex-wrap justify-center gap-4 text-white/80"
            >
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                <span>Cultura Brasileira</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>Conhecimento</span>
              </div>
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                <span>Soberania</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="container mx-auto px-4 py-12">
        {/* Barra de Busca */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar artigos por título, conteúdo ou autor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg bg-white rounded-2xl border-2 border-gray-200 focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-100 transition-all shadow-lg"
            />
          </div>
        </motion.div>

        {/* Filtros e Ordenação */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-green-100 mb-12"
        >
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-green-600" />
                <label className="text-lg font-semibold text-gray-800">
                  Categorias
                </label>
              </div>
              <div className="flex flex-wrap gap-3">
                {categorias.map(categoria => (
                  <motion.button
                    key={categoria}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFiltroCategoria(categoria)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      filtroCategoria === categoria
                        ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg transform scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                    }`}
                  >
                    {categoria}
                  </motion.button>
                ))}
              </div>
            </div>
            
            <div className="lg:w-80">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-green-600" />
                <label className="text-lg font-semibold text-gray-800">
                  Ordenação
                </label>
              </div>
              <select
                value={ordenacao}
                onChange={(e) => setOrdenacao(e.target.value)}
                aria-label="Ordenar posts"
                className="w-full bg-white text-gray-900 rounded-xl px-4 py-3 border-2 border-gray-200 focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-100 transition-all text-lg shadow-md"
              >
                <option value="data-desc">📅 Mais recentes</option>
                <option value="data-asc">📅 Mais antigos</option>
                <option value="titulo">🔤 Título A-Z</option>
              </select>
            </div>
          </div>
          
          {/* Estatísticas */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span><strong>{postsOrdenados.length}</strong> artigos encontrados</span>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <span>Categoria: <strong>{filtroCategoria}</strong></span>
              </div>
              {searchTerm && (
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  <span>Busca: <strong>"{searchTerm}"</strong></span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Grid de Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {postsOrdenados.map((post, index) => {
            const getCategoryIcon = (categoria: string) => {
              switch (categoria) {
                case 'História': return { icon: '📚', gradient: 'from-blue-500 to-purple-600' };
                case 'Cultura': return { icon: '🎭', gradient: 'from-pink-500 to-rose-600' };
                case 'Política': return { icon: '🏛️', gradient: 'from-indigo-500 to-blue-600' };
                case 'Arte': return { icon: '🎨', gradient: 'from-purple-500 to-pink-600' };
                case 'Economia': return { icon: '💰', gradient: 'from-yellow-500 to-orange-600' };
                case 'Educação': return { icon: '🎓', gradient: 'from-green-500 to-teal-600' };
                default: return { icon: '📝', gradient: 'from-gray-500 to-slate-600' };
              }
            };
            
            const categoryData = getCategoryIcon(post.categoria);
            
            return (
              <motion.article
                 key={post.id}
                 initial={{ opacity: 0, y: 30, scale: 0.9 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 transition={{ 
                   duration: 0.6, 
                   delay: index * 0.1,
                   type: "spring",
                   stiffness: 100
                 }}
                 whileHover={{ 
                   y: -8,
                   transition: { duration: 0.3 }
                 }}
                 className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 group overflow-hidden border border-white/20 relative"
               >
                
                {/* Header com gradiente da categoria */}
                <div className={`aspect-[16/10] bg-gradient-to-br ${categoryData.gradient} flex items-center justify-center relative overflow-hidden`}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-4 left-4 w-16 h-16 bg-white rounded-full animate-pulse"></div>
                    <div className="absolute bottom-4 right-4 w-12 h-12 bg-white/50 rounded-full animate-bounce"></div>
                    <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-white/30 rounded-full animate-ping"></div>
                  </div>
                  
                  <motion.div 
                    className="text-7xl opacity-90 z-10"
                    whileHover={{ 
                      scale: 1.2,
                      rotate: 5,
                      transition: { duration: 0.3 }
                    }}
                  >
                    {categoryData.icon}
                  </motion.div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/30">
                    {post.categoria}
                  </div>
                  
                  {/* Reading Time */}
                  <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.tempoLeitura}
                  </div>
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                
                {/* Content */}
                <div className="p-8">
                  {/* Meta Info */}
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span className="font-medium">{post.autor}</span>
                    </div>
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatarData(post.data)}</span>
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors leading-tight line-clamp-2">
                    {post.titulo}
                  </h2>
                  
                  {/* Summary */}
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed line-clamp-3">
                    {post.resumo}
                  </p>
                  
                  {/* Read More Button */}
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="group/btn inline-flex items-center justify-center w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    <BookOpen className="w-4 h-4 mr-2 group-hover/btn:rotate-12 transition-transform" />
                    Ler artigo completo
                    <motion.svg 
                      className="w-4 h-4 ml-2" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </motion.svg>
                  </Link>
                </div>
              </motion.article>
            );
          })}
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
      <div className="relative bg-gradient-to-br from-green-600 via-yellow-500 to-green-700 py-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-20 w-32 h-32 bg-yellow-200 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-green-200 rounded-full animate-ping"></div>
          <div className="absolute bottom-10 right-10 w-36 h-36 bg-white rounded-full animate-pulse"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center bg-white/95 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/30 max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="inline-block mb-6"
            >
              <div className="bg-gradient-to-r from-green-500 to-yellow-500 rounded-full p-4">
                <BookOpen className="w-12 h-12 text-white" />
              </div>
            </motion.div>
            
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="text-4xl font-bold bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent mb-6"
            >
              📧 Receba nossos artigos por email
            </motion.h3>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="text-lg text-gray-700 mb-8 leading-relaxed"
            >
              Fique por dentro das novidades e reflexões sobre soberania nacional, cultura brasileira e construção de um país verdadeiramente livre
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
            >
              <div className="relative flex-1">
                <input
                  type="email"
                  placeholder="Seu melhor email"
                  className="w-full px-6 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-100 transition-all shadow-lg"
                />
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap flex items-center justify-center gap-2"
              >
                <Heart className="w-5 h-5" />
                Inscrever-se
              </motion.button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.5 }}
              className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-600"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Conteúdo exclusivo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Sem spam</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Cancele quando quiser</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}