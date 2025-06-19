import React, { useEffect, useState } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { createCarta } from '../services/api';
import { toast } from 'react-toastify';
import { CustomError } from '../services/api'; // Importe o tipo CustomError

interface Banco {
    BancoId: number;
    BancoNome: string;
    Cnab: any[];
    Produto: any[];
}

interface FormDataValues {
    emitente: {
        cnpj: string;
        razaoSocial: string;
    };
    responsavel: {
        nome: string;
        cargo: string;
        telefone: string;
        email: string;
    };
    banco: {
        agencia: string;
        agenciaDV: string;
        conta: number; // Pode ser string no TypeScript, mas será convertido
        contaDV: number;
        convenio: string;
        cnab: string; // "240", "400", "444"
        gerente: {
            nome: string;
            telefone: string;
            email: string;
        };
    };
}

interface ErrorField {
    campo: string;
    mensagem: string;
}

interface DataFormStepProps {
    selectedBankData: Banco | undefined;
    formData: FormDataValues;
    onFormDataChange: (data: FormDataValues) => void;
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
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<ErrorField[]>([]);

    // Mapeamento de cnab para tipoCnabId
    const cnabToTipoCnabId: { [key: string]: number } = {
        '240': 1,
        '400': 2,
        '444': 3,
    };

