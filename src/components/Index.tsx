import React, { useState } from 'react';
import { fetchBanco } from '../services/api';
import StepHeader from './StepHeader';
import ProgressSidebar from './ProgressSidebar';
import BankSelectionStep from './BankSelectionStep';
import ProductSelectionStep from './ProductSelectionStep';
import DataFormStep from './DataFormStep';
import LetterType from './LetterType';

// Interfaces
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

interface Step {
    id: number;
    title: string;
    subtitle: string;
}

interface TipoCarta {
    id: number;
    label: string;
    description: string;
}

interface FormData {
    cnpj: string;
    razaoSocial: string;
    responsavelNome: string;
    responsavelCargo: string;
    responsavelTelefone: string;
    responsavelEmail: string;
    agencia: string;
    agenciaDV: string;
    conta: string;
    contaDV: string;
    convenio: string;
    cnab: string;
    gerenteNome: string;
    gerenteTelefone: string;
    gerenteEmail: string;
}

const HomePage = () => {
    const [activeStep, setActiveStep] = useState(1);
    const [selectedBank, setSelectedBank] = useState<string>('');
    const [selectedProduct, setSelectedProduct] = useState<string>('');
    const [selectedLetterType, setSelectedLetterType] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [bancos, setBancos] = useState<Banco[]>([]);
    const [isDataFormValid, setIsDataFormValid] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        cnpj: '',
        razaoSocial: '',
        responsavelNome: '',
        responsavelCargo: '',
        responsavelTelefone: '',
        responsavelEmail: '',
        agencia: '',
        agenciaDV: '',
        conta: '',
        contaDV: '',
        convenio: '',
        cnab: '',
        gerenteNome: '',
        gerenteTelefone: '',
        gerenteEmail: '',
    });

    // Lista estática de todos os produtos possíveis
    const todosProdutos: Produto[] = [
        { id: 1, label: 'Boletos', description: 'Trafegar arquivos de remessa e retorno de Boletos' },
        { id: 2, label: 'Pagamentos', description: 'Trafegar arquivos de remessa e retorno de pagamentos' },
        { id: 3, label: 'Extrato', description: 'Trafegar arquivos de extratos' },
        { id: 4, label: 'DDA', description: 'Trafegar arquivos de Varredura de débitos' },
    ];

    const steps: Step[] = [
        { id: 1, title: 'Selecione um Banco', subtitle: 'Instituição Bancária' },
        { id: 2, title: 'Selecione um Produto', subtitle: 'Produtos desejados' },
        { id: 3, title: 'Preencher Dados', subtitle: 'Empresa e conta' },
        { id: 4, title: 'Tipo de Carta', subtitle: 'Configuração de carta' },
        { id: 5, title: 'Carta', subtitle: 'Visualização da carta gerada' },
    ];

    const tiposCarta: TipoCarta[] = [
        { id: 1, label: 'Nextera', description: 'Arquivo de remessa para o banco' },
        { id: 2, label: 'Finnet', description: 'Arquivo de retorno do banco' },
    ];

    const selectedBankData = bancos.find((banco) => banco.BancoId.toString() === selectedBank);

    // Combina produtos disponíveis com a lista estática
    const produtos: Produto[] = todosProdutos.map((produto) => {
        const produtoBanco = selectedBankData?.Produto.find((p) => p.id === produto.id);
        return {
            ...produto,
            disabled: !produtoBanco,
        };
    });

    const handleFetchBanco = async () => {
        setLoading(true);
        setError(null);
        try {
            const bancosData = await fetchBanco('/bancos-configuracoes');
            console.log('Bancos fetched:', bancosData);
            setBancos(bancosData);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Falha ao carregar os bancos. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        handleFetchBanco();
    }, []);

    const nextStep = () => {
        if (activeStep < 5) {
            setActiveStep(activeStep + 1);
        }
    };

    const prevStep = () => {
        if (activeStep > 1) {
            if (activeStep === 3) {
                // Limpar formData e isDataFormValid ao voltar da etapa 3 para a 2
                setFormData({
                    cnpj: '',
                    razaoSocial: '',
                    responsavelNome: '',
                    responsavelCargo: '',
                    responsavelTelefone: '',
                    responsavelEmail: '',
                    agencia: '',
                    agenciaDV: '',
                    conta: '',
                    contaDV: '',
                    convenio: '',
                    cnab: '',
                    gerenteNome: '',
                    gerenteTelefone: '',
                    gerenteEmail: '',
                });
                setIsDataFormValid(false);
                setSelectedProduct(''); // Também limpa o produto selecionado
            } else if (activeStep === 4) {
                setSelectedLetterType(''); // Limpa o tipo de carta ao voltar da etapa 4
            }
            setActiveStep(activeStep - 1);
        }
    };

    const goToStep = (step: number) => {
        if (step === 1) {
            setActiveStep(1);
        } else if (step === 2 && selectedBank) {
            setActiveStep(2);
        } else if (step === 3 && selectedBank && selectedProduct && isDataFormValid) {
            setActiveStep(3);
        } else if (step === 4 && selectedBank && selectedProduct && isDataFormValid) {
            setActiveStep(4);
        } else if (step === 5 && selectedBank && selectedProduct && isDataFormValid && selectedLetterType) {
            setActiveStep(5);
        }
    };

    const isStepComplete = (step: number) => {
        if (step === 1) return selectedBank !== '';
        if (step === 2) return selectedProduct !== '';
        if (step === 3) return isDataFormValid;
        if (step === 4) return selectedLetterType !== '';
        return false;
    };

    const handleBankSelect = (bankId: string) => {
        setSelectedBank(bankId);
        setSelectedProduct('');
        setSelectedLetterType('');
        setIsDataFormValid(false);
    };

    const handleProductSelect = (productId: string) => {
        const produto = produtos.find((p) => p.id.toString() === productId);
        if (!produto?.disabled) {
            setSelectedProduct(productId);
            setSelectedLetterType('');
        }
    };

    const handleLetterTypeSelect = (letterTypeId: string) => {
        setSelectedLetterType(letterTypeId);
    };

    const handleFormDataChange = (data: FormData) => {
        setFormData(data);
    };

    return (
        <div className="bg-gray-50">
            {/* Header com timeline */}
            <StepHeader
                steps={steps}
                activeStep={activeStep}
                selectedBank={selectedBank}
                selectedProduct={selectedProduct}
                isStepComplete={isStepComplete}
                goToStep={goToStep}
            />

            <div className="flex mx-auto">
                {/* Sidebar */}
                <ProgressSidebar
                    steps={steps}
                    activeStep={activeStep}
                    selectedBank={selectedBank}
                    selectedProduct={selectedProduct}
                    bancos={bancos}
                    produtos={produtos}
                    isStepComplete={isStepComplete}
                    goToStep={goToStep}
                />

                {/* Conteúdo principal */}
                <div className="flex-1 ml-1">
                    {activeStep === 1 && (
                        <BankSelectionStep
                            bancos={bancos}
                            selectedBank={selectedBank}
                            error={error}
                            onBankSelect={handleBankSelect}
                            onNext={nextStep}
                        />
                    )}

                    {activeStep === 2 && (
                        <ProductSelectionStep
                            produtos={produtos}
                            selectedProduct={selectedProduct}
                            onProductSelect={handleProductSelect}
                            onNext={nextStep}
                            onPrev={prevStep}
                        />
                    )}

                    {activeStep === 3 && (
                        <DataFormStep
                            selectedBankData={selectedBankData}
                            formData={formData}
                            onFormDataChange={handleFormDataChange}
                            isValid={setIsDataFormValid}
                            onPrev={prevStep}
                            onNext={nextStep}
                        />
                    )}

                    {activeStep === 4 && (
                        <LetterType
                            tiposCarta={tiposCarta}
                            selectedLetterType={selectedLetterType}
                            onLetterTypeSelect={handleLetterTypeSelect}
                            onNext={nextStep}
                            onPrev={prevStep}
                        />
                    )}

                    {activeStep === 5 && (
                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Visualização da Carta</h1>
                            <p className="text-gray-600 text-lg mb-8">Placeholder para a visualização da carta gerada.</p>
                            <div className="flex justify-between">
                                <button
                                    className="cursor-pointer px-8 py-4 border-2 border-[#0d7ac9] text-[#0d7ac9] rounded-xl font-semibold hover:bg-[#0d7ac9] hover:text-white transition-all duration-300"
                                    onClick={prevStep}
                                >
                                    Voltar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomePage;