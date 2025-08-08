'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, ArrowLeft, Upload, File } from 'lucide-react'

export default function CreatePostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    author: '',
    category: '',
    readTime: '',
    image: '',
    published: false
  })
  const [mdxFile, setMdxFile] = useState<File | null>(null)
  const [mdxContent, setMdxContent] = useState('')

  // Função para gerar slug a partir do título
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
      .trim()
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/-+/g, '-') // Remove hífens duplicados
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!mdxContent.trim()) {
      alert('Por favor, anexe um arquivo MDX ou adicione conteúdo')
      return
    }
    
    setLoading(true)

    try {
      const response = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          content: mdxContent,
          slug: generateSlug(formData.title)
        }),
      })

      if (response.ok) {
        router.push('/admin/blog')
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao criar post')
      }
    } catch (error) {
      console.error('Erro ao criar post:', error)
      alert('Erro ao criar post')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.name.endsWith('.mdx') && !file.name.endsWith('.md')) {
        alert('Por favor, selecione um arquivo .mdx ou .md')
        return
      }
      
      setMdxFile(file)
      
      // Ler o conteúdo do arquivo
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        setMdxContent(content)
      }
      reader.readAsText(file)
    }
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMdxContent(e.target.value)
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Criar Novo Post</h1>
              <p className="text-gray-600">Adicione um novo artigo ao blog</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Digite o título do post"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Autor *
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Nome do autor"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resumo *
              </label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Breve resumo do post"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Conteúdo MDX *
              </label>
              
              {/* Upload de arquivo MDX */}
              <div className="mb-4">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {mdxFile ? (
                        <>
                          <File className="w-8 h-8 mb-2 text-green-500" />
                          <p className="text-sm text-gray-700 font-medium">{mdxFile.name}</p>
                          <p className="text-xs text-gray-500">Arquivo carregado com sucesso</p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 mb-2 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Clique para anexar</span> seu arquivo MDX
                          </p>
                          <p className="text-xs text-gray-500">MDX ou MD (MAX. 10MB)</p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".mdx,.md"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>

              {/* Editor de conteúdo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conteúdo MDX (editar ou colar diretamente)
                </label>
                <textarea
                  value={mdxContent}
                  onChange={handleContentChange}
                  required
                  rows={15}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                  placeholder="Cole seu conteúdo MDX aqui ou anexe um arquivo acima...

Exemplo:
# Título do Post

Este é um parágrafo em **MDX**.

## Subtítulo

- Item 1
- Item 2

```javascript
console.log('Código de exemplo')
```"
                />
              </div>
              
              {mdxContent && (
                <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-700">
                  ✓ Conteúdo MDX carregado ({mdxContent.length} caracteres)
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="História">História</option>
                  <option value="Cultura">Cultura</option>
                  <option value="Política">Política</option>
                  <option value="Arte">Arte</option>
                  <option value="Sustentabilidade">Sustentabilidade</option>
                  <option value="Tecnologia">Tecnologia</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tempo de Leitura
                </label>
                <input
                  type="text"
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="ex: 5 min"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL da Imagem
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="published"
                checked={formData.published}
                onChange={handleChange}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Publicar imediatamente
              </label>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Criando...' : 'Criar Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}