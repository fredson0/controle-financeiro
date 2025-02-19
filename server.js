const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db'); 

const app = express();
const PORT = 3001; 

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('API está rodando!');
});

app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('❌ Erro ao buscar usuários:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});


app.post('/users', (req, res) => {
    console.log("📩 Dados recebidos:", req.body);

    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: "Nome e e-mail são obrigatórios!" });
    }

    db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], (err, result) => {
        if (err) {
            console.error('❌ Erro ao inserir usuário:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: '✅ Usuário adicionado com sucesso!', id: result.insertId });
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});