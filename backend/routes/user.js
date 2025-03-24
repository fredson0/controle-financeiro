const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../config/db');

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ error: 'Acesso negado! Token não fornecido.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido!' });
        }
        req.user = user;
        next();
    });
};

router.get('/', authenticateToken, (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('❌ Erro ao buscar usuários:', err);
            return res.status(500).json({ error: 'Erro interno ao buscar usuários.' });
        }
        res.json(results);
    });
});

router.get('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
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

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios!' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword], (err, result) => {
            if (err) {
                console.error('❌ Erro ao registrar usuário:', err);
                return res.status(500).json({ error: 'Erro interno ao registrar usuário.' });
            }
            res.status(201).json({ message: '✅ Usuário registrado com sucesso!', id: result.insertId });
        });
    } catch (err) {
        console.error('❌ Erro ao criptografar senha:', err);
        res.status(500).json({ error: 'Erro interno ao registrar usuário.' });
    }
});

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

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: '✅ Login realizado com sucesso!', token });
    });
});

router.put('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

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

router.delete('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('❌ Erro ao excluir usuário:', err);
            return res.status(500).json({ error: 'Erro interno ao excluir usuário.' });
        }
        res.json({ message: '✅ Usuário excluído com sucesso!' });
    });
});

module.exports = router;
