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
    db.get("SELECT * FROM test_plans WHERE id = ?", [id], (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Query no banco falhou' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Plano de teste não encontrado' });
        }
        res.status(200).json(row);
    });
});

// pega test plans por projeto
router.get('/project/:project_id', (req, res) => {
    const { project_id } = req.params;
    db.all("SELECT * FROM test_plans where test_plans.project_id == ?", [project_id], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Query no banco falhou' });
        }
        res.status(200).json(rows);
    });
});

// Create a new test plan
router.post('/', (req, res) => {
    const { name, description, active, project_id } = req.body;
    if (!name || !description || typeof active === 'undefined' || !project_id) {
        return res.status(400).json({ error: 'Nome, descrição, ativo e project_id são obrigatórios.' });
    }

    db.run(
        "INSERT INTO test_plans (name, description, active, project_id) VALUES (?, ?, ?, ?)",
        [name, description, active, project_id],
        function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Query no banco falhou.' });
            }
            res.status(201).json({ id: this.lastID, name, description, active, project_id });
        }
    );
});

// Update a test plan by ID
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, active, project_id } = req.body;
    if (!name || !description || typeof active === 'undefined' || !project_id) {
        return res.status(400).json({ error: 'Nome, descrição, ativo e project_id são obrigatórios.' });
    }

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
            res.status(200).json({ id, name, description, active, project_id });
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

// Link a test case to a test plan (individual)
router.post('/:id/test-cases/:testCaseId', (req, res) => {
    const { id, testCaseId } = req.params;
    db.run(
        "INSERT INTO testplans_testcases (test_plan_id, test_case_id) VALUES (?, ?)",
        [id, testCaseId],
        function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Falha ao vincular caso de teste ao plano de teste.' });
            }
            res.status(201).json({ test_plan_id: id, test_case_id: testCaseId });
        }
    );
});

// Unlink a test case from a test plan (individual)
router.delete('/:id/test-cases/:testCaseId', (req, res) => {
    const { id, testCaseId } = req.params;
    db.run(
        "DELETE FROM testplans_testcases WHERE test_plan_id = ? AND test_case_id = ?",
        [id, testCaseId],
        function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Falha ao desvincular caso de teste do plano de teste.' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Caso de teste ou plano de teste não encontrado' });
            }
            res.status(200).json({ message: 'Caso de teste desvinculado com sucesso' });
        }
    );
});

// Link multiple test cases to a test plan
router.post('/:id/test-cases', (req, res) => {
    const { id } = req.params;
    const { testCaseIds } = req.body; // Expects an array of testCaseIds
    if (!Array.isArray(testCaseIds) || testCaseIds.length === 0) {
        return res.status(400).json({ error: 'É necessário fornecer uma lista de IDs de casos de teste.' });
    }

    const placeholders = testCaseIds.map(() => "(?, ?)").join(", ");
    const values = testCaseIds.flatMap(testCaseId => [id, testCaseId]);

    db.run(
        `INSERT INTO testplans_testcases (test_plan_id, test_case_id) VALUES ${placeholders}`,
        values,
        function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Falha ao vincular casos de teste ao plano de teste.' });
            }
            res.status(201).json({ test_plan_id: id, test_case_ids: testCaseIds });
        }
    );
});

module.exports = router;