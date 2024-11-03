const express = require('express');
const db = require("../db"); // Importa o banco de dados sqlite
const router = express.Router();

// Get all test cases
router.get('/', (req, res) => {
    db.all("SELECT * FROM test_executions_test_cases", [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Query no banco falhou' });
        }
        res.status(200).json(rows);
    });
});

// Get test case by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM test_executions_test_cases WHERE id = ?", [id], (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Query no banco falhou' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Caso de teste não encontrado' });
        }
        res.status(200).json(row);
    });
});

// Create a new test case
router.post('/', (req, res) => {
    const { created_at, comment, passed, skipped, failed, test_execution_id, test_case_id } = req.body;

    if (!created_at || comment === undefined || passed === undefined || skipped === undefined|| failed === undefined || !test_execution_id || !test_case_id) {
        return res.status(400).json({ error: 'created_at, comment, passed, skipped, failed, test_execution_id, test_case_id são obrigatórios.' });
    }
    db.run(
        "INSERT INTO test_executions_test_cases (created_at, comment, passed, skipped, failed, test_execution_id, test_case_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [created_at, comment, passed, skipped, failed, test_execution_id, test_case_id],
        function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Query no banco falhou.' });
            }
            res.status(201).json({ id: this.lastID });
        }
    );
});

// Update a test case by ID
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { created_at, comment, passed, skipped, failed, test_execution_id, test_case_id } = req.body;

    if (!created_at || comment === undefined || passed === undefined || skipped === undefined|| failed === undefined|| !test_execution_id || !test_case_id) {
        return res.status(400).json({ error: 'created_at, comment, passed, skipped, failed, test_execution_id, test_case_id são obrigatórios.' });
    }

    db.run(
        `UPDATE test_executions_test_cases SET 
            created_at = ?,
            comment = ?,
            passed = ?,
            skipped = ?,
            failed = ?,
            test_execution_id = ?,
            test_case_id = ?
        WHERE id = ?`,
        [created_at, comment, passed, skipped, failed, test_execution_id, test_case_id, id],
        function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Query no banco falhou.' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Caso de teste não encontrado' });
            }
            res.status(200).json({ id });
        }
    );
});

// Delete a test case by ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM test_executions_test_cases WHERE id = ?", [id], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Query no banco falhou.' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Caso de teste não encontrado' });
        }
        res.status(200).json({ message: 'Caso de teste deletado com sucesso' });
    });
});

module.exports = router;