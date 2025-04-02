const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');
const transactionsRoutes = require('./routes/transactions');

const app = express();
const PORT = 3001;

// Middleware para habilitar CORS
app.use(cors());

// Middleware para interpretar JSON no corpo da requisição
app.use(express.json()); // Substitui bodyParser.json() para versões mais recentes do Express
app.use(bodyParser.json()); // Mantido para compatibilidade, se necessário

// Logs iniciais
console.log("🚀 Servidor está iniciando...");

// Verificação da variável de ambiente JWT_SECRET
if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET não está definido! Verifique o arquivo docker-compose.yml ou as variáveis de ambiente.');
} else {
    console.log('✅ JWT_SECRET carregado:', process.env.JWT_SECRET);
}

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
