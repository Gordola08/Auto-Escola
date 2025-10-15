
import React from 'react'
import { motion } from 'framer-motion'
import { Award, Users, Target, Heart, Shield, Star, CheckCircle, Clock, Car, BookOpen } from 'lucide-react'

const Sobre = () => {
    const stats = [
        { number: '15+', label: 'Anos de Experiência', icon: Clock },
        { number: '5000+', label: 'Alunos Aprovados', icon: Users },
        { number: '98%', label: 'Taxa de Aprovação', icon: Target },
        { number: '50+', label: 'Veículos na Frota', icon: Car },
    ]

    const values = [
        {
            icon: Shield,
            title: 'Segurança',
            description: 'Priorizamos a segurança em todas as nossas atividades, desde as aulas teóricas até as práticas.'
        },
        {
            icon: Heart,
            title: 'Compromisso',
            description: 'Estamos comprometidos com o sucesso de cada aluno, oferecendo suporte personalizado.'
        },
        {
            icon: Award,
            title: 'Excelência',
            description: 'Buscamos sempre a excelência em nossos serviços e no atendimento aos nossos alunos.'
        },
        {
            icon: Users,
            title: 'Respeito',
            description: 'Tratamos cada aluno com respeito e dignidade, valorizando suas individualidades.'
        },
    ]

    const team = [
        {
            name: 'Carlos Silva',
            role: 'Diretor Geral',
            experience: '20 anos de experiência',
            image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
            description: 'Fundador da AutoEscola Drive, especialista em educação no trânsito.'
        },
        {
            name: 'Ana Costa',
            role: 'Coordenadora Pedagógica',
            experience: '15 anos de experiência',
            image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
            description: 'Responsável pelo desenvolvimento dos métodos de ensino e qualidade das aulas.'
        },
        {
            name: 'Roberto Santos',
            role: 'Instrutor Chefe',
            experience: '18 anos de experiência',
            image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
            description: 'Instrutor principal com especialização em todas as categorias de habilitação.'
        },
        {
            name: 'Maria Oliveira',
            role: 'Instrutora Especialista',
            experience: '12 anos de experiência',
            image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
            description: 'Especialista em aulas práticas para iniciantes e pessoas com dificuldades.'
        },
    ]

    const differentials = [
        'Instrutores certificados e experientes',
        'Frota moderna e bem conservada',
        'Metodologia de ensino atualizada',
        'Simuladores de última geração',
        'Acompanhamento personalizado',
        'Horários flexíveis',
        'Material didático digital',
        'Suporte 24/7 online',
        'Localização privilegiada',
        'Estacionamento gratuito'
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
                            Sobre <span className="text-orange-400">Nós</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
                            Conheça nossa história, valores e o que nos torna a melhor escolha para sua habilitação
                        </p>
                    </motion.div>
                </div>
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

            {/* Our Story Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-6"
                        >
                            <h2 className="text-4xl font-bold text-gray-900 mb-6">
                                Nossa História
                            </h2>

                            <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                                <p>
                                    A <strong>AutoEscola Drive</strong> nasceu em 2009 com o sonho de transformar
                                    a educação no trânsito. Fundada por Carlos Silva, nossa missão sempre foi
                                    formar condutores responsáveis e seguros.
                                </p>

                                <p>
                                    Ao longo dos anos, investimos continuamente em tecnologia, capacitação
                                    de instrutores e modernização de nossa frota. Hoje, somos referência
                                    na região com mais de 5.000 alunos aprovados.
                                </p>

                                <p>
                                    Nossa metodologia única combina teoria sólida com prática intensiva,
                                    garantindo que nossos alunos não apenas passem no exame, mas se tornem
                                    condutores exemplares.
                                </p>
                            </div>

                            <div className="flex items-center space-x-4 pt-4">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-10 h-10 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center">
                                            <Star className="h-5 w-5 text-white" />
                                        </div>
                                    ))}
                                </div>
                                <span className="text-gray-600">Avaliação 5 estrelas de nossos alunos</span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="relative"
                        >
                            <img
                                src="https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2"
                                alt="AutoEscola Drive"
                                className="rounded-2xl shadow-2xl"
                            />
                            <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-6 rounded-xl shadow-lg">
                                <div className="text-2xl font-bold">15+</div>
                                <div className="text-sm">Anos de tradição</div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Missão, Visão e Valores
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="bg-blue-50 rounded-2xl p-8 text-center"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full mb-6">
                                <Target className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Missão</h3>
                            <p className="text-gray-700">
                                Formar condutores responsáveis e seguros, contribuindo para um trânsito
                                mais seguro e consciente através de educação de qualidade.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-orange-50 rounded-2xl p-8 text-center"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600 text-white rounded-full mb-6">
                                <BookOpen className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Visão</h3>
                            <p className="text-gray-700">
                                Ser reconhecida como a melhor auto escola da região, referência em
                                qualidade de ensino e inovação na educação para o trânsito.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="bg-green-50 rounded-2xl p-8 text-center"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 text-white rounded-full mb-6">
                                <Heart className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Valores</h3>
                            <p className="text-gray-700">
                                Segurança, compromisso, excelência e respeito são os pilares que
                                orientam todas as nossas ações e decisões.
                            </p>
                        </motion.div>
                    </div>

                    {/* Values Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-lg mb-4">
                                    <value.icon className="h-6 w-6" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
                                <p className="text-gray-600 text-sm">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Nossa Equipe
                        </h2>
                        <p className="text-xl text-gray-600">
                            Profissionais qualificados e dedicados ao seu sucesso
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
                            >
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                                />
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                                <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                                <p className="text-sm text-gray-600 mb-3">{member.experience}</p>
                                <p className="text-gray-700 text-sm">{member.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Differentials Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Nossos Diferenciais
                        </h2>
                        <p className="text-xl text-gray-600">
                            O que nos torna únicos no mercado
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {differentials.map((differential, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                                className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-300"
                            >
                                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                                <span className="text-gray-700 font-medium">{differential}</span>
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
                            Faça parte da nossa família
                        </h2>
                        <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                            Junte-se aos milhares de alunos que conquistaram sua habilitação conosco.
                            Sua jornada para a independência no trânsito começa aqui!
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="tel:+5511999999999"
                                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors"
                            >
                                Entre em Contato
                            </a>
                            <a
                                href="#"
                                className="bg-orange-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-orange-600 transition-colors"
                            >
                                Agendar Visita
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}

export default Sobre
