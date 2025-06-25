import React from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';

interface Step {
    id: number;
    title: string;
    subtitle: string;
}

interface Banco {
    BancoId: number;
    BancoNome: string;
    Cnab: any[];
    Produto: any[];
}

interface Produto {
    id: number;
    label: string;
    description: string;
    disabled?: boolean;
}

interface ProgressSidebarProps {
    steps: Step[];
    activeStep: number;
    selectedBank: string;
    selectedProduct: string;
    bancos: Banco[];
    produtos: Produto[];
    formData: {
        banco: {
            cnab: string;
        };
    };
    isStepComplete: (step: number) => boolean;
    goToStep: (step: number) => void;
}

const ProgressSidebar: React.FC<ProgressSidebarProps> = ({
    steps,
    activeStep,
    selectedBank,
    selectedProduct,
    bancos,
    produtos,
    formData,
    isStepComplete,
    goToStep,
}) => {
    return (
        <div className="w-80 bg-white shadow-xl rounded-2xl min-h-screen">
            <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <div className="w-2 h-6 bg-[#0d7ac9] rounded-full mr-3"></div>
                    Progresso
                </h2>

                {steps.map((step) => (
                    <div key={step.id} className="mb-4">
                        <div
                            className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                                activeStep === step.id
                                    ? 'bg-gradient-to-r from-[#0d7ac9] to-[#0a6ab0] text-white shadow-lg transform scale-105'
                                    : isStepComplete(step.id)
                                    ? 'bg-green-50 text-green-700 border-2 border-green-200 hover:bg-green-100'
                                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                            }`}
                            onClick={() => goToStep(step.id)}
                        >
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mr-4 transition-all duration-300 ${
                                    isStepComplete(step.id)
                                        ? 'bg-green-500 text-white'
                                        : activeStep === step.id
                                        ? 'bg-white text-[#0d7ac9]'
                                        : 'bg-gray-300 text-gray-600'
                                }`}
                            >
                                {isStepComplete(step.id) ? <CheckIcon className="w-5 h-5" /> : step.id}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-sm">{step.title}</h3>
                                <p className="text-xs opacity-75">{step.subtitle}</p>
                            </div>
                            {isStepComplete(step.id) && <CheckIcon className="w-5 h-5 text-green-500" />}
                        </div>
                    </div>
                ))}

                {/* Resumo das seleções */}
                <div className="mt-8 p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                    <h3 className="font-bold text-gray-700 mb-4 flex items-center">
                        <div className="w-2 h-4 bg-[#0d7ac9] rounded-full mr-2"></div>
                        Resumo da Seleção
                    </h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-medium">Banco:</span>
                            <span
                                className={`font-semibold ${selectedBank ? 'text-green-600' : 'text-gray-400'}`}
                            >
                                {bancos.find((banco) => banco.BancoId.toString() === selectedBank)?.BancoNome ||
                                    'Não selecionado'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-medium">Produto:</span>
                            <span
                                className={`font-semibold ${selectedProduct ? 'text-green-600' : 'text-gray-400'}`}
                            >
                                {selectedProduct
                                    ? produtos.find((p) => p.id.toString() === selectedProduct)?.label
                                    : 'Não selecionado'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-medium">CNAB:</span>
                            <span
                                className={`font-semibold ${formData.banco.cnab ? 'text-green-600' : 'text-gray-400'}`}
                            >
                                {formData.banco.cnab || 'Não selecionado'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgressSidebar;