const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'finance_app',  // Definindo o banco de dados diretamente aqui
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

  // Criar a tabela "users"
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

  // Criar a tabela "transactions"
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