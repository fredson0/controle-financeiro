const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
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

  pool.query('USE finance_app', (err) => {
    if (err) {
      console.error('❌ Erro ao conectar ao banco "finance_app":', err);
      return;
    }
    console.log('✅ Conectado ao banco "finance_app"!');

  
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    pool.query(createTableQuery, (err) => {
      if (err) {
        console.error('❌ Erro ao criar tabela "users":', err);
      } else {
        console.log('✅ Tabela "users" pronta para uso!');
      }
    });
  });
});

module.exports = pool;
