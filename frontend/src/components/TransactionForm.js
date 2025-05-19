import React, { useState } from "react";
import api from "../services/api"; // Certifique-se de que o axios está configurado

function TransactionForm({ userId, onTransactionAdded }) {
    const [formData, setFormData] = useState({
        description: "",
        amount: "",
        type: "expense",
        date: "",
        category: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState(null); // Feedback para mensagens de sucesso ou erro

    // Categorias definidas manualmente
    const categories = [
        { id: 1, name: "Alimentação" },
        { id: 2, name: "Transporte" },
        { id: 3, name: "Saúde" },
        { id: 4, name: "Educação" },
        { id: 5, name: "Lazer" }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validação de campos obrigatórios
        if (!formData.description || !formData.amount || !formData.date || !formData.category) {
            setFeedback({ type: "error", message: "Por favor, preencha todos os campos obrigatórios." });
            return;
        }

        setIsSubmitting(true);
        setFeedback(null); // Limpa mensagens de feedback anteriores

        try {
            // Envia os dados para o backend
            const response = await api.post("/transactions", {
                ...formData,
                user_id: userId // Inclui o ID do usuário
            });

            console.log("Transação salva com sucesso:", response.data);
            setFeedback({ type: "success", message: "Transação salva com sucesso!" });

            // Limpa o formulário
            setFormData({
                description: "",
                amount: "",
                type: "expense",
                date: "",
                category: ""
            });

            // Chama a função para atualizar a lista de transações
            if (onTransactionAdded) {
                onTransactionAdded();
            }
        } catch (error) {
            console.error("Erro ao salvar a transação:", error);
            setFeedback({ type: "error", message: "Erro ao salvar a transação. Tente novamente." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="transaction-form">
            <h2 className="text-center text-success">Adicionar Transação</h2>

            {/* Feedback de erro ou sucesso */}
            {feedback && (
                <div className={`alert ${feedback.type === "success" ? "alert-success" : "alert-danger"} mt-3`}>
                    {feedback.message}
                </div>
            )}

            <div className="form-group">
                <label>Descrição:</label>
                <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="form-control"
                    placeholder="Ex.: Compra no supermercado"
                />
            </div>
            <div className="form-group">
                <label>Valor:</label>
                <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="form-control"
                    placeholder="Ex.: 150.00"
                />
            </div>
            <div className="form-group">
                <label>Tipo:</label>
                <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="form-control"
                >
                    <option value="income">Receita</option>
                    <option value="expense">Despesa</option>
                </select>
            </div>
            <div className="form-group">
                <label>Data:</label>
                <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label>Categoria:</label>
                <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="form-control"
                >
                    <option value="">Selecione uma categoria</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.name}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>
            <button type="submit" className="btn btn-success mt-3" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar"}
            </button>
        </form>
    );
}

export default TransactionForm;