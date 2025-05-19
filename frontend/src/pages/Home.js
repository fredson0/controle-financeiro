import React, { useRef } from "react";
import Summary from "../components/Summary";
import TransactionsList from "../components/TransactionsList";
import TransactionForm from "../components/TransactionForm";
import CategoryReport from "../components/CategoryReport"; // Importa o gráfico de categorias

const Home = () => {
    const summaryRef = useRef(null); // Referência para atualizar o resumo financeiro
    const transactionsRef = useRef(null); // Referência para atualizar a lista de transações

    // Função chamada após adicionar uma transação
    const handleTransactionAdded = () => {
        if (summaryRef.current) {
            summaryRef.current(); // Atualiza o resumo financeiro
        }
        if (transactionsRef.current) {
            transactionsRef.current(); // Atualiza a lista de transações
        }
    };

    return (
        <div className="container">
            <Summary onUpdate={(updateFn) => (summaryRef.current = updateFn)} />
            <TransactionForm onTransactionAdded={handleTransactionAdded} />
            <CategoryReport /> {/* Adiciona o gráfico de categorias */}
            <TransactionsList onUpdate={(updateFn) => (transactionsRef.current = updateFn)} />
        </div>
    );
};

export default Home;