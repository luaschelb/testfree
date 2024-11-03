const express = require('express');
const db = require("../db"); // Importa o banco de dados sqlite
const router = express.Router();

// Get all executions
router.get('/', (req, res) => {
    db.all("SELECT * FROM test_executions", [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Query no banco falhou' });
        }
        res.status(200).json(rows);
    });
});

// Rota para listar execuções com o nome do plano de teste e versão da build
router.get('/list', (req, res) => {
    const query = `
        SELECT 
            e.id as execution_id,
            e.start_date,
            e.end_date,
            e.status,
            e.comments,
            tp.name as test_plan_name,
            b.version as build_version
        FROM 
            test_executions e
        JOIN 
            test_plans tp ON e.test_plan_id = tp.id
        JOIN 
            builds b ON e.build_id = b.id
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Falha ao buscar execuções.' });
        }
        res.status(200).json(rows);
    });
});


// Get all executions by project
router.get('/project/:project_id', (req, res) => {
    const { project_id } = req.params;
    const query = `
        SELECT 
            e.id as execution_id,
            e.start_date,
            e.end_date,
            e.status,
            e.comments,
            tp.name as test_plan_name,
            b.version as build_version
        FROM 
            test_executions e
        JOIN 
            test_plans tp ON e.test_plan_id = tp.id
        JOIN 
            builds b ON e.build_id = b.id
        where tp.project_id == ?
    `;
    db.all(query, [project_id], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Falha ao buscar execuções' });
        }
        res.status(200).json(rows);
    });
});

// Get execution by ID with related test cases and files
router.get('/:id', (req, res) => {
    const { id } = req.params;

    db.get("SELECT * FROM test_executions WHERE id = ?", [id], (err, execution) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Query no banco falhou' });
        }
        if (!execution) {
            return res.status(404).json({ error: 'Execução não encontrada' });
        }

        // Buscar test cases relacionados
        db.all(`
            SELECT 
                tc.id,
                tc.name as test_case_name,
                tc.description as test_case_description,
                tct.id as test_execution_test_case_id,
                tct.created_at,
                tct.comment,
                tct.passed,
                tct.skipped,
                tct.failed,
                tct.test_execution_id,
                tct.test_case_id
            FROM test_executions_test_cases tct
            JOIN test_cases tc ON tct.test_case_id = tc.id
            WHERE tct.test_execution_id = ?
        `, [id], (err, testCases) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao buscar os casos de teste' });
            }

            // Filtrar test cases únicos por test_case_id com maior created_at
            const uniqueTestCases = testCases.reduce((acc, testCase) => {
                const existing = acc[testCase.test_case_id];
                if (!existing || new Date(testCase.created_at) > new Date(existing.created_at)) {
                    acc[testCase.test_case_id] = testCase;
                }
                return acc;
            }, {});

            // Adicionar arquivos aos test cases únicos
            const promises = Object.values(uniqueTestCases).map((testCase) => {
                return new Promise((resolve, reject) => {
                    db.all("SELECT * FROM files WHERE test_executions_test_cases_id = ?", [testCase.id], (err, files) => {
                        if (err) reject(err);
                        testCase.files = files || [];
                        resolve();
                    });
                });
            });

            // Retornar a resposta com execução, casos de teste e arquivos
            Promise.all(promises).then(() => {
                res.status(200).json({
                    execution,
                    test_cases: Object.values(uniqueTestCases) // Converte para array
                });
            }).catch((error) => {
                console.error(error);
                res.status(500).json({ error: 'Erro ao buscar os arquivos' });
            });
        });
    });
});

// Create a new execution
router.post('/', (req, res) => {
    const { start_date, end_date, test_plan_id, build_id, status, comments } = req.body;

    db.run(
        "INSERT INTO test_executions (start_date, end_date, test_plan_id, build_id, status, comments) VALUES (?, ?, ?, ?, ?, ?)",
        [start_date, end_date, test_plan_id, build_id, status || 1, comments || null],
        function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Query no banco falhou' });
            }
            res.status(201).json({ id: this.lastID, start_date, end_date, test_plan_id, build_id, status, comments });
        }
    );
});

// Update an execution by ID
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { start_date, end_date, test_plan_id, build_id, status, comments } = req.body;

    db.run(
        `UPDATE test_executions SET 
            start_date = ?, 
            end_date = ?, 
            test_plan_id = ?, 
            build_id = ?, 
            status = ?, 
            comments = ? 
        WHERE id = ?`,
        [start_date, end_date, test_plan_id, build_id, status || 1, comments || null, id],
        function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Query no banco falhou' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Execução não encontrada' });
            }
            res.status(200).json({ id, start_date, end_date, test_plan_id, build_id, status, comments });
        }
    );
});

// Delete an execution by ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.run("DELETE FROM test_executions WHERE id = ?", [id], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Query no banco falhou' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Execução não encontrada' });
        }
        res.status(200).json({ message: 'Execução deletada com sucesso' });
    });
});

// Link a test case to an execution
router.post('/link-test-case', (req, res) => {
    const { test_execution_id, test_case_id } = req.body;

    db.run(
        "INSERT INTO test_executions_test_cases (test_execution_id, test_case_id) VALUES (?, ?)",
        [test_execution_id, test_case_id],
        function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao vincular o caso de teste' });
            }
            res.status(201).json({ message: 'Caso de teste vinculado com sucesso' });
        }
    );
});

// Unlink a test case from an execution
router.post('/unlink-test-case', (req, res) => {
    const { test_execution_id, test_case_id } = req.body;

    db.run(
        "DELETE FROM test_executions_test_cases WHERE test_execution_id = ? AND test_case_id = ?",
        [test_execution_id, test_case_id],
        function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao desvincular o caso de teste' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Caso de teste não vinculado a essa execução' });
            }
            res.status(200).json({ message: 'Caso de teste desvinculado com sucesso' });
        }
    );
});

// Link a file to a test case in an execution
router.post('/link-file', (req, res) => {
    const { name, path, test_executions_test_cases_id } = req.body;

    db.run(
        "INSERT INTO files (name, path, test_executions_test_cases_id) VALUES (?, ?, ?)",
        [name, path, test_executions_test_cases_id],
        function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao vincular o arquivo' });
            }
            res.status(201).json({ message: 'Arquivo vinculado com sucesso' });
        }
    );
});

// Unlink a file from a test case in an execution
router.delete('/unlink-file/:id', (req, res) => {
    const { id } = req.params;

    db.run("DELETE FROM files WHERE id = ?", [id], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao desvincular o arquivo' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Arquivo não encontrado' });
        }
        res.status(200).json({ message: 'Arquivo desvinculado com sucesso' });
    });
});

module.exports = router;