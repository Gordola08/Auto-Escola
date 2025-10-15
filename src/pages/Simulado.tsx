
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Clock, CheckCircle, XCircle, RotateCcw, Award, Target, Brain, ArrowRight, ArrowLeft } from 'lucide-react'

interface Question {
    id: number
    question: string
    options: string[]
    correct: number
    explanation: string
    category: string
}

const Simulado = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
    const [answers, setAnswers] = useState<(number | null)[]>([])
    const [showResult, setShowResult] = useState(false)
    const [timeLeft, setTimeLeft] = useState(1800) // 30 minutos em segundos
    const [isStarted, setIsStarted] = useState(false)

    const questions: Question[] = [
        {
            id: 1,
            question: "Qual é a velocidade máxima permitida em vias urbanas para veículos de passeio?",
            options: ["40 km/h", "50 km/h", "60 km/h", "70 km/h"],
            correct: 2,
            explanation: "Em vias urbanas, a velocidade máxima para veículos de passeio é de 60 km/h, conforme estabelecido pelo Código de Trânsito Brasileiro.",
            category: "Legislação"
        },
        {
            id: 2,
            question: "O que significa a placa de trânsito circular com fundo azul e símbolo branco?",
            options: ["Proibição", "Advertência", "Regulamentação", "Indicação"],
            correct: 2,
            explanation: "Placas circulares com fundo azul e símbolos brancos são de regulamentação, indicando uma obrigação ou restrição.",
            category: "Sinalização"
        },
        {
            id: 3,
            question: "Em caso de aquaplanagem, o condutor deve:",
            options: [
                "Acelerar para sair rapidamente da água",
                "Frear bruscamente",
                "Manter o volante firme e tirar o pé do acelerador",
                "Virar o volante rapidamente"
            ],
            correct: 2,
            explanation: "Na aquaplanagem, deve-se manter o volante firme, tirar o pé do acelerador gradualmente e evitar movimentos bruscos.",
            category: "Direção Defensiva"
        },
        {
            id: 4,
            question: "A distância mínima de seguimento em rodovias é:",
            options: ["2 segundos", "3 segundos", "4 segundos", "5 segundos"],
            correct: 1,
            explanation: "A regra dos 3 segundos é recomendada para manter distância segura em condições normais de tráfego.",
            category: "Direção Defensiva"
        },
        {
            id: 5,
            question: "Qual documento é obrigatório para conduzir veículos?",
            options: ["RG", "CPF", "CNH", "Carteira de trabalho"],
            correct: 2,
            explanation: "A Carteira Nacional de Habilitação (CNH) é o documento obrigatório para conduzir veículos automotores.",
            category: "Legislação"
        },
        {
            id: 6,
            question: "O condutor que dirigir sob efeito de álcool comete:",
            options: ["Infração leve", "Infração média", "Infração grave", "Crime"],
            correct: 3,
            explanation: "Dirigir sob efeito de álcool é considerado crime pelo Código de Trânsito Brasileiro.",
            category: "Legislação"
        },
        {
            id: 7,
            question: "Em uma curva, o veículo tende a:",
            options: ["Acelerar", "Desacelerar", "Seguir em linha reta", "Inclinar para dentro"],
            correct: 2,
            explanation: "Devido à inércia, o veículo tende a seguir em linha reta, exigindo força no volante para fazer a curva.",
            category: "Mecânica"
        },
        {
            id: 8,
            question: "A luz de freio deve estar sempre:",
            options: ["Apagada", "Acesa", "Funcionando", "Piscando"],
            correct: 2,
            explanation: "A luz de freio deve estar sempre funcionando para sinalizar aos demais condutores quando o veículo está freando.",
            category: "Mecânica"
        },
        {
            id: 9,
            question: "Ao se aproximar de uma faixa de pedestres, o condutor deve:",
            options: [
                "Acelerar para passar rapidamente",
                "Buzinar para avisar os pedestres",
                "Reduzir a velocidade e parar se necessário",
                "Manter a velocidade"
            ],
            correct: 2,
            explanation: "O condutor deve sempre reduzir a velocidade ao se aproximar de faixas de pedestres e parar quando necessário.",
            category: "Direção Defensiva"
        },
        {
            id: 10,
            question: "O prazo para renovação da CNH é de:",
            options: ["3 anos", "5 anos", "10 anos", "Não há prazo"],
            correct: 1,
            explanation: "A CNH deve ser renovada a cada 5 anos para condutores até 50 anos, e a cada 3 anos para condutores acima de 50 anos.",
            category: "Legislação"
        }
    ]

    useEffect(() => {
        setAnswers(new Array(questions.length).fill(null))
    }, [])

    useEffect(() => {
        let timer: NodeJS.Timeout
        if (isStarted && timeLeft > 0 && !showResult) {
            timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
        } else if (timeLeft === 0 && !showResult) {
            handleFinish()
        }
        return () => clearTimeout(timer)
    }, [isStarted, timeLeft, showResult])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const handleAnswer = (answerIndex: number) => {
        setSelectedAnswer(answerIndex)
        const newAnswers = [...answers]
        newAnswers[currentQuestion] = answerIndex
        setAnswers(newAnswers)
    }

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1)
            setSelectedAnswer(answers[currentQuestion + 1])
        }
    }

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1)
            setSelectedAnswer(answers[currentQuestion - 1])
        }
    }

    const handleFinish = () => {
        setShowResult(true)
    }

    const calculateScore = () => {
        let correct = 0
        answers.forEach((answer, index) => {
            if (answer === questions[index].correct) {
                correct++
            }
        })
        return correct
    }

    const getScoreMessage = (score: number) => {
        const percentage = (score / questions.length) * 100
        if (percentage >= 70) {
            return {
                title: "Parabéns! Você foi aprovado!",
                message: "Você demonstrou conhecimento suficiente para ser aprovado no exame teórico.",
                color: "text-green-600",
                bgColor: "bg-green-50",
                icon: CheckCircle
            }
        } else {
            return {
                title: "Você foi reprovado",
                message: "Continue estudando! Você precisa de pelo menos 70% de acertos para ser aprovado.",
                color: "text-red-600",
                bgColor: "bg-red-50",
                icon: XCircle
            }
        }
    }

    const restart = () => {
        setCurrentQuestion(0)
        setSelectedAnswer(null)
        setAnswers(new Array(questions.length).fill(null))
        setShowResult(false)
        setTimeLeft(1800)
        setIsStarted(false)
    }

    if (!isStarted) {
        return (
            <div className="pt-20 min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <div className="bg-white rounded-3xl shadow-2xl p-12">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 text-blue-600 rounded-full mb-8">
                                <BookOpen className="h-10 w-10" />
                            </div>

                            <h1 className="text-4xl font-bold text-gray-900 mb-6">
                                Simulado do Exame Teórico
                            </h1>

                            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                                Teste seus conhecimentos com nosso simulado oficial.
                                São 10 questões baseadas no exame real do DETRAN.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-blue-50 rounded-xl p-6">
                                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-lg mb-4">
                                        <Target className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">10 Questões</h3>
                                    <p className="text-gray-600 text-sm">Questões oficiais do DETRAN</p>
                                </div>

                                <div className="bg-orange-50 rounded-xl p-6">
                                    <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 text-orange-600 rounded-lg mb-4">
                                        <Clock className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">30 Minutos</h3>
                                    <p className="text-gray-600 text-sm">Tempo limite do exame</p>
                                </div>

                                <div className="bg-green-50 rounded-xl p-6">
                                    <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-lg mb-4">
                                        <Brain className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">70% Aprovação</h3>
                                    <p className="text-gray-600 text-sm">Nota mínima para passar</p>
                                </div>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
                                <h4 className="font-semibold text-yellow-800 mb-2">Instruções:</h4>
                                <ul className="text-yellow-700 text-sm space-y-1 text-left max-w-md mx-auto">
                                    <li>• Leia cada questão com atenção</li>
                                    <li>• Você pode navegar entre as questões</li>
                                    <li>• O tempo é limitado a 30 minutos</li>
                                    <li>• Precisa de 70% de acertos para ser aprovado</li>
                                </ul>
                            </div>

                            <button
                                onClick={() => setIsStarted(true)}
                                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
                            >
                                <span>Iniciar Simulado</span>
                                <ArrowRight className="h-5 w-5" />
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        )
    }

    if (showResult) {
        const score = calculateScore()
        const result = getScoreMessage(score)
        const percentage = Math.round((score / questions.length) * 100)

        return (
            <div className="pt-20 min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="bg-white rounded-3xl shadow-2xl p-12 text-center"
                    >
                        <div className={`inline-flex items-center justify-center w-20 h-20 ${result.bgColor} rounded-full mb-8`}>
                            <result.icon className={`h-10 w-10 ${result.color}`} />
                        </div>

                        <h1 className={`text-4xl font-bold mb-4 ${result.color}`}>
                            {result.title}
                        </h1>

                        <p className="text-xl text-gray-600 mb-8">
                            {result.message}
                        </p>

                        <div className="bg-gray-50 rounded-2xl p-8 mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-600 mb-2">{score}/{questions.length}</div>
                                    <div className="text-gray-600">Acertos</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-orange-600 mb-2">{percentage}%</div>
                                    <div className="text-gray-600">Aproveitamento</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-600 mb-2">{formatTime(1800 - timeLeft)}</div>
                                    <div className="text-gray-600">Tempo usado</div>
                                </div>
                            </div>
                        </div>

                        {/* Review Questions */}
                        <div className="text-left mb-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Revisão das Questões:</h3>
                            <div className="space-y-4 max-h-60 overflow-y-auto">
                                {questions.map((question, index) => {
                                    const userAnswer = answers[index]
                                    const isCorrect = userAnswer === question.correct

                                    return (
                                        <div key={index} className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                            <div className="flex items-start space-x-3">
                                                {isCorrect ? (
                                                    <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                                                ) : (
                                                    <XCircle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                                                )}
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900 mb-2">
                                                        {index + 1}. {question.question}
                                                    </p>
                                                    {userAnswer !== null && (
                                                        <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                                            Sua resposta: {question.options[userAnswer]}
                                                        </p>
                                                    )}
                                                    {!isCorrect && (
                                                        <p className="text-sm text-green-700">
                                                            Resposta correta: {question.options[question.correct]}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={restart}
                                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
                            >
                                <RotateCcw className="h-5 w-5" />
                                <span>Fazer Novamente</span>
                            </button>

                            <a
                                href="/contato"
                                className="bg-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
                            >
                                Matricular-se
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        )
    }

    return (
        <div className="pt-20 min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Simulado do Exame Teórico
                        </h1>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 text-orange-600">
                                <Clock className="h-5 w-5" />
                                <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Questão {currentQuestion + 1} de {questions.length}</span>
                            <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}% concluído</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Question Navigator */}
                    <div className="flex flex-wrap gap-2">
                        {questions.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setCurrentQuestion(index)
                                    setSelectedAnswer(answers[index])
                                }}
                                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${index === currentQuestion
                                        ? 'bg-blue-600 text-white'
                                        : answers[index] !== null
                                            ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Question */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestion}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-2xl shadow-lg p-8"
                    >
                        <div className="mb-6">
                            <div className="text-sm text-blue-600 font-medium mb-2">
                                {questions[currentQuestion].category}
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 leading-relaxed">
                                {questions[currentQuestion].question}
                            </h2>
                        </div>

                        <div className="space-y-3 mb-8">
                            {questions[currentQuestion].options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswer(index)}
                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${selectedAnswer === index
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedAnswer === index
                                                ? 'border-blue-500 bg-blue-500'
                                                : 'border-gray-300'
                                            }`}>
                                            {selectedAnswer === index && (
                                                <CheckCircle className="h-4 w-4 text-white" />
                                            )}
                                        </div>
                                        <span className="font-medium">{String.fromCharCode(65 + index)}</span>
                                        <span>{option}</span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Navigation */}
                        <div className="flex justify-between items-center">
                            <button
                                onClick={handlePrevious}
                                disabled={currentQuestion === 0}
                                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-colors ${currentQuestion === 0
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                <ArrowLeft className="h-4 w-4" />
                                <span>Anterior</span>
                            </button>

                            {currentQuestion === questions.length - 1 ? (
                                <button
                                    onClick={handleFinish}
                                    className="bg-green-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
                                >
                                    <Award className="h-4 w-4" />
                                    <span>Finalizar</span>
                                </button>
                            ) : (
                                <button
                                    onClick={handleNext}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
                                >
                                    <span>Próxima</span>
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}

export default Simulado
