const express = require('express');
const db = require("../db"); // Importa o banco de dados sqlite
const router = express.Router();

// Get all test plans
router.get('/', (req, res) => {
    db.all("SELECT * FROM test_plans", [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Query no banco falhou' });
        }
        res.status(200).json(rows);
    });
});

// Get test plan by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;

    // Query que pega os planos de teste e seus casos de teste
    const query = `
        SELECT 
            tp.id as test_plan_id, 
            tp.name as test_plan_name, 
            tp.description as test_plan_description, 
            tp.active as test_plan_active, 
            tp.project_id as project_id,
            tptc.test_case_id as test_case_id
        FROM test_plans as tp
        LEFT JOIN testplans_testcases as tptc ON tptc.test_plan_id = tp.id
        WHERE tp.id = ?
    `;

    db.all(query, [id], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Query no banco falhou' });
        }

        // Organizar os resultados
        let testPlans = {};

        rows.forEach(row => {
            // Se o plano de teste ainda não foi adicionado ao objeto, adiciona
            if (!testPlans[row.test_plan_id]) {
                testPlans[row.test_plan_id] = {
                    id: row.test_plan_id,
                    name: row.test_plan_name,
                    description: row.test_plan_description,
                    active: row.test_plan_active,
                    project_id: row.project_id,
                    test_cases: [] // Inicializa a lista de test cases
                };
            }

            // Se o caso de teste existir, adiciona-o à lista de test cases
            if (row.test_case_id) {
                testPlans[row.test_plan_id].test_cases.push(
                    row.test_case_id
                );
            }
        });

        // Converte o objeto testPlans em uma lista para a resposta
        const result = Object.values(testPlans);

        res.status(200).json(result[0]);
    });
});

// Pega test plans por projeto e retorna um JSON organizado
router.get('/project/:project_id', (req, res) => {
    const { project_id } = req.params;

    // Query que pega os planos de teste e seus casos de teste
    const query = `
        SELECT 
            tp.id as test_plan_id, 
            tp.name as test_plan_name, 
            tp.description as test_plan_description, 
            tp.active as test_plan_active, 
            tp.project_id as project_id,
            tptc.test_case_id as test_case_id
        FROM test_plans as tp
        LEFT JOIN testplans_testcases as tptc ON tptc.test_plan_id = tp.id
        WHERE tp.project_id = ?
    `;

    db.all(query, [project_id], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Query no banco falhou' });
        }

        // Organizar os resultados
        const testPlans = {};

        rows.forEach(row => {
            // Se o plano de teste ainda não foi adicionado ao objeto, adiciona
            if (!testPlans[row.test_plan_id]) {
                testPlans[row.test_plan_id] = {
                    id: row.test_plan_id,
                    name: row.test_plan_name,
                    description: row.test_plan_description,
                    active: row.test_plan_active,
                    project_id: row.project_id,
                    test_cases: [] // Inicializa a lista de test cases
                };
            }

            // Se o caso de teste existir, adiciona-o à lista de test cases
            if (row.test_case_id) {
                testPlans[row.test_plan_id].test_cases.push({
                    id: row.test_case_id
                });
            }
        });

        // Converte o objeto testPlans em uma lista para a resposta
        const result = Object.values(testPlans);

        res.status(200).json(result);
    });
});

// Create a new test plan
router.post('/', (req, res) => {
    const { name, description, active, project_id, testCases } = req.body;

    if (!name || !description || typeof active === 'undefined' || !project_id) {
        return res.status(400).json({ error: 'Nome, descrição, ativo e project_id são obrigatórios.' });
    }

    // Primeiro, cria o plano de teste
    db.run(
        "INSERT INTO test_plans (name, description, active, project_id) VALUES (?, ?, ?, ?)",
        [name, description, active, project_id],
        function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Query no banco falhou.' });
            }

            const testPlanId = this.lastID;

            // Se testCases foi fornecido e é um array, vincula os casos de teste ao plano de teste
            if (Array.isArray(testCases) && testCases.length > 0) {
                const placeholders = testCases.map(() => "(?, ?)").join(", ");
                const values = testCases.flatMap(testCaseId => [testPlanId, testCaseId]);

                db.run(
                    `INSERT INTO testplans_testcases (test_plan_id, test_case_id) VALUES ${placeholders}`,
                    values,
                    function (insertErr) {
                        if (insertErr) {
                            console.error(insertErr);
                            return res.status(500).json({ error: 'Falha ao vincular novos casos de teste.' });
                        }

                        // Resposta de sucesso com o plano e associações de test cases
                        res.status(201).json({
                            id: testPlanId,
                            name,
                            description,
                            active,
                            project_id,
                            test_case_ids: testCases
                        });
                    }
                );
            } else {
                // Se não há test cases, apenas retorna o plano de teste criado
                res.status(201).json({
                    id: testPlanId,
                    name,
                    description,
                    active,
                    project_id
                });
            }
        }
    );
});

// Update a test plan by ID, including linking test cases
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, active, project_id, testCases } = req.body;

    // Verifica se os campos obrigatórios estão presentes
    if (!name || !description || typeof active === 'undefined' || !project_id) {
        return res.status(400).json({ error: 'Nome, descrição, ativo e project_id são obrigatórios.' });
    }

    // Começa com a atualização dos dados principais do test plan
    db.run(
        "UPDATE test_plans SET name = ?, description = ?, active = ?, project_id = ? WHERE id = ?",
        [name, description, active, project_id, id],
        function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Query no banco falhou.' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Plano de teste não encontrado' });
            }

            // Agora faz a associação dos test cases, se `testCases` estiver presente
            if (Array.isArray(testCases)) {
                // Remove todas as associações de casos de teste com o plano de teste
                db.run(
                    "DELETE FROM testplans_testcases WHERE test_plan_id = ?",
                    [id],
                    function (deleteErr) {
                        if (deleteErr) {
                            console.error(deleteErr);
                            return res.status(500).json({ error: 'Falha ao remover casos de teste antigos.' });
                        }

                        // Se não há casos de teste para adicionar, finaliza aqui
                        if (testCases.length === 0) {
                            return res.status(200).json({
                                id,
                                name,
                                description,
                                active,
                                project_id,
                                test_cases: []
                            });
                        }

                        // Inserção de novos casos de teste
                        const placeholders = testCases.map(() => "(?, ?)").join(", ");
                        const values = testCases.flatMap(testCaseId => [id, testCaseId]);

                        db.run(
                            `INSERT INTO testplans_testcases (test_plan_id, test_case_id) VALUES ${placeholders}`,
                            values,
                            function (insertErr) {
                                if (insertErr) {
                                    console.error(insertErr);
                                    return res.status(500).json({ error: 'Falha ao vincular novos casos de teste.' });
                                }

                                // Resposta de sucesso com a associação dos test cases
                                res.status(200).json({
                                    id,
                                    name,
                                    description,
                                    active,
                                    project_id,
                                    test_case_ids: testCases
                                });
                            }
                        );
                    }
                );
            } else {
                // Se não houver test cases, apenas finalize a edição do test plan
                res.status(200).json({ id, name, description, active, project_id });
            }
        }
    );
});

// Delete a test plan by ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM test_plans WHERE id = ?", [id], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Query no banco falhou.' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Plano de teste não encontrado' });
        }
        res.status(200).json({ message: 'Plano de teste deletado com sucesso' });
    });
});

module.exports = router;