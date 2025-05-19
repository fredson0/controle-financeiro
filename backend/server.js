const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/users');
const transactionsRoutes = require('./routes/transactions');

const app = express();
const PORT = 3001;

// Middleware para habilitar CORS com origem restrita
app.use(cors({
    origin: 'http://localhost:3000', // Permitir apenas requisições do frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
}));

// Middleware para interpretar JSON no corpo da requisição
app.use(express.json()); // Substitui bodyParser.json()

// Logs para depuração
app.use((req, res, next) => {
    console.log(`📥 Requisição recebida: ${req.method} ${req.url}`);
    next();
});

// Rota principal
app.get('/', (req, res) => {
    res.send('API está rodando!');
});

// Carregamento das rotas
console.log("✅ Rotas carregadas: /users e /transactions");
app.use('/users', userRoutes);
app.use('/transactions', transactionsRoutes);

// Middleware para rotas inexistentes (404)
app.use((req, res, next) => {
    res.status(404).json({ error: 'Rota não encontrada!' });
});

// Middleware global para tratamento de erros
app.use((err, req, res, next) => {
    console.error('❌ Erro no servidor:', err);
    res.status(500).json({ error: 'Erro interno no servidor.' });
});

// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});