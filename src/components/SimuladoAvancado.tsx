
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { lumi } from '../lib/lumi'
import {BookOpen, Clock, Target, Trophy, BarChart3, Star, CheckCircle, XCircle, RotateCcw, Play, Pause, ArrowRight, ArrowLeft, Award, TrendingUp} from 'lucide-react'
import toast from 'react-hot-toast'

interface Question {
  _id: string
  question: string
  options: string[]
  correct: number
  explanation: string
  category: string
  subcategory: string
  difficulty: string
  license: string[]
  image?: string
  statistics: {
    totalAnswers: number
    correctAnswers: number
    successRate: number
  }
}

interface ExamResult {
  _id: string
  student_id: string
  type: string
  category: string
  score: number
  totalQuestions: number
  correctAnswers: number
  status: string
  startTime: string
  endTime: string
  duration: number
}

const SimuladoAvancado = () => {
  const { user, isAuthenticated, signIn } = useAuth()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([])
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(1800) // 30 minutos
  const [isStarted, setIsStarted] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [selectedLicense, setSelectedLicense] = useState<string>('B')
  const [examResults, setExamResults] = useState<ExamResult[]>([])
  const [loading, setLoading] = useState(true)
  const [student, setStudent] = useState<any>(null)

  const categories = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'legislacao', label: 'Legislação' },
    { value: 'sinalizacao', label: 'Sinalização' },
    { value: 'direcao_defensiva', label: 'Direção Defensiva' },
    { value: 'primeiros_socorros', label: 'Primeiros Socorros' },
    { value: 'meio_ambiente', label: 'Meio Ambiente' },
    { value: 'mecanica', label: 'Mecânica' }
  ]

  const difficulties = [
    { value: 'all', label: 'Todas as Dificuldades' },
    { value: 'facil', label: 'Fácil' },
    { value: 'medio', label: 'Médio' },
    { value: 'dificil', label: 'Difícil' }
  ]

  const licenses = [
    { value: 'A', label: 'Categoria A' },
    { value: 'B', label: 'Categoria B' },
    { value: 'AB', label: 'Categoria A+B' },
    { value: 'C', label: 'Categoria C' },
    { value: 'D', label: 'Categoria D' },
    { value: 'E', label: 'Categoria E' }
  ]

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      
      // Construir filtros
      const filter: any = {
        active: true,
        license: { $in: [selectedLicense] }
      }
      
      if (selectedCategory !== 'all') {
        filter.category = selectedCategory
      }
      
      if (selectedDifficulty !== 'all') {
        filter.difficulty = selectedDifficulty
      }

      const { list } = await lumi.entities.questions.list({
        filter,
        limit: 30,
        sort: { _id: 1 }
      })

      if (list && list.length >= 10) {
        // Embaralhar questões e pegar apenas 30
        const shuffled = list.sort(() => 0.5 - Math.random()).slice(0, 30)
        setQuestions(shuffled)
        setSelectedAnswers(new Array(shuffled.length).fill(null))
      } else {
        toast.error('Não há questões suficientes para este filtro')
      }
    } catch (error) {
      console.error('Erro ao carregar questões:', error)
      toast.error('Erro ao carregar questões')
    } finally {
      setLoading(false)
    }
  }

  const fetchStudentData = async () => {
    if (!user) return

    try {
      const { list: students } = await lumi.entities.students.list({
        filter: { user_id: user.userId }
      })
      
      if (students && students.length > 0) {
        setStudent(students[0])
        
        // Buscar histórico de exames
        const { list: results } = await lumi.entities.exams.list({
          filter: { 
            student_id: students[0]._id,
            type: 'simulado'
          },
          sort: { createdAt: -1 },
          limit: 10
        })
        setExamResults(results || [])
      }
    } catch (error) {
      console.error('Erro ao carregar dados do aluno:', error)
    }
  }

  const startExam = () => {
    if (questions.length === 0) {
      toast.error('Carregue as questões primeiro')
      return
    }
    
    setIsStarted(true)
    setCurrentQuestion(0)
    setSelectedAnswers(new Array(questions.length).fill(null))
    setShowResult(false)
    setTimeLeft(1800)
    setIsPaused(false)
  }

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const finishExam = async () => {
    if (!student) return

    const correctAnswers = selectedAnswers.reduce((count, answer, index) => {
      return answer === questions[index]?.correct ? count + 1 : count
    }, 0)

    const score = Math.round((correctAnswers / questions.length) * 100)
    const status = score >= 70 ? 'aprovado' : 'reprovado'
    const endTime = new Date()
    const startTime = new Date(endTime.getTime() - (1800 - timeLeft) * 1000)

    try {
      const examData = {
        student_id: student._id,
        type: 'simulado',
        category: selectedLicense,
        questions: questions.map(q => q._id),
        answers: selectedAnswers,
        score,
        totalQuestions: questions.length,
        correctAnswers,
        status,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        duration: Math.round((1800 - timeLeft) / 60),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      await lumi.entities.exams.create(examData)

      // Atualizar estatísticas das questões
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i]
        const isCorrect = selectedAnswers[i] === question.correct
        
        const newTotalAnswers = question.statistics.totalAnswers + 1
        const newCorrectAnswers = question.statistics.correctAnswers + (isCorrect ? 1 : 0)
        const newSuccessRate = (newCorrectAnswers / newTotalAnswers) * 100

        await lumi.entities.questions.update(question._id, {
          'statistics.totalAnswers': newTotalAnswers,
          'statistics.correctAnswers': newCorrectAnswers,
          'statistics.successRate': newSuccessRate,
          updatedAt: new Date().toISOString()
        })
      }

      // Atualizar pontos do aluno (gamificação)
      const pointsEarned = Math.max(0, score - 50) // Pontos baseados na performance
      if (pointsEarned > 0) {
        await lumi.entities.students.update(student._id, {
          points: (student.points || 0) + pointsEarned,
          updatedAt: new Date().toISOString()
        })
      }

      setShowResult(true)
      fetchStudentData()

    } catch (error) {
      console.error('Erro ao salvar resultado:', error)
      toast.error('Erro ao salvar resultado do exame')
    }
  }

  const resetExam = () => {
    setIsStarted(false)
    setCurrentQuestion(0)
    setSelectedAnswers([])
    setShowResult(false)
    setTimeLeft(1800)
    setIsPaused(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchStudentData()
    }
  }, [isAuthenticated, user])

  useEffect(() => {
    fetchQuestions()
  }, [selectedCategory, selectedDifficulty, selectedLicense])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isStarted && !isPaused && !showResult && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    } else if (timeLeft === 0 && !showResult) {
      finishExam()
    }
    return () => clearTimeout(timer)
  }, [isStarted, isPaused, showResult, timeLeft])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md"
        >
          <BookOpen className="h-16 w-16 text-blue-600 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Simulado Avançado
          </h1>
          <p className="text-gray-600 mb-8">
            Faça login para acessar o simulado completo
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

  if (showResult) {
    const correctAnswers = selectedAnswers.reduce((count, answer, index) => {
      return answer === questions[index]?.correct ? count + 1 : count
    }, 0)
    const score = Math.round((correctAnswers / questions.length) * 100)
    const passed = score >= 70

    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-12 text-center"
          >
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-8 ${
              passed ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {passed ? (
                <CheckCircle className="h-10 w-10 text-green-600" />
              ) : (
                <XCircle className="h-10 w-10 text-red-600" />
              )}
            </div>

            <h1 className={`text-4xl font-bold mb-4 ${passed ? 'text-green-600' : 'text-red-600'}`}>
              {passed ? 'Parabéns! Você foi aprovado!' : 'Você foi reprovado'}
            </h1>

            <p className="text-xl text-gray-600 mb-8">
              {passed 
                ? 'Você demonstrou conhecimento suficiente para ser aprovado!'
                : 'Continue estudando! Você precisa de pelo menos 70% de acertos.'
              }
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {correctAnswers}/{questions.length}
                </div>
                <div className="text-gray-600">Acertos</div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {score}%
                </div>
                <div className="text-gray-600">Aproveitamento</div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {formatTime(1800 - timeLeft)}
                </div>
                <div className="text-gray-600">Tempo Usado</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={resetExam}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <RotateCcw className="h-5 w-5" />
                <span>Fazer Novamente</span>
              </button>
              
              <a
                href="/dashboard"
                className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
              >
                Voltar ao Dashboard
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (isStarted) {
    const currentQ = questions[currentQuestion]
    const progress = ((currentQuestion + 1) / questions.length) * 100

    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header do Exame */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Simulado Avançado - {selectedLicense}
              </h1>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                >
                  {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                  <span>{isPaused ? 'Continuar' : 'Pausar'}</span>
                </button>
                <div className="flex items-center space-x-2 text-orange-600">
                  <Clock className="h-5 w-5" />
                  <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
                </div>
              </div>
            </div>
            
            {/* Barra de Progresso */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Questão {currentQuestion + 1} de {questions.length}</span>
                <span>{Math.round(progress)}% concluído</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Navegador de Questões */}
            <div className="flex flex-wrap gap-2">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    index === currentQuestion
                      ? 'bg-blue-600 text-white'
                      : selectedAnswers[index] !== null
                      ? 'bg-green-100 text-green-600 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Questão */}
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
                <div className="flex items-center space-x-2 mb-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    {currentQ?.category}
                  </span>
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                    {currentQ?.difficulty}
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                    {currentQ?.statistics.successRate.toFixed(1)}% acerto
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 leading-relaxed">
                  {currentQ?.question}
                </h2>
                {currentQ?.image && (
                  <img
                    src={currentQ.image}
                    alt="Imagem da questão"
                    className="mt-4 max-w-md mx-auto rounded-lg shadow-md"
                  />
                )}
              </div>

              <div className="space-y-3 mb-8">
                {currentQ?.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedAnswers[currentQuestion] === index
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswers[currentQuestion] === index
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedAnswers[currentQuestion] === index && (
                          <CheckCircle className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <span className="font-medium">{String.fromCharCode(65 + index)}</span>
                      <span>{option}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Navegação */}
              <div className="flex justify-between items-center">
                <button
                  onClick={previousQuestion}
                  disabled={currentQuestion === 0}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-colors ${
                    currentQuestion === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Anterior</span>
                </button>

                {currentQuestion === questions.length - 1 ? (
                  <button
                    onClick={finishExam}
                    className="bg-green-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Award className="h-4 w-4" />
                    <span>Finalizar</span>
                  </button>
                ) : (
                  <button
                    onClick={nextQuestion}
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

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simulado Avançado
          </h1>
          <p className="text-xl text-gray-600">
            Sistema completo de simulados com banco extenso de questões e estatísticas detalhadas
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configurações do Simulado */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl shadow-xl p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Target className="h-6 w-6 text-blue-600 mr-3" />
                Configurar Simulado
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria
                  </label>
                  <select
                    value={selectedLicense}
                    onChange={(e) => setSelectedLicense(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {licenses.map((license) => (
                      <option key={license.value} value={license.value}>
                        {license.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Matéria
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dificuldade
                  </label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {difficulties.map((difficulty) => (
                      <option key={difficulty.value} value={difficulty.value}>
                        {difficulty.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-blue-50 rounded-2xl p-6 mb-6">
                <h3 className="font-semibold text-blue-900 mb-3">Informações do Simulado:</h3>
                <ul className="space-y-2 text-blue-800">
                  <li>• {questions.length} questões disponíveis</li>
                  <li>• Tempo limite: 30 minutos</li>
                  <li>• Nota mínima para aprovação: 70%</li>
                  <li>• Questões com explicações detalhadas</li>
                  <li>• Estatísticas de desempenho</li>
                </ul>
              </div>

              <button
                onClick={startExam}
                disabled={questions.length === 0}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                <Play className="h-5 w-5" />
                <span>Iniciar Simulado</span>
              </button>
            </motion.div>

            {/* Histórico de Resultados */}
            {examResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-3xl shadow-xl p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <BarChart3 className="h-6 w-6 text-green-600 mr-3" />
                  Histórico de Resultados
                </h2>

                <div className="space-y-4">
                  {examResults.slice(0, 5).map((result) => (
                    <div key={result._id} className="border rounded-xl p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              result.status === 'aprovado' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {result.status === 'aprovado' ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              ) : (
                                <XCircle className="h-3 w-3 mr-1" />
                              )}
                              {result.status === 'aprovado' ? 'Aprovado' : 'Reprovado'}
                            </span>
                            <span className="text-sm text-gray-600">
                              Categoria {result.category}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {new Date(result.endTime).toLocaleDateString('pt-BR')} - 
                            {result.duration} minutos
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">
                            {result.score}%
                          </div>
                          <div className="text-sm text-gray-600">
                            {result.correctAnswers}/{result.totalQuestions} acertos
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar com Estatísticas */}
          <div className="space-y-8">
            {/* Estatísticas Gerais */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl shadow-xl p-8"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <TrendingUp className="h-5 w-5 text-purple-600 mr-2" />
                Suas Estatísticas
              </h3>
              
              {examResults.length > 0 ? (
                <div className="space-y-4">
                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="text-2xl font-bold text-green-600">
                      {examResults.filter(r => r.status === 'aprovado').length}
                    </div>
                    <div className="text-green-700 text-sm">Aprovações</div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round(examResults.reduce((sum, r) => sum + r.score, 0) / examResults.length)}%
                    </div>
                    <div className="text-blue-700 text-sm">Média Geral</div>
                  </div>
                  
                  <div className="bg-orange-50 rounded-xl p-4">
                    <div className="text-2xl font-bold text-orange-600">
                      {Math.max(...examResults.map(r => r.score))}%
                    </div>
                    <div className="text-orange-700 text-sm">Melhor Resultado</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Trophy className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Faça seu primeiro simulado</p>
                </div>
              )}
            </motion.div>

            {/* Ranking */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl shadow-xl p-8"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Trophy className="h-5 w-5 text-yellow-600 mr-2" />
                Ranking Geral
              </h3>
              
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((position) => (
                  <div key={position} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      position === 1 ? 'bg-yellow-500' :
                      position === 2 ? 'bg-gray-400' :
                      position === 3 ? 'bg-orange-500' : 'bg-blue-500'
                    }`}>
                      {position}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {position === 1 && student ? student.name : `Aluno ${position}`}
                      </div>
                      <div className="text-sm text-gray-600">
                        {95 - position * 2}% média
                      </div>
                    </div>
                    {position <= 3 && (
                      <Star className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Dicas */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8"
            >
              <h3 className="text-xl font-bold text-blue-900 mb-4">
                Dicas para o Sucesso
              </h3>
              
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Leia cada questão com atenção</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Gerencie bem o tempo disponível</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Revise as questões em dúvida</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Pratique regularmente</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimuladoAvancado
