import React, { useState } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { generatePdf } from '../services/api';
import { Toast } from '../lib/toast';

interface TipoCarta {
    id: number;
    nome: string;
    description: string;
}

interface LetterTypeProps {
    servicos: TipoCarta[];
    selectedLetterType: string;
    onLetterTypeSelect: (letterTypeId: string) => void;
    onNext: () => void;
    onPrev: () => void;
    cartaId: number;
    setPdfUrl: (url: string) => void;
}

const LetterType: React.FC<LetterTypeProps> = ({
    servicos,
    selectedLetterType,
    onLetterTypeSelect,
    onNext,
    onPrev,
    cartaId,
    setPdfUrl,
}) => {
    const [loading, setLoading] = useState(false);

    const handleNext = async () => {
        if (selectedLetterType) {
            setLoading(true);
            Toast.info('Carta está sendo gerada...');
            try {
                const response = await generatePdf(cartaId, selectedLetterType);
                setPdfUrl(response.pdfUrl);
                Toast.success('PDF gerado com sucesso!');
                onNext();
            } catch (error) {
                console.error('Erro ao gerar PDF:', error);
                Toast.error('Erro ao gerar PDF. Por favor, tente novamente.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-[#0d7ac9] to-[#0a6ab0] rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                    <span className="text-white font-bold text-xl">4</span>
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Selecionar Tipo de Serviço</h1>
                    <p className="text-gray-600 text-lg">
                        Selecione o tipo de serviço que deseja utilizar para a transferência de arquivos por VAN
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-9 mb-8">
                {servicos.map((servico) => (
                    <button
                        key={servico.id}
                        className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${selectedLetterType === servico.id.toString()
                                ? 'border-[#0d7ac9] bg-gradient-to-br from-[#0d7ac9] to-[#0a6ab0] text-white shadow-xl transform scale-105'
                                : 'border-gray-200 bg-white hover:border-[#0d7ac9] hover:shadow-md cursor-pointer'
                            } ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                        onClick={() => !loading && onLetterTypeSelect(servico.id.toString())}
                        disabled={loading}
                    >
                        <h3 className="font-bold text-xl mb-3">{servico.nome}</h3>
                        <p className="text-sm opacity-90 leading-relaxed">{servico.description}</p>
                    </button>
                ))}
            </div>

            <div className="flex justify-between">
                <button
                    className={`cursor-pointer px-8 py-4 border-2 border-[#0d7ac9] text-[#0d7ac9] rounded-xl font-semibold transition-all duration-300 ${loading
                            ? 'cursor-not-allowed opacity-50'
                            : 'hover:bg-[#0d7ac9] hover:text-white'
                        }`}
                    onClick={onPrev}
                    disabled={loading}
                >
                    Voltar
                </button>
                <button
                    className={`cursor-pointer px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center ${selectedLetterType && !loading
                            ? 'bg-gradient-to-r from-[#0d7ac9] to-[#0a6ab0] hover:from-[#0a6ab0] hover:to-[#0d7ac9] text-white shadow-lg hover:shadow-xl'
                            : 'bg-gray-300 text-gray-200 cursor-not-allowed'
                        }`}
                    onClick={handleNext}
                    disabled={!selectedLetterType || loading}
                >
                    {loading ? (
                        <span className="flex items-center">
                            <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path
                                    fill="currentColor"
                                    fillOpacity="0.75"
                                    d="M4 12a8 8 0 018-8V4a4 4 0 00-4 4h4"
                                />
                            </svg>
                            Gerando...
                        </span>
                    ) : (
                        <>
                            Finalizar <ChevronRightIcon className="w-5 h-5 ml-2" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default LetterType;