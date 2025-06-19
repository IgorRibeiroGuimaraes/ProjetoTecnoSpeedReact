import React from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/solid';

interface TipoCarta {
    id: number;
    label: string;
    description: string;
}

interface LetterTypeProps {
    tiposCarta: TipoCarta[];
    selectedLetterType: string;
    onLetterTypeSelect: (letterTypeId: string) => void;
    onNext: () => void;
    onPrev: () => void;
}

const LetterType: React.FC<LetterTypeProps> = ({
    tiposCarta,
    selectedLetterType,
    onLetterTypeSelect,
    onNext,
    onPrev,
}) => {
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
                {tiposCarta.map((tipoCarta) => (
                    <button
                        key={tipoCarta.id}
                        className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                            selectedLetterType === tipoCarta.id.toString()
                                ? 'border-[#0d7ac9] bg-gradient-to-br from-[#0d7ac9] to-[#0a6ab0] text-white shadow-xl transform scale-105'
                                : 'border-gray-200 bg-white hover:border-[#0d7ac9] hover:shadow-md cursor-pointer'
                        }`}
                        onClick={() => onLetterTypeSelect(tipoCarta.id.toString())}
                    >
                        <h3 className="font-bold text-xl mb-3">{tipoCarta.label}</h3>
                        <p className="text-sm opacity-90 leading-relaxed">{tipoCarta.description}</p>
                    </button>
                ))}
            </div>

            <div className="flex justify-between">
                <button
                    className="cursor-pointer px-8 py-4 border-2 border-[#0d7ac9] text-[#0d7ac9] rounded-xl font-semibold hover:bg-[#0d7ac9] hover:text-white transition-all duration-300"
                    onClick={onPrev}
                >
                    Voltar
                </button>
                <button
                    className={`cursor-pointer px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center ${
                        selectedLetterType
                            ? 'bg-gradient-to-r from-[#0d7ac9] to-[#0a6ab0] hover:from-[#0a6ab0] hover:to-[#0d7ac9] text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    onClick={onNext}
                    disabled={!selectedLetterType}
                >
                    Finalizar <ChevronRightIcon className="w-5 h-5 ml-2" />
                </button>
            </div>
        </div>
    );
};

export default LetterType;