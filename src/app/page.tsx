'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

// Componente de partículas animadas
const ParticlesBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Configuração do canvas para tela cheia
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    window.addEventListener('resize', resizeCanvas)
    resizeCanvas()
    
    // Configuração das partículas
    const particlesArray: Particle[] = []
    const numberOfParticles = 50
    
    // Cores das partículas (verde e amarelo com transparência)
    const colors = ['rgba(0, 156, 59, 0.3)', 'rgba(255, 223, 0, 0.3)']
    
    // Classe para as partículas
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 5 + 1
        this.speedX = Math.random() * 1 - 0.5
        this.speedY = Math.random() * 1 - 0.5
        this.color = colors[Math.floor(Math.random() * colors.length)]
      }
      
      update() {
        this.x += this.speedX
        this.y += this.speedY
        
        // Rebater nas bordas
        if (this.x > canvas.width || this.x < 0) {
          this.speedX = -this.speedX
        }
        if (this.y > canvas.height || this.y < 0) {
          this.speedY = -this.speedY
        }
      }
      
      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    
    // Inicializar partículas
    const init = () => {
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle())
      }
    }
    init()
    
    // Conectar partículas próximas com linhas
    const connect = () => {
      if (!ctx) return
      let opacityValue = 1
      
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x
          const dy = particlesArray[a].y - particlesArray[b].y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 100) {
            opacityValue = 1 - (distance / 100)
            ctx.strokeStyle = `rgba(255, 223, 0, ${opacityValue * 0.2})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y)
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y)
            ctx.stroke()
          }
        }
      }
    }
    
    // Função de animação
    const animate = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update()
        particlesArray[i].draw()
      }
      connect()
      requestAnimationFrame(animate)
    }
    animate()
    
    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])
  
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-5 pointer-events-none"
    />
  )
}

// Componente para cada item do contador
const CountdownItem = ({ value, label, delay }: { value: string | number, label: string, delay: number }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      className="flex flex-col items-center"
    >
      <motion.div 
        whileHover={{ scale: 1.05, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="text-4xl font-bold text-white bg-black/30 w-20 h-20 flex items-center justify-center rounded-xl shadow-lg border border-white/10"
      >
        {value}
      </motion.div>
      <motion.span 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.2, duration: 0.5 }}
        className="text-sm font-medium text-yellow-300 mt-2"
      >
        {label}
      </motion.span>
    </motion.div>
  )
}

// Componente de botão para rolar para o topo
const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }
    
    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
  
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.8,
        y: isVisible ? 0 : 20
      }}
      transition={{ duration: 0.3 }}
      onClick={scrollToTop}
      className="fixed left-6 bottom-6 z-30 bg-yellow-500 text-gray-900 p-3 rounded-full shadow-lg border border-yellow-400 hover:bg-yellow-400 transition-colors duration-300"
      aria-label="Rolar para o topo"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </motion.button>
  )
}

// Componente de ícones sociais flutuantes
const SocialIcons = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2.5, duration: 0.8 }}
      className="fixed right-6 bottom-6 z-30 flex flex-col space-y-3"
    >
      <motion.a 
        href="#" 
        target="_blank" 
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1, y: -5 }}
        whileTap={{ scale: 0.9 }}
        className="bg-white/10 backdrop-blur-md p-3 rounded-full shadow-lg border border-white/20 text-white hover:bg-green-700 transition-colors duration-300"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
        </svg>
      </motion.a>
      <motion.a 
        href="#" 
        target="_blank" 
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1, y: -5 }}
        whileTap={{ scale: 0.9 }}
        className="bg-white/10 backdrop-blur-md p-3 rounded-full shadow-lg border border-white/20 text-white hover:bg-yellow-500 transition-colors duration-300"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      </motion.a>
    </motion.div>
  )
}

export default function Page() {
  const LAUNCH = new Date('2025-10-10T00:00:00Z') // Data de lançamento - ajuste conforme necessário

  // Inicializa com valores zero para evitar erro de hidratação
  const [timeValues, setTimeValues] = useState({ d: 0, h: 0, m: 0, s: 0 })
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Marca que estamos no cliente
    setIsClient(true)
    
    // Função para calcular o tempo restante
    const updateCountdown = () => {
      const now = new Date()
      const diff = Math.max(0, LAUNCH.getTime() - now.getTime())
      
      const d = Math.floor(diff / (1000*60*60*24))
      const h = Math.floor((diff / (1000*60*60)) % 24)
      const m = Math.floor((diff / (1000*60)) % 60)
      const s = Math.floor((diff / 1000) % 60)
      
      setTimeValues({ d, h, m, s })
    }
    
    // Atualiza imediatamente
    updateCountdown()
    
    // Configura o intervalo
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [])

  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle'|'loading'|'ok'|'error'>('idle')

  async function subscribe(ev: React.FormEvent) {
    ev.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStatus('ok')
        setEmail('')
      } else {
        throw new Error('Falha')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Ícones de redes sociais flutuantes */}
      <SocialIcons />
      
      {/* Botão para rolar para o topo */}
      <ScrollToTopButton />
      {/* Imagem de fundo com overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/60 z-10" /> {/* Overlay escuro para melhorar legibilidade */}
        <div className="h-full w-full relative">
          {/* Usamos uma div com background-image para cobrir toda a tela */}
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{
              backgroundImage: 'url(/foto.png)', 
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed' // Efeito parallax
            }}
          />
        </div>
      </div>
      
      {/* Partículas animadas */}
      <ParticlesBackground />

      {/* Conteúdo centralizado */}
      <div className="relative z-20 text-center px-4 py-16 max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-black/40 backdrop-blur-md p-10 rounded-2xl shadow-2xl border border-white/10"
        >
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-6xl md:text-7xl font-bold text-white mb-2"
          >
            Pindorama Soberano
          </motion.h1>
          
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '8rem' }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="h-1 bg-yellow-500 mx-auto my-6"
          />
          
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="text-3xl md:text-4xl font-semibold text-yellow-400 mb-6"
          >
            EM BREVE
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-xl text-white mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Uma nova experiência em moda com estampas exclusivas que celebram a cultura brasileira.
            Estamos preparando algo especial para você.  
          </motion.p>

          {/* Contador regressivo */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-4 md:gap-6 mb-10"
          >
            <CountdownItem value={isClient ? timeValues.d : '--'} label="DIAS" delay={1.6} />
            <CountdownItem value={isClient ? timeValues.h : '--'} label="HORAS" delay={1.7} />
            <CountdownItem value={isClient ? timeValues.m : '--'} label="MIN" delay={1.8} />
            <CountdownItem value={isClient ? timeValues.s : '--'} label="SEG" delay={1.9} />
          </motion.div>

          {/* Formulário de inscrição */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.0, duration: 0.8 }}
            className="mt-8"
          >
            {status === 'ok' ? (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-green-300 bg-black/40 p-6 rounded-xl inline-block shadow-lg border border-green-500/20"
              >
                <svg className="w-8 h-8 text-green-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-lg">Obrigado! Você será um dos primeiros a saber do nosso lançamento.</p>
              </motion.div>
            ) : (
              <div className="max-w-md mx-auto">
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.1, duration: 0.5 }}
                  className="text-white mb-4 text-lg"
                >
                  Seja o primeiro a saber quando lançarmos:
                </motion.p>
                
                <motion.form 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.2, duration: 0.5 }}
                  onSubmit={subscribe} 
                  className="flex shadow-xl"
                >
                  <input
                    type="email"
                    placeholder="Seu melhor e-mail"
                    required
                    disabled={status==='loading'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-grow px-4 py-4 rounded-l-lg text-white bg-black/30 border-2 border-yellow-500 focus:outline-none focus:border-yellow-600 focus:ring-2 focus:ring-yellow-500/50 transition-all duration-300"
                  />
                  <motion.button
                    whileHover={{ scale: 1.03, backgroundColor: '#eab308' }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={status==='loading'}
                    className="px-6 py-4 bg-yellow-500 text-gray-900 font-bold rounded-r-lg transition duration-200 shadow-lg"
                  >
                    {status==='loading' ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enviando
                      </span>
                    ) : 'AVISE-ME'}
                  </motion.button>
                </motion.form>
                
                {status === 'error' && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-300 mt-3 bg-red-900/20 p-3 rounded-lg border border-red-500/20"
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Oops! Algo deu errado. Tente novamente.
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
