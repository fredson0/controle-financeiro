const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/authenticateToken'); // Middleware de autenticação
const router = express.Router();
const db = require('../config/db');

const SECRET_KEY = 'sophia2907'; // Substitua por uma chave segura

// Rota para buscar todos os usuários (GET /users)
router.get('/', authenticateToken, (req, res) => {
    db.query('SELECT id, name, email FROM users', (err, results) => {
        if (err) {
            console.error('❌ Erro ao buscar usuários:', err);
            return res.status(500).json({ error: 'Erro interno ao buscar usuários.' });
        }
        res.json(results);
    });
});

// Rota para buscar um usuário específico pelo ID (GET /users/:id)
router.get('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    // Verifica se o usuário autenticado está tentando acessar os próprios dados
    if (req.user.id !== parseInt(id)) {
        return res.status(403).json({ error: 'Acesso negado!' });
    }

    db.query('SELECT id, name, email FROM users WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('❌ Erro ao buscar usuário:', err);
            return res.status(500).json({ error: 'Erro interno ao buscar usuário.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado!' });
        }

        res.json(results[0]);
    });
});

// Rota para registrar um novo usuário com e-mail e senha (POST /users/register)
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios!' });
    }

    // Verifica se o e-mail já está registrado
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            console.error('❌ Erro ao verificar e-mail:', err);
            return res.status(500).json({ error: 'Erro interno ao verificar e-mail.' });
        }

        if (results.length > 0) {
            return res.status(400).json({ error: 'E-mail já registrado!' });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10); // Criptografa a senha
            db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword], (err, result) => {
                if (err) {
                    console.error('❌ Erro ao registrar usuário:', err);
                    return res.status(500).json({ error: 'Erro interno ao registrar usuário.' });
                }

                // Gera um token JWT
                const token = jwt.sign({ id: result.insertId, name }, SECRET_KEY, { expiresIn: '1d' });

                // Retorna o token e os dados do usuário
                res.status(201).json({
                    message: '✅ Usuário registrado com sucesso!',
                    token,
                    user: { id: result.insertId, name, email }
                });
            });
        } catch (err) {
            console.error('❌ Erro ao criptografar senha:', err);
            res.status(500).json({ error: 'Erro interno ao registrar usuário.' });
        }
    });
});

// Rota para login de usuário (POST /users/login)
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'E-mail e senha são obrigatórios!' });
    }

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            console.error('❌ Erro ao buscar usuário:', err);
            return res.status(500).json({ error: 'Erro interno ao buscar usuário.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado!' });
        }

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Senha inválida!' });
        }

        // Gera um token JWT
        const token = jwt.sign({ id: user.id, name: user.name }, SECRET_KEY, { expiresIn: '1d' });
        res.json({
            message: '✅ Login realizado com sucesso!',
            token,
            user: { id: user.id, name: user.name, email: user.email }
        });
    });
});

// Rota para renovar o token (POST /users/refresh-token)
router.post('/refresh-token', authenticateToken, (req, res) => {
    const { id, name } = req.user;

    // Gera um novo token com o mesmo payload
    const newToken = jwt.sign({ id, name }, SECRET_KEY, { expiresIn: '1d' });

    res.json({ token: newToken });
});

// Rota para atualizar um usuário (PUT /users/:id)
router.put('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    // Verifica se o usuário autenticado está tentando atualizar os próprios dados
    if (req.user.id !== parseInt(id)) {
        return res.status(403).json({ error: 'Acesso negado!' });
    }

    if (!name || !email) {
        return res.status(400).json({ error: 'Nome e e-mail são obrigatórios!' });
    }

    db.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id], (err, result) => {
        if (err) {
            console.error('❌ Erro ao atualizar usuário:', err);
            return res.status(500).json({ error: 'Erro interno ao atualizar usuário.' });
        }
        res.json({ message: '✅ Usuário atualizado com sucesso!' });
    });
});

// Rota para excluir um usuário (DELETE /users/:id)
router.delete('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    // Verifica se o usuário autenticado está tentando excluir os próprios dados
    if (req.user.id !== parseInt(id)) {
        return res.status(403).json({ error: 'Acesso negado!' });
    }

    db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('❌ Erro ao excluir usuário:', err);
            return res.status(500).json({ error: 'Erro interno ao excluir usuário.' });
        }
        res.json({ message: '✅ Usuário excluído com sucesso!' });
    });
});

module.exports = router;