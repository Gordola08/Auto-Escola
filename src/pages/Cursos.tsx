
import React from 'react'
import { motion } from 'framer-motion'
import {Car, Clock, Users, CheckCircle, Star, BookOpen, Shield, Award, Target, Bike, Truck} from 'lucide-react'

const Cursos = () => {
  const courses = [
    {
      id: 1,
      category: 'A',
      title: 'Habilitação Categoria A',
      subtitle: 'Motocicletas e Motonetas',
      icon: Bike,
      duration: '25 horas',
      students: '500+ aprovados',
      price: 'R$ 900,00',
      description: 'Curso completo para habilitação de motocicletas até 50cc e ciclomotores.',
      features: [
        '20h de aulas teóricas',
        '5h de aulas práticas',
        'Simulados online ilimitados',
        'Material didático incluso',
        'Instrutor especializado',
        'Motocicletas modernas'
      ],
      requirements: [
        'Idade mínima: 18 anos',
        'Saber ler e escrever',
        'Documento de identidade',
        'CPF',
        'Comprovante de residência'
      ],
      process: [
        'Matrícula e documentação',
        'Exame médico e psicotécnico',
        'Aulas teóricas (20h)',
        'Prova teórica no DETRAN',
        'Aulas práticas (5h)',
        'Exame prático no DETRAN'
      ]
    },
    {
      id: 2,
      category: 'B',
      title: 'Habilitação Categoria B',
      subtitle: 'Carros de Passeio',
      icon: Car,
      duration: '45 horas',
      students: '2000+ aprovados',
      price: 'R$ 1.200,00',
      description: 'Curso completo para habilitação de veículos de passeio até 3.500kg.',
      features: [
        '45h de aulas teóricas',
        '25h de aulas práticas',
        'Simulados online ilimitados',
        'Material didático digital',
        'Instrutores certificados',
        'Veículos com duplo comando'
      ],
      requirements: [
        'Idade mínima: 18 anos',
        'Saber ler e escrever',
        'Documento de identidade',
        'CPF',
        'Comprovante de residência'
      ],
      process: [
        'Matrícula e documentação',
        'Exame médico e psicotécnico',
        'Aulas teóricas (45h)',
        'Prova teórica no DETRAN',
        'Aulas práticas (25h)',
        'Exame prático no DETRAN'
      ]
    },
    {
      id: 3,
      category: 'AB',
      title: 'Habilitação Categoria A+B',
      subtitle: 'Motos e Carros',
      icon: Target,
      duration: '70 horas',
      students: '800+ aprovados',
      price: 'R$ 1.800,00',
      description: 'Curso combinado para habilitação de motocicletas e carros de passeio.',
      features: [
        '45h de aulas teóricas',
        '25h de práticas (carro)',
        '5h de práticas (moto)',
        'Simulados especializados',
        'Material completo',
        'Desconto especial'
      ],
      requirements: [
        'Idade mínima: 18 anos',
        'Saber ler e escrever',
        'Documento de identidade',
        'CPF',
        'Comprovante de residência'
      ],
      process: [
        'Matrícula única',
        'Exames médico e psicotécnico',
        'Aulas teóricas (45h)',
        'Prova teórica (única)',
        'Aulas práticas (30h total)',
        'Exames práticos (A e B)'
      ]
    },
    {
      id: 4,
      category: 'C',
      title: 'Adição Categoria C',
      subtitle: 'Caminhões',
      icon: Truck,
      duration: '50 horas',
      students: '300+ aprovados',
      price: 'R$ 1.500,00',
      description: 'Curso para adição da categoria C - caminhões e veículos de carga.',
      features: [
        '50h de aulas teóricas',
        '15h de aulas práticas',
        'Curso de movimentação de cargas',
        'Simulador de direção',
        'Instrutor especializado',
        'Caminhões modernos'
      ],
      requirements: [
        'Possuir CNH categoria B',
        'Idade mínima: 21 anos',
        '1 ano de habilitação',
        'Não ter cometido infração grave',
        'Curso de movimentação de cargas'
      ],
      process: [
        'Verificação de requisitos',
        'Matrícula e documentação',
        'Curso especializado (50h)',
        'Exame teórico especializado',
        'Aulas práticas (15h)',
        'Exame prático no DETRAN'
      ]
    }
  ]

  const benefits = [
    {
      icon: Award,
      title: 'Instrutores Certificados',
      description: 'Profissionais qualificados e experientes'
    },
    {
      icon: Car,
      title: 'Frota Moderna',
      description: 'Veículos novos com duplo comando'
    },
    {
      icon: BookOpen,
      title: 'Material Atualizado',
      description: 'Conteúdo sempre atualizado com as leis'
    },
    {
      icon: Shield,
      title: 'Segurança Total',
      description: 'Aulas práticas com máxima segurança'
    }
  ]

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-indigo-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Nossos <span className="text-orange-400">Cursos</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Escolha o curso ideal para você e conquiste sua habilitação com qualidade e segurança
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <benefit.icon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Escolha seu Curso
            </h2>
            <p className="text-xl text-gray-600">
              Oferecemos cursos para todas as categorias de habilitação
            </p>
          </motion.div>

          <div className="space-y-12">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
                  {/* Course Info */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-xl">
                        <course.icon className="h-8 w-8" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Categoria {course.category}
                          </span>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">{course.title}</h3>
                        <p className="text-gray-600">{course.subtitle}</p>
                      </div>
                    </div>

                    <p className="text-gray-700 text-lg">{course.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">O que está incluso:</h4>
                        <ul className="space-y-2">
                          {course.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span className="text-gray-600">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Requisitos:</h4>
                        <ul className="space-y-2">
                          {course.requirements.map((req, idx) => (
                            <li key={idx} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                              <span className="text-gray-600">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Processo do curso:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {course.process.map((step, idx) => (
                          <div key={idx} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-medium">
                              {idx + 1}
                            </div>
                            <span className="text-sm text-gray-700">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Course Details & CTA */}
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-blue-600" />
                        <span className="text-gray-700">{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Users className="h-5 w-5 text-blue-600" />
                        <span className="text-gray-700">{course.students}</span>
                      </div>
                      <div className="border-t pt-4">
                        <div className="text-3xl font-bold text-blue-600 mb-2">{course.price}</div>
                        <div className="text-sm text-gray-600">Parcelamento disponível</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                        Matricular Agora
                      </button>
                      <button className="w-full border border-blue-600 text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
                        Mais Informações
                      </button>
                    </div>

                    <div className="text-center">
                      <a href="tel:+5511999999999" className="text-blue-600 hover:text-blue-700 font-medium">
                        📞 (11) 99999-9999
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ainda tem dúvidas?
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Nossa equipe está pronta para esclarecer todas as suas dúvidas e ajudar você a escolher o melhor curso
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+5511999999999"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors"
              >
                Ligar Agora
              </a>
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-green-600 transition-colors"
              >
                WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Cursos
