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
    if (typeof type !== 'string' || (type !== 'income' && type !== 'expense')) {
        return 'O tipo de transação deve ser "income" ou "expense"!';
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
    db.query(query, [description.trim(), amount, type.trim(), date], (err, result) => {
        if (err) {
            console.error('❌ Erro ao adicionar transação:', err);
            return res.status(500).json({ error: 'Erro interno ao adicionar transação.' });
        }
        console.log("✅ Transação adicionada com sucesso! ID:", result.insertId);
        res.json({ message: '✅ Transação adicionada com sucesso!', id: result.insertId });
    });
};

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

const getTransactionsByPeriod = (req, res) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Os parâmetros startDate e endDate são obrigatórios!' });
    }

    console.debug(`📅 Buscando transações de ${startDate} até ${endDate}`);

    const query = 'SELECT * FROM transactions WHERE date BETWEEN ? AND ? ORDER BY date DESC';
    db.query(query, [startDate, endDate], (err, results) => {
        if (err) {
            console.error('❌ Erro ao buscar transações:', err);
            return res.status(500).json({ error: 'Erro interno ao buscar transações.' });
        }
        console.log(`✅ ${results.length} transações encontradas.`);
        res.json(results);
    });
};

router.post('/', addTransaction);
router.get('/:id', getTransactionById);
router.get('/', getTransactionsByPeriod); 

module.exports = router;
