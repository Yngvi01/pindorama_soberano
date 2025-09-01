import { ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, User, Calendar, Share2, BookOpen } from 'lucide-react';

interface BlogLayoutProps {
  children: ReactNode;
}

export default function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Breadcrumb */}
      <div className="relative bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 py-8 border-b border-gray-200 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-green-500 rounded-full blur-3xl"></div>
          <div className="absolute top-20 right-20 w-24 h-24 bg-blue-500 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-yellow-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <motion.nav 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-3 text-sm mb-6"
          >
            <Link href="/" className="flex items-center text-gray-600 hover:text-green-600 transition-colors group">
              <span className="group-hover:underline">Início</span>
            </Link>
            <span className="text-gray-400">›</span>
            <Link href="/blog" className="flex items-center text-gray-600 hover:text-green-600 transition-colors group">
              <BookOpen className="w-4 h-4 mr-1" />
              <span className="group-hover:underline">Blog</span>
            </Link>
            <span className="text-gray-400">›</span>
            <span className="text-gray-900 font-medium flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Artigo
            </span>
          </motion.nav>
          
          {/* Reading Progress Indicator */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1 bg-gradient-to-r from-green-500 via-blue-500 to-yellow-500 rounded-full mb-4"
          ></motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center gap-6 text-sm text-gray-600"
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Leitura estimada</span>
            </div>
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              <span>Compartilhar</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <article className="w-full py-16">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Content Wrapper with Enhanced Styling */}
              <div className="prose prose-xl max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-green-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-blockquote:border-l-green-500 prose-blockquote:bg-green-50 prose-blockquote:rounded-r-lg prose-code:bg-gray-100 prose-code:text-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100 px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            
            {/* Floating Action Buttons */}
            <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 hidden lg:flex flex-col gap-3">
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="bg-white shadow-lg rounded-full p-3 hover:bg-green-50 hover:shadow-xl transition-all duration-300 group"
                title="Compartilhar"
              >
                <Share2 className="w-5 h-5 text-gray-600 group-hover:text-green-600" />
              </motion.button>
              
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="bg-white shadow-lg rounded-full p-3 hover:bg-blue-50 hover:shadow-xl transition-all duration-300 group"
                title="Tempo de leitura"
              >
                <Clock className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
              </motion.button>
            </div>
          </motion.div>
        </div>
        </div>
      </article>

      {/* Navigation Section */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 py-12">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-between gap-6"
            >
              <Link
                href="/blog"
                className="group inline-flex items-center bg-white hover:bg-green-50 text-green-600 hover:text-green-700 font-medium px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-green-200 hover:border-green-300"
              >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                Voltar ao Blog
              </Link>
              
              <div className="flex items-center gap-4">
                <span className="text-gray-600 text-sm">Gostou do artigo?</span>
                <div className="flex gap-2">
                  <button className="bg-white hover:bg-blue-50 text-blue-600 p-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-blue-200">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button className="bg-white hover:bg-red-50 text-red-600 p-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-red-200">
                    <span className="text-sm">❤️</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Related Articles Section */}
      <div className="relative bg-gradient-to-br from-green-900 via-blue-900 to-yellow-900 py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-64 h-64 bg-green-500 rounded-full blur-3xl"></div>
          <div className="absolute top-32 right-32 w-48 h-48 bg-blue-500 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-yellow-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-32 h-32 bg-green-400 rounded-full blur-xl"></div>
        </div>
        
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                Continue sua Jornada de
                <span className="block bg-gradient-to-r from-green-400 via-blue-400 to-yellow-400 bg-clip-text text-transparent">
                  Conhecimento
                </span>
              </h3>
              
              <p className="text-gray-200 mb-10 text-lg max-w-2xl mx-auto leading-relaxed">
                Explore mais conteúdos sobre soberania nacional, cultura brasileira e a verdadeira identidade de Pindorama
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/blog"
                  className="group bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 inline-flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Ver Todos os Artigos
                  <motion.div
                    className="ml-2"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowLeft className="w-5 h-5 rotate-180" />
                  </motion.div>
                </Link>
                
                <div className="flex items-center gap-4 text-white/80">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="text-sm">Artigos exclusivos</span>
                  </div>
                  <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Atualizações semanais</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}