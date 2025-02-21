const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('❌ Erro ao buscar usuários:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

router.post('/', (req, res) => {
    console.log("📩 Dados recebidos:", req.body);

    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: "Nome e e-mail são obrigatórios!" });
    }

    db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], (err, result) => {
        if (err) {
            console.error('❌ Erro ao inserir usuário:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: '✅ Usuário adicionado com sucesso!', id: result.insertId });
    });
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: "Nome e e-mail são obrigatórios!" });
    }

    db.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id], (err, result) => {
        if (err) {
            console.error('❌ Erro ao atualizar usuário:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: '✅ Usuário atualizado com sucesso!' });
    });
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('❌ Erro ao excluir usuário:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: '✅ Usuário excluído com sucesso!' });
    });
});

module.exports = router;