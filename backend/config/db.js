const mysql = require('mysql2');
require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

const db = mysql.createConnection({
    host: process.env.DB_HOST, // Substituído por variável de ambiente
    user: process.env.DB_USER, // Substituído por variável de ambiente
    password: process.env.DB_PASSWORD, // Substituído por variável de ambiente
    database: process.env.DB_NAME, // Substituído por variável de ambiente
    port: process.env.DB_PORT // Substituído por variável de ambiente
});

db.connect(err => {
    if (err) {
        console.error('❌ Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('✅ Conectado ao banco "finance_app"!');

    // Criar a tabela de usuários se ela não existir
    const createUsersTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL, -- Adicionado o campo "password"
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    
    db.query(createUsersTableQuery, (err, result) => {
        if (err) {
            console.error('❌ Erro ao criar a tabela "users":', err);
            return;
        }
        console.log('✅ Tabela "users" pronta para uso!');
    });

    // Criar a tabela de transações, se necessário
    const createTransactionsTableQuery = `
        CREATE TABLE IF NOT EXISTS transactions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            description VARCHAR(255) NOT NULL,
            amount DECIMAL(10, 2) NOT NULL,
            type ENUM('income', 'expense') NOT NULL,
            date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            category VARCHAR(50) DEFAULT 'Outros', -- Adicionado o campo "category"
            user_id INT NOT NULL, -- Relacionamento com a tabela "users"
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `;
    
    db.query(createTransactionsTableQuery, (err, result) => {
        if (err) {
            console.error('❌ Erro ao criar a tabela "transactions":', err);
            return;
        }
        console.log('✅ Tabela "transactions" pronta para uso!');
    });
});

module.exports = db;