const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('testfree.db'); // Banco de dados persistido em arquivo

// Função para criar tabelas e inserir dados
function createTablesAndInsertData() {
  // Inicia uma transação
  db.serialize(() => {

  });
}

// Função auxiliar para verificar e inserir dados
function insertIfTableEmpty(tableName, insertQuery) {
  db.get(`SELECT COUNT(*) AS count FROM ${tableName}`, (err, row) => {
    if (err) {
      console.error(`Erro ao verificar a tabela ${tableName}:`, err.message);
      return;
    }

    if (row.count === 0) {
      db.run(insertQuery, (err) => {
        if (err) {
          console.error(`Erro ao inserir dados na tabela ${tableName}:`, err.message);
        } else {
          console.log(`Dados inseridos na tabela ${tableName}.`);
        }
      });
    }
  });
}

// Fechar o banco de dados ao encerrar o processo
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Erro ao fechar o banco de dados:', err.message);
    } else {
      console.log('Conexão com o banco de dados encerrada.');
    }
    process.exit(0);
  });
});

// Chama a função para criar as tabelas e inserir os dados
createTablesAndInsertData();

// Exporta o banco de dados para ser utilizado nas controllers
module.exports = db;