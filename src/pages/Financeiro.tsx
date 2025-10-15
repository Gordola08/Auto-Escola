
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { lumi } from '../lib/lumi'
import { CreditCard, DollarSign, Calendar, Download, CheckCircle, XCircle, Clock, AlertTriangle, Receipt, TrendingUp, PieChart } from 'lucide-react'
import toast from 'react-hot-toast'

interface Payment {
    _id: string
    student_id: string
    amount: number
    method: string
    status: string
    description: string
    category: string
    installments: number
    installmentNumber: number
    dueDate: string
    paidAt?: string
    receipt?: string
    createdAt: string
}

interface Student {
    _id: string
    name: string
}

const Financeiro = () => {
    const { user, isAuthenticated, signIn } = useAuth()
    const [student, setStudent] = useState<Student | null>(null)
    const [payments, setPayments] = useState<Payment[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<string>('all')
    const [sortBy, setSortBy] = useState<string>('date')

    const fetchFinancialData = async () => {
        if (!user) return

        try {
            setLoading(true)

            // Buscar dados do aluno
            const { list: students } = await lumi.entities.students.list({
                filter: { user_id: user.userId }
            })

            if (students && students.length > 0) {
                setStudent(students[0])

                // Buscar histórico de pagamentos
                const { list: paymentList } = await lumi.entities.payments.list({
                    filter: { student_id: students[0]._id },
                    sort: { createdAt: -1 }
                })
                setPayments(paymentList || [])
            }
        } catch (error) {
            console.error('Erro ao carregar dados financeiros:', error)
            toast.error('Erro ao carregar dados financeiros')
        } finally {
            setLoading(false)
        }
    }

    const handlePayment = async (paymentId: string, method: string) => {
        try {
            // Simular processamento de pagamento
            await lumi.entities.payments.update(paymentId, {
                status: 'processando',
                updatedAt: new Date().toISOString()
            })

            toast.success('Pagamento sendo processado...')

            // Simular aprovação após 2 segundos
            setTimeout(async () => {
                try {
                    await lumi.entities.payments.update(paymentId, {
                        status: 'aprovado',
                        paidAt: new Date().toISOString(),
                        method: method,
                        updatedAt: new Date().toISOString()
                    })

                    toast.success('Pagamento aprovado!')
                    fetchFinancialData()
                } catch (error) {
                    console.error('Erro ao atualizar pagamento:', error)
                    toast.error('Erro ao processar pagamento')
                }
            }, 2000)

        } catch (error) {
            console.error('Erro ao processar pagamento:', error)
            toast.error('Erro ao processar pagamento')
        }
    }

    const generateReceipt = async (paymentId: string) => {
        try {
            // Simular geração de comprovante
            const receiptUrl = `https://autoescola.com/receipts/${paymentId}.pdf`

            await lumi.entities.payments.update(paymentId, {
                receipt: receiptUrl,
                updatedAt: new Date().toISOString()
            })

            toast.success('Comprovante gerado!')
            fetchFinancialData()
        } catch (error) {
            console.error('Erro ao gerar comprovante:', error)
            toast.error('Erro ao gerar comprovante')
        }
    }

    useEffect(() => {
        if (isAuthenticated && user) {
            fetchFinancialData()
        }
    }, [isAuthenticated, user])

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center pt-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md"
                >
                    <CreditCard className="h-16 w-16 text-blue-600 mx-auto mb-6" />
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Área Financeira
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Faça login para acessar suas informações financeiras
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
                    <AlertTriangle className="h-16 w-16 text-orange-500 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Matrícula Necessária
                    </h2>
                    <p className="text-gray-600 mb-8">
                        Você precisa estar matriculado para acessar informações financeiras
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

    const filteredPayments = payments.filter(payment => {
        if (filter === 'all') return true
        return payment.status === filter
    })

    const sortedPayments = filteredPayments.sort((a, b) => {
        if (sortBy === 'date') {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        }
        if (sortBy === 'amount') {
            return b.amount - a.amount
        }
        return 0
    })

    const totalPaid = payments
        .filter(p => p.status === 'aprovado')
        .reduce((sum, p) => sum + p.amount, 0)

    const totalPending = payments
        .filter(p => p.status === 'pendente')
        .reduce((sum, p) => sum + p.amount, 0)

    const totalOverdue = payments
        .filter(p => p.status === 'pendente' && new Date(p.dueDate) < new Date())
        .reduce((sum, p) => sum + p.amount, 0)

    const statusLabels: Record<string, { label: string; color: string; icon: any }> = {
        'pendente': { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
        'processando': { label: 'Processando', color: 'bg-blue-100 text-blue-800', icon: Clock },
        'aprovado': { label: 'Aprovado', color: 'bg-green-100 text-green-800', icon: CheckCircle },
        'recusado': { label: 'Recusado', color: 'bg-red-100 text-red-800', icon: XCircle },
        'estornado': { label: 'Estornado', color: 'bg-gray-100 text-gray-800', icon: XCircle },
        'cancelado': { label: 'Cancelado', color: 'bg-gray-100 text-gray-800', icon: XCircle }
    }

    const methodLabels: Record<string, string> = {
        'cartao_credito': 'Cartão de Crédito',
        'cartao_debito': 'Cartão de Débito',
        'pix': 'PIX',
        'boleto': 'Boleto',
        'dinheiro': 'Dinheiro',
        'transferencia': 'Transferência'
    }

    const categoryLabels: Record<string, string> = {
        'matricula': 'Matrícula',
        'mensalidade': 'Mensalidade',
        'aula_extra': 'Aula Extra',
        'exame': 'Exame',
        'material': 'Material',
        'multa': 'Multa'
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Área Financeira
                    </h1>
                    <p className="text-xl text-gray-600">
                        Gerencie seus pagamentos e acompanhe seu histórico financeiro
                    </p>
                </motion.div>

                {/* Resumo Financeiro */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
                >
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Pago</p>
                                <p className="text-2xl font-bold text-green-600">
                                    R$ {totalPaid.toFixed(2)}
                                </p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Pendente</p>
                                <p className="text-2xl font-bold text-yellow-600">
                                    R$ {totalPending.toFixed(2)}
                                </p>
                            </div>
                            <Clock className="h-8 w-8 text-yellow-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Em Atraso</p>
                                <p className="text-2xl font-bold text-red-600">
                                    R$ {totalOverdue.toFixed(2)}
                                </p>
                            </div>
                            <AlertTriangle className="h-8 w-8 text-red-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total de Transações</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {payments.length}
                                </p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-blue-500" />
                        </div>
                    </div>
                </motion.div>

                {/* Filtros e Ordenação */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-lg p-6 mb-8"
                >
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Filtrar por Status
                            </label>
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">Todos</option>
                                <option value="pendente">Pendente</option>
                                <option value="aprovado">Aprovado</option>
                                <option value="processando">Processando</option>
                                <option value="recusado">Recusado</option>
                            </select>
                        </div>

                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ordenar por
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="date">Data</option>
                                <option value="amount">Valor</option>
                            </select>
                        </div>
                    </div>
                </motion.div>

                {/* Lista de Pagamentos */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                            <Receipt className="h-6 w-6 text-blue-600 mr-3" />
                            Histórico de Pagamentos
                        </h2>
                    </div>

                    {sortedPayments.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Descrição
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Valor
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Vencimento
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {sortedPayments.map((payment) => {
                                        const StatusIcon = statusLabels[payment.status]?.icon || Clock
                                        const isOverdue = payment.status === 'pendente' && new Date(payment.dueDate) < new Date()

                                        return (
                                            <tr key={payment._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {payment.description}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {categoryLabels[payment.category]}
                                                            {payment.installments > 1 && (
                                                                <span className="ml-2">
                                                                    ({payment.installmentNumber}/{payment.installments})
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        R$ {payment.amount.toFixed(2)}
                                                    </div>
                                                    {payment.method && (
                                                        <div className="text-sm text-gray-500">
                                                            {methodLabels[payment.method]}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isOverdue ? 'bg-red-100 text-red-800' : statusLabels[payment.status]?.color
                                                        }`}>
                                                        <StatusIcon className="h-3 w-3 mr-1" />
                                                        {isOverdue ? 'Vencido' : statusLabels[payment.status]?.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(payment.dueDate).toLocaleDateString('pt-BR')}
                                                    {payment.paidAt && (
                                                        <div className="text-xs text-green-600">
                                                            Pago em {new Date(payment.paidAt).toLocaleDateString('pt-BR')}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                    {payment.status === 'pendente' && (
                                                        <div className="space-x-2">
                                                            <button
                                                                onClick={() => handlePayment(payment._id, 'pix')}
                                                                className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors"
                                                            >
                                                                Pagar PIX
                                                            </button>
                                                            <button
                                                                onClick={() => handlePayment(payment._id, 'cartao_credito')}
                                                                className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors"
                                                            >
                                                                Cartão
                                                            </button>
                                                        </div>
                                                    )}

                                                    {payment.status === 'aprovado' && !payment.receipt && (
                                                        <button
                                                            onClick={() => generateReceipt(payment._id)}
                                                            className="bg-gray-600 text-white px-3 py-1 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-1"
                                                        >
                                                            <Download className="h-3 w-3" />
                                                            <span>Comprovante</span>
                                                        </button>
                                                    )}

                                                    {payment.receipt && (
                                                        <a
                                                            href={payment.receipt}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-1"
                                                        >
                                                            <Download className="h-3 w-3" />
                                                            <span>Download</span>
                                                        </a>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">Nenhum pagamento encontrado</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}

export default Financeiro
