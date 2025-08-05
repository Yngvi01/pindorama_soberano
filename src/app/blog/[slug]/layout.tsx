import { ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import MDXComponents from '../components/MDXComponents';

interface BlogLayoutProps {
  children: ReactNode;
}

export default function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Navigation */}
      <div className="bg-gray-50 py-4 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700 transition-colors">
              Início
            </Link>
            <span className="text-gray-400">›</span>
            <Link href="/blog" className="text-gray-500 hover:text-gray-700 transition-colors">
              Blog
            </Link>
            <span className="text-gray-400">›</span>
            <span className="text-gray-900 font-medium">Artigo</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <article className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="prose prose-lg max-w-none"
          >
            {children}
          </motion.div>
        </div>
      </article>

      {/* Back to Blog */}
      <div className="container mx-auto px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="border-t border-gray-200 pt-8"
          >
            <Link
              href="/blog"
              className="inline-flex items-center text-green-600 hover:text-green-700 font-medium transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar ao Blog
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Related Articles Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Continue Lendo
              </h3>
              <p className="text-gray-600 mb-8">
                Explore mais conteúdos sobre soberania nacional e cultura brasileira
              </p>
              <Link
                href="/blog"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
              >
                Ver Todos os Artigos
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}