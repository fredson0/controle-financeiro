// filepath: c:\Users\freds\OneDrive\Documentos\projeto controle financeiro\frontend\src\pages\Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [feedback, setFeedback] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setFeedback(null);

        try {
            const response = await api.post('/users/register', formData);
            const { token } = response.data;

            // Salva o token no localStorage
            localStorage.setItem('authToken', token);

            alert('Conta criada com sucesso! Você será redirecionado para o login.');
            navigate('/login'); // Redireciona para a página de login
        } catch (err) {
            console.error('Erro ao criar conta:', err);
            setFeedback(err.response?.data?.error || 'Erro ao criar conta.');
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center">Criar Conta</h2>
            {feedback && <div className="alert alert-danger">{feedback}</div>}
            <form onSubmit={handleRegister}>
                <div className="form-group">
                    <label>Nome</label>
                    <input
                        type="text"
                        className="form-control"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>E-mail</label>
                    <input
                        type="email"
                        className="form-control"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>Senha</label>
                    <input
                        type="password"
                        className="form-control"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Criar Conta
                </button>
            </form>
        </div>
    );
};

export default Register;