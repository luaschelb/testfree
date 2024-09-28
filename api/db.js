const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('testfree.db'); // Banco de dados persistido em arquivo

// Função para criar tabelas e inserir dados
function createTablesAndInsertData() {
  // Inicia uma transação
  db.serialize(() => {
    // Cria a tabela `testprojects` se não existir
    db.run(`
      CREATE TABLE IF NOT EXISTS testprojects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT
      )
    `);

    // Cria a tabela `testscenarios` se não existir
    db.run(`
      CREATE TABLE IF NOT EXISTS testscenarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        test_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        testproject_id INTEGER NOT NULL,
        FOREIGN KEY (testproject_id) REFERENCES testprojects(id) ON DELETE CASCADE
      )
    `);

    // Cria a tabela `testcases` se não existir
    db.run(`
      CREATE TABLE IF NOT EXISTS testcases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        test_id TEXT NOT NULL,
        name TEXT,
        description TEXT,
        steps TEXT,
        testscenario_id INTEGER,
        FOREIGN KEY (testscenario_id) REFERENCES testscenarios(id) ON DELETE SET NULL
      )
    `);

    // Inserção de dados nas tabelas, se estiverem vazias
    insertIfTableEmpty('testprojects', `
      INSERT INTO testprojects (name, description) VALUES 
      ('Projeto de Teste 1', 'Descrição do Projeto de Teste 1'),
      ('Projeto de Teste 2', 'Descrição do Projeto de Teste 2')
    `);

    insertIfTableEmpty('testscenarios', `
      INSERT INTO testscenarios (test_id, name, description, testproject_id) VALUES 
      ('CEN-1', 'Cenário de Teste 1', 'Descrição do Cenário de Teste 1', 1),
      ('CEN-2', 'Cenário de Teste 2', 'Descrição do Cenário de Teste 2', 1)
    `);

    insertIfTableEmpty('testcases', `
      INSERT INTO testcases (test_id, name, description, steps, testscenario_id) VALUES 
      ('TC-1', 'Nome do Caso 1', 'Descrição do Teste 1', 'Passo 1: Ação A\nPasso 2: Ação B\nPasso 3: Ação C', 1),
      ('TC-2', 'Nome do Caso 2', 'Descrição do Teste 2', 'Passo 1: Ação X\nPasso 2: Ação Y\nPasso 3: Ação Z', 1),
      ('TC-3', 'Nome do Caso 3', 'Descrição do Teste 3', 'Passo 1: Ação A\nPasso 2: Ação B\nPasso 3: Ação C', 2),
      ('TC-4', 'Nome do Caso 4', 'Descrição do Teste 4', 'Passo 1: Ação X\nPasso 2: Ação Y\nPasso 3: Ação Z', 2)
    `);
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
