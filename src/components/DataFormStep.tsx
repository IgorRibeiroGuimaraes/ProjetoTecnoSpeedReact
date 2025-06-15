import React, { useEffect } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/solid';

interface Banco {
    BancoId: number;
    BancoNome: string;
    Cnab: any[];
    Produto: any[];
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

interface DataFormStepProps {
    selectedBankData: Banco | undefined;
    formData: FormData; // Recebe formData do pai
    onFormDataChange: (data: FormData) => void; // Callback para atualizar formData
    isValid: (isValid: boolean) => void;
    onPrev: () => void;
    onNext: () => void;
}

const DataFormStep: React.FC<DataFormStepProps> = ({
    selectedBankData,
    formData,
    onFormDataChange,
    onPrev,
    onNext,
    isValid,
}) => {
    // Função para atualizar os campos do formulário
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        onFormDataChange({
            ...formData,
            [name]: value,
        });
    };

    // Função para atualizar o campo CNAB
    const handleCnabChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFormDataChange({
            ...formData,
            cnab: e.target.value,
        });
    };

    // Função de validação
    const isFormValid = () => {
        return (
            formData.cnpj.trim() !== '' &&
            formData.razaoSocial.trim() !== '' &&
            formData.responsavelNome.trim() !== '' &&
            formData.responsavelCargo.trim() !== '' &&
            formData.responsavelTelefone.trim() !== '' &&
            formData.responsavelEmail.trim() !== '' &&
            formData.agencia.trim() !== '' &&
            formData.agenciaDV.trim() !== '' &&
            formData.conta.trim() !== '' &&
            formData.contaDV.trim() !== '' &&
            formData.convenio.trim() !== '' &&
            formData.cnab.trim() !== '' &&
            formData.gerenteNome.trim() !== '' &&
            formData.gerenteTelefone.trim() !== '' &&
            formData.gerenteEmail.trim() !== ''
        );
    };

    useEffect(() => {
        if (typeof isValid === 'function') {
            isValid(isFormValid());
        }
    }, [formData, isValid]);

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-[#0d7ac9] to-[#0a6ab0] rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                    <span className="text-white font-bold text-xl">3</span>
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Preencher dados da empresa e conta</h1>
                    <p className="text-gray-600 text-lg">
                        A seguir precisamos coletar alguns dados que utilizamos para elaborar a carta de VAN para o banco desejado
                    </p>
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
                                name="cnpj"
                                value={formData.cnpj}
                                onChange={handleInputChange}
                                placeholder="Inserir número do CNPJ"
                                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#0d7ac9]/20 focus:border-[#0d7ac9] transition-all duration-300"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Razão Social</label>
                            <input
                                type="text"
                                name="razaoSocial"
                                value={formData.razaoSocial}
                                onChange={handleInputChange}
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
                                name="responsavelNome"
                                value={formData.responsavelNome}
                                onChange={handleInputChange}
                                placeholder="Inserir o nome do Responsável pela Empresa"
                                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#0d7ac9]/20 focus:border-[#0d7ac9] transition-all duration-300"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Cargo</label>
                            <input
                                type="text"
                                name="responsavelCargo"
                                value={formData.responsavelCargo}
                                onChange={handleInputChange}
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
                                name="responsavelTelefone"
                                value={formData.responsavelTelefone}
                                onChange={handleInputChange}
                                placeholder="Inserir telefone do Responsável pela Empresa"
                                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#0d7ac9]/20 focus:border-[#0d7ac9] transition-all duration-300"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">E-mail</label>
                            <input
                                type="email"
                                name="responsavelEmail"
                                value={formData.responsavelEmail}
                                onChange={handleInputChange}
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
                            value={selectedBankData?.BancoNome || ''}
                            readOnly
                        />
                    </div>
                    <div className="grid grid-cols-6 gap-4 mb-6">
                        <div className="col-span-5">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Agência</label>
                            <input
                                type="text"
                                name="agencia"
                                value={formData.agencia}
                                onChange={handleInputChange}
                                placeholder="Inserir número da Agência"
                                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#0d7ac9]/20 focus:border-[#0d7ac9] transition-all duration-300"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">DV</label>
                            <input
                                type="text"
                                name="agenciaDV"
                                value={formData.agenciaDV}
                                onChange={handleInputChange}
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
                                name="conta"
                                value={formData.conta}
                                onChange={handleInputChange}
                                placeholder="Inserir número da Conta"
                                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#0d7ac9]/20 focus:border-[#0d7ac9] transition-all duration-300"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">DV</label>
                            <input
                                type="text"
                                name="contaDV"
                                value={formData.contaDV}
                                onChange={handleInputChange}
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
                                name="convenio"
                                value={formData.convenio}
                                onChange={handleInputChange}
                                placeholder="Inserir o número do Convênio"
                                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#0d7ac9]/20 focus:border-[#0d7ac9] transition-all duration-300"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">CNAB</label>
                            <div className="flex items-center space-x-8 mt-4">
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="cnab240"
                                        name="cnab"
                                        value="240"
                                        checked={formData.cnab === '240'}
                                        onChange={handleCnabChange}
                                        className="mr-3 w-4 h-4 text-[#0d7ac9] focus:ring-[#0d7ac9]"
                                    />
                                    <label htmlFor="cnab240" className="text-sm font-medium">240</label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="cnab400"
                                        name="cnab"
                                        value="400"
                                        checked={formData.cnab === '400'}
                                        onChange={handleCnabChange}
                                        className="mr-3 w-4 h-4 text-[#0d7ac9] focus:ring-[#0d7ac9]"
                                    />
                                    <label htmlFor="cnab400" className="text-sm font-medium">400</label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="cnab444"
                                        name="cnab"
                                        value="444"
                                        checked={formData.cnab === '444'}
                                        onChange={handleCnabChange}
                                        className="mr-3 w-4 h-4 text-[#0d7ac9] focus:ring-[#0d7ac9]"
                                    />
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
                                name="gerenteNome"
                                value={formData.gerenteNome}
                                onChange={handleInputChange}
                                placeholder="Inserir o nome do Gerente de Conta"
                                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#0d7ac9]/20 focus:border-[#0d7ac9] transition-all duration-300"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Telefone</label>
                            <input
                                type="text"
                                name="gerenteTelefone"
                                value={formData.gerenteTelefone}
                                onChange={handleInputChange}
                                placeholder="Inserir o número de telefone do Gerente de Conta"
                                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#0d7ac9]/20 focus:border-[#0d7ac9] transition-all duration-300"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">E-mail</label>
                        <input
                            type="email"
                            name="gerenteEmail"
                            value={formData.gerenteEmail}
                            onChange={handleInputChange}
                            placeholder="Inserir o e-mail do Gerente de Conta"
                            className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#0d7ac9]/20 focus:border-[#0d7ac9] transition-all duration-300"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-between mt-10 pt-8 border-t-2 border-gray-200">
                <button
                    className="cursor-pointer px-8 py-4 border-2 border-[#0d7ac9] text-[#0d7ac9] rounded-xl font-semibold hover:bg-[#0d7ac9] hover:text-white transition-all duration-300"
                    onClick={onPrev}
                >
                    Voltar
                </button>
                <button
                    className={`cursor-pointer px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center ${
                        selectedBankData && isFormValid()
                            ? 'bg-gradient-to-r from-[#0d7ac9] to-[#0a6ab0] hover:from-[#0a6ab0] hover:to-[#0d7ac9] text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    onClick={onNext}
                    disabled={!selectedBankData || !isFormValid()}
                >
                    Próximo <ChevronRightIcon className="w-5 h-5 ml-2" />
                </button>
            </div>
        </div>
    );
};

export default DataFormStep;