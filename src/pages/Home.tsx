
import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Car, Users, Award, Clock, CheckCircle, Star, ArrowRight, Shield, Target, BookOpen } from 'lucide-react'

const Home = () => {
    const stats = [
        { icon: Users, number: '5000+', label: 'Alunos Aprovados' },
        { icon: Award, number: '15+', label: 'Anos de Experiência' },
        { icon: Car, number: '98%', label: 'Taxa de Aprovação' },
        { icon: Clock, number: '24h', label: 'Suporte Online' },
    ]

    const services = [
        {
            icon: Car,
            title: 'Primeira Habilitação',
            description: 'Categoria A e B com aulas teóricas e práticas completas',
            features: ['45h de aulas teóricas', 'Aulas práticas personalizadas', 'Simulados online'],
            price: 'A partir de R$ 1.200'
        },
        {
            icon: Shield,
            title: 'Renovação de CNH',
            description: 'Renovação rápida e sem complicações',
            features: ['Exame médico', 'Exame psicotécnico', 'Foto digital'],
            price: 'A partir de R$ 350'
        },
        {
            icon: Target,
            title: 'Adição de Categoria',
            description: 'Adicione novas categorias à sua habilitação',
            features: ['Categoria A para B', 'Categoria B para A', 'Categorias C, D, E'],
            price: 'A partir de R$ 800'
        },
    ]

    const testimonials = [
        {
            name: 'Maria Silva',
            rating: 5,
            comment: 'Excelente auto escola! Passei de primeira no exame. Instrutores muito pacientes e qualificados.',
            avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
        },
        {
            name: 'João Santos',
            rating: 5,
            comment: 'Recomendo muito! Estrutura moderna e metodologia eficiente. Consegui minha carteira em tempo recorde.',
            avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
        },
        {
            name: 'Ana Costa',
            rating: 5,
            comment: 'Atendimento excepcional do início ao fim. Equipe super profissional e carros em ótimo estado.',
            avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
        },
    ]

    return (
        <div className="overflow-hidden">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2"
                        alt="Driving"
                        className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-indigo-900/80"></div>
                </div>

                {/* Floating Elements */}
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, 0]
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-20 left-10 w-16 h-16 bg-orange-500/20 rounded-full blur-xl"
                />
                <motion.div
                    animate={{
                        y: [0, 20, 0],
                        x: [0, 10, 0]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute bottom-20 right-10 w-24 h-24 bg-blue-500/20 rounded-full blur-xl"
                />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                            Sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">Carteira</span>
                            <br />
                            de Motorista
                            <br />
                            <span className="text-blue-300">com Segurança</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                            A auto escola mais confiável da região. Aprenda a dirigir com instrutores qualificados
                            e conquiste sua independência no trânsito.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                to="/contato"
                                className="group bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                            >
                                <span className="flex items-center space-x-2">
                                    <span>Matricule-se Agora</span>
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>

                            <Link
                                to="/simulado"
                                className="group bg-white/10 backdrop-blur-lg text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
                            >
                                <span className="flex items-center space-x-2">
                                    <BookOpen className="h-5 w-5" />
                                    <span>Simulado Grátis</span>
                                </span>
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                >
                    <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
                    </div>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="text-center group"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                    <stat.icon className="h-8 w-8" />
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                                <div className="text-gray-600">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Nossos Serviços
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Oferecemos uma gama completa de serviços para todas as suas necessidades de habilitação
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                            >
                                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-xl mb-6">
                                    <service.icon className="h-8 w-8" />
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                                <p className="text-gray-600 mb-6">{service.description}</p>

                                <ul className="space-y-2 mb-6">
                                    {service.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center space-x-2">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <span className="text-sm text-gray-600">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="text-2xl font-bold text-blue-600 mb-4">{service.price}</div>

                                <Link
                                    to="/contato"
                                    className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Saiba Mais
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            O que nossos alunos dizem
                        </h2>
                        <p className="text-xl text-gray-600">
                            Depoimentos reais de quem conquistou a carteira conosco
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="flex items-center space-x-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                                    ))}
                                </div>

                                <p className="text-gray-700 mb-6 italic">"{testimonial.comment}"</p>

                                <div className="flex items-center space-x-3">
                                    <img
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <div className="font-medium text-gray-900">{testimonial.name}</div>
                                        <div className="text-sm text-gray-600">Aluno aprovado</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8"
                    >
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Pronto para começar sua jornada?
                        </h2>
                        <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                            Entre em contato conosco hoje mesmo e dê o primeiro passo rumo à sua independência no trânsito
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/contato"
                                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors"
                            >
                                Fale Conosco
                            </Link>
                            <a
                                href="tel:+5511999999999"
                                className="bg-orange-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-orange-600 transition-colors"
                            >
                                (11) 99999-9999
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}

export default Home
