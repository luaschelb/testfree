const express = require('express');
const db = require("../db"); // Importa o banco de dados sqlite
const router = express.Router();

// Get all test projects
router.get('/', (req, res) => {
    db.all("SELECT * FROM projects", [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Query no banco falhou' });
        }
        res.status(200).json(rows);
    });
});

// Get count for test_scenarios, builds, test_executions, e test_plans for the project
router.get('/count/:id', (req, res) => {
    const { id } = req.params;

    const query = `
        SELECT
            (SELECT COUNT(*) FROM test_scenarios WHERE test_project_id = p.id) AS test_scenarios_count,
            (SELECT COUNT(*) FROM builds WHERE project_id = p.id) AS builds_count,
            (SELECT COUNT(*) FROM test_executions te
             INNER JOIN builds b ON te.build_id = b.id
             WHERE b.project_id = p.id) AS test_executions_count,
            (SELECT COUNT(*) FROM test_plans WHERE project_id = p.id) AS test_plans_count
        FROM projects p
        WHERE p.id = ?
    `;

    db.get(query, [id], (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Query no banco falhou' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Projeto de teste não encontrado' });
        }
        res.status(200).json({
            test_scenarios_count: row.test_scenarios_count || 0,
            builds_count: row.builds_count || 0,
            test_executions_count: row.test_executions_count || 0,
            test_plans_count: row.test_plans_count || 0,
        });
    });
});

// Get test project by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM projects WHERE id = ?", [id], (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Query no banco falhou' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Projeto de teste não encontrado' });
        }
        res.status(200).json(row);
    });
});

// Create a new test project
router.post('/', (req, res) => {
    const { name, description } = req.body;
    if (!name || !description) {
        return res.status(400).json({ error: 'Nome e descrição são obrigatórios.' });
    }

    db.run(
        "INSERT INTO projects (name, description) VALUES (?, ?)",
        [name, description],
        function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Query no banco falhou.' });
            }
            // `this.lastID` é o ID gerado do último insert
            res.status(201).json({ id: this.lastID, name, description });
        }
    );
});

// Update a test project by ID
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    if (!name || !description) {
        return res.status(400).json({ error: 'Nome e descrição são obrigatórios.' });
    }

    db.run(
        "UPDATE projects SET name = ?, description = ? WHERE id = ?",
        [name, description, id],
        function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Query no banco falhou.' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Projeto de teste não encontrado' });
            }
            res.status(200).json({ id, name, description });
        }
    );
});

// Delete a test project by ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM projects WHERE id = ?", [id], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Query no banco falhou.' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Projeto de teste não encontrado' });
        }
        res.status(200).json({ message: 'Projeto de teste deletado com sucesso' });
    });
});

module.exports = router;