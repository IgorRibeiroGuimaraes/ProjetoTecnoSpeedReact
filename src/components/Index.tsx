import React from 'react';
import { ChevronRightIcon, CheckIcon } from '@heroicons/react/24/solid';


const HomePage = () => {

    // Estado para controlar qual etapa está ativa
    const [activeStep, setActiveStep] = React.useState(1);
    
    // Estado para armazenar o banco selecionado
    const [selectedBank, setSelectedBank] = React.useState('');
    
    // Estado para armazenar o produto selecionado
    const [selectedProduct, setSelectedProduct] = React.useState('');

    const bancos = [
        { id: 1, label: 'Banco do Brasil' },
        { id: 2, label: 'Itaú' },
        { id: 3, label: 'Bradesco' },
        { id: 4, label: 'Santander' },
        { id: 5, label: 'Caixa Econômica Federal' },
        { id: 6, label: 'Banco Safra' },
        { id: 7, label: 'Banco Inter' },
        { id: 8, label: 'Banco Original' },
    ];
    
    // Produtos disponíveis
    const produtos = [
        { id: 1, label: 'Boletos', description: 'Trafegar arquivos de remessa e retorno de Boletos' },
        { id: 2, label: 'Pagamentos', description: 'Trafegar arquivos de remessa e retorno de pagamentos' },
        { id: 3, label: 'Extrato', description: 'Trafegar arquivos de extratos' },
        { id: 4, label: 'DDA', description: 'Trafegar arquivos de Varredura de débitos' },
    ];

    // Etapas do processo
    const steps = [
        { id: 1, title: 'Selecione um Banco', subtitle: 'Instituição Bancária' },
        { id: 2, title: 'Selecione um Produto', subtitle: 'Produtos desejados' },
        { id: 3, title: 'Preencher Dados', subtitle: 'Empresa e conta' },
    ];

    // Função para avançar para a próxima etapa
    const nextStep = () => {
        if (activeStep < 3) {
            setActiveStep(activeStep + 1);
        }
    };

    const prevStep = () => {
        if (activeStep > 1) {
            if (activeStep === 2) {
                setSelectedProduct(''); // Clear selectedProduct when moving back from step 2 to step 1
            }
            setActiveStep(activeStep - 1);
        }
    };
    
    // Função para selecionar um produto
    const selectProduct = (productId: string) => {
        setSelectedProduct(productId);
    };
    

    // Função para ir diretamente para uma etapa (com validação)
    const goToStep = (step: number) => {
        if (step === 1) {
            setActiveStep(1);
        } else if (step === 2 && selectedBank) {
            setActiveStep(2);
        } else if (step === 3 && selectedBank && selectedProduct) {
            setActiveStep(3);
        }
    };

    // Função para verificar se uma etapa está completa
    const isStepComplete = (step: number) => {
        if (step === 1) return selectedBank !== '';
        if (step === 2) return selectedProduct !== '';
        if (step === 3) return false; // Etapa final não tem validação automática
        return false;
    };

    return (
        <div className="bg-gray-50">
            {/* Header com timeline melhorada */}
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
                                        (step.id === 1) || (step.id === 2 && selectedBank) || (step.id === 3 && selectedBank && selectedProduct)
                                            ? 'cursor-pointer hover:scale-110' 
                                            : 'cursor-not-allowed opacity-60'
                                    }`}
                                    onClick={() => goToStep(step.id)}
                                >
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                                        isStepComplete(step.id) ? 'bg-green-500 text-white shadow-lg' : 
                                        activeStep === step.id ? 'bg-white text-[#0d7ac9] shadow-lg transform scale-110' : 
                                        'bg-blue-300 text-white'
                                    }`}>
                                        {isStepComplete(step.id) ? (
                                            <CheckIcon className="w-6 h-6" />
                                        ) : (
                                            step.id
                                        )}
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
                                <div className={`w-24 h-1 mx-4 rounded-full transition-all duration-500 self-center ${
                                    activeStep > step.id ? 'bg-green-400' : 'bg-blue-300'
                                }`}></div>
                            )}
                        </div>
                    ))}
                    </div>
                </div>
            </div>

            <div className="flex mx-auto">
                {/* Sidebar melhorada */}
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
                                        activeStep === step.id ? 'bg-gradient-to-r from-[#0d7ac9] to-[#0a6ab0] text-white shadow-lg transform scale-105' : 
                                        isStepComplete(step.id) ? 'bg-green-50 text-green-700 border-2 border-green-200 hover:bg-green-100' :
                                        'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                    }`}
                                    onClick={() => goToStep(step.id)}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mr-4 transition-all duration-300 ${
                                        isStepComplete(step.id) ? 'bg-green-500 text-white' : 
                                        activeStep === step.id ? 'bg-white text-[#0d7ac9]' : 
                                        'bg-gray-300 text-gray-600'
                                    }`}>
                                        {isStepComplete(step.id) ? <CheckIcon className="w-5 h-5" /> : step.id}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-sm">{step.title}</h3>
                                        <p className="text-xs opacity-75">{step.subtitle}</p>
                                    </div>
                                    {isStepComplete(step.id) && (
                                        <CheckIcon className="w-5 h-5 text-green-500" />
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Resumo das seleções melhorado */}
                        <div className="mt-8 p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                            <h3 className="font-bold text-gray-700 mb-4 flex items-center">
                                <div className="w-2 h-4 bg-[#0d7ac9] rounded-full mr-2"></div>
                                Resumo da Seleção
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 font-medium">Banco:</span>
                                    <span className={`font-semibold ${selectedBank ? 'text-green-600' : 'text-gray-400'}`}>
                                        {selectedBank || 'Não selecionado'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 font-medium">Produto:</span>
                                    <span className={`font-semibold ${selectedProduct ? 'text-green-600' : 'text-gray-400'}`}>
                                        {selectedProduct ? produtos.find(p => p.id === selectedProduct)?.label : 'Não selecionado'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Conteúdo principal */}
                <div className="flex-1 ml-1">
                    {/* Etapa 1 - Seleção de Banco */}
                    {activeStep === 1 && (
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
                                <select 
                                    className="w-full p-4 border-2 border-gray-300 rounded-xl text-lg focus:ring-4 focus:ring-[#0d7ac9]/20 focus:border-[#0d7ac9] transition-all duration-300"
                                    value={selectedBank}
                                    onChange={(e) => setSelectedBank(e.target.value)}
                                >
                                    <option value="">Selecione um banco</option>
                                    {bancos.map((banco) => (
                                        <option key={banco.id} value={banco.label}>
                                            {banco.label}
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
                                    onClick={nextStep}
                                    disabled={!selectedBank}
                                >
                                    Próximo <ChevronRightIcon className="w-5 h-5 ml-2" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Etapa 2 - Seleção de Produtos */}
                    {activeStep === 2 && (
                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                            <div className="flex items-center mb-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#0d7ac9] to-[#0a6ab0] rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                                    <span className="text-white font-bold text-xl">2</span>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Selecionar um Produto</h1>
                                    <p className="text-gray-600 text-lg">Selecione qual produto deseja utilizar a transferência de arquivos por VAN</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                {produtos.map((produto) => (
                                    <button 
                                        key={produto.id}
                                        className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 text-left hover:shadow-lg ${
                                            selectedProduct === produto.id 
                                                ? 'border-[#0d7ac9] bg-gradient-to-br from-[#0d7ac9] to-[#0a6ab0] text-white shadow-xl transform scale-105' 
                                                : 'border-gray-200 bg-white hover:border-[#0d7ac9] hover:shadow-md'
                                        }`}
                                        onClick={() => selectProduct(produto.id)}
                                    >
                                        <h3 className="font-bold text-xl mb-3">{produto.label}</h3>
                                        <p className="text-sm opacity-90 leading-relaxed">{produto.description}</p>
                                    </button>
                                ))}
                            </div>

                            <div className="flex justify-between">
                                <button 
                                    className="cursor-pointer px-8 py-4 border-2 border-[#0d7ac9] text-[#0d7ac9] rounded-xl font-semibold hover:bg-[#0d7ac9] hover:text-white transition-all duration-300"
                                    onClick={prevStep}
                                >
                                    Voltar
                                </button>
                                <button 
                                    className={`cursor-pointer px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center ${
                                        selectedProduct 
                                            ? 'bg-gradient-to-r from-[#0d7ac9] to-[#0a6ab0] hover:from-[#0a6ab0] hover:to-[#0d7ac9] text-white shadow-lg hover:shadow-xl transform hover:scale-105' 
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                    onClick={nextStep}
                                    disabled={!selectedProduct}
                                >
                                    Próximo <ChevronRightIcon className="w-5 h-5 ml-2" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Etapa 3 - Preenchimento de Dados */}
                    {activeStep === 3 && (
                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                            <div className="flex items-center mb-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#0d7ac9] to-[#0a6ab0] rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                                    <span className="text-white font-bold text-xl">3</span>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Preencher dados da empresa e conta</h1>
                                    <p className="text-gray-600 text-lg">A seguir precisamos coletar alguns dados que utilizamos para elaborar a carta de VAN para o banco desejado</p>
                                </div>
                            </div>

                            <div className="space-y-8">
                                {/* Dados da Empresa */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                        <div className="w-1 h-6 bg-[#0d7ac9] rounded-full mr-3"></div>
                                        EMPRESA
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">CNPJ</label>
                                            <input 
                                                type="text" 
                                                placeholder="Inserir número do CNPJ" 
                                                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#0d7ac9]/20 focus:border-[#0d7ac9] transition-all duration-300"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Razão Social</label>
                                            <input 
                                                type="text" 
                                                placeholder="Inserir a Razão Social" 
                                                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#0d7ac9]/20 focus:border-[#0d7ac9] transition-all duration-300"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Responsável pela Empresa */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                        <div className="w-1 h-6 bg-[#0d7ac9] rounded-full mr-3"></div>
                                        RESPONSÁVEL PELA EMPRESA
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Nome</label>
                                            <input 
                                                type="text" 
                                                placeholder="Inserir o nome do Responsável pela Empresa" 
                                                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#0d7ac9]/20 focus:border-[#0d7ac9] transition-all duration-300"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Cargo</label>
                                            <input 
                                                type="text" 
                                                placeholder="Inserir o cargo do Responsável pela Empresa" 
                                                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#0d7ac9]/20 focus:border-[#0d7ac9] transition-all duration-300"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Telefone</label>
                                            <input 
                                                type="text" 
                                                placeholder="Inserir telefone do Responsável pela Empresa" 
                                                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#0d7ac9]/20 focus:border-[#0d7ac9] transition-all duration-300"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">E-mail</label>
                                            <input 
                                                type="email" 
                                                placeholder="Inserir e-mail do Responsável pela Empresa" 
                                                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#0d7ac9]/20 focus:border-[#0d7ac9] transition-all duration-300"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Dados da Conta */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                        <div className="w-1 h-6 bg-[#0d7ac9] rounded-full mr-3"></div>
                                        CONTA
                                    </h2>
                                    <div className="mb-6">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Banco</label>
                                        <input 
                                            type="text" 
                                            className="w-full p-4 border-2 border-gray-300 rounded-xl bg-gray-100"
                                            value={selectedBank}
                                            readOnly
                                        />
                                    </div>
                                    <div className="grid grid-cols-6 gap-4 mb-6">
                                        <div className="col-span-5">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Agência</label>
                                            <input 
                                                type="text" 
                                                placeholder="Inserir número da Agência" 
                                                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#0d7ac9]/20 focus:border-[#0d7ac9] transition-all duration-300"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">DV</label>
                                            <input 
                                                type="text" 
                                                placeholder="DV" 
                                                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#0d7ac9]/20 focus:border-[#0d7ac9] transition-all duration-300"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-6 gap-4 mb-6">
                                        <div className="col-span-5">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Conta</label>
                                            <input 
                                                type="text" 
                                                placeholder="Inserir número da Conta" 
                                                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#0d7ac9]/20 focus:border-[#0d7ac9] transition-all duration-300"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">DV</label>
                                            <input 
                                                type="text" 
                                                placeholder="DV" 
                                                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#0d7ac9]/20 focus:border-[#0d7ac9] transition-all duration-300"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Convênio</label>
                                            <input 
                                                type="text" 
                                                placeholder="Inserir o número do Convênio" 
                                                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#0d7ac9]/20 focus:border-[#0d7ac9] transition-all duration-300"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">CNAB</label>
                                            <div className="flex items-center space-x-8 mt-4">
                                                <div className="flex items-center">
                                                    <input type="radio" id="cnab240" name="cnab" value="240" className="mr-3 w-4 h-4 text-[#0d7ac9] focus:ring-[#0d7ac9]"/>
                                                    <label htmlFor="cnab240" className="text-sm font-medium">240</label>
                                                </div>
                                                <div className="flex items-center">
                                                    <input type="radio" id="cnab400" name="cnab" value="400" className="mr-3 w-4 h-4 text-[#0d7ac9] focus:ring-[#0d7ac9]"/>
                                                    <label htmlFor="cnab400" className="text-sm font-medium">400</label>
                                                </div>
                                                <div className="flex items-center">
                                                    <input type="radio" id="cnab444" name="cnab" value="444" className="mr-3 w-4 h-4 text-[#0d7ac9] focus:ring-[#0d7ac9]"/>
                                                    <label htmlFor="cnab444" className="text-sm font-medium">444</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Gerente de Conta */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                        <div className="w-1 h-6 bg-[#0d7ac9] rounded-full mr-3"></div>
                                        GERENTE DE CONTA
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Nome</label>
                                            <input 
                                                type="text" 
                                                placeholder="Inserir o nome do Gerente de Conta" 
                                                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#0d7ac9]/20 focus:border-[#0d7ac9] transition-all duration-300"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Telefone</label>
                                            <input 
                                                type="text" 
                                                placeholder="Inserir o número de telefone do Gerente de Conta" 
                                                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#0d7ac9]/20 focus:border-[#0d7ac9] transition-all duration-300"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">E-mail</label>
                                        <input 
                                            type="email" 
                                            placeholder="Inserir o e-mail do Gerente de Conta" 
                                            className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#0d7ac9]/20 focus:border-[#0d7ac9] transition-all duration-300"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between mt-10 pt-8 border-t-2 border-gray-200">
                                <button 
                                    className="cursor-pointer px-8 py-4 border-2 border-[#0d7ac9] text-[#0d7ac9] rounded-xl font-semibold hover:bg-[#0d7ac9] hover:text-white transition-all duration-300"
                                    onClick={prevStep}
                                >
                                    Voltar
                                </button>
                                <button 
                                    className="cursor-pointer px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    Enviar Solicitação
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default HomePage;