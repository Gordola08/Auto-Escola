
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Cursos from './pages/Cursos'
import Sobre from './pages/Sobre'
import Contato from './pages/Contato'
import Simulado from './pages/Simulado'
import Dashboard from './pages/Dashboard'
import Agendamento from './pages/Agendamento'
import Financeiro from './pages/Financeiro'
import SimuladoAvancado from './components/SimuladoAvancado.tsx'

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-white">
                <Navbar />
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/cursos" element={<Cursos />} />
                        <Route path="/sobre" element={<Sobre />} />
                        <Route path="/contato" element={<Contato />} />
                        <Route path="/simulado" element={<Simulado />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/agendamento" element={<Agendamento />} />
                        <Route path="/financeiro" element={<Financeiro />} />
                        <Route path="/simulado-avancado" element={<SimuladoAvancado />} />
                    </Routes>
                </main>
                <Footer />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#1f2937',
                            color: '#fff',
                        },
                        success: {
                            style: {
                                background: '#10b981',
                            },
                        },
                        error: {
                            style: {
                                background: '#ef4444',
                            },
                        },
                    }}
                />
            </div>
        </Router>
    )
}

export default App
