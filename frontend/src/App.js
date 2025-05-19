import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import TransactionsList from "./components/TransactionsList";
import TransactionForm from "./components/TransactionForm";
import Summary from "./components/Summary";
import CategoryReport from "./components/CategoryReport"; // Importa o gráfico de categorias
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./styles/index.css";

function App() {
  const [userId, setUserId] = useState(localStorage.getItem("user_id") || null);
  const [theme, setTheme] = useState("light");

  // Remove o ID do usuário do localStorage se ele não estiver logado
  useEffect(() => {
    if (!userId) {
      localStorage.removeItem("user_id");
    }
  }, [userId]);

  // Alterna o tema entre claro e escuro
  useEffect(() => {
    document.body.className = theme === "dark" ? "bg-dark text-white" : "bg-light text-dark";
  }, [theme]);

  return (
    <Router>
      <Routes>
        {/* Rota para login */}
        <Route
          path="/login"
          element={
            userId ? (
              <Navigate to="/home" />
            ) : (
              <Login
                onLoginSuccess={(id) => {
                  console.log("Login bem-sucedido, ID do usuário:", id); // Log para depuração
                  setUserId(id);
                  localStorage.setItem("user_id", id);
                }}
              />
            )
          }
        />

        {/* Rota para registro */}
        <Route
          path="/register"
          element={
            userId ? (
              <Navigate to="/home" />
            ) : (
              <Register />
            )
          }
        />

        {/* Rota para a página inicial */}
        <Route
          path="/home"
          element={
            userId ? (
              <motion.div
                className={`app-container mt-4 ${
                  theme === "dark" ? "bg-dark text-white" : "bg-light text-dark"
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h1 className="text-success">Finance App</h1>
                  <div>
                    <button
                      className="btn btn-secondary me-2"
                      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                    >
                      Alternar Tema
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        console.log("Usuário fez logout"); // Log para depuração
                        setUserId(null);
                        localStorage.removeItem("user_id");
                      }}
                    >
                      Sair
                    </button>
                  </div>
                </div>
                <motion.div
                  className="summary p-3 rounded shadow-sm"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Summary userId={userId} />
                </motion.div>
                <motion.div
                  className="mt-4"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <TransactionForm
                    userId={userId}
                    onTransactionAdded={() => {
                      console.log("Transação adicionada! Atualize os componentes necessários.");
                    }}
                  />
                </motion.div>
                <motion.div
                  className="mt-4"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <CategoryReport /> {/* Adiciona o gráfico de categorias */}
                </motion.div>
                <motion.div
                  className="mt-4"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <TransactionsList userId={userId} />
                </motion.div>
              </motion.div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Rota padrão (fallback) */}
        <Route path="*" element={<Navigate to={userId ? "/home" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;