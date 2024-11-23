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

    insertIfTableEmpty(
      'projects',
      `INSERT INTO projects (testcase_counter, testscenario_counter, testexecutions_counter, name, description, active)
        VALUES 
          (5, 2, 3, 'GESCAD - Gestão de Produtos', 'Plataforma para gerenciar produtos e vendas em uma loja virtual', 1),
          (5, 2, 3, 'CDCFACIL - Sistema de Empréstimos', 'Plataforma para empréstimos disponibilizados pela nossa empresa', 1);`
    );
    
    // Seeds para a tabela 'builds'
    insertIfTableEmpty(
      'builds',
      `INSERT INTO builds (title, version, description, active, project_id)
        VALUES 
          ('Versão 1.0-DEV', '1.0', 'Primeira versão estável do sistema', 1, 1),
          ('Versão 1.1-HOM', '1.1', 'Subida da versão para ambiente de hom', 1, 1),
          ('Versão 12.1-DEV', '12.1', 'Correções na máscara de documento', 1, 2),
          ('Versão 10.0-HOM', '10.0', 'Atualizado Vue para versão 16', 1, 2);`
    );
    
    insertIfTableEmpty(
      'test_scenarios',
      `INSERT INTO test_scenarios (name, count, description, "order", test_project_id)
        VALUES 
          ('Login e Autenticação', 1, 'Testes relacionados ao processo de login e autenticação do sistema', 1, 1),
          ('Gerenciamento de Produtos', 1, 'Testes de inserção, edição e exclusão de produtos', 2, 1),
          ('Relatórios', 1, 'Testes relativos à funcionalidade de relatórios', 3, 1),
          ('Gerenciamento de Estoque', 1, 'Verificar a funcionalidade de gestão de estoque de produtos', 4, 1),
          ('Cadastro de Categorias', 1, 'Testar a funcionalidade de criação e edição de categorias de produtos', 5, 1),
          ('Relatórios de Estoque', 1, 'Validar a geração de relatórios sobre o estoque', 6, 1),
          ('Cálculo de Financiamento', 1, 'Verificar se o cálculo de financiamento é realizado corretamente', 1, 2),
          ('Validação de Dados do Cliente', 1, 'Garantir que o sistema valida corretamente os dados do cliente', 2, 2),
          ('Geração de Empréstimos', 1, 'Testes relacionados à geração de empréstimos e regras de negócio', 3, 2),
          ('Aprovação de Documentos', 1, 'Verificar a aprovação e reprovação da documentação enviada', 4, 2),
          ('Transação na MPOS', 1, 'Validar a realização de transações utilizando a MPOS', 5, 2);`
    );
    
    // Seeds para a tabela 'test_cases'
    insertIfTableEmpty(
      'test_cases',
      `INSERT INTO test_cases (name, "order", count, description, steps, enabled, can_edit, test_scenario_id) VALUES
          ('Login com credenciais válidas', 1, 1, 'Login realizado com credenciais válidas', '1. Acessar a página de login\n2. Inserir e-mail e senha válidos\n3. Clicar em Entrar\n4. Verificar se o login foi bem-sucedido', 1, 1, 1),
          ('Login com credenciais inválidas', 2, 1, 'Tentativa de login com senha incorreta', '1. Acessar a página de login\n2. Inserir e-mail válido e senha inválida\n3. Verificar se a mensagem de erro é exibida', 1, 1, 1),
          ('Esqueci minha senha', 3, 1, 'Recuperação de senha através do e-mail cadastrado', '1. Clicar em "Esqueci minha senha"\n2. Inserir o e-mail cadastrado\n3. Verificar envio do link de recuperação', 1, 1, 1),
          
          ('Cadastro de produto válido', 1, 1, 'Cadastro de um novo produto com todos os dados obrigatórios', '1. Acessar a página de produtos\n2. Clicar em "Adicionar Produto"\n3. Preencher os dados obrigatórios\n4. Clicar em "Salvar"\n5. Verificar se o produto foi adicionado', 1, 1, 2),
          ('Editar produto existente', 2, 1, 'Editar informações de um produto já cadastrado', '1. Acessar a página de produtos\n2. Selecionar um produto existente\n3. Alterar informações do produto\n4. Clicar em "Salvar"\n5. Verificar se as alterações foram aplicadas', 1, 1, 2),
          ('Excluir produto', 3, 1, 'Excluir um produto existente', '1. Acessar a página de produtos\n2. Selecionar um produto existente\n3. Clicar em "Excluir"\n4. Confirmar a exclusão\n5. Verificar se o produto foi removido', 1, 1, 2),
          
          ('Gerar relatório de vendas', 1, 1, 'Geração de relatório com vendas realizadas em um período', '1. Acessar a página de Relatórios\n2. Selecionar período desejado\n3. Clicar em "Gerar Relatório"\n4. Verificar se os dados estão corretos', 1, 1, 3),
          ('Exportar relatório de vendas', 2, 1, 'Exportar relatório de vendas para arquivo', '1. Acessar a página de Relatórios\n2. Selecionar o relatório desejado\n3. Clicar em "Exportar"\n4. Verificar se o arquivo foi baixado corretamente', 1, 1, 3);`
    );
    // Seeds para a tabela 'test_cases'
    insertIfTableEmpty(
      'test_cases',
      `INSERT INTO test_cases (name, "order", count, description, steps, enabled, can_edit, test_scenario_id) VALUES
          ('Atualizar estoque de produto existente', 1, 1, 'Verificar atualização do estoque de um produto existente', '1. Acessar a página de Estoque\n2. Localizar o produto desejado\n3. Atualizar o campo de quantidade disponível\n4. Clicar em "Salvar"\n5. Verificar se o estoque foi atualizado', 1, 1, 4),
          ('Reduzir estoque após venda', 2, 1, 'Validar redução automática no estoque após venda', '1. Acessar a página de Vendas\n2. Registrar a venda de um produto existente\n3. Finalizar venda\n4. Verificar se o estoque foi reduzido', 1, 1, 4),
          
          ('Criar nova categoria', 1, 1, 'Testar criação de nova categoria de produto', '1. Acessar a página de Categorias\n2. Clicar em "Nova Categoria"\n3. Inserir o nome da categoria\n4. Clicar em "Salvar"\n5. Verificar se a categoria foi adicionada', 1, 1, 5),
          ('Editar categoria existente', 2, 1, 'Editar nome de uma categoria já existente', '1. Acessar a página de Categorias\n2. Selecionar uma categoria existente\n3. Alterar o nome da categoria\n4. Clicar em "Salvar"\n5. Verificar se as alterações foram aplicadas', 1, 1, 5),
          
          ('Gerar relatório de produtos em baixa', 1, 1, 'Geração de relatório com produtos abaixo do estoque mínimo', '1. Acessar a página de Relatórios\n2. Selecionar a opção "Produtos em baixa"\n3. Clicar em "Gerar Relatório"\n4. Verificar se o relatório foi gerado corretamente', 1, 1, 6),
          ('Exportar relatório de estoque', 2, 1, 'Exportar relatório atual de estoque para arquivo', '1. Acessar a página de Relatórios\n2. Selecionar o relatório de estoque atual\n3. Clicar em "Exportar"\n4. Verificar se o arquivo foi baixado com os dados corretos', 1, 1, 6),

          ('Calcular financiamento com entrada válida', 1, 1, 'Verificar cálculo correto do financiamento com entrada', '1. Acessar a página de Financiamento\n2. Inserir os dados do cliente e do veículo\n3. Informar um valor de entrada válido\n4. Clicar em "Calcular"\n5. Verificar se o valor do financiamento foi exibido corretamente', 1, 1, 7),
          ('Calcular financiamento sem entrada', 2, 1, 'Verificar cálculo de financiamento sem entrada', '1. Acessar a página de Financiamento\n2. Inserir os dados do cliente e do veículo\n3. Não informar valor de entrada\n4. Clicar em "Calcular"\n5. Verificar se o valor do financiamento foi exibido corretamente', 1, 1, 7);`
    );
    // // Seeds para a tabela 'test_cases'
    insertIfTableEmpty(
      'test_cases',
      `INSERT INTO test_cases (name, "order", count, description, steps, enabled, can_edit, test_scenario_id) VALUES
          ('Inserir CPF inválido', 1, 1, 'Validar erro ao inserir CPF inválido em cadastro', '1. Acessar a página de Cadastro do Cliente\n2. Inserir um CPF inválido\n3. Clicar em "Salvar"\n4. Verificar se o sistema exibe uma mensagem de erro', 1, 1, 8),
          ('Validar campos obrigatórios', 2, 1, 'Verificar se o sistema impede o envio de cadastro sem campos obrigatórios preenchidos', '1. Acessar a página de Cadastro do Cliente\n2. Tentar salvar sem preencher os campos obrigatórios\n3. Verificar se o sistema exibe mensagem de erro', 1, 1, 8),

          ('Simular empréstimo válido', 1, 1, 'Simulação de empréstimo com dados válidos', '1. Acessar a página de Empréstimos\n2. Inserir dados válidos do cliente\n3. Inserir valor do empréstimo\n4. Clicar em "Simular"\n5. Verificar se o sistema exibe a simulação corretamente', 1, 1, 9),
          ('Rejeitar simulação com dados inválidos', 2, 1, 'Rejeitar simulação de empréstimo com dados inválidos', '1. Acessar a página de Empréstimos\n2. Inserir dados inválidos do cliente\n3. Inserir valor do empréstimo\n4. Clicar em "Simular"\n5. Verificar se o sistema exibe mensagem de erro', 1, 1, 9),

          ('Aprovar documentos válidos', 1, 1, 'Verificar aprovação de documentos válidos enviados', '1. Acessar a página de Documentação\n2. Selecionar documentos válidos\n3. Clicar em "Aprovar"\n4. Verificar se o sistema marca os documentos como aprovados', 1, 1, 10),
          ('Rejeitar documentos inválidos', 2, 1, 'Verificar rejeição de documentos inválidos enviados', '1. Acessar a página de Documentação\n2. Selecionar documentos inválidos\n3. Clicar em "Rejeitar"\n4. Verificar se o sistema marca os documentos como rejeitados', 1, 1, 10),

          ('Realizar transação de venda com sucesso', 1, 1, 'Validar realização de transação de venda bem-sucedida', '1. Acessar a página de Transações na MPOS\n2. Inserir dados do cliente e do cartão\n3. Inserir valor da venda\n4. Clicar em "Confirmar"\n5. Verificar se a transação foi aprovada', 1, 1, 11),
          ('Rejeitar transação com cartão inválido', 2, 1, 'Validar rejeição de transação com dados inválidos do cartão', '1. Acessar a página de Transações na MPOS\n2. Inserir dados do cliente e um cartão inválido\n3. Inserir valor da venda\n4. Clicar em "Confirmar"\n5. Verificar se o sistema rejeita a transação', 1, 1, 11);`
    );

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

    // Seeds para a tabela 'test_executions'
    insertIfTableEmpty('test_executions', `
      INSERT INTO test_executions (start_date, end_date, test_plan_id, build_id, status, comments)
      VALUES 
        ('28/09/2024', '28/09/2024 14:00', 1, 1, 2, 'Primeira execução de testes do plano 1'),
        ('28/09/2024', '29/09/2024 14:00', 2, 2, 1, 'Execução de testes com observações');
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
    
    // Seeds para a tabela 'test_executions_test_cases'
    insertIfTableEmpty('test_executions_test_cases', `
      INSERT INTO test_executions_test_cases (created_at, comment, passed, skipped, failed, test_execution_id, test_case_id)
      VALUES 
        ('28/09/2024 14:01', 'Produto atualizado com sucesso', 1, 0, 0, 1, 1),
        ('28/09/2024 14:03', 'Não foi reduzido estoque', 0, 0, 1, 1, 2),
        ('28/09/2024 14:05', 'Categoria cadastrada corretamente', 1, 0, 0, 1, 3),
        ('28/09/2024 14:14', 'Categoria cadastrada corretamente', 1, 0, 0, 2, 3);
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

let allowSeed = true;
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

db.run('PRAGMA foreign_keys = OFF;')

// Exporta o banco de dados para ser utilizado nas controllers
module.exports = db;