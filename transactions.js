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
    if (typeof type !== 'string' || !['income', 'expense'].includes(type.toLowerCase())) {
        return 'O tipo de transação deve ser "income" ou "expense"!';
    }
    if (isNaN(Date.parse(date))) {
        return 'A data informada é inválida!';
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
            console.error('❌ Erro ao adicionar transação:', err.sqlMessage);
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
            console.error('❌ Erro ao buscar transação:', err.sqlMessage);
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
            console.error('❌ Erro ao buscar transações:', err.sqlMessage);
            return res.status(500).json({ error: 'Erro interno ao buscar transações.' });
        }
        console.log(`✅ ${results.length} transações encontradas.`);
        res.json(results);
    });
};

const updateTransaction = (req, res) => {
    const { id } = req.params;
    const { description, amount, type, date } = req.body;

    console.debug(`✏️ Atualizando transação ID: ${id}`);
    console.debug("📦 Novos dados recebidos:", req.body);

    const validationError = validateTransaction(description, amount, type, date);
    if (validationError) {
        console.warn("❌ Erro na validação:", validationError);
        return res.status(400).json({ error: validationError });
    }

    const query = 'UPDATE transactions SET description = ?, amount = ?, type = ?, date = ? WHERE id = ?';
    db.query(query, [description.trim(), amount, type.trim(), date, id], (err, result) => {
        if (err) {
            console.error('❌ Erro ao atualizar transação:', err.sqlMessage);
            return res.status(500).json({ error: 'Erro interno ao atualizar transação.' });
        }
        if (result.affectedRows === 0) {
            console.warn(`⚠️ Nenhuma transação encontrada com ID: ${id}`);
            return res.status(404).json({ error: 'Transação não encontrada!' });
        }
        console.log("✅ Transação atualizada com sucesso!");
        res.json({ message: '✅ Transação atualizada com sucesso!' });
    });
};

const deleteTransaction = (req, res) => {
    const { id } = req.params;
    console.debug(`🗑 Excluindo transação ID: ${id}`);

    const query = 'DELETE FROM transactions WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('❌ Erro ao excluir transação:', err.sqlMessage);
            return res.status(500).json({ error: 'Erro interno ao excluir transação.' });
        }
        if (result.affectedRows === 0) {
            console.warn(`⚠️ Nenhuma transação encontrada com ID: ${id}`);
            return res.status(404).json({ error: 'Transação não encontrada!' });
        }
        console.log("✅ Transação excluída com sucesso!");
        res.json({ message: '✅ Transação excluída com sucesso!' });
    });
};

router.post('/', addTransaction);
router.get('/:id', getTransactionById);
router.get('/', getTransactionsByPeriod);
router.put('/:id', updateTransaction); // Atualizar transação
router.delete('/:id', deleteTransaction); // Excluir transação

module.exports = router;
