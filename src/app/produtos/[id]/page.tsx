'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCart } from '@/contexts/CartContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, ShoppingCart, Heart, Share2, Minus, Plus, Loader2, Check } from 'lucide-react';
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
  specifications?: Record<string, any>
  createdAt: string
  updatedAt: string
}

// Dados estáticos como fallback
const produtoEstatico = {
  id: '68961ed2cf4cea023b42542e',
  nome: 'Bermuda Veteran - Camuflado Digital Desert',
  preco: 279.00,
  precoOriginal: 350.00,
  desconto: 20,
  avaliacao: 4.7,
  parcelamento: '5x de R$ 55,80',
  descricao: 'Bermuda tática de alta qualidade com camuflagem digital desert. Confeccionada em tecido resistente e durável, ideal para atividades outdoor e uso casual. Possui múltiplos bolsos funcionais e ajuste confortável.',
  categoria: 'Bermudas',
  imagens: [
    '/produtos/bermuda-desert-1.jpg',
    '/produtos/bermuda-desert-2.jpg',
    '/produtos/bermuda-desert-3.jpg'
  ],
  tamanhos: ['38', '40', '42', '44', '46', '48', '50'],
  cores: [
    { nome: 'Caqui', codigo: '#8B7355' },
    { nome: 'Preto', codigo: '#000000' }
  ],
  especificacoes: [
    'Material: 65% Algodão, 35% Poliéster',
    'Camuflagem digital desert',
    '6 bolsos funcionais',
    'Cós com elástico lateral',
    'Resistente à água',
    'Secagem rápida'
  ],
  estoque: 25
};

