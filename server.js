const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');
const transactionsRoutes = require('./routes/transactions');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

console.log("🚀 Servidor está iniciando...");

app.get('/', (req, res) => {
    res.send('API está rodando!');
});

console.log("✅ Rotas carregadas: /users e /transactions");

app.use('/users', userRoutes);
app.use('/transactions', transactionsRoutes); 

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
