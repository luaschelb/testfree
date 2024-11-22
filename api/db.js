const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('testfree.db'); // Banco de dados persistido em arquivo

// Função para criar tabelas e inserir dados
function createTablesAndInsertData() {
  // Inicia uma transação
  db.serialize(() => {
    // Criação das tabelas
    db.run(`CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      testcase_counter INTEGER DEFAULT 1,
      testscenario_counter INTEGER DEFAULT 1,
      testexecutions_counter INTEGER DEFAULT 1,
      name VARCHAR(255),
      description TEXT,
      active BOOLEAN
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS builds (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title VARCHAR(255),
      version VARCHAR(50),
      description TEXT,
      active BOOLEAN,
      project_id INTEGER,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS test_scenarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(255),
      count INTEGER,
      description TEXT,
      "order" INTEGER,
      test_project_id INTEGER,
      FOREIGN KEY (test_project_id) REFERENCES projects(id) ON DELETE CASCADE
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS test_cases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(255),
      "order" INTEGER,
      count INTEGER,
      description TEXT,
      steps TEXT,
      enabled BOOLEAN,
      can_edit BOOLEAN,
      test_scenario_id INTEGER,
      FOREIGN KEY (test_scenario_id) REFERENCES test_scenarios(id) ON DELETE CASCADE
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS test_steps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stepnumber INTEGER,
      action TEXT,
      expected_result TEXT,
      test_case_id INTEGER,
      FOREIGN KEY (test_case_id) REFERENCES test_cases(id) ON DELETE CASCADE
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS test_plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(255),
      description TEXT,
      active BOOLEAN,
      project_id INTEGER,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS testplans_testcases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      test_plan_id INTEGER,
      test_case_id INTEGER,
      FOREIGN KEY (test_plan_id) REFERENCES test_plans(id) ON DELETE CASCADE,
      FOREIGN KEY (test_case_id) REFERENCES test_cases(id) ON DELETE CASCADE
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS test_executions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      start_date DATETIME,
      end_date DATETIME,
      test_plan_id INTEGER,
      build_id INTEGER,
      status INTEGER DEFAULT 1,
      comments TEXT,
      FOREIGN KEY (test_plan_id) REFERENCES test_plans(id) ON DELETE CASCADE,
      FOREIGN KEY (build_id) REFERENCES builds(id) ON DELETE CASCADE
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS test_executions_test_cases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at DATETIME,
      comment TEXT,
      passed BOOLEAN,
      skipped BOOLEAN,
      failed BOOLEAN,
      test_execution_id INTEGER,
      test_case_id INTEGER,
      FOREIGN KEY (test_execution_id) REFERENCES test_executions(id) ON DELETE CASCADE,
      FOREIGN KEY (test_case_id) REFERENCES test_cases(id) ON DELETE CASCADE
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(255),
      path VARCHAR(255),
      test_executions_test_cases_id INTEGER,
      FOREIGN KEY (test_executions_test_cases_id) REFERENCES test_executions_test_cases(id) ON DELETE CASCADE
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS User (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(255),
      login VARCHAR(255),
      email VARCHAR(255),
      password VARCHAR(255),
      role VARCHAR(50)
    );`);

    // Seeds para a tabela 'projects'
    insertIfTableEmpty('projects', `
      INSERT INTO projects (testcase_counter, testscenario_counter, testexecutions_counter, name, description, active)
      VALUES 
        (5, 2, 3, 'Sistema de Gestão de Produtos', 'Plataforma para gerenciar produtos e vendas em uma loja virtual', 1),
        (5, 2, 3, 'Sistema de Empréstimos', 'Plataforma para empréstimos disponibilizados pela nossa empresa', 1);
    `);

    // Seeds para a tabela 'builds'
    insertIfTableEmpty('builds', `
      INSERT INTO builds (title, version, description, active, project_id)
      VALUES 
        ('Versão 1.0-DEV', '1.0', 'Primeira versão estável do sistema', 1, 1),
        ('Versão 1.1-DEV', '1.1', 'Atualização com correções de bugs', 1, 1),
        ('Versão 12.1-DEV', '12.1', 'Nova versão empréstimo em dev', 1, 2),
        ('Versão 10.4-HOM', '10.4', 'Atualizado Vue para versão 16', 1, 2);
    `);

    // Seeds para a tabela 'test_scenarios'
    insertIfTableEmpty('test_scenarios', `
      INSERT INTO test_scenarios (name, count, description, "order", test_project_id)
      VALUES 
        ('Cenário de Login', 3, 'Verificação de login com credenciais válidas e inválidas', 1, 1),
        ('Cenário de Cadastro de Produto', 5, 'Testes de inserção, edição e exclusão de produtos', 2, 1),
        ('Cenário de Login Empréstimo', 3, 'Verificação de login com credenciais válidas e inválidas', 1, 2),
        ('Cenário de Cadastro de Produto Empréstimo', 5, 'Testes de inserção, edição e exclusão de produtos', 2, 2);
    `);

    // Seeds para a tabela 'test_cases'
    insertIfTableEmpty('test_cases', `
      INSERT INTO test_cases (name, "order", count, description, steps, enabled, can_edit, test_scenario_id)
      VALUES 
        ('Login com credenciais válidas', 1, 4, 'Login realizado com credenciais válidas', '1. Acessar a página de login\n2. Inserir e-mail e senha válidos\n3. Clicar em Entrar\n4. Verificar se o login foi bem-sucedido', 1, 1, 1),
        ('Login com credenciais inválidas', 2, 3, 'Tentativa de login com senha incorreta', '1. Acessar a página de login\n2. Inserir e-mail válido e senha inválida\n3. Verificar se a mensagem de erro é exibida', 1, 1, 1),
        ('Cadastro de produto válido', 1, 5, 'Cadastro de um novo produto com todos os dados obrigatórios', '1. Acessar a página de produtos\n2. Clicar em "Adicionar Produto"\n3. Preencher os dados obrigatórios\n4. Clicar em "Salvar"\n5. Verificar se o produto foi adicionado', 1, 1, 2);
    `);

    // Seeds para a tabela 'test_steps'
    insertIfTableEmpty('test_steps', `
      INSERT INTO test_steps (stepnumber, action, expected_result, test_case_id)
      VALUES 
        (1, 'Acessar a página de login', 'Página de login exibida corretamente', 1),
        (2, 'Inserir e-mail e senha válidos', 'E-mail e senha inseridos corretamente', 1),
        (3, 'Clicar em Entrar', 'Sistema tenta fazer login', 1),
        (4, 'Verificar se o login foi bem-sucedido', 'Usuário autenticado com sucesso', 1);
    `);

    // Seeds para a tabela 'test_plans'
    insertIfTableEmpty('test_plans', `
      INSERT INTO test_plans (name, description, active, project_id)
      VALUES 
        ('Plano de Testes da Versão 1.0', 'Plano de testes para a versão 1.0 do sistema', 1, 1),
        ('Plano de Testes da Versão 1.1', 'Plano de testes para a versão 1.1 com correções de bugs', 1, 1);
    `);

    // Seeds para a tabela 'testplans_testcases'
    insertIfTableEmpty('testplans_testcases', `
      INSERT INTO testplans_testcases (test_plan_id, test_case_id)
      VALUES 
        (1, 1),
        (1, 2),
        (1, 3),
        (2, 1),
        (2, 3);
    `);

    // Seeds para a tabela 'test_executions'
    insertIfTableEmpty('test_executions', `
      INSERT INTO test_executions (start_date, end_date, test_plan_id, build_id, status, comments)
      VALUES 
        ('28/09/2024', '28/09/2024 14:00', 1, 1, 2, 'Primeira execução de testes do plano 1'),
        ('28/09/2024', '29/09/2024 14:00', 2, 2, 2, 'Execução de testes com observações');
    `);

    // Seeds para a tabela 'test_executions_test_cases'
    insertIfTableEmpty('test_executions_test_cases', `
      INSERT INTO test_executions_test_cases (created_at, comment, passed, skipped, failed, test_execution_id, test_case_id)
      VALUES 
        ('28/09/2024 14:01', 'Login realizado com sucesso', 1, 0, 0, 1, 1),
        ('28/09/2024 14:03', 'Erro exibido ao tentar login com senha inválida', 0, 0, 1, 1, 2),
        ('28/09/2024 14:05', 'Produto cadastrado corretamente', 1, 0, 0, 1, 3),
        ('28/09/2024 14:14', 'Produto cadastrado corretamente', 1, 0, 0, 2, 3);
    `);

    // Seeds para a tabela 'files'
    insertIfTableEmpty('files', `
      INSERT INTO files (name, path, test_executions_test_cases_id)
      VALUES 
        ('screenshot-login-sucesso.png', '/screenshots/login-success.png', 1),
        ('screenshot-login-falha.png', '/screenshots/login-failure.png', 2),
        ('screenshot-cadastro-produto.png', '/screenshots/product-add.png', 3);
    `);

    // Seeds para a tabela 'User'
    insertIfTableEmpty('User', `
      INSERT INTO User (name, login, email, password, role)
      VALUES 
        ('Admin', 'admin', 'admin@loja.com', 'admin123', 'admin'),
        ('Tester', 'tester', 'tester@loja.com', 'tester123', 'tester');
    `);
  });
}

let allowSeed = false;
// Função auxiliar para verificar e inserir dados
function insertIfTableEmpty(tableName, insertQuery) {
  if (!allowSeed)
    return;
  
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