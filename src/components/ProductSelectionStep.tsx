// ProductSelectionStep.tsx
import React from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/solid';

interface Produto {
    id: number;
    label: string;
    description: string;
    disabled?: boolean;
}

interface ProductSelectionStepProps {
    produtos: Produto[];
    selectedProduct: string;
    onProductSelect: (productId: string) => void;
    onNext: () => void;
    onPrev: () => void;
}

const ProductSelectionStep: React.FC<ProductSelectionStepProps> = ({
    produtos,
    selectedProduct,
    onProductSelect,
    onNext,
    onPrev,
}) => {
    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-[#0d7ac9] to-[#0a6ab0] rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                    <span className="text-white font-bold text-xl">2</span>
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Selecionar um Produto</h1>
                    <p className="text-gray-600 text-lg">
                        Selecione qual produto deseja utilizar a transferência de arquivos por VAN
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {produtos.map((produto) => (
                    <button
                        key={produto.id}
                        className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                            produto.disabled
                                ? 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed opacity-60'
                                : selectedProduct === produto.id.toString()
                                ? 'border-[#0d7ac9] bg-gradient-to-br from-[#0d7ac9] to-[#0a6ab0] text-white shadow-xl transform scale-105'
                                : 'border-gray-200 bg-white hover:border-[#0d7ac9] hover:shadow-md cursor-pointer'
                        }`}
                        onClick={() => onProductSelect(produto.id.toString())}
                        disabled={produto.disabled}
                    >
                        <h3 className="font-bold text-xl mb-3">{produto.label}</h3>
                        <p className="text-sm opacity-90 leading-relaxed">{produto.description}</p>
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
                        selectedProduct
                            ? 'bg-gradient-to-r from-[#0d7ac9] to-[#0a6ab0] hover:from-[#0a6ab0] hover:to-[#0d7ac9] text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    onClick={onNext}
                    disabled={!selectedProduct}
                >
                    Próximo <ChevronRightIcon className="w-5 h-5 ml-2" />
                </button>
            </div>
        </div>
    );
};

export default ProductSelectionStep;