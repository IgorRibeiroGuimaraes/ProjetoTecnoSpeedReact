const API_URL = import.meta.env.VITE_API_URL;

export async function login(cnpj: string, senha: string) {

    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cnpj, senha }),
        credentials: 'include', // Inclui cookies na requisição
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
            // Usuário não autenticado, retorna estrutura esperada
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

    // Backend retorna { mensagem: 'Você está autenticado!' }
    const data = await response.json();
    // Mapeia a resposta para a estrutura esperada
    return {
        isAuthenticated: data.mensagem === 'Você está autenticado!' ? true : false,
        user: null, // Backend não retorna user, então deixamos como null
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