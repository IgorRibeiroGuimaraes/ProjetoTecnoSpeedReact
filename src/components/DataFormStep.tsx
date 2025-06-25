import React, { useEffect, useState } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { createCarta, CustomError } from '../services/api';
import { toast } from 'react-toastify';
import { IMaskInput } from 'react-imask';

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
    responsavelTecnoSpeed: {
        respTecno: string;
        emailTecno: string;
    };
    banco: {
        agencia: string;
        agenciaDV: string;
        conta: number;
        contaDV: number;
        cidadebanco: string;
        ufBanco: string;
        convenio: string;
        cnab: string;
        gerente: {
            nome: string;
            telefone: string;
            email: string;
        };
        preferenciaContato: string;
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
    selectedProduct: string;
    setCartaId: (id: number) => void;
}

const DataFormStep: React.FC<DataFormStepProps> = ({
    selectedBankData,
    formData,
    onFormDataChange,
    onPrev,
    onNext,
    isValid,
    selectedProduct,
    setCartaId,
}) => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<ErrorField[]>([]);

    // Regex para validar Razão Social
    const razaoSocialRegex = /^[A-Za-zÀ-ÿ0-9\s,.()\-&]*$/;
    // Regex para validar nome (apenas letras e espaços)
    const nameRegex = /^[A-Za-z\s]{2,}$/;
    // Regex para validar e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const cnabToTipoCnabId: { [key: string]: number } = {
        '240': 1,
        '400': 2,
        '444': 3,
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        section: keyof FormDataValues,
        subSection?: keyof FormDataValues['responsavel'] | keyof FormDataValues['banco']['gerente'] | 'gerente' | 'preferenciaContato'
    ) => {
        const { name, value } = e.target;

        // Limpar erro relacionado ao campo alterado
        setErrors((prevErrors) =>
            prevErrors.filter((err) => {
                if (section === 'emitente') {
                    return err.campo !== `emitente.${name}`;
                } else if (section === 'responsavel') {
                    return err.campo !== `responsavel.${name}`;
                } else if (section === 'banco') {
                    if (subSection === 'gerente') {
                        return err.campo !== `banco.gerente.${name}`;
                    }
                    return err.campo !== `banco.${name}`;
                }
                return true;
            })
        );

        // Validação para Razão Social
        if (section === 'emitente' && name === 'razaoSocial') {
            if (!razaoSocialRegex.test(value)) {
                return;
            }
        }

        // Validação para e-mail do responsável
        if (section === 'responsavel' && name === 'email') {
            if (value && !emailRegex.test(value)) {
                setErrors((prevErrors) => [
                    ...prevErrors,
                    { campo: 'responsavel.email', mensagem: 'E-mail inválido' },
                ]);
            }
        }

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
            } else if (subSection === 'preferenciaContato') {
                // Se for preferenciaContato, atualizar diretamente
                onFormDataChange({
                    ...formData,
                    banco: {
                        ...formData.banco,
                        preferenciaContato: value,
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

    // Manipulador para mudanças nos campos responsavelTecnoSpeed
    const handleResponsavelTecnoSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Limpar erro relacionado ao campo alterado
        setErrors((prevErrors) => prevErrors.filter((err) => err.campo !== `responsavelTecnoSpeed.${name}`));

        // Atualizar o estado independentemente da validação
        onFormDataChange({
            ...formData,
            responsavelTecnoSpeed: {
                ...formData.responsavelTecnoSpeed,
                [name]: value,
            },
        });

        // Validar apenas para exibir erros, sem bloquear a entrada
        if (name === 'respTecno' && value && !nameRegex.test(value)) {
            setErrors((prevErrors) => [
                ...prevErrors,
                { campo: 'responsavelTecnoSpeed.respTecno', mensagem: 'Nome deve conter apenas letras e espaços (mínimo 2 caracteres)' },
            ]);
        } else if (name === 'emailTecno' && value && !emailRegex.test(value)) {
            setErrors((prevErrors) => [
                ...prevErrors,
                { campo: 'responsavelTecnoSpeed.emailTecno', mensagem: 'E-mail inválido' },
            ]);
        }
    };

    // Função para bloquear caracteres inválidos em tempo real
    const handleRazaoSocialKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const char = e.key;
        if (!razaoSocialRegex.test(char)) {
            e.preventDefault();
        }
    };

    const handleCnabChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setErrors((prevErrors) => prevErrors.filter((err) => err.campo !== 'banco.cnab'));

        onFormDataChange({
            ...formData,
            banco: {
                ...formData.banco,
                cnab: e.target.value,
            },
        });
    };

    const handleMaskChange = (
        value: string,
        section: keyof FormDataValues,
        field: string,
        subSection?: 'gerente'
    ) => {
        setErrors((prevErrors) =>
            prevErrors.filter((err) => {
                if (section === 'emitente') {
                    return err.campo !== `emitente.${field}`;
                } else if (section === 'responsavel') {
                    return err.campo !== `responsavel.${field}`;
                } else if (section === 'banco' && subSection === 'gerente') {
                    return err.campo !== `banco.gerente.${field}`;
                }
                return true;
            })
        );

        if (section === 'emitente') {
            onFormDataChange({
                ...formData,
                emitente: {
                    ...formData.emitente,
                    [field]: value,
                },
            });
        } else if (section === 'responsavel') {
            onFormDataChange({
                ...formData,
                responsavel: {
                    ...formData.responsavel,
                    [field]: value,
                },
            });
        } else if (section === 'banco' && subSection === 'gerente') {
            onFormDataChange({
                ...formData,
                banco: {
                    ...formData.banco,
                    gerente: {
                        ...formData.banco.gerente,
                        [field]: value,
                    },
                },
            });
        }
    };

    const isFormValid = () => {
        return (
            formData.emitente.cnpj.trim() !== '' &&
            formData.emitente.razaoSocial.trim() !== '' &&
            razaoSocialRegex.test(formData.emitente.razaoSocial) &&
            formData.responsavel.nome.trim() !== '' &&
            nameRegex.test(formData.responsavel.nome) &&
            formData.responsavel.cargo.trim() !== '' &&
            formData.responsavel.telefone.trim() !== '' &&
            formData.responsavel.email.trim() !== '' &&
            emailRegex.test(formData.responsavel.email) &&
            formData.responsavelTecnoSpeed.respTecno.trim() !== '' &&
            nameRegex.test(formData.responsavelTecnoSpeed.respTecno) &&
            formData.responsavelTecnoSpeed.emailTecno.trim() !== '' &&
            emailRegex.test(formData.responsavelTecnoSpeed.emailTecno) &&
            formData.banco.agencia.trim() !== '' &&
            formData.banco.agenciaDV.trim() !== '' &&
            formData.banco.conta !== null &&
            formData.banco.contaDV !== null &&
            formData.banco.cidadebanco.trim() !== '' &&
            formData.banco.ufBanco.trim() !== '' &&
            formData.banco.convenio.trim() !== '' &&
            formData.banco.cnab.trim() !== '' &&
            formData.banco.gerente.nome.trim() !== '' &&
            nameRegex.test(formData.banco.gerente.nome) &&
            formData.banco.gerente.telefone.trim() !== '' &&
            formData.banco.gerente.email.trim() !== '' &&
            formData.banco.preferenciaContato.trim() !== '' &&
            emailRegex.test(formData.banco.gerente.email) &&
            errors.length === 0
        );
    };

    const handleCreateCarta = async () => {
        if (!isFormValid() || !selectedBankData) {
            toast.error(
                errors.length > 0
                    ? 'Por favor, corrija os erros nos campos indicados.'
                    : 'Por favor, preencha todos os dados obrigatórios corretamente.'
            );
            return;
        }

        setLoading(true);
        try {
            const dataToSend = {
                emitente: formData.emitente,
                responsavel: formData.responsavel,
                responsavelTecnoSpeed: formData.responsavelTecnoSpeed,
                banco: {
                    bancoId: selectedBankData.BancoId,
                    agencia: formData.banco.agencia,
                    agenciaDV: formData.banco.agenciaDV,
                    conta: Number(formData.banco.conta),
                    contaDV: Number(formData.banco.contaDV),
                    cidadebanco: formData.banco.cidadebanco,
                    ufBanco: formData.banco.ufBanco,
                    convenio: formData.banco.convenio,
                    tipoCnabId: cnabToTipoCnabId[formData.banco.cnab] || 1,
                    gerente: formData.banco.gerente,
                    preferenciaContato: formData.banco.preferenciaContato,
                },
                produtoId: selectedProduct,
            };

            const response = await createCarta(dataToSend);

            setCartaId(response.id);

            toast.success('Carta criada com sucesso!');
            onNext();
        } catch (error: CustomError | any) {
            console.error('Erro ao criar carta:', error);
            if (error instanceof Error && 'campos' in error && Array.isArray(error.campos)) {
                setErrors(error.campos);
                error.campos.forEach((err: ErrorField) => {
                    toast.error(`${err.mensagem} (Campo: ${err.campo})`);
                });
            } else {
                toast.error(error.message + error || 'Erro ao criar carta. Tente novamente.');
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
                            <IMaskInput
                                mask="00.000.000/0000-00"
                                value={formData.emitente.cnpj}
                                onAccept={(value) => handleMaskChange(value, 'emitente', 'cnpj')}
                                placeholder="99.999.999/9999-99"
                                className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-[#0d7ac9]/20 focus:border-[#0d7ac9] transition-all duration-300 ${errors.find((err) => err.campo === 'emitente.cnpj') ? 'border-red-500' : 'border-gray-300'
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
                                onKeyPress={handleRazaoSocialKeyPress}
                                placeholder="Inserir a Razão Social"
                                maxLength={150}
                                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#0d7ac9]/20 focus:border-[#0d7ac9] transition-all duration-300"
                            />
                        </div>
                    </div>
                </div>

                {/* Dados do Responsável TecnoSpeed */}
                <div className="bg-gray-50 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                        <div className="w-1 h-6 bg-[#0d7ac9] rounded-full mr-3"></div>
                        RESPONSÁVEL TECNOSPEED
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Nome</label>
                            <input
                                type="text"
                                name="respTecno"
                                value={formData.responsavelTecnoSpeed.respTecno}
                                onChange={handleResponsavelTecnoSpeedChange}
                                placeholder="Inserir o nome do Responsável TecnoSpeed"
                                className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-[#0d7ac9]/20 focus:border-[#0d7ac9] transition-all duration-300 ${errors.find((err) => err.campo === 'responsavelTecnoSpeed.respTecno') ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.find((err) => err.campo === 'responsavelTecnoSpeed.respTecno') && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.find((err) => err.campo === 'responsavelTecnoSpeed.respTecno')?.mensagem}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">E-mail</label>
                            <input
                                type="email"
                                name="emailTecno"
                                value={formData.responsavelTecnoSpeed.emailTecno}
                                onChange={handleResponsavelTecnoSpeedChange}
                                placeholder="Inserir e-mail do Responsável TecnoSpeed"
                                className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-[#0d7ac9]/20 focus:border-[#0d7ac9] transition-all duration-300 ${errors.find((err) => err.campo === 'responsavelTecnoSpeed.emailTecno') ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.find((err) => err.campo === 'responsavelTecnoSpeed.emailTecno') && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.find((err) => err.campo === 'responsavelTecnoSpeed.emailTecno')?.mensagem}
                                </p>
                            )}
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
                            <IMaskInput
                                mask={[
                                    { mask: '(00) 0000-0000' },
                                    { mask: '(00) 00000-0000' },
                                ]}
                                value={formData.responsavel.telefone}
                                onAccept={(value) => handleMaskChange(value, 'responsavel', 'telefone')}
                                placeholder="(99) 99999-9999"
                                className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-[#0d7ac9]/20 focus:border-[#0d7ac9] transition-all duration-300 ${errors.find((err) => err.campo === 'responsavel.telefone') ? 'border-red-500' : 'border-gray-300'
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
                                className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-[#0d7ac9]/20 focus:border-[#0d7ac9] transition-all duration-300 ${errors.find((err) => err.campo === 'responsavel.email') ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.find((err) => err.campo === 'responsavel.email') && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.find((err) => err.campo === 'responsavel.email')?.mensagem}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Preferência de Contato */}
                <div className="bg-gray-50 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                        <div className="w-1 h-6 bg-[#0d7ac9] rounded-full mr-3"></div>
                        PREFERÊNCIA DE CONTATO
                    </h2>
                    <p className="text-gray-600 text-sm mb-4">
                        Este contato será utilizado apenas caso haja problemas ou atrasos no processo de liberação do relacionamento.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="email"
                                name="preferenciaContato"
                                value="E-mail"
                                checked={formData.banco.preferenciaContato === 'E-mail'}
                                onChange={(e) => handleInputChange(e, 'banco', 'preferenciaContato')}
                                className="mr-3 w-4 h-4 text-[#0d7ac9] focus:ring-[#0d7ac9]"
                            />
                            <label htmlFor="email" className="text-sm font-medium">E-mail</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="telefone"
                                name="preferenciaContato"
                                value="Telefone"
                                checked={formData.banco.preferenciaContato === 'Telefone'}
                                onChange={(e) => handleInputChange(e, 'banco', 'preferenciaContato')}
                                className="mr-3 w-4 h-4 text-[#0d7ac9] focus:ring-[#0d7ac9]"
                            />
                            <label htmlFor="telefone" className="text-sm font-medium">Telefone</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="whatsapp"
                                name="preferenciaContato"
                                value="WhatsApp"
                                checked={formData.banco.preferenciaContato === 'WhatsApp'}
                                onChange={(e) => handleInputChange(e, 'banco', 'preferenciaContato')}
                                className="mr-3 w-4 h-4 text-[#0d7ac9] focus:ring-[#0d7ac9]"
                            />
                            <label htmlFor="whatsapp" className="text-sm font-medium">WhatsApp</label>
                        </div>
                        <div>
                            <input
                                type="text"
                                name="preferenciaContato"
                                value={formData.banco.preferenciaContato === 'Outro' ? formData.banco.preferenciaContato : ''}
                                onChange={(e) => handleInputChange(e, 'banco', 'preferenciaContato')}
                                placeholder="Outro"
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Cidade</label>
                            <input
                                type="text"
                                name="cidadebanco"
                                value={formData.banco.cidadebanco}
                                onChange={(e) => handleInputChange(e, 'banco')}
                                placeholder="Inserir a cidade do Banco"
                                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#0d7ac9]/20 focus:border-[#0d7ac9] transition-all duration-300"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">UF</label>
                            <input
                                type="text"
                                name="ufBanco"
                                value={formData.banco.ufBanco}
                                onChange={(e) => handleInputChange(e, 'banco')}
                                maxLength={2}
                                placeholder="Inserir a UF do Banco"
                                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#0d7ac9]/20 focus:border-[#0d7ac9] transition-all duration-300"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Convênio</label>
                            <input
                                type="number"
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
                                {['240', '400', '444'].map((cnabValue) => {
                                    const isCnabAvailable = selectedBankData?.Cnab.some((cnab) => cnab.Tipo === cnabValue);
                                    return (
                                        <div className="flex items-center" key={cnabValue}>
                                            <input
                                                type="radio"
                                                id={`cnab${cnabValue}`}
                                                name="cnab"
                                                value={cnabValue}
                                                checked={formData.banco.cnab === cnabValue}
                                                onChange={handleCnabChange}
                                                className="mr-3 w-4 h-4 text-[#0d7ac9] focus:ring-[#0d7ac9]"
                                                disabled={!isCnabAvailable}
                                            />
                                            <label htmlFor={`cnab${cnabValue}`} className="text-sm font-medium">
                                                {cnabValue}
                                            </label>
                                        </div>
                                    );
                                })}
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
                            <IMaskInput
                                mask={[
                                    { mask: '(00) 0000-0000' },
                                    { mask: '(00) 00000-0000' },
                                ]}
                                value={formData.banco.gerente.telefone}
                                onAccept={(value) => handleMaskChange(value, 'banco', 'telefone', 'gerente')}
                                placeholder="(99) 99999-9999"
                                className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-[#0d7ac9]/20 focus:border-[#0d7ac9] transition-all duration-300 ${errors.find((err) => err.campo === 'banco.gerente.telefone') ? 'border-red-500' : 'border-gray-300'
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
                            className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-[#0d7ac9]/20 focus:border-[#0d7ac9] transition-all duration-300 ${errors.find((err) => err.campo === 'banco.gerente.email') ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.find((err) => err.campo === 'banco.gerente.email') && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.find((err) => err.campo === 'banco.gerente.email')?.mensagem}
                            </p>
                        )}
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
                    className={`cursor-pointer px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center ${selectedBankData && isFormValid() && !loading
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