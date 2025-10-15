
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { lumi } from '../lib/lumi'
import { Calendar, Clock, Trophy, Target, BookOpen, Car, Star, TrendingUp, Award, Bell, User, CreditCard, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface Student {
    _id: string
    user_id: string
    name: string
    category: string
    status: string
    theoreticalHours: number
    practicalHours: number
    theoreticalRequired: number
    practicalRequired: number
    points: number
    badges: string[]
    avatar?: string
}

interface Lesson {
    _id: string
    student_id: string
    type: string
    scheduledDate: string
    status: string
    instructor_id: string
}

interface Notification {
    _id: string
    title: string
    message: string
    type: string
    status: string
    createdAt: string
}

const Dashboard = () => {
    const { user, isAuthenticated, signIn } = useAuth()
    const [student, setStudent] = useState<Student | null>(null)
    const [upcomingLessons, setUpcomingLessons] = useState<Lesson[]>([])
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)

    const fetchStudentData = async () => {
        if (!user) return

        try {
            setLoading(true)

            // Buscar dados do aluno
            const { list: students } = await lumi.entities.students.list({
                filter: { user_id: user.userId }
            })

            if (students && students.length > 0) {
                setStudent(students[0])

                // Buscar próximas aulas
                const { list: lessons } = await lumi.entities.lessons.list({
                    filter: {
                        student_id: students[0]._id,
                        status: { $in: ['agendada', 'confirmada'] }
                    },
                    sort: { scheduledDate: 1 },
                    limit: 5
                })
                setUpcomingLessons(lessons || [])
            }

            // Buscar notificações não lidas
            const { list: userNotifications } = await lumi.entities.notifications.list({
                filter: {
                    user_id: user.userId,
                    status: { $in: ['pendente', 'enviada'] }
                },
                sort: { createdAt: -1 },
                limit: 5
            })
            setNotifications(userNotifications || [])

        } catch (error) {
            console.error('Erro ao carregar dados:', error)
            toast.error('Erro ao carregar dados do dashboard')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (isAuthenticated && user) {
            fetchStudentData()
        } else {
            setLoading(false)
        }
    }, [isAuthenticated, user])

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md"
                >
                    <User className="h-16 w-16 text-blue-600 mx-auto mb-6" />
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Portal do Aluno
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Faça login para acessar seu painel de estudos e acompanhar seu progresso
                    </p>
                    <button
                        onClick={signIn}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Fazer Login
                    </button>
                </motion.div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (!student) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-md"
                >
                    <BookOpen className="h-16 w-16 text-orange-500 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Bem-vindo à AutoEscola Drive!
                    </h2>
                    <p className="text-gray-600 mb-8">
                        Você ainda não está matriculado. Entre em contato conosco para iniciar seu curso.
                    </p>
                    <a
                        href="/contato"
                        className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Falar Conosco
                    </a>
                </motion.div>
            </div>
        )
    }

    const theoreticalProgress = (student.theoreticalHours / student.theoreticalRequired) * 100
    const practicalProgress = (student.practicalHours / student.practicalRequired) * 100
    const overallProgress = ((student.theoreticalHours + student.practicalHours) /
        (student.theoreticalRequired + student.practicalRequired)) * 100

    const badgeLabels: Record<string, string> = {
        'primeira_aula': 'Primeira Aula',
        'teorico_completo': 'Teórico Completo',
        'pratico_completo': 'Prático Completo',
        '10_aulas_praticas': '10 Aulas Práticas',
        '5_aulas_teoricas': '5 Aulas Teóricas',
        'aprovado_primeira_tentativa': 'Aprovado na 1ª Tentativa',
        'formado': 'Formado'
    }

    const statusLabels: Record<string, { label: string; color: string }> = {
        'matriculado': { label: 'Matriculado', color: 'bg-blue-100 text-blue-800' },
        'cursando_teorico': { label: 'Cursando Teórico', color: 'bg-yellow-100 text-yellow-800' },
        'cursando_pratico': { label: 'Cursando Prático', color: 'bg-orange-100 text-orange-800' },
        'aprovado': { label: 'Aprovado', color: 'bg-green-100 text-green-800' },
        'formado': { label: 'Formado', color: 'bg-purple-100 text-purple-800' },
        'reprovado': { label: 'Reprovado', color: 'bg-red-100 text-red-800' }
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="bg-white rounded-3xl shadow-xl p-8">
                        <div className="flex items-center space-x-6">
                            <img
                                src={student.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg'}
                                alt={student.name}
                                className="w-20 h-20 rounded-full object-cover"
                            />
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    Olá, {student.name}!
                                </h1>
                                <div className="flex items-center space-x-4">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusLabels[student.status]?.color}`}>
                                        {statusLabels[student.status]?.label}
                                    </span>
                                    <span className="text-gray-600">Categoria {student.category}</span>
                                    <div className="flex items-center space-x-1">
                                        <Trophy className="h-4 w-4 text-yellow-500" />
                                        <span className="text-yellow-600 font-medium">{student.points} pontos</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-blue-600 mb-1">
                                    {Math.round(overallProgress)}%
                                </div>
                                <div className="text-gray-600 text-sm">Progresso Geral</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Coluna Principal */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Progresso dos Cursos */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-3xl shadow-xl p-8"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                <Target className="h-6 w-6 text-blue-600 mr-3" />
                                Progresso do Curso
                            </h2>

                            <div className="space-y-6">
                                {/* Progresso Teórico */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center space-x-2">
                                            <BookOpen className="h-5 w-5 text-blue-600" />
                                            <span className="font-medium text-gray-900">Aulas Teóricas</span>
                                        </div>
                                        <span className="text-sm text-gray-600">
                                            {student.theoreticalHours}/{student.theoreticalRequired}h
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min(theoreticalProgress, 100)}%` }}
                                        />
                                    </div>
                                    <div className="text-right mt-1">
                                        <span className="text-sm font-medium text-blue-600">
                                            {Math.round(theoreticalProgress)}%
                                        </span>
                                    </div>
                                </div>

                                {/* Progresso Prático */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center space-x-2">
                                            <Car className="h-5 w-5 text-orange-600" />
                                            <span className="font-medium text-gray-900">Aulas Práticas</span>
                                        </div>
                                        <span className="text-sm text-gray-600">
                                            {student.practicalHours}/{student.practicalRequired}h
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className="bg-orange-600 h-3 rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min(practicalProgress, 100)}%` }}
                                        />
                                    </div>
                                    <div className="text-right mt-1">
                                        <span className="text-sm font-medium text-orange-600">
                                            {Math.round(practicalProgress)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Próximas Aulas */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-3xl shadow-xl p-8"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                <Calendar className="h-6 w-6 text-green-600 mr-3" />
                                Próximas Aulas
                            </h2>

                            {upcomingLessons.length > 0 ? (
                                <div className="space-y-4">
                                    {upcomingLessons.map((lesson) => (
                                        <div key={lesson._id} className="border rounded-xl p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`w-3 h-3 rounded-full ${lesson.type === 'teorica' ? 'bg-blue-500' :
                                                        lesson.type === 'pratica' ? 'bg-orange-500' : 'bg-purple-500'
                                                        }`} />
                                                    <div>
                                                        <div className="font-medium text-gray-900 capitalize">
                                                            Aula {lesson.type}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {new Date(lesson.scheduledDate).toLocaleDateString('pt-BR', {
                                                                weekday: 'long',
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${lesson.status === 'agendada' ? 'bg-yellow-100 text-yellow-800' :
                                                    lesson.status === 'confirmada' ? 'bg-green-100 text-green-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {lesson.status === 'agendada' ? 'Agendada' :
                                                        lesson.status === 'confirmada' ? 'Confirmada' : lesson.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">Nenhuma aula agendada</p>
                                    <a
                                        href="/agendamento"
                                        className="text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block"
                                    >
                                        Agendar nova aula
                                    </a>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Badges e Conquistas */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-3xl shadow-xl p-8"
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <Award className="h-5 w-5 text-purple-600 mr-2" />
                                Conquistas
                            </h3>

                            {student.badges && student.badges.length > 0 ? (
                                <div className="grid grid-cols-2 gap-3">
                                    {student.badges.map((badge) => (
                                        <div key={badge} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 text-center">
                                            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                                <Star className="h-4 w-4 text-white" />
                                            </div>
                                            <div className="text-xs font-medium text-purple-800">
                                                {badgeLabels[badge] || badge}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <Trophy className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-500 text-sm">Nenhuma conquista ainda</p>
                                </div>
                            )}
                        </motion.div>

                        {/* Notificações */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white rounded-3xl shadow-xl p-8"
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <Bell className="h-5 w-5 text-red-600 mr-2" />
                                Notificações
                            </h3>

                            {notifications.length > 0 ? (
                                <div className="space-y-3">
                                    {notifications.slice(0, 3).map((notification) => (
                                        <div key={notification._id} className="border-l-4 border-blue-500 bg-blue-50 p-3 rounded-r-lg">
                                            <div className="font-medium text-blue-900 text-sm">
                                                {notification.title}
                                            </div>
                                            <div className="text-blue-700 text-xs mt-1">
                                                {notification.message}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-500 text-sm">Nenhuma notificação</p>
                                </div>
                            )}
                        </motion.div>

                        {/* Ações Rápidas */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white rounded-3xl shadow-xl p-8"
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-6">
                                Ações Rápidas
                            </h3>

                            <div className="space-y-3">
                                <a
                                    href="/simulado"
                                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                                >
                                    <BookOpen className="h-4 w-4" />
                                    <span>Fazer Simulado</span>
                                </a>

                                <a
                                    href="/agendamento"
                                    className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                                >
                                    <Calendar className="h-4 w-4" />
                                    <span>Agendar Aula</span>
                                </a>

                                <a
                                    href="/financeiro"
                                    className="w-full bg-orange-600 text-white py-3 rounded-xl font-medium hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
                                >
                                    <CreditCard className="h-4 w-4" />
                                    <span>Ver Financeiro</span>
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
