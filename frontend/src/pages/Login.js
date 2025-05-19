import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirecionamento
import api from '../services/api';

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [feedback, setFeedback] = useState(null);
    const navigate = useNavigate(); // Hook para redirecionamento

    const handleLogin = () => {
        // Validação de campos
        if (!email || !password) {
            setFeedback('Por favor, preencha todos os campos.');
            return;
        }

        console.log('Tentando fazer login com:', { email, password }); // Log para depuração

        api.post('/users/login', { email, password })
            .then((response) => {
                console.log('Resposta do backend:', response.data); // Log da resposta do backend
                const { token, user } = response.data;

                // Salva o token no localStorage
                localStorage.setItem('authToken', token);
                console.log('Token salvo no localStorage:', token); // Log do token salvo

                // Exibe mensagem de sucesso
                setFeedback(`Bem-vindo, ${user.name}!`);

                // Chama a função de sucesso
                if (onLoginSuccess) {
                    console.log('Chamando onLoginSuccess com ID do usuário:', user.id); // Log do ID do usuário
                    onLoginSuccess(user.id);
                }

                // Redireciona para a página inicial
                navigate('/home');
            })
            .catch((error) => {
                console.error('Erro ao fazer login:', error); // Log do erro
                if (error.response && error.response.data && error.response.data.error) {
                    setFeedback(`Erro: ${error.response.data.error}`);
                } else {
                    setFeedback('Erro ao fazer login. Verifique suas credenciais.');
                }
            });
    };

    const handleGoToRegister = () => {
        navigate('/register'); // Redireciona para a página de registro
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center">Login</h2>
            {feedback && (
                <div className={`alert ${feedback.includes('Erro') ? 'alert-danger' : 'alert-success'}`}>
                    {feedback}
                </div>
            )}
            <div className="form-group">
                <label>E-mail</label>
                <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Senha</label>
                <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button className="btn btn-primary" onClick={handleLogin}>
                Entrar
            </button>
            <button
                className="btn btn-link"
                onClick={handleGoToRegister}
                style={{ marginTop: '10px' }}
            >
                Não tem uma conta? Crie uma agora!
            </button>
        </div>
    );
};

export default Login;