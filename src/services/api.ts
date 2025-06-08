const API_URL = import.meta.env.VITE_API_URL;

export async function fetchData(endpoint: string): Promise<any> {
    try {
        const response = await fetch(`${API_URL}/${endpoint}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

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
        throw new Error('Erro ao autenticar');
    }

    return response.json();
}