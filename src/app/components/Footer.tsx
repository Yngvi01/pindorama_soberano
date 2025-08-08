import Link from 'next/link'
import { MapPin, Phone, Mail, Heart, Instagram, Facebook, Twitter, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-green-900 via-green-800 to-green-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="footerPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1" fill="currentColor" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#footerPattern)" />
          </svg>
        </div>
      </div>

      <div className="relative">
        {/* Main Footer Content */}
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">
                  Pindorama <span className="text-yellow-400">Soberano</span>
                </h3>
                <p className="text-green-100 text-sm leading-relaxed">
                  Celebrando a rica cultura brasileira através de produtos autênticos e sustentáveis. 
                  Conectando tradição e modernidade.
                </p>
              </div>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm text-green-100">
                  <MapPin className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                  <span>São Paulo, Brasil</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-green-100">
                  <Phone className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                  <span>+55 (11) 9999-9999</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-green-100">
                  <Mail className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                  <span>contato@pindorama.com</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-yellow-400">Links Rápidos</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="text-green-100 hover:text-yellow-400 transition-colors duration-200 text-sm">
                    Início
                  </Link>
                </li>
                <li>
                  <Link href="/produtos" className="text-green-100 hover:text-yellow-400 transition-colors duration-200 text-sm">
                    Produtos
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-green-100 hover:text-yellow-400 transition-colors duration-200 text-sm">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/user/dashboard" className="text-green-100 hover:text-yellow-400 transition-colors duration-200 text-sm">
                    Minha Conta
                  </Link>
                </li>
                <li>
                  <Link href="/user/orders" className="text-green-100 hover:text-yellow-400 transition-colors duration-200 text-sm">
                    Meus Pedidos
                  </Link>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-yellow-400">Categorias</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/produtos?categoria=roupas" className="text-green-100 hover:text-yellow-400 transition-colors duration-200 text-sm">
                    Roupas Tradicionais
                  </Link>
                </li>
                <li>
                  <Link href="/produtos?categoria=acessorios" className="text-green-100 hover:text-yellow-400 transition-colors duration-200 text-sm">
                    Acessórios
                  </Link>
                </li>
                <li>
                  <Link href="/produtos?categoria=artesanato" className="text-green-100 hover:text-yellow-400 transition-colors duration-200 text-sm">
                    Artesanato
                  </Link>
                </li>
                <li>
                  <Link href="/produtos?categoria=decoracao" className="text-green-100 hover:text-yellow-400 transition-colors duration-200 text-sm">
                    Decoração
                  </Link>
                </li>
                <li>
                  <Link href="/produtos?categoria=sustentavel" className="text-green-100 hover:text-yellow-400 transition-colors duration-200 text-sm">
                    Produtos Sustentáveis
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter & Social */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-yellow-400">Conecte-se</h4>
              
              {/* Newsletter */}
              <div className="mb-6">
                <p className="text-green-100 text-sm mb-4">
                  Receba novidades sobre cultura brasileira e nossos produtos.
                </p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Seu e-mail"
                    className="flex-1 px-3 py-2 bg-green-700 border border-green-600 rounded-l-lg text-white placeholder-green-300 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                  <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-green-900 rounded-r-lg transition-colors duration-200 font-medium text-sm">
                    Inscrever
                  </button>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <p className="text-green-100 text-sm mb-4">Siga-nos nas redes sociais:</p>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="w-10 h-10 bg-green-700 hover:bg-yellow-500 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 group"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5 text-green-100 group-hover:text-green-900" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-green-700 hover:bg-yellow-500 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 group"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-5 w-5 text-green-100 group-hover:text-green-900" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-green-700 hover:bg-yellow-500 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 group"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-5 w-5 text-green-100 group-hover:text-green-900" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-green-700 hover:bg-yellow-500 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 group"
                    aria-label="YouTube"
                  >
                    <Youtube className="h-5 w-5 text-green-100 group-hover:text-green-900" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-green-700">
          <div className="mx-auto max-w-7xl px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2 text-sm text-green-100">
                <span>&copy; {new Date().getFullYear()} Pindorama Soberano.</span>
                <span>Feito com</span>
                <Heart className="h-4 w-4 text-red-400 fill-current" />
                <span>no Brasil</span>
              </div>
              
              <div className="flex space-x-6 text-sm">
                <Link href="/privacidade" className="text-green-100 hover:text-yellow-400 transition-colors duration-200">
                  Política de Privacidade
                </Link>
                <Link href="/termos" className="text-green-100 hover:text-yellow-400 transition-colors duration-200">
                  Termos de Uso
                </Link>
                <Link href="/contato" className="text-green-100 hover:text-yellow-400 transition-colors duration-200">
                  Contato
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
