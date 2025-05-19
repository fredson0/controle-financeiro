import React, { useState, useEffect } from 'react';
import api from '../services/api';

const UserProfile = ({ onUserSelected }) => {
    const [profiles, setProfiles] = useState([]); // Lista de perfis existentes
    const [newProfile, setNewProfile] = useState(''); // Nome do novo perfil
    const [email, setEmail] = useState(''); // E-mail do novo perfil
    const [password, setPassword] = useState(''); // Senha do novo perfil
    const [feedback, setFeedback] = useState(null); // Feedback para erros ou sucesso

    useEffect(() => {
        // Carregar perfis existentes do backend
        api.get('/users')
            .then((response) => setProfiles(response.data))
            .catch((error) => {
                console.error('Erro ao carregar perfis:', error);
                setFeedback('Erro ao carregar perfis.');
            });
    }, []);

    const handleCreateProfile = () => {
        if (!newProfile.trim() || !email.trim() || !password.trim()) {
            setFeedback('Por favor, preencha todos os campos.');
            return;
        }

        api.post('/users/register', { name: newProfile, email, password })
            .then((response) => {
                // Verifica se o perfil já existe na lista
                const isDuplicate = profiles.some(profile => profile.id === response.data.id);
                if (!isDuplicate) {
                    setProfiles([...profiles, response.data]); // Atualiza a lista de perfis
                }
                setNewProfile(''); // Limpa o campo de entrada
                setEmail(''); // Limpa o campo de e-mail
                setPassword(''); // Limpa o campo de senha
                setFeedback('Perfil criado com sucesso!');
                onUserSelected(response.data.id); // Seleciona o novo perfil
            })
            .catch((error) => {
                console.error('Erro ao criar perfil:', error);
                setFeedback('Erro ao criar o perfil.');
            });
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center text-success">Selecione ou Crie um Perfil</h2>

            {/* Feedback de erro ou sucesso */}
            {feedback && (
                <div className={`alert ${feedback.includes('Erro') ? 'alert-danger' : 'alert-success'} mt-3`}>
                    {feedback}
                </div>
            )}

            {/* Lista de perfis existentes */}
            <ul className="list-group mb-3">
                {profiles.map((profile) => (
                    <li key={profile.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>{profile.name}</span>
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                                onUserSelected(profile.id);
                                localStorage.setItem('user_id', profile.id); // Salva o ID no localStorage
                            }}
                        >
                            Selecionar
                        </button>
                    </li>
                ))}
            </ul>

            {/* Campo para criar novo perfil */}
            <div className="input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Nome do perfil"
                    value={newProfile}
                    onChange={(e) => setNewProfile(e.target.value)}
                />
            </div>
            <div className="input-group mb-3">
                <input
                    type="email"
                    className="form-control"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="input-group mb-3">
                <input
                    type="password"
                    className="form-control"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button className="btn btn-success" onClick={handleCreateProfile}>
                Criar Perfil
            </button>
        </div>
    );
};

export default UserProfile;