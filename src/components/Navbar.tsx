import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/api';
import { Toast } from '../lib/toast';

import {
    UserIcon,
    ArrowRightOnRectangleIcon,
    EnvelopeIcon,
    ChevronDownIcon
} from '@heroicons/react/24/solid';

const Navbar = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        try {
            logout();
            console.log('Usuário deslogado com sucesso');
        } catch (error) {
            console.error('Erro ao deslogar:', error);
            Toast.error('Erro ao deslogar. Tente novamente.');
        } finally {
            navigate('/login');
        }

    };

    const handleAccessCards = () => {
        // Aqui você pode adicionar a lógica para acessar as cartas
        console.log('Acessando cartas enviadas');
        // Exemplo: navigate('/cartas');
    };

    return (
        <header className="bg-[#0d58c9] text-white p-4 shadow-md">
            <div className="flex justify-between items-center">
                {/* Logo com efeito hover sutil */}
                <img
                    src="/assets/images/Logo.png"
                    alt="Logo"
                    className="h-12 hover:scale-105 transition-transform duration-200"
                />

                {/* Menu do usuário */}
                <div className="relative">
                    <button
                        onClick={toggleMenu}
                        className="cursor-pointer flex items-center space-x-2 hover:bg-blue-700 rounded-xl px-4 py-2 transition-all duration-200"
                    >
                        <div className="bg-blue-800 rounded-full p-2">
                            <UserIcon className="w-5 h-5 text-white" />
                        </div>
                        <ChevronDownIcon
                            className={`w-4 h-4 transform transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''
                                }`}
                        />
                    </button>

                    {/* Dropdown Menu */}
                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                            <div className="py-1">
                                <button
                                    onClick={handleAccessCards}
                                    className="cursor-pointer flex items-center space-x-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                                >
                                    <EnvelopeIcon className="w-4 h-4 text-gray-500" />
                                    <span>Cartas Enviadas</span>
                                </button>

                                <hr className="border-gray-200 my-1" />

                                <button
                                    onClick={handleLogout}
                                    className="cursor-pointer flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                                >
                                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                                    <span>Sair</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Overlay invisível para fechar o menu quando clicar fora */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}
        </header>
    );
};

export default Navbar;