import './globals.css'
import { ReactNode } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SessionWrapper from '../components/SessionWrapper'

export const metadata = {
  title: 'Pindorama Soberano — Em Breve',
  description: 'Em breve lançaremos nossa loja com roupas de estampas personalizadas que celebram a cultura brasileira.',
  keywords: 'pindorama, soberano, brasil, cultura brasileira, roupas, estampas personalizadas',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="flex flex-col min-h-screen">
        <SessionWrapper>
          <Navbar/>
          <main className="flex-grow">{children}</main>
          <Footer/>
        </SessionWrapper>
      </body>
    </html>
  )
}
