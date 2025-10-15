
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { lumi } from '../lib/lumi'
import { Calendar, Clock, User, Car, CheckCircle, AlertCircle, ChevronLeft, ChevronRight, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'

interface Instructor {
    _id: string
    name: string
    categories: string[]
    rating: number
    avatar?: string
    schedule: Record<string, string[]>
}

interface Student {
    _id: string
    category: string
    name: string
}

interface Vehicle {
    _id: string
    model: string
    brand: string
    category: string
    status: string
}

const Agendamento = () => {
    const { user, isAuthenticated, signIn } = useAuth()
    const [student, setStudent] = useState<Student | null>(null)
    const [instructors, setInstructors] = useState<Instructor[]>([])
    const [vehicles, setVehicles] = useState<Vehicle[]>([])
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [selectedInstructor, setSelectedInstructor] = useState<string>('')
    const [selectedTime, setSelectedTime] = useState<string>('')
    const [selectedType, setSelectedType] = useState<string>('pratica')
    const [selectedVehicle, setSelectedVehicle] = useState<string>('')
    const [availableSlots, setAvailableSlots] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const [booking, setBooking] = useState(false)

    const fetchData = async () => {
        if (!user) return

        try {
            setLoading(true)

            // Buscar dados do aluno
            const { list: students } = await lumi.entities.students.list({
                filter: { user_id: user.userId }
            })

            if (students && students.length > 0) {
                setStudent(students[0])

                // Buscar instrutores da categoria do aluno
                const { list: instructorList } = await lumi.entities.instructors.list({
                    filter: {
                        categories: { $in: [students[0].category] },
                        status: 'ativo'
                    }
                })
                setInstructors(instructorList || [])

                // Buscar veículos da categoria do aluno
                const { list: vehicleList } = await lumi.entities.vehicles.list({
                    filter: {
                        category: students[0].category,
                        status: { $in: ['disponivel', 'em_uso'] }
                    }
                })
                setVehicles(vehicleList || [])
            }
        } catch (error) {
            console.error('Erro ao carregar dados:', error)
            toast.error('Erro ao carregar dados')
        } finally {
            setLoading(false)
        }
    }

    const generateAvailableSlots = async () => {
        if (!selectedInstructor || !selectedDate) return

        const instructor = instructors.find(i => i._id === selectedInstructor)
        if (!instructor) return

        const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'lowercase' })
        const scheduleForDay = instructor.schedule[dayOfWeek] || []

        // Buscar aulas já agendadas para o instrutor na data selecionada
        const startOfDay = new Date(selectedDate)
        startOfDay.setHours(0, 0, 0, 0)
        const endOfDay = new Date(selectedDate)
        endOfDay.setHours(23, 59, 59, 999)

        try {
            const { list: bookedLessons } = await lumi.entities.lessons.list({
                filter: {
                    instructor_id: selectedInstructor,
                    scheduledDate: {
                        $gte: startOfDay.toISOString(),
                        $lte: endOfDay.toISOString()
                    },
                    status: { $in: ['agendada', 'confirmada'] }
                }
            })

            const bookedTimes = (bookedLessons || []).map(lesson => {
                const date = new Date(lesson.scheduledDate)
                return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
            })

            // Gerar slots disponíveis
            const slots: string[] = []
            scheduleForDay.forEach(timeRange => {
                const [start, end] = timeRange.split('-')
                const [startHour] = start.split(':').map(Number)
                const [endHour] = end.split(':').map(Number)

                for (let hour = startHour; hour < endHour; hour++) {
                    const timeSlot = `${hour.toString().padStart(2, '0')}:00`
                    if (!bookedTimes.includes(timeSlot)) {
                        slots.push(timeSlot)
                    }
                }
            })

            setAvailableSlots(slots)
        } catch (error) {
            console.error('Erro ao verificar horários:', error)
            setAvailableSlots([])
        }
    }

    const handleBooking = async () => {
        if (!student || !selectedDate || !selectedTime || !selectedInstructor) {
            toast.error('Preencha todos os campos obrigatórios')
            return
        }

        if (selectedType === 'pratica' && !selectedVehicle) {
            toast.error('Selecione um veículo para aula prática')
            return
        }

        setBooking(true)
        try {
            const [hour, minute] = selectedTime.split(':').map(Number)
            const lessonDate = new Date(selectedDate)
            lessonDate.setHours(hour, minute, 0, 0)

            const lessonData = {
                student_id: student._id,
                instructor_id: selectedInstructor,
                type: selectedType,
                scheduledDate: lessonDate.toISOString(),
                duration: selectedType === 'teorica' ? 60 : 50,
                status: 'agendada',
                vehicle: selectedType === 'pratica' ? selectedVehicle : undefined,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }

            await lumi.entities.lessons.create(lessonData)

            // Criar notificação para o aluno
            await lumi.entities.notifications.create({
                user_id: user!.userId,
                title: 'Aula Agendada',
                message: `Sua aula ${selectedType} foi agendada para ${lessonDate.toLocaleDateString('pt-BR')} às ${selectedTime}`,
                type: 'aula',
                priority: 'normal',
                status: 'pendente',
                channels: ['app', 'email'],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            })

            toast.success('Aula agendada com sucesso!')

            // Resetar formulário
            setSelectedTime('')
            setSelectedVehicle('')
            generateAvailableSlots()

        } catch (error) {
            console.error('Erro ao agendar aula:', error)
            toast.error('Erro ao agendar aula')
        } finally {
            setBooking(false)
        }
    }

    useEffect(() => {
        if (isAuthenticated && user) {
            fetchData()
        }
    }, [isAuthenticated, user])

    useEffect(() => {
        if (selectedInstructor && selectedDate) {
            generateAvailableSlots()
        }
    }, [selectedInstructor, selectedDate])

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center pt-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md"
                >
                    <Calendar className="h-16 w-16 text-blue-600 mx-auto mb-6" />
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Agendamento Online
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Faça login para agendar suas aulas
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (!student) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-md"
                >
                    <AlertCircle className="h-16 w-16 text-orange-500 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Matrícula Necessária
                    </h2>
                    <p className="text-gray-600 mb-8">
                        Você precisa estar matriculado para agendar aulas
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

    const today = new Date()
    const maxDate = new Date()
    maxDate.setDate(today.getDate() + 30) // Máximo 30 dias no futuro

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Agendamento de Aulas
                    </h1>
                    <p className="text-xl text-gray-600">
                        Agende suas aulas práticas e teóricas de forma fácil e rápida
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Formulário de Agendamento */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-3xl shadow-xl p-8"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <Calendar className="h-6 w-6 text-blue-600 mr-3" />
                            Nova Aula
                        </h2>

                        <div className="space-y-6">
                            {/* Tipo de Aula */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tipo de Aula
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setSelectedType('teorica')}
                                        className={`p-3 rounded-xl border-2 transition-colors ${selectedType === 'teorica'
                                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-center justify-center space-x-2">
                                            <Clock className="h-4 w-4" />
                                            <span className="font-medium">Teórica</span>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => setSelectedType('pratica')}
                                        className={`p-3 rounded-xl border-2 transition-colors ${selectedType === 'pratica'
                                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-center justify-center space-x-2">
                                            <Car className="h-4 w-4" />
                                            <span className="font-medium">Prática</span>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Data */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Data da Aula
                                </label>
                                <input
                                    type="date"
                                    value={selectedDate.toISOString().split('T')[0]}
                                    min={today.toISOString().split('T')[0]}
                                    max={maxDate.toISOString().split('T')[0]}
                                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Instrutor */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Instrutor
                                </label>
                                <select
                                    value={selectedInstructor}
                                    onChange={(e) => setSelectedInstructor(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Selecione um instrutor</option>
                                    {instructors.map((instructor) => (
                                        <option key={instructor._id} value={instructor._id}>
                                            {instructor.name} - {instructor.rating}⭐ ({instructor.categories.join(', ')})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Horário */}
                            {selectedInstructor && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Horário Disponível
                                    </label>
                                    {availableSlots.length > 0 ? (
                                        <div className="grid grid-cols-3 gap-2">
                                            {availableSlots.map((slot) => (
                                                <button
                                                    key={slot}
                                                    onClick={() => setSelectedTime(slot)}
                                                    className={`p-2 rounded-lg border-2 transition-colors ${selectedTime === slot
                                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    {slot}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-4 text-gray-500">
                                            Nenhum horário disponível para esta data
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Veículo (apenas para aulas práticas) */}
                            {selectedType === 'pratica' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Veículo
                                    </label>
                                    <select
                                        value={selectedVehicle}
                                        onChange={(e) => setSelectedVehicle(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Selecione um veículo</option>
                                        {vehicles.map((vehicle) => (
                                            <option key={vehicle._id} value={vehicle._id}>
                                                {vehicle.brand} {vehicle.model} - {vehicle.category}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Botão de Agendamento */}
                            <button
                                onClick={handleBooking}
                                disabled={booking || !selectedTime || !selectedInstructor}
                                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                            >
                                {booking ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>Agendando...</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="h-4 w-4" />
                                        <span>Agendar Aula</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>

                    {/* Informações Adicionais */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        {/* Instrutor Selecionado */}
                        {selectedInstructor && (
                            <div className="bg-white rounded-3xl shadow-xl p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                    <User className="h-5 w-5 text-blue-600 mr-2" />
                                    Instrutor Selecionado
                                </h3>
                                {instructors
                                    .filter(i => i._id === selectedInstructor)
                                    .map((instructor) => (
                                        <div key={instructor._id} className="flex items-center space-x-4">
                                            <img
                                                src={instructor.avatar || 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg'}
                                                alt={instructor.name}
                                                className="w-16 h-16 rounded-full object-cover"
                                            />
                                            <div>
                                                <div className="font-semibold text-gray-900">{instructor.name}</div>
                                                <div className="text-gray-600">Categorias: {instructor.categories.join(', ')}</div>
                                                <div className="flex items-center space-x-1">
                                                    <span className="text-yellow-500">⭐</span>
                                                    <span className="text-gray-600">{instructor.rating}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}

                        {/* Resumo da Aula */}
                        {selectedTime && selectedInstructor && (
                            <div className="bg-white rounded-3xl shadow-xl p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">
                                    Resumo da Aula
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tipo:</span>
                                        <span className="font-medium capitalize">{selectedType}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Data:</span>
                                        <span className="font-medium">
                                            {selectedDate.toLocaleDateString('pt-BR')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Horário:</span>
                                        <span className="font-medium">{selectedTime}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Duração:</span>
                                        <span className="font-medium">
                                            {selectedType === 'teorica' ? '60 min' : '50 min'}
                                        </span>
                                    </div>
                                    {selectedType === 'pratica' && selectedVehicle && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Veículo:</span>
                                            <span className="font-medium">
                                                {vehicles.find(v => v._id === selectedVehicle)?.brand} {vehicles.find(v => v._id === selectedVehicle)?.model}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Dicas */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6">
                            <h3 className="text-xl font-bold text-blue-900 mb-4">
                                Dicas Importantes
                            </h3>
                            <ul className="space-y-2 text-blue-800">
                                <li className="flex items-start space-x-2">
                                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm">Chegue 10 minutos antes do horário</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm">Traga seus documentos pessoais</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm">Use calçados fechados para aulas práticas</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm">Cancele com 24h de antecedência</span>
                                </li>
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default Agendamento
