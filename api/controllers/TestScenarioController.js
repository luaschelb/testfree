const express = require('express');
const db = require("../db"); // Importa o banco de dados sqlite
const router = express.Router();

// Get all test scenarios
router.get('/', (req, res) => {
    db.all("SELECT * FROM testscenarios", [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Query no banco falhou' });
        }
        res.status(200).json(rows);
    });
});

// Get all test scenarios with test cases
router.get('/eager', (req, res) => {
    const query = `
        SELECT  
            testscenarios.id as testscenarios_id,
            testscenarios.test_id as testscenarios_test_id,
            testscenarios.name as testscenarios_name,
            testscenarios.description as testscenarios_description,
            testscenarios.testproject_id as testscenarios_testproject_id,
            testcases.id as testcases_id,
            testcases.test_id as testcases_test_id,
            testcases.name as testcases_name,
            testcases.description as testcases_description,
            testcases.steps as testcases_steps,
            testcases.testscenario_id as testcases_testscenario_id
        FROM testscenarios 
        LEFT JOIN testcases ON testcases.testscenario_id = testscenarios.id`;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Query no banco falhou' });
        }

        // Organize the result into the desired format
        const scenariosMap = {};
        rows.forEach(row => {
            if (!scenariosMap[row.testscenarios_id]) {
                scenariosMap[row.testscenarios_id] = {
                    id: row.testscenarios_id,
                    test_id: row.testscenarios_test_id,
                    name: row.testscenarios_name,
                    description: row.testscenarios_description,
                    testproject_id: row.testscenarios_testproject_id,
                    testcases: []
                };
            }
            if (row.testcases_id) {
                scenariosMap[row.testscenarios_id].testcases.push({
                    id: row.testcases_id,
                    test_id: row.testcases_test_id,
                    name: row.testcases_name,
                    description: row.testcases_description,
                    steps: row.testcases_steps,
                    testscenario_id: row.testcases_testscenario_id
                });
            }
        });

        const grouped = Object.values(scenariosMap);
        res.status(200).json(grouped);
    });
});

// Get test scenario by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM testscenarios WHERE id = ?", [id], (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Query no banco falhou' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Cenário de teste não encontrado' });
        }
        res.status(200).json(row);
    });
});

// Create a new test scenario
router.post('/', (req, res) => {
    const { name, description, testproject_id } = req.body;
    if (!name || !description || !testproject_id) {
        return res.status(400).json({ error: 'Nome, descrição e ID do projeto de teste são obrigatórios.' });
    }

    db.run(
        "INSERT INTO testscenarios (name, description, testproject_id) VALUES (?, ?, ?)",
        [name, description, testproject_id],
        function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Query no banco falhou.' });
            }
            res.status(201).json({ id: this.lastID, name, description, testproject_id });
        }
    );
});

// Update a test scenario by ID
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, testproject_id } = req.body;
    if (!name || !description || !testproject_id) {
        return res.status(400).json({ error: 'Nome, descrição e ID do projeto de teste são obrigatórios.' });
    }

    db.run(
        "UPDATE testscenarios SET name = ?, description = ?, testproject_id = ? WHERE id = ?",
        [name, description, testproject_id, id],
        function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Query no banco falhou.' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Cenário de teste não encontrado' });
            }
            res.status(200).json({ id, name, description, testproject_id });
        }
    );
});

// Delete a test scenario by ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM testscenarios WHERE id = ?", [id], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Query no banco falhou.' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Cenário de teste não encontrado' });
        }
        res.status(200).json({ message: 'Cenário de teste deletado com sucesso' });
    });
});

module.exports = router;