const express = require('express');
const db = require("../db"); // Importa o banco de dados sqlite
const router = express.Router();

// Get all test cases
router.get('/', (req, res) => {
    db.all("SELECT * FROM testcases", [], (err, rows) => {
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
    db.get("SELECT * FROM testcases WHERE id = ?", [id], (err, row) => {
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
    const { description, steps, testscenario_id } = req.body;
    if (!description || !steps || !testscenario_id) {
        return res.status(400).json({ error: 'Descrição, passos e ID do cenário são obrigatórios.' });
    }

    db.run(
        "INSERT INTO testcases (description, steps, testscenario_id) VALUES (?, ?, ?)",
        [description, steps, testscenario_id],
        function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Query no banco falhou.' });
            }
            res.status(201).json({ id: this.lastID, description, steps, testscenario_id });
        }
    );
});

// Update a test case by ID
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { test_id, name, description, steps, testscenario_id } = req.body;

    if (!description || !steps || !testscenario_id) {
        return res.status(400).json({ error: 'Descrição, passos e ID do cenário são obrigatórios.' });
    }

    db.run(
        `UPDATE testcases SET 
            test_id = ?,
            name = ?,
            description = ?, 
            steps = ?, 
            testscenario_id = ? 
        WHERE id = ?`,
        [test_id, name, description, steps, testscenario_id, id],
        function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Query no banco falhou.' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Caso de teste não encontrado' });
            }
            res.status(200).json({ id, description, steps, testscenario_id });
        }
    );
});

// Delete a test case by ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM testcases WHERE id = ?", [id], function (err) {
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