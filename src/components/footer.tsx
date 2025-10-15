
import React from 'react'
import { Link } from 'react-router-dom'
import { Car, Phone, Mail, MapPin, Clock, Facebook, Instagram, Youtube } from 'lucide-react'

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Logo e Descrição */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Car className="h-8 w-8 text-blue-500" />
                            <span className="text-xl font-bold">AutoEscola Drive</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Há mais de 15 anos formando condutores responsáveis e seguros.
                            Sua carteira de motorista com qualidade e confiança.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                                <Youtube className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Links Rápidos */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                                    Início
                                </Link>
                            </li>
                            <li>
                                <Link to="/cursos" className="text-gray-400 hover:text-white transition-colors">
                                    Nossos Cursos
                                </Link>
                            </li>
                            <li>
                                <Link to="/sobre" className="text-gray-400 hover:text-white transition-colors">
                                    Sobre Nós
                                </Link>
                            </li>
                            <li>
                                <Link to="/simulado" className="text-gray-400 hover:text-white transition-colors">
                                    Simulado Online
                                </Link>
                            </li>
                            <li>
                                <Link to="/contato" className="text-gray-400 hover:text-white transition-colors">
                                    Contato
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contato */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contato</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center space-x-3">
                                <Phone className="h-4 w-4 text-blue-500" />
                                <span className="text-gray-400">(11) 99999-9999</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail className="h-4 w-4 text-blue-500" />
                                <span className="text-gray-400">contato@autoescoladrive.com.br</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <MapPin className="h-4 w-4 text-blue-500 mt-1" />
                                <span className="text-gray-400">
                                    Rua das Flores, 123<br />
                                    Centro - São Paulo, SP<br />
                                    CEP: 01234-567
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Horário de Funcionamento */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Funcionamento</h3>
                        <ul className="space-y-2">
                            <li className="flex items-center space-x-3">
                                <Clock className="h-4 w-4 text-blue-500" />
                                <div className="text-gray-400">
                                    <div className="font-medium">Segunda à Sexta</div>
                                    <div className="text-sm">08:00 às 18:00</div>
                                </div>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Clock className="h-4 w-4 text-blue-500" />
                                <div className="text-gray-400">
                                    <div className="font-medium">Sábados</div>
                                    <div className="text-sm">08:00 às 12:00</div>
                                </div>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Clock className="h-4 w-4 text-blue-500" />
                                <div className="text-gray-400">
                                    <div className="font-medium">Domingos</div>
                                    <div className="text-sm">Fechado</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Linha divisória e copyright */}
                <div className="border-t border-gray-800 mt-8 pt-8 text-center">
                    <p className="text-gray-400 text-sm">
                        © 2024 AutoEscola Drive. Todos os direitos reservados. |
                        <span className="ml-1">CNPJ: 12.345.678/0001-90</span>
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
