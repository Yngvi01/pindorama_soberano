'use client';

import { motion } from 'framer-motion';
import { Heart, Target, Users, Award, MapPin, Mail, Phone } from 'lucide-react';

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Sobre a <span className="text-yellow-400">Pindorama Soberano</span>
            </h1>
            <p className="text-xl md:text-2xl text-green-100 leading-relaxed">
              Celebrando a cultura brasileira através de roupas e acessórios únicos,
              criados com amor e orgulho nacional.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Nossa História */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Nossa História</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              A Pindorama Soberano nasceu do amor pela cultura brasileira e da vontade de 
              expressar nossa identidade nacional através da moda. Pindorama, nome dado pelos 
              povos indígenas ao Brasil, significa "terra das palmeiras" - um símbolo da 
              riqueza natural e cultural do nosso país.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Criamos peças que contam histórias, que carregam símbolos e mensagens de 
              resistência, orgulho e soberania nacional. Cada produto é pensado para 
              celebrar nossa brasilidade de forma autêntica e contemporânea.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Nossos Valores */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Nossos Valores</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Os pilares que guiam nossa missão e definem quem somos
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Heart,
                title: "Amor pelo Brasil",
                description: "Cada peça é criada com amor e orgulho pela nossa terra e nossa gente."
              },
              {
                icon: Target,
                title: "Qualidade",
                description: "Utilizamos materiais de alta qualidade para garantir durabilidade e conforto."
              },
              {
                icon: Users,
                title: "Comunidade",
                description: "Valorizamos nossa comunidade e apoiamos artistas e criadores brasileiros."
              },
              {
                icon: Award,
                title: "Autenticidade",
                description: "Designs únicos que representam verdadeiramente a cultura brasileira."
              }
            ].map((valor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <valor.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{valor.title}</h3>
                <p className="text-gray-600 leading-relaxed">{valor.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Nossa Missão */}
      <section className="py-20 bg-gradient-to-r from-green-50 to-yellow-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Nossa Missão</h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 md:p-12 shadow-lg"
            >
              <blockquote className="text-xl md:text-2xl text-gray-700 leading-relaxed text-center italic mb-8">
                "Fortalecer a identidade brasileira através da moda, criando peças que 
                inspirem orgulho nacional e celebrem nossa rica diversidade cultural."
              </blockquote>
              <p className="text-lg text-gray-600 leading-relaxed text-center">
                Acreditamos que a moda é uma forma poderosa de expressão cultural. 
                Por isso, cada produto da Pindorama Soberano é uma declaração de amor 
                ao Brasil, uma forma de carregar nossa identidade com orgulho e 
                compartilhar nossa cultura com o mundo.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contato */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Entre em Contato</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Tem alguma dúvida ou sugestão? Adoraríamos ouvir você!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: MapPin,
                title: "Localização",
                info: "Brasil - Terra das Palmeiras"
              },
              {
                icon: Mail,
                title: "E-mail",
                info: "contato@pindoramasoberano.com.br"
              },
              {
                icon: Phone,
                title: "Telefone",
                info: "+55 (11) 99999-9999"
              }
            ].map((contato, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <contato.icon className="h-8 w-8 text-gray-900" />
                </div>
                <h3 className="text-xl font-bold mb-2">{contato.title}</h3>
                <p className="text-gray-300">{contato.info}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}