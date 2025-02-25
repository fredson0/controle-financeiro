const express = require('express');
const db = require('../config/db');

const router = express.Router();

const validateTransaction = (description, amount, type, date) => {
    if (!description || !amount || !type || !date) {
        return 'Todos os campos são obrigatórios!';
    }
    if (isNaN(amount) || amount <= 0) {
        return 'O valor da transação deve ser um número positivo!';
    }
    return null;
};

const addTransaction = (req, res) => {
    console.debug("📩 Requisição recebida em /transactions");
    console.debug("📦 Dados recebidos:", req.body);

    const { description, amount, type, date } = req.body;
    
    const validationError = validateTransaction(description, amount, type, date);
    if (validationError) {
        console.warn("❌ Erro na validação:", validationError);
        return res.status(400).json({ error: validationError });
    }

    const query = 'INSERT INTO transactions (description, amount, type, date) VALUES (?, ?, ?, ?)';
    db.query(query, [description, amount, type, date], (err, result) => {
        if (err) {
            console.error('❌ Erro ao adicionar transação:', err);
            return res.status(500).json({ error: 'Erro interno ao adicionar transação.' });
        }
        console.log("✅ Transação adicionada com sucesso! ID:", result.insertId);
        res.json({ message: '✅ Transação adicionada com sucesso!', id: result.insertId });
    });
};

router.post('/', addTransaction);

module.exports = router;