export default function ProdutoPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { addToCart } = useCart();
  
  const [produto, setProduto] = useState(produtoEstatico);
  const [loading, setLoading] = useState(true);
  const [imagemAtiva, setImagemAtiva] = useState(0);
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState('');
  const [corSelecionada, setCorSelecionada] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [adicionandoCarrinho, setAdicionandoCarrinho] = useState(false);
  const [adicionadoCarrinho, setAdicionadoCarrinho] = useState(false);
  const [favorito, setFavorito] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${params.id}`);
        
        if (response.ok) {
          const data: Product = await response.json();
          // Converter para formato esperado
          const isAdesivoPoster = data.category.toLowerCase().includes('adesivo') || data.category.toLowerCase().includes('poster');
          
          setProduto({
            ...produtoEstatico,
            id: data.id,
            nome: data.name,
            preco: data.price,
            descricao: data.description || produtoEstatico.descricao,
            categoria: data.category,
            estoque: data.stock,
            // Adesivos e posters não devem ter tamanho e cor
            tamanhos: isAdesivoPoster ? [] : (data.sizes || produtoEstatico.tamanhos),
            cores: isAdesivoPoster ? [] : (data.colors ? data.colors.map(color => ({ nome: color, codigo: '#000000' })) : produtoEstatico.cores)
          });
        }
      } catch (error) {
        console.error('Erro ao buscar produto:', error);
        // Usar dados estáticos como fallback
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const handleAddToCart = async () => {
    if (!session) {
      router.push('/auth/login');
      return;
    }

    // Verificar se tamanho é obrigatório (não para adesivos e posters)
    const isAdesivoPoster = produto.categoria.toLowerCase().includes('adesivo') || produto.categoria.toLowerCase().includes('poster');
    
    if (!isAdesivoPoster && !tamanhoSelecionado && produto.tamanhos.length > 0) {
      alert('Por favor, selecione um tamanho.');
      return;
    }

    if (!isAdesivoPoster && !corSelecionada && produto.cores.length > 0) {
      alert('Por favor, selecione uma cor.');
      return;
    }

    try {
      setAdicionandoCarrinho(true);
      const success = await addToCart({
        productId: produto.id,
        quantity: quantidade,
        size: tamanhoSelecionado,
        color: corSelecionada
      });
      
      if (success) {
        setAdicionadoCarrinho(true);
        setTimeout(() => {
          setAdicionadoCarrinho(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
    } finally {
      setAdicionandoCarrinho(false);
    }
  };

  const incrementarQuantidade = () => {
    if (quantidade < produto.estoque) {
      setQuantidade(quantidade + 1);
    }
  };

  const decrementarQuantidade = () => {
    if (quantidade > 1) {
      setQuantidade(quantidade - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com navegação */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/produtos" 
            className="inline-flex items-center text-gray-600 hover:text-green-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Voltar aos produtos
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Galeria de Imagens */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {/* Imagem Principal */}
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-9xl opacity-80">
                  {produto.categoria === 'Bermudas' ? '🩳' : 
                   produto.categoria === 'Camisas' ? '👕' : 
                   produto.categoria === 'Moletons' ? '🧥' :
                   produto.categoria === 'Adesivos' ? '🏷️' : '🖼️'}
                </div>
              </div>
            </div>
            
            {/* Miniaturas */}
            <div className="flex gap-2 overflow-x-auto">
              {produto.imagens.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setImagemAtiva(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    imagemAtiva === index ? 'border-green-600' : 'border-gray-200'
                  }`}
                >
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-2xl opacity-60">
                      {produto.categoria === 'Bermudas' ? '🩳' : '👕'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Informações do Produto */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Cabeçalho */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                  {produto.categoria}
                </span>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">{produto.avaliacao}</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{produto.nome}</h1>
              <p className="text-gray-600 leading-relaxed">{produto.descricao}</p>
            </div>

            {/* Preço */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                {produto.precoOriginal && (
                  <span className="text-lg text-gray-500 line-through">
                    R$ {produto.precoOriginal.toFixed(2).replace('.', ',')}
                  </span>
                )}
                {produto.desconto && (
                  <span className="bg-orange-500 text-white text-sm px-2 py-1 rounded-full font-bold">
                    {produto.desconto}% OFF
                  </span>
                )}
              </div>
              <div className="text-3xl font-bold text-green-600 mb-1">
                R$ {produto.preco.toFixed(2).replace('.', ',')}
              </div>
              <div className="text-sm text-gray-600">
                ou {produto.parcelamento}
              </div>
            </div>

            {/* Seleção de Tamanho */}
            {produto.tamanhos.length > 0 && !produto.categoria.toLowerCase().includes('adesivo') && !produto.categoria.toLowerCase().includes('poster') && (
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">Tamanho</h3>
                <div className="grid grid-cols-4 gap-2">
                  {produto.tamanhos.map((tamanho) => (
                    <button
                      key={tamanho}
                      onClick={() => setTamanhoSelecionado(tamanho)}
                      className={`py-2 px-3 rounded-lg border-2 font-medium transition-all ${
                        tamanhoSelecionado === tamanho
                          ? 'border-green-600 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {tamanho}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Seleção de Cor */}
            {produto.cores.length > 0 && !produto.categoria.toLowerCase().includes('adesivo') && !produto.categoria.toLowerCase().includes('poster') && (
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">Cor</h3>
                <div className="flex gap-3">
                  {produto.cores.map((cor) => (
                    <button
                      key={cor.nome}
                      onClick={() => setCorSelecionada(cor.nome)}
                      className={`flex items-center gap-2 py-2 px-4 rounded-lg border-2 transition-all ${
                        corSelecionada === cor.nome
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: cor.codigo }}
                      ></div>
                      <span className="text-sm font-medium">{cor.nome}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantidade e Ações */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Quantidade</h3>
                  <p className="text-sm text-gray-600">{produto.estoque} disponíveis</p>
                </div>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={decrementarQuantidade}
                    disabled={quantidade <= 1}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 font-medium">{quantidade}</span>
                  <button
                    onClick={incrementarQuantidade}
                    disabled={quantidade >= produto.estoque}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={adicionandoCarrinho || produto.estoque === 0}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center"
                >
                  {adicionandoCarrinho ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Adicionando...
                    </>
                  ) : adicionadoCarrinho ? (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      Adicionado!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Adicionar ao Carrinho
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => setFavorito(!favorito)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    favorito 
                      ? 'border-red-500 bg-red-50 text-red-600' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${favorito ? 'fill-current' : ''}`} />
                </button>
                
                <button className="p-3 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-all">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Especificações */}
            {produto.especificacoes && produto.especificacoes.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Especificações</h3>
                <div className="space-y-3">
                  {produto.especificacoes.map((spec, index) => (
                    <div key={index} className="py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-sm text-gray-600">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Seção Você também pode gostar */}
        <RelatedProducts currentProductId={produto.id} category={produto.categoria} />
      </div>
    </div>
  );
}

// Componente para produtos relacionados
function RelatedProducts({ currentProductId, category }: { currentProductId: string, category: string }) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/products?category=${encodeURIComponent(category)}&limit=4`)
        if (response.ok) {
          const data = await response.json()
          // Filtrar o produto atual e pegar apenas 4 produtos
          const filtered = data.products.filter((p: Product) => p.id !== currentProductId).slice(0, 4)
          setRelatedProducts(filtered)
        }
      } catch (error) {
        console.error('Erro ao buscar produtos relacionados:', error)
      } finally {
        setLoading(false)
      }
    }

    if (currentProductId && category) {
      fetchRelatedProducts()
    }
  }, [currentProductId, category])

  if (loading) {
    return (
      <div className="mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Você também pode gostar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm p-4 animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <div className="mt-16 bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Você também pode gostar</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
            >
              <Link href={`/produtos/${product.id}`}>
                <div className="relative aspect-square overflow-hidden">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-100 to-yellow-100 flex items-center justify-center">
                      <span className="text-green-600 font-medium">Sem imagem</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {product.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-green-600">
                      R$ {product.price.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-sm text-gray-500">
                      {product.stock > 0 ? `${product.stock} em estoque` : 'Esgotado'}
                    </span>
                  </div>
                  {product.colors && product.colors.length > 0 && (
                    <div className="flex items-center mt-2 space-x-1">
                      <span className="text-xs text-gray-500">Cores:</span>
                      {product.colors.slice(0, 3).map((color, index) => (
                        <div
                          key={index}
                          className="w-4 h-4 rounded-full border border-gray-200"
                          style={{ backgroundColor: color.toLowerCase() }}
                          title={color}
                        ></div>
                      ))}
                      {product.colors.length > 3 && (
                        <span className="text-xs text-gray-500">+{product.colors.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}