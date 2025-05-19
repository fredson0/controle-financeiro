import axios from 'axios';

// Cria a instância do axios com a URL base do backend
const api = axios.create({
    baseURL: 'http://localhost:3001', // Certifique-se de que a URL do backend está correta
});

// Adiciona o token JWT no cabeçalho Authorization de todas as requisições
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken'); // Obtém o token do localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Adiciona o token ao cabeçalho
            console.log('Token JWT adicionado ao cabeçalho:', token); // Log para depuração
        }
        return config;
    },
    (error) => {
        console.error('Erro na configuração da requisição:', error);
        return Promise.reject(error);
    }
);

// Configura os interceptores para lidar com respostas e erros
api.interceptors.response.use(
    (response) => response, // Retorna a resposta se não houver erro
    async (error) => {
        // Verifica se o erro é de autenticação (403)
        if (error.response && error.response.status === 403) {
            const originalRequest = error.config;

            try {
                // Tenta renovar o token
                const refreshResponse = await axios.post(
                    'http://localhost:3001/users/refresh-token',
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                        },
                    }
                );

                const newToken = refreshResponse.data.token;
                localStorage.setItem('authToken', newToken); // Atualiza o token no localStorage
                originalRequest.headers.Authorization = `Bearer ${newToken}`; // Atualiza o token na requisição original

                return api(originalRequest); // Reenvia a requisição original com o novo token
            } catch (refreshError) {
                console.error('Erro ao renovar o token:', refreshError);
                alert('Sua sessão expirou. Faça login novamente.');
                localStorage.removeItem('authToken'); // Remove o token inválido
                window.location.href = '/login'; // Redireciona para a página de login
            }
        }

        // Trata erros de rede ou servidor offline
        if (!error.response) {
            console.error('Erro de rede ou servidor offline:', error);
            alert('Não foi possível conectar ao servidor. Verifique sua conexão.');
        }

        // Rejeita a promessa para tratar o erro em outros lugares
        return Promise.reject(error);
    }
);

export default api;