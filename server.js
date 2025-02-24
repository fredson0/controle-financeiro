const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('API está rodando!');
});

app.use('/users', userRoutes);

const transactionsRoutes = require('./routes/transactions');
app.use(transactionsRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