    // Função para atualizar os campos do formulário
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        section: keyof FormDataValues,
        subSection?: keyof FormDataValues['responsavel'] | keyof FormDataValues['banco']['gerente'] | 'gerente'
    ) => {
        const { name, value } = e.target;
        if (section === 'emitente') {
            onFormDataChange({
                ...formData,
                emitente: {
                    ...formData.emitente,
                    [name]: value,
                },
            });
        } else if (section === 'responsavel') {
            onFormDataChange({
                ...formData,
                responsavel: {
                    ...formData.responsavel,
                    [name]: value,
                },
            });
        } else if (section === 'banco') {
            if (subSection === 'gerente') {
                onFormDataChange({
                    ...formData,
                    banco: {
                        ...formData.banco,
                        gerente: {
                            ...formData.banco.gerente,
                            [name]: value,
                        },
                    },
                });
            } else {
                onFormDataChange({
                    ...formData,
                    banco: {
                        ...formData.banco,
                        [name]: value,
                    },
                });
            }
        }
    };

    // Função para atualizar o campo CNAB
    const handleCnabChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFormDataChange({
            ...formData,
            banco: {
                ...formData.banco,
                cnab: e.target.value,
            },
        });
    };

    // Função de validação básica
    const isFormValid = () => {
        return (
            formData.emitente.cnpj.trim() !== '' &&
            formData.emitente.razaoSocial.trim() !== '' &&
            formData.responsavel.nome.trim() !== '' &&
            formData.responsavel.cargo.trim() !== '' &&
            formData.responsavel.telefone.trim() !== '' &&
            formData.responsavel.email.trim() !== '' &&
            formData.banco.agencia.trim() !== '' &&
            formData.banco.agenciaDV.trim() !== '' &&
            formData.banco.conta !== null &&
            formData.banco.contaDV !== null &&
            formData.banco.convenio.trim() !== '' &&
            formData.banco.cnab.trim() !== '' &&
            formData.banco.gerente.nome.trim() !== '' &&
            formData.banco.gerente.telefone.trim() !== '' &&
            formData.banco.gerente.email.trim() !== '' &&
            errors.length === 0
        );
    };

    // Função para criar a carta
    const handleCreateCarta = async () => {
        if (!isFormValid() || !selectedBankData) {
            toast.error('Por favor, corrija os erros nos campos e preencha todos os dados obrigatórios.');
            return;
        }

        setLoading(true);
        try {
            const dataToSend = {
                emitente: formData.emitente,
                responsavel: formData.responsavel,
                banco: {
                    bancoId: selectedBankData.BancoId,
                    agencia: formData.banco.agencia,
                    agenciaDV: formData.banco.agenciaDV,
                    conta: Number(formData.banco.conta), // Garante que seja número
                    contaDV: Number(formData.banco.contaDV), // Garante que seja número
                    convenio: formData.banco.convenio,
                    tipoCnabId: cnabToTipoCnabId[formData.banco.cnab] || 1,
                    gerente: formData.banco.gerente,
                },
            };

            await createCarta(dataToSend);
            toast.success('Carta criada com sucesso!');
            onNext();
        } catch (error: CustomError | any) { // Usa CustomError como tipo possível
            console.error('Erro ao criar carta:', error);
            // Verifica se o erro contém os dados retornados pela API
            if (error instanceof Error && 'campos' in error && Array.isArray(error.campos)) {
                setErrors(error.campos); // Atualiza os erros diretamente do objeto de erro
                console.log('Erros capturados:', error.campos);
                error.campos.forEach((err: ErrorField) => {
                    toast.error(`${err.mensagem} (Campo: ${err.campo})`);
                });
            } else {
                toast.error(error.message || 'Erro ao criar carta. Tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (typeof isValid === 'function') {
            isValid(isFormValid());
        }
    }, [formData, isValid, errors]);

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
                                value={formData.emitente.cnpj}
                                onChange={(e) => handleInputChange(e, 'emitente')}
                                placeholder="Inserir número do CNPJ"
                                className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-[#0d7ac9]/20 focus:border-[#0d7ac9] transition-all duration-300 ${
                                    errors.find((err) => err.campo === 'emitente.cnpj') ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.find((err) => err.campo === 'emitente.cnpj') && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.find((err) => err.campo === 'emitente.cnpj')?.mensagem}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Razão Social</label>
                            <input
                                type="text"
                                name="razaoSocial"
                                value={formData.emitente.razaoSocial}
                                onChange={(e) => handleInputChange(e, 'emitente')}
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
                                name="nome"
                                value={formData.responsavel.nome}
                                onChange={(e) => handleInputChange(e, 'responsavel')}
                                placeholder="Inserir o nome do Responsável pela Empresa"
                                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#0d7ac9]/20 focus:border-[#0d7ac9] transition-all duration-300"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Cargo</label>
                            <input
                                type="text"
                                name="cargo"
                                value={formData.responsavel.cargo}
                                onChange={(e) => handleInputChange(e, 'responsavel')}
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
                                name="telefone"
                                value={formData.responsavel.telefone}
                                onChange={(e) => handleInputChange(e, 'responsavel')}
                                placeholder="Inserir telefone do Responsável pela Empresa (ex: 99 99999-9999)"
                                className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-[#0d7ac9]/20 focus:border-[#0d7ac9] transition-all duration-300 ${
                                    errors.find((err) => err.campo === 'responsavel.telefone') ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.find((err) => err.campo === 'responsavel.telefone') && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.find((err) => err.campo === 'responsavel.telefone')?.mensagem}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">E-mail</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.responsavel.email}
                                onChange={(e) => handleInputChange(e, 'responsavel')}
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
                                type="number"
                                name="agencia"
                                value={formData.banco.agencia}
                                onChange={(e) => handleInputChange(e, 'banco')}
                                placeholder="Inserir número da Agência"
                                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#0d7ac9]/20 focus:border-[#0d7ac9] transition-all duration-300"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">DV</label>
                            <input
                                type="number"
                                name="agenciaDV"
                                value={formData.banco.agenciaDV}
                                onChange={(e) => handleInputChange(e, 'banco')}
                                placeholder="DV"
                                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#0d7ac9]/20 focus:border-[#0d7ac9] transition-all duration-300"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-6 gap-4 mb-6">
                        <div className="col-span-5">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Conta</label>
                            <input
                                type="number"
                                name="conta"
                                value={formData.banco.conta}
                                onChange={(e) => handleInputChange(e, 'banco')}
                                placeholder="Inserir número da Conta"
                                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#0d7ac9]/20 focus:border-[#0d7ac9] transition-all duration-300"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">DV</label>
                            <input
                                type="number"
                                name="contaDV"
                                value={formData.banco.contaDV}
                                onChange={(e) => handleInputChange(e, 'banco')}
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
                                value={formData.banco.convenio}
                                onChange={(e) => handleInputChange(e, 'banco')}
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
                                        checked={formData.banco.cnab === '240'}
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
                                        checked={formData.banco.cnab === '400'}
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
                                        checked={formData.banco.cnab === '444'}
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
                                name="nome"
                                value={formData.banco.gerente.nome}
                                onChange={(e) => handleInputChange(e, 'banco', 'gerente')}
                                placeholder="Inserir o nome do Gerente de Conta"
                                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#0d7ac9]/20 focus:border-[#0d7ac9] transition-all duration-300"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Telefone</label>
                            <input
                                type="text"
                                name="telefone"
                                value={formData.banco.gerente.telefone}
                                onChange={(e) => handleInputChange(e, 'banco', 'gerente')}
                                placeholder="Inserir o número de telefone do Gerente de Conta (ex: 99 99999-9999)"
                                className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-[#0d7ac9]/20 focus:border-[#0d7ac9] transition-all duration-300 ${
                                    errors.find((err) => err.campo === 'banco.gerente.telefone') ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.find((err) => err.campo === 'banco.gerente.telefone') && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.find((err) => err.campo === 'banco.gerente.telefone')?.mensagem}
                                </p>
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">E-mail</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.banco.gerente.email}
                            onChange={(e) => handleInputChange(e, 'banco', 'gerente')}
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
                        selectedBankData && isFormValid() && !loading
                            ? 'bg-gradient-to-r from-[#0d7ac9] to-[#0a6ab0] hover:from-[#0a6ab0] hover:to-[#0d7ac9] text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    onClick={handleCreateCarta}
                    disabled={!selectedBankData || !isFormValid() || loading}
                >
                    {loading ? 'Enviando...' : 'Criar Carta'} <ChevronRightIcon className="w-5 h-5 ml-2" />
                </button>
            </div>
        </div>
    );
};

export default DataFormStep;