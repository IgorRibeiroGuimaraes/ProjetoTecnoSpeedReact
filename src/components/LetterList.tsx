import { useEffect, useState } from 'react';
import { 
    ChevronRightIcon, 
    EnvelopeIcon, 
    ExclamationCircleIcon, 
    DocumentTextIcon, 
    PlusIcon,
    ClockIcon,
    CheckCircleIcon,
    ArrowDownTrayIcon,
    BuildingOfficeIcon
} from '@heroicons/react/24/solid';
import { fetchCartas } from '../services/api';

interface Carta {
    id: string;
    tipoCnab: string;
    produto: string;
    status: 'aberta' | 'fechada';
    banco: string;
    pdfUrl: string;
}

const LetterList = () => {
    const [cartas, setCartas] = useState<Carta[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const cnpj = localStorage.getItem('cnpj');

    useEffect(() => {
        if (!cnpj) {
            setError('CNPJ não encontrado. Faça login novamente.');
            setLoading(false);
            return;
        }

        fetchCartas(cnpj)
            .then(setCartas)
            .catch(() => setError('Erro ao carregar as cartas.'))
            .finally(() => setLoading(false));

    }, [cnpj]);

    useEffect(() => {
        if (!loading && !error) {
            console.log('Cartas carregadas:', cartas);
        }
    }, [loading, error, cartas]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'aberta':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'fechada':
                return 'bg-red-50 text-red-700 border-red-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const downloadPdf = (pdfUrl: string, fileName: string) => {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const LoadingState = () => (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="relative">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-lg font-medium text-gray-700">Carregando suas cartas</p>
            <p className="mt-2 text-sm text-gray-500">Aguarde enquanto buscamos seus dados</p>
        </div>
    );

    const ErrorState = () => (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <ExclamationCircleIcon className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Ops! Algo deu errado</h3>
            <p className="text-gray-600 text-center mb-6 max-w-md">{error}</p>
            <button 
                onClick={() => window.location.reload()}
                className="px-6 py-3 cursor-pointer bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
                Tentar novamente
            </button>
        </div>
    );

    const EmptyState = () => (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <DocumentTextIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">Nenhuma carta encontrada</h3>
            <p className="text-gray-600 text-center mb-8 max-w-md">
                Você ainda não possui nenhuma carta de crédito. Que tal criar sua primeira?
            </p>
            <button className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
                <PlusIcon className="w-5 h-5" />
                Nova Carta
            </button>
        </div>
    );

    const CartaCard = ({ carta }: { carta: Carta }) => (
        <div className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {carta.produto}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">Tipo CNAB: {carta.tipoCnab}</p>
                    <p className="text-sm text-gray-500">{carta.banco}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(carta.status)} uppercase`}>
                    {carta.status}
                </span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-2">
                    <BuildingOfficeIcon className="w-4 h-4" />
                    <span>{carta.banco}</span>
                </div>
                <div className="flex items-center gap-2">
                    <DocumentTextIcon className="w-4 h-4" />
                    <span>{carta.tipoCnab}</span>
                </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <button 
                    onClick={() => downloadPdf(carta.pdfUrl, `${carta.produto}-${carta.banco}.pdf`)}
                    className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium transition-colors"
                >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    Baixar PDF
                </button>
                <button className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium transition-colors">
                    Enviar Novamente
                    <ChevronRightIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Minhas Cartas</h1>
                            <p className="mt-2 text-lg text-gray-600">
                                Gerencie e acompanhe suas cartas de crédito
                            </p>
                        </div>
                        {!loading && !error && cartas.length > 0 && (
                            <a href="/" className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
                                <PlusIcon className="w-5 h-5" />
                                Nova Carta
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading && <LoadingState />}
                {error && <ErrorState />}
                {!loading && !error && cartas.length === 0 && <EmptyState />}
                
                {!loading && !error && cartas.length > 0 && (
                    <>
                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-xl border border-gray-200">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                        <EnvelopeIcon className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-2xl font-bold text-gray-900">{cartas.length}</p>
                                        <p className="text-sm text-gray-600">Total de Cartas</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-gray-200">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                                        <CheckCircleIcon className="w-6 h-6 text-green-500" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-2xl font-bold text-gray-900">
                                            {cartas.filter(c => c.status === 'aberta').length}
                                        </p>
                                        <p className="text-sm text-gray-600">Abertas</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-gray-200">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                                        <ClockIcon className="w-6 h-6 text-red-500" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-2xl font-bold text-gray-900">
                                            {cartas.filter(c => c.status === 'fechada').length}
                                        </p>
                                        <p className="text-sm text-gray-600">Fechadas</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Lista de Cartas */}
                        <div className="grid gap-6">
                            {cartas.map((carta) => (
                                <CartaCard key={carta.id} carta={carta} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default LetterList;