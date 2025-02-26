const express = require('express');
const db = require('../config/db');

const router = express.Router();

// 📌 Função para validar transação antes de inserir no banco
const validateTransaction = (description, amount, type, date) => {
    if (!description || !amount || !type || !date) {
        return 'Todos os campos são obrigatórios!';
    }
    if (isNaN(amount) || amount <= 0) {
        return 'O valor da transação deve ser um número positivo!';
    }
    return null;
};

// 📌 Adicionar uma nova transação
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

// 📌 Buscar transação por ID
const getTransactionById = (req, res) => {
    const { id } = req.params;
    console.debug(`🔍 Buscando transação com ID: ${id}`);

    const query = 'SELECT * FROM transactions WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('❌ Erro ao buscar transação:', err);
            return res.status(500).json({ error: 'Erro interno ao buscar transação.' });
        }
        if (result.length === 0) {
            console.warn(`⚠️ Nenhuma transação encontrada com ID: ${id}`);
            return res.status(404).json({ error: 'Transação não encontrada!' });
        }
        console.log("✅ Transação encontrada:", result[0]);
        res.json(result[0]);
    });
};

// 🛠 Definição das rotas
router.post('/', addTransaction);
router.get('/:id', getTransactionById);

module.exports = router;
