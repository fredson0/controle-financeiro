const express = require('express');
const db = require('../config/db');
const authenticateToken = require('../middleware/authenticateToken'); // Middleware de autenticação

const router = express.Router();

// Função para validar transações
const validateTransaction = (description, amount, type, date) => {
    if (!description || typeof description !== 'string' || description.trim().length === 0) {
        return 'A descrição é obrigatória e deve ser uma string não vazia!';
    }
    if (!amount || isNaN(amount) || amount <= 0) {
        return 'O valor da transação deve ser um número positivo!';
    }
    if (!type || typeof type !== 'string' || !['income', 'expense'].includes(type.toLowerCase())) {
        return 'O tipo de transação deve ser "income" ou "expense"!';
    }
    if (!date || isNaN(Date.parse(date))) {
        return 'A data informada é inválida ou está ausente!';
    }
    return null;
};

// Adicionar uma nova transação (POST /transactions)
const addTransaction = (req, res) => {
    const { description, amount, type, date, category } = req.body;
    const user_id = req.user.id; // Obtém o user_id do token JWT

    console.log('Dados recebidos no backend:', { description, amount, type, date, category });

    const validationError = validateTransaction(description, amount, type, date);
    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    const query = `
        INSERT INTO transactions (description, amount, type, date, user_id, category)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [description.trim(), amount, type.trim(), date, user_id, category || 'Outros'], (err, result) => {
        if (err) {
            console.error('❌ Erro ao adicionar transação:', err.sqlMessage);
            return res.status(500).json({ error: 'Erro interno ao adicionar transação.' });
        }
        res.json({ message: '✅ Transação adicionada com sucesso!', id: result.insertId });
    });
};

// Buscar todas as transações com filtros opcionais (GET /transactions)
const getTransactions = (req, res) => {
    const user_id = req.user.id; // Obtém o user_id do token JWT
    const { type, start_date, end_date, sortBy, order } = req.query;

    let query = 'SELECT * FROM transactions WHERE user_id = ?';
    const queryParams = [user_id];

    if (type && ['income', 'expense'].includes(type.toLowerCase())) {
        query += ' AND type = ?';
        queryParams.push(type.toLowerCase());
    }

    if (start_date && end_date) {
        if (isNaN(Date.parse(start_date)) || isNaN(Date.parse(end_date))) {
            return res.status(400).json({ error: 'As datas fornecidas são inválidas!' });
        }
        query += ' AND date BETWEEN ? AND ?';
        queryParams.push(start_date, end_date);
    }

    if (sortBy && ['date', 'amount'].includes(sortBy.toLowerCase())) {
        query += ` ORDER BY ${sortBy}`;
        if (order && ['asc', 'desc'].includes(order.toLowerCase())) {
            query += ` ${order.toUpperCase()}`;
        } else {
            query += ' ASC';
        }
    }

    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('❌ Erro ao buscar transações:', err.sqlMessage);
            return res.status(500).json({ error: 'Erro interno ao buscar transações.' });
        }
        res.json(results);
    });
};

// Resumo financeiro (GET /transactions/summary)
const getTransactionSummary = (req, res) => {
    const user_id = req.user.id; // Obtém o user_id do token JWT

    const query = `
        SELECT 
            COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS total_income,
            COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expense,
            (COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) - 
             COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0)) AS balance
        FROM transactions
        WHERE user_id = ?;
    `;

    db.query(query, [user_id], (err, results) => {
        if (err) {
            console.error('❌ Erro ao calcular resumo financeiro:', err.sqlMessage);
            return res.status(500).json({ error: 'Erro interno ao calcular resumo financeiro.' });
        }
        res.json(results[0]);
    });
};

// Buscar despesas agrupadas por categoria (GET /transactions/categories)
const getExpensesByCategory = (req, res) => {
    const user_id = req.user.id; // Obtém o user_id do token JWT
    const { start_date, end_date } = req.query;

    let query = `
        SELECT category, SUM(amount) AS value
        FROM transactions
        WHERE type = 'expense' AND user_id = ?
    `;
    const queryParams = [user_id];

    // Adiciona filtros de data apenas se forem fornecidos
    if (start_date && end_date) {
        if (isNaN(Date.parse(start_date)) || isNaN(Date.parse(end_date))) {
            return res.status(400).json({ error: 'As datas fornecidas são inválidas!' });
        }
        query += ' AND date BETWEEN ? AND ?';
        queryParams.push(start_date, end_date);
    }

    query += ' GROUP BY category';

    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('❌ Erro ao buscar despesas por categoria:', err.sqlMessage);
            return res.status(500).json({ error: 'Erro interno ao buscar despesas por categoria.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Nenhuma despesa encontrada para este usuário.' });
        }

        res.json(results);
    });
};

// Rotas protegidas com autenticação
router.post('/', authenticateToken, addTransaction);
router.get('/summary', authenticateToken, getTransactionSummary);
router.get('/categories', authenticateToken, getExpensesByCategory); // Nova rota para categorias
router.get('/', authenticateToken, getTransactions);

module.exports = router;