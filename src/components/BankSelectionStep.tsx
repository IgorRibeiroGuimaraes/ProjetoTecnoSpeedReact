// BankSelectionStep.tsx
import React from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/solid';

interface Banco {
    BancoId: number;
    BancoNome: string;
    Cnab: any[];
    Produto: any[];
}

interface BankSelectionStepProps {
    bancos: Banco[];
    selectedBank: string;
    error: string | null;
    onBankSelect: (bankId: string) => void;
    onNext: () => void;
}

const BankSelectionStep: React.FC<BankSelectionStepProps> = ({
    bancos,
    selectedBank,
    error,
    onBankSelect,
    onNext,
}) => {
    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-[#0d7ac9] to-[#0a6ab0] rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                    <span className="text-white font-bold text-xl">1</span>
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Selecione um Banco</h1>
                    <p className="text-gray-600 text-lg">Escolha a instituição bancária desejada</p>
                </div>
            </div>

            <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Instituições Bancárias Disponíveis:
                </label>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <select
                    className="w-full p-4 border-2 border-gray-300 rounded-xl text-lg focus:ring-4 focus:ring-[#0d7ac9]/20 focus:border-[#0d7ac9] transition-all duration-300"
                    value={selectedBank}
                    onChange={(e) => onBankSelect(e.target.value)}
                >
                    <option value="">Selecione um banco</option>
                    {bancos.map((banco) => (
                        <option key={banco.BancoId} value={banco.BancoId}>
                            {banco.BancoNome}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex justify-end">
                <button
                    className={`cursor-pointer px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center ${
                        selectedBank
                            ? 'bg-gradient-to-r from-[#0d7ac9] to-[#0a6ab0] hover:from-[#0a6ab0] hover:to-[#0d7ac9] text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    onClick={onNext}
                    disabled={!selectedBank}
                >
                    Próximo <ChevronRightIcon className="w-5 h-5 ml-2" />
                </button>
            </div>
        </div>
    );
};

export default BankSelectionStep;