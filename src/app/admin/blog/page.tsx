'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Post {
  id: string
  title: string
  slug: string
  summary: string
  content: string
  author: string
  category: string
  readTime: string
  image?: string
  published: boolean
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

export default function AdminBlogPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [categories, setCategories] = useState<string[]>([])

  // Verificar se é admin
  useEffect(() => {
    if (status === 'loading') return
    
    if (!session || session.user?.role !== 'admin') {
      router.push('/admin/dashboard')
    }
  }, [session, status, router])

  useEffect(() => {
    fetchPosts()
  }, [currentPage, searchTerm, selectedCategory, selectedStatus])

  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>
  }

  if (!session || session.user?.role !== 'admin') {
    return null
  }

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        search: searchTerm,
        category: selectedCategory === 'all' ? '' : selectedCategory,
        status: selectedStatus === 'all' ? '' : selectedStatus,
      })

      const response = await fetch(`/api/admin/blog?${params}`)
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts)
        setTotalPages(data.totalPages)
        
        // Extrair categorias únicas
        const uniqueCategories = [...new Set(data.posts.map((post: Post) => post.category))] as string[]
        setCategories(uniqueCategories)
      }
    } catch (error) {
      console.error('Erro ao buscar posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const togglePublished = async (postId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          published: !currentStatus,
          publishedAt: !currentStatus ? new Date().toISOString() : null
        }),
      })

      if (response.ok) {
        fetchPosts()
      } else {
        alert('Erro ao atualizar status do post')
      }
    } catch (error) {
      console.error('Erro ao atualizar post:', error)
      alert('Erro ao atualizar status do post')
    }
  }

  const deletePost = async (postId: string) => {
    if (!confirm('Tem certeza que deseja excluir este post?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchPosts()
      } else {
        alert('Erro ao excluir post')
      }
    } catch (error) {
      console.error('Erro ao excluir post:', error)
      alert('Erro ao excluir post')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Blog</h1>
        <button 
          onClick={() => router.push('/admin/blog/create')}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Novo Post
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar posts
            </label>
            <input
              type="text"
              placeholder="Título, autor ou conteúdo..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              aria-label="Filtrar por categoria"
            >
              <option value="all">Todas as categorias</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              aria-label="Filtrar por status"
            >
              <option value="all">Todos os status</option>
              <option value="published">Publicados</option>
              <option value="draft">Rascunhos</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
                setSelectedStatus('all')
                setCurrentPage(1)
              }}
              className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Posts */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Post
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Autor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {post.image && (
                        <img
                          className="h-10 w-10 rounded-lg object-cover mr-4"
                          src={post.image}
                          alt={post.title}
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {post.title}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {post.summary}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {post.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        post.published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {post.published ? 'Publicado' : 'Rascunho'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {post.published && post.publishedAt
                      ? formatDate(post.publishedAt)
                      : formatDate(post.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => togglePublished(post.id, post.published)}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                          post.published
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {post.published ? 'Despublicar' : 'Publicar'}
                      </button>
                      <button className="px-3 py-1 bg-blue-100 text-blue-800 hover:bg-blue-200 rounded text-xs font-medium transition-colors">
                        Editar
                      </button>
                      <button
                        onClick={() => deletePost(post.id)}
                        className="px-3 py-1 bg-red-100 text-red-800 hover:bg-red-200 rounded text-xs font-medium transition-colors"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">Nenhum post encontrado</div>
            <p className="text-gray-400 mt-2">Tente ajustar os filtros ou criar um novo post</p>
          </div>
        )}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 border rounded-md text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-green-600 border-green-600 text-white'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próxima
            </button>
          </nav>
        </div>
      )}
    </div>
  )
}