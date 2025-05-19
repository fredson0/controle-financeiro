import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import api from "../services/api";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF6384"]; // Cores para o gráfico

const CategoryReport = () => {
    const [data, setData] = useState([]); // Dados para o gráfico
    const [loading, setLoading] = useState(true); // Estado para indicar carregamento
    const [error, setError] = useState(null); // Estado para mensagens de erro
    const [startDate, setStartDate] = useState(""); // Data de início do filtro
    const [endDate, setEndDate] = useState(""); // Data de fim do filtro

    // Função para buscar as despesas por categoria
    const fetchCategoryData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get("/transactions/categories", {
                params: {
                    start_date: startDate || undefined, // Envia apenas se preenchido
                    end_date: endDate || undefined, // Envia apenas se preenchido
                },
            });
            console.log("Dados recebidos para o gráfico (detalhado):", JSON.stringify(response.data, null, 2));

            // Converte o campo "value" para número antes de validar
            const formattedData = response.data.map((item) => ({
                ...item,
                value: parseFloat(item.value), // Converte "value" para número
            }));

            // Validação dos dados recebidos
            if (
                Array.isArray(formattedData) &&
                formattedData.every(
                    (item) =>
                        typeof item.category === "string" &&
                        typeof item.value === "number"
                )
            ) {
                setData(formattedData);
            } else {
                console.error("Formato inválido dos dados recebidos:", formattedData);
                throw new Error("Os dados recebidos estão em um formato inválido.");
            }
        } catch (error) {
            console.error("Erro ao buscar dados de categorias:", error);

            // Define mensagens de erro específicas com base no status
            if (error.response) {
                if (error.response.status === 404) {
                    setError("Nenhuma despesa encontrada para o período selecionado.");
                } else if (error.response.status === 400) {
                    setError("As datas fornecidas são inválidas. Verifique e tente novamente.");
                } else {
                    setError("Erro ao carregar os dados. Tente novamente mais tarde.");
                }
            } else {
                setError("Erro de conexão. Verifique sua internet ou tente novamente mais tarde.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Chama a função ao montar o componente ou ao alterar as datas
    useEffect(() => {
        fetchCategoryData();
    }, [startDate, endDate]);

    return (
        <div className="category-report">
            <h3 className="text-center">Despesas por Categoria</h3>

            {/* Filtros de data */}
            <div className="filters text-center mb-3">
                <label>
                    Data de início:
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="form-control"
                    />
                </label>
                <label className="ms-3">
                    Data de fim:
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="form-control"
                    />
                </label>
                <button
                    className="btn btn-primary ms-3"
                    onClick={fetchCategoryData}
                    disabled={loading}
                >
                    {loading ? "Carregando..." : "Filtrar"}
                </button>
            </div>

            {/* Gráfico ou mensagens */}
            {loading ? (
                <p className="text-center text-muted">Carregando...</p>
            ) : error ? (
                <p className="text-center text-danger">{error}</p>
            ) : data.length > 0 ? ( // Exibe o gráfico se houver pelo menos uma categoria
                <PieChart width={400} height={400}>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        fill="#8884d8"
                        label
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            ) : (
                <p className="text-center text-muted">Nenhuma despesa encontrada para o período selecionado.</p>
            )}
        </div>
    );
};

export default CategoryReport;