const mysql = require('mysql2');
require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

const pool = mysql.createPool({
  host: process.env.DB_HOST, // Substituído por variável de ambiente
  user: process.env.DB_USER, // Substituído por variável de ambiente
  password: process.env.DB_PASSWORD, // Substituído por variável de ambiente
  database: process.env.DB_NAME, // Substituído por variável de ambiente
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log("🚀 Tentando conectar ao MySQL...");

pool.query('CREATE DATABASE IF NOT EXISTS finance_app', (err) => {
  if (err) {
    console.error('❌ Erro ao criar banco de dados:', err);
    return;
  }
  console.log('✅ Banco de dados "finance_app" pronto!');

  const createUsersTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  pool.query(createUsersTableQuery, (err) => {
    if (err) {
      console.error('❌ Erro ao criar tabela "users":', err);
    } else {
      console.log('✅ Tabela "users" pronta para uso!');
    }
  });

  const createTransactionsTableQuery = `
    CREATE TABLE IF NOT EXISTS transactions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      description VARCHAR(255) NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      type ENUM('income', 'expense') NOT NULL,
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  pool.query(createTransactionsTableQuery, (err) => {
    if (err) {
      console.error('❌ Erro ao criar tabela "transactions":', err);
    } else {
      console.log('✅ Tabela "transactions" pronta para uso!');
    }
  });
});

module.exports = pool;