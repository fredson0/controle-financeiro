const mysql = require('mysql2');
require('dotenv').config(); 

const db = mysql.createConnection({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME, 
    port: process.env.DB_PORT 
});

db.connect(err => {
    if (err) {
        console.error('❌ Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('✅ Conectado ao banco "finance_app"!');

    // Criar a tabela de usuários se ela não existir
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    
    db.query(createTableQuery, (err, result) => {
        if (err) {
            console.error('❌ Erro ao criar a tabela "users":', err);
            return;
        }
        console.log('✅ Tabela "users" pronta para uso!');
    });

    const createTransactionsTableQuery = `
        CREATE TABLE IF NOT EXISTS transactions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            description VARCHAR(255) NOT NULL,
            amount DECIMAL(10, 2) NOT NULL,
            type ENUM('income', 'expense') NOT NULL,
            date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
