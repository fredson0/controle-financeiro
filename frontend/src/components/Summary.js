import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion'; // Importa o Framer Motion
import api from '../services/api'; // Importa a API configurada

const Summary = () => {
    const [summary, setSummary] = useState({
        total_income: 0,
        total_expense: 0,
        balance: 0,
    });
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState(null);

    // Função para formatar valores como moeda
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    // Função para buscar o resumo financeiro
    const fetchResumoFinanceiro = async () => {
        setLoading(true);
        setFeedback(null);

        try {
            const response = await api.get('/transactions/summary');
            setSummary(response.data);
        } catch (error) {
            console.error('Erro ao buscar resumo financeiro:', error);
            setFeedback('Erro ao carregar o resumo financeiro.');
        } finally {
            setLoading(false);
        }
    };

    // Busca o resumo financeiro ao carregar o componente
    useEffect(() => {
        fetchResumoFinanceiro();
    }, []);

    return (
        <motion.div
            className="summary-container text-center p-3 rounded shadow-sm"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-success">Resumo Financeiro</h2>

            {loading ? (
                <p>Carregando...</p>
            ) : feedback ? (
                <div className="alert alert-danger mt-3">{feedback}</div>
            ) : (
                <>
                    <p className="fw-bold">
                        Receitas: <span className="text-success">{formatCurrency(summary.total_income)}</span>
                    </p>
                    <p className="fw-bold">
                        Despesas: <span className="text-danger">{formatCurrency(summary.total_expense)}</span>
                    </p>
                    <p className="fw-bold">
                        Saldo:{' '}
                        <span className={summary.balance >= 0 ? 'text-success' : 'text-danger'}>
                            {formatCurrency(summary.balance)}
                        </span>
                    </p>
                </>
            )}
        </motion.div>
    );
};

export default Summary;