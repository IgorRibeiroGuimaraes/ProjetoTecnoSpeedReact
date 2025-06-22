import React, { useState } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { Toast } from '../lib/toast';

interface PdfViewProps {
    onLetterTypeSelect: (letterTypeId: string) => void;
    onNext: () => void;
    onPrev: () => void;
    pdfUrl: string;
}

const PdfView: React.FC<PdfViewProps> = ({
    onNext,
    onPrev,
    pdfUrl,
}) => {
    const [pdfError, setPdfError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const handlePdfError = () => {
        setPdfError(true);
        setLoading(false);
        Toast.error('Erro ao carregar o PDF. Tentando abrir em nova aba...');
    };

    const handlePdfLoad = () => {
        setPdfError(false);
        setLoading(false);
    };

    const handleFinalize = () => {
        setShowModal(true);
    };

    const handleConfirmFinalize = () => {
        setShowModal(false);
        onNext();
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <>
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="flex items-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#0d7ac9] to-[#0a6ab0] rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                        <span className="text-white font-bold text-xl">4</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Visualizar Documento</h1>
                        <p className="text-gray-600 text-lg">
                            Visualize o documento antes de finalizar a transferência por VAN
                        </p>
                    </div>
                </div>

                {/* Área de visualização do PDF */}
                <div className="mb-8">
                    <div className="bg-gray-50 rounded-xl p-4 border-2 border-dashed border-gray-300">
                        {pdfUrl ? (
                            <div className="relative">
                                {/* Visualizador do PDF */}
                                <div className="relative bg-white rounded-lg border overflow-hidden">
                                    {loading && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                                            <div className="flex items-center">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0d7ac9]"></div>
                                                <span className="ml-2 text-gray-600">Carregando documento...</span>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {pdfError ? (
                                        <div className="flex flex-col items-center justify-center h-96 text-gray-500 bg-gray-50">
                                            <div className="text-center">
                                                <svg className="w-16 h-16 mb-4 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <p className="text-lg font-medium mb-2">Visualização não disponível</p>
                                                <p className="text-sm mb-4 text-gray-600">
                                                    O seu navegador pode não suportar a visualização inline de PDFs.
                                                </p>
                                                <div className="space-y-2">
                                                    <a 
                                                        href={pdfUrl} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="inline-block px-4 py-2 bg-[#0d7ac9] text-white rounded-lg hover:bg-[#0a6ab0] transition-colors"
                                                    >
                                                        Abrir em nova aba
                                                    </a>
                                                    <br />
                                                    <a 
                                                        href={pdfUrl} 
                                                        download
                                                        className="inline-block px-4 py-2 border border-[#0d7ac9] text-[#0d7ac9] rounded-lg hover:bg-[#0d7ac9] hover:text-white transition-colors"
                                                    >
                                                        Baixar documento
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <iframe
                                            src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1&page=1&view=FitH`} 
                                            className="w-full h-96 border-0"
                                            title="Visualização do PDF"
                                            onError={handlePdfError}
                                            onLoad={handlePdfLoad}
                                            style={{ minHeight: '1400px' }}
                                        />
                                    )}
                                </div>

                                {/* Dicas de uso */}
                                {!pdfError && (
                                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <div className="flex items-start">
                                            <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <div className="text-sm text-blue-800">
                                                <p className="font-medium mb-1">Dicas para visualização:</p>
                                                <ul className="text-xs space-y-1 list-disc list-inside ml-2">
                                                    <li>Use os controles do PDF para navegar e dar zoom</li>
                                                    <li>Clique em "Abrir em nova aba" para visualização em tela cheia</li>
                                                    <li>Você pode baixar o documento para visualização offline</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-lg font-medium">Nenhum documento disponível</p>
                                <p className="text-sm">O PDF será exibido aqui quando fornecido</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-between">
                    <button
                        className="cursor-pointer px-8 py-4 border-2 border-[#0d7ac9] text-[#0d7ac9] rounded-xl font-semibold hover:bg-[#0d7ac9] hover:text-white transition-all duration-300"
                        onClick={onPrev}
                    >
                        Voltar
                    </button>
                    <button
                        className="cursor-pointer px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center bg-gradient-to-r from-[#0d7ac9] to-[#0a6ab0] hover:from-[#0a6ab0] hover:to-[#0d7ac9] text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                        onClick={handleFinalize}
                    >
                        Finalizar <ChevronRightIcon className="w-5 h-5 ml-2" />
                    </button>
                </div>
            </div>

            {/* Modal de Confirmação */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black bg-opacity-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden">
                        {/* Header do Modal com Background Azul */}
                        <div className="bg-gradient-to-r from-[#1e40af] to-[#2563eb] p-8 text-white relative overflow-hidden">
                            <div className="flex items-center justify-between">
                                {/* Conteúdo de texto */}
                                <div className="flex-1 pr-8">
                                    <h2 className="text-2xl font-bold mb-4">
                                        Seu pedido está sendo processado, você será atualizado quando sua carta VAN sofrer atualizações ou estiver finalizada
                                    </h2>
                                    
                                    <p className="text-blue-100 mb-6">
                                        Enquanto isso, entre no site da tecnospeed para saber quais passos você pode tomar agora, ou volte para o início caso seja necessário mais cartas VANs
                                    </p>

                                    {/* Ícones de processo */}
                                    <div className="flex space-x-6 mt-6">
                                        <div className="flex flex-col items-center">
                                            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-2">
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-8 h-0.5 bg-white bg-opacity-30"></div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-2">
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-8 h-0.5 bg-white bg-opacity-30"></div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-2">
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Ilustração de pessoa no lado direito */}
                                <div className="flex-shrink-0">
                                    <div className="relative">
                                        <svg width="180" height="200" viewBox="0 0 180 200" className="text-white">
                                            {/* Corpo da pessoa */}
                                            <ellipse cx="90" cy="180" rx="45" ry="15" fill="currentColor" opacity="0.1" />
                                            
                                            {/* Cabeça */}
                                            <circle cx="90" cy="50" r="25" fill="currentColor" opacity="0.3" />
                                            
                                            {/* Corpo */}
                                            <path d="M60 80 Q90 70 120 80 L115 140 Q90 150 65 140 Z" fill="currentColor" opacity="0.3" />
                                            
                                            {/* Braços */}
                                            <path d="M60 90 Q45 100 50 120 Q55 115 65 110" fill="currentColor" opacity="0.3" />
                                            <path d="M120 90 Q135 100 130 120 Q125 115 115 110" fill="currentColor" opacity="0.3" />
                                            
                                            {/* Pernas */}
                                            <path d="M70 140 Q75 160 70 180 Q80 175 85 155" fill="currentColor" opacity="0.3" />
                                            <path d="M110 140 Q105 160 110 180 Q100 175 95 155" fill="currentColor" opacity="0.3" />
                                            
                                            {/* Laptop/dispositivo */}
                                            <rect x="75" y="120" width="30" height="20" rx="2" fill="currentColor" opacity="0.4" />
                                            <rect x="77" y="122" width="26" height="14" rx="1" fill="white" opacity="0.8" />
                                            
                                            {/* Detalhes do rosto */}
                                            <circle cx="83" cy="45" r="2" fill="currentColor" opacity="0.6" />
                                            <circle cx="97" cy="45" r="2" fill="currentColor" opacity="0.6" />
                                            <path d="M85 55 Q90 58 95 55" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Botões de Ação */}
                        <div className="p-6">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={handleCloseModal}
                                    className="flex-1 cursor-pointer px-6 py-3 border-2 border-[#0d7ac9] text-[#0d7ac9] rounded-xl font-semibold hover:bg-[#0d7ac9] hover:text-white transition-all duration-300"
                                >
                                    INÍCIO
                                </button>
                                <button
                                    onClick={() => window.open('https://tecnospeed.com.br', '_blank')}
                                    className="flex-1 cursor-pointer px-6 py-3 bg-gradient-to-r from-[#0d7ac9] to-[#0a6ab0] text-white rounded-xl font-semibold hover:from-[#0a6ab0] hover:to-[#0d7ac9] transition-all duration-300 shadow-lg"
                                >
                                    SITE
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PdfView;