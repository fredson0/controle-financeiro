const express = require('express');
const db = require('../config/db');

const router = express.Router();

// Rota para adicionar uma nova transação
router.post('/transactions', (req, res) => {
    const { description, amount, type, date } = req.body;

    if (!description || !amount || !type || !date) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
    }

    const query = 'INSERT INTO transactions (description, amount, type, date) VALUES (?, ?, ?, ?)';
    db.query(query, [description, amount, type, date], (err, result) => {
        if (err) {
            console.error('❌ Erro ao adicionar transação:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: '✅ Transação adicionada com sucesso!', id: result.insertId });
    });
});

module.exports = router;