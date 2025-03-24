const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');
const transactionsRoutes = require('./routes/transactions');

const app = express();
const PORT = 3001;

app.use(cors());

app.use(express.json()); 
app.use(bodyParser.json()); 

console.log("🚀 Servidor está iniciando...");

app.get('/', (req, res) => {
    res.send('API está rodando!');
});

console.log("✅ Rotas carregadas: /users e /transactions");
app.use('/users', userRoutes);
app.use('/transactions', transactionsRoutes);

app.use((req, res, next) => {
    res.status(404).json({ error: 'Rota não encontrada!' });
});

app.use((err, req, res, next) => {
    console.error('❌ Erro no servidor:', err);
    res.status(500).json({ error: 'Erro interno no servidor.' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
