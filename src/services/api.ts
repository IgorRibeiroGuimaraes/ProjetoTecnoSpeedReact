const API_URL = import.meta.env.VITE_API_URL;

// Definição da interface para o erro personalizado
interface CustomError extends Error {
    campos?: { campo: string; mensagem: string }[]; // Alinha com a estrutura de ErrorField
}

export async function login(cnpj: string, senha: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cnpj, senha }),
        credentials: 'include',
    });

    if (!response.ok) {
        const errorData = await response.json(); // <-- Pega a mensagem de erro do servidor
        const message = 'Erro ao autenticar. Verifique suas credenciais.';
        throw new Error(message);
    }

    return response.json();
}

export async function checkAuth() {
    const response = await fetch(`${API_URL}/auth/protected`, {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        if (response.status === 401) {
            return { isAuthenticated: false, user: null };
        }
        let message = 'Erro ao verificar autenticação.';
        try {
            const errorData = await response.json();
            message = errorData.message || message;
        } catch {
            // Ignora se não conseguir parsear JSON
        }
        throw new Error(message);
    }

    const data = await response.json();
    return {
        isAuthenticated: data.mensagem === 'Você está autenticado!' ? true : false,
        user: null,
    };
}

export async function logout() {
    const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include', // Inclui cookies na requisição
    });
    if (!response.ok) {
        const errorData = await response.json();
        const message = 'Erro ao deslogar. Tente novamente.';
        throw new Error(message);
    }
    return response.json();
}

export async function fetchBanco(endpoint: string): Promise<any> {
    try {
        const response = await fetch(`${API_URL}/bancos-configuracoes`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

export async function createCarta(data: {
    emitente: { cnpj: string; razaoSocial: string };
    responsavel: { nome: string; cargo: string; telefone: string; email: string };
    banco: {
        bancoId: number;
        agencia: string;
        agenciaDV: string;
        conta: number;
        contaDV: number;
        convenio: string;
        tipoCnabId: number;
        gerente: { nome: string; telefone: string; email: string };
    };
}): Promise<any> {
    console.log('Creating Carta with data:', data);
    try {
        const response = await fetch(`${API_URL}/carta-van`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            credentials: 'include',
        });

        console.log('Status da resposta:', response.status);
        if (!response.ok) {
            const errorData = await response.json();
            console.log('Erro do backend:', errorData);
            const error = new Error(errorData.message || 'Erro ao criar carta.') as CustomError;
            error.campos = errorData.campos; // Adiciona os campos de erro ao objeto de erro
            throw error;
        }

        return await response.json();
    } catch (error) {
        console.error('Create Carta error:', error);
        throw error;
    }
}