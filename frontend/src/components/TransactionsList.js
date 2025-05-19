import React, { useEffect, useState } from 'react';
import api from '../services/api';

const TransactionsList = ({ userId, onUpdate }) => {
    const [transactions, setTransactions] = useState([]);
    const [filters, setFilters] = useState({ type: '', category: '', date: '' }); // Filtros para busca
    const [feedback, setFeedback] = useState(null); // Feedback para erros ou sucesso
    const [loading, setLoading] = useState(false); // Estado de carregamento
    const [deleting, setDeleting] = useState(null); // Estado de exclusão de transação

    // Função para formatar valores como moeda
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    // Função para buscar transações
    const fetchTransacoes = async () => {
        if (!userId) return;

        setLoading(true); // Ativa o estado de carregamento
        setFeedback(null); // Limpa mensagens de erro anteriores

        try {
            const response = await api.get(`/transactions?user_id=${userId}`);
            setTransactions(response.data);
        } catch (error) {
            console.error('Erro ao buscar transações:', error);
            setFeedback({ type: 'error', message: 'Erro ao carregar transações. Tente novamente mais tarde.' });
        } finally {
            setLoading(false); // Desativa o estado de carregamento
        }
    };

    // Atualiza as transações ao carregar o componente ou quando `userId` mudar
    useEffect(() => {
        fetchTransacoes();
    }, [userId]);

    // Permite que o componente pai solicite uma atualização
    useEffect(() => {
        if (onUpdate) {
            onUpdate(fetchTransacoes);
        }
    }, [onUpdate]);

    // Função para excluir uma transação
    const handleDelete = async (id) => {
        setDeleting(id); // Define o estado de exclusão para a transação atual
        setFeedback(null); // Limpa mensagens de feedback anteriores

        try {
            await api.delete(`/transactions/${id}`);
            setTransactions(transactions.filter((transaction) => transaction.id !== id));
            setFeedback({ type: 'success', message: 'Transação excluída com sucesso!' });
        } catch (error) {
            console.error('Erro ao excluir transação:', error);
            setFeedback({ type: 'error', message: 'Erro ao excluir transação. Tente novamente.' });
        } finally {
            setDeleting(null); // Reseta o estado de exclusão
        }
    };

    // Função para aplicar filtros
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const filteredTransactions = transactions.filter((transaction) => {
        return (
            (!filters.type || transaction.type === filters.type) &&
            (!filters.category || transaction.category === filters.category) &&
            (!filters.date || transaction.date === filters.date)
        );
    });

    return (
        <div className="mt-4">
            <h2 className="text-center text-success">Transações</h2>

            {/* Feedback de erro ou sucesso */}
            {feedback && (
                <div className={`alert ${feedback.type === 'success' ? 'alert-success' : 'alert-danger'} mt-3`}>
                    {feedback.message}
                </div>
            )}

            {/* Indicador de carregamento */}
            {loading ? (
                <p className="text-center">Carregando transações...</p>
            ) : (
                <>
                    {/* Filtros */}
                    <div className="row mb-3">
                        <div className="col-md-3">
                            <select
                                name="type"
                                value={filters.type}
                                onChange={handleFilterChange}
                                className="form-select"
                            >
                                <option value="">Todos os tipos</option>
                                <option value="income">Receita</option>
                                <option value="expense">Despesa</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <input
                                type="text"
                                name="category"
                                placeholder="Categoria"
                                value={filters.category}
                                onChange={handleFilterChange}
                                className="form-control"
                            />
                        </div>
                        <div className="col-md-3">
                            <input
                                type="date"
                                name="date"
                                value={filters.date}
                                onChange={handleFilterChange}
                                className="form-control"
                            />
                        </div>
                        <div className="col-md-3">
                            <button
                                className="btn btn-secondary w-100"
                                onClick={() => setFilters({ type: '', category: '', date: '' })}
                            >
                                Limpar Filtros
                            </button>
                        </div>
                    </div>

                    {/* Tabela de transações */}
                    <table className="table table-striped mt-3">
                        <thead className="table-success">
                            <tr>
                                <th>Descrição</th>
                                <th>Valor</th>
                                <th>Tipo</th>
                                <th>Data</th>
                                <th>Categoria</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map((transaction) => (
                                <tr key={transaction.id}>
                                    <td>{transaction.description}</td>
                                    <td>{formatCurrency(transaction.amount)}</td>
                                    <td>{transaction.type === 'income' ? 'Receita' : 'Despesa'}</td>
                                    <td>{new Date(transaction.date).toLocaleDateString()}</td>
                                    <td>{transaction.category}</td>
                                    <td>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(transaction.id)}
                                            disabled={deleting === transaction.id} // Desativa o botão durante a exclusão
                                        >
                                            {deleting === transaction.id ? 'Excluindo...' : 'Excluir'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default TransactionsList;