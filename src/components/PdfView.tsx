import React, { useState } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { Toast } from '../lib/toast';

interface PdfViewProps {
    onLetterTypeSelect: (letterTypeId: string) => void;
    onPrev: () => void;
    pdfUrl: string;
}

const PdfView: React.FC<PdfViewProps> = ({
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
                <div
                    className="fixed inset-0 flex items-center justify-center z-50 p-4"
                    onClick={handleCloseModal} // Fecha ao clicar fora
                >
                    {/* Modal container que impede propagação do clique */}
                    <div
                        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden"
                        onClick={(e) => e.stopPropagation()} // Impede fechar ao clicar dentro
                    >
                        {/* Header do Modal com Background Azul */}
                        <div className="bg-gradient-to-r from-[#1e40af] to-[#2563eb] p-8 text-white rounded-xl relative overflow-hidden shadow-lg">
                            <div className="flex items-center justify-between flex-wrap">
                                {/* Conteúdo de texto */}
                                <div className="flex-1 max-w-xl pr-8">
                                    <h2 className="text-2xl font-bold mb-4 leading-snug">
                                        Seu pedido está sendo processado, você será atualizado quando sua carta VAN sofrer atualizações ou estiver finalizada
                                    </h2>
                                    <p className="text-blue-100 mb-6">
                                        Enquanto isso, entre no site da tecnospeed para saber quais passos você pode tomar agora, ou volte para o início caso seja necessário mais cartas VANs
                                    </p>

                                    {/* Botões */}
                                    <div className="flex gap-4">
                                        <button
                                            onClick={handleCloseModal}
                                            className="bg-white text-[#1e40af] font-semibold px-6 py-2 rounded-md hover:bg-gray-100 transition"
                                        >
                                            INÍCIO
                                        </button>
                                        <button className="border border-white text-white font-semibold px-6 py-2 rounded-md hover:bg-white hover:text-[#1e40af] transition">
                                            SITE
                                        </button>
                                    </div>
                                </div>

                                {/* Imagem da pessoa */}
                                <div className="w-full sm:w-auto mt-8 sm:mt-0">
                                    <img
                                        src="/assets/images/LogoModal.png"
                                        alt="Ilustração"
                                        className="max-w-xs mx-auto sm:mx-0"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
};

export default PdfView;