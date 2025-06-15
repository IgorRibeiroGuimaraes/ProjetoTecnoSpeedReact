// StepHeader.tsx
import React from 'react';
import { CheckIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

interface Step {
    id: number;
    title: string;
    subtitle: string;
}

interface StepHeaderProps {
    steps: Step[];
    activeStep: number;
    selectedBank: string;
    selectedProduct: string;
    isStepComplete: (step: number) => boolean;
    goToStep: (step: number) => void;
}

const StepHeader: React.FC<StepHeaderProps> = ({
    steps,
    activeStep,
    selectedBank,
    selectedProduct,
    isStepComplete,
    goToStep,
}) => {
    return (
        <div className="bg-gradient-to-r shadow-lg mb-2 rounded-xl">
            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="flex items-center justify-center">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex items-center">
                            {/* Bloco da etapa */}
                            <div className="flex flex-col items-center">
                                {/* Círculo da etapa */}
                                <div
                                    className={`relative cursor-pointer transition-all duration-300 ${
                                        step.id === 1 ||
                                        (step.id === 2 && selectedBank) ||
                                        (step.id === 3 && selectedBank && selectedProduct)
                                            ? 'cursor-pointer hover:scale-110'
                                            : 'cursor-not-allowed opacity-60'
                                    }`}
                                    onClick={() => goToStep(step.id)}
                                >
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                                            isStepComplete(step.id)
                                                ? 'bg-green-500 text-white shadow-lg'
                                                : activeStep === step.id
                                                ? 'bg-white text-[#0d7ac9] shadow-lg transform scale-110'
                                                : 'bg-blue-300 text-white'
                                        }`}
                                    >
                                        {isStepComplete(step.id) ? <CheckIcon className="w-6 h-6" /> : step.id}
                                    </div>
                                </div>

                                {/* Título e subtítulo */}
                                <div className="mt-2 text-center">
                                    <div className="text-black font-semibold text-sm">{step.title}</div>
                                    <div className="text-gray-500 text-xs">{step.subtitle}</div>
                                </div>
                            </div>

                            {/* Linha conectora */}
                            {index < steps.length - 1 && (
                                <div
                                    className={`w-24 h-1 mx-4 rounded-full transition-all duration-500 self-center ${
                                        activeStep > step.id ? 'bg-green-400' : 'bg-blue-300'
                                    }`}
                                ></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StepHeader;