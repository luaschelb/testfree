const express = require('express');
const db = require("../db"); // Importa o banco de dados sqlite
const router = express.Router();

// Get all test scenarios
router.get('/', (req, res) => {
    db.all("SELECT * FROM test_scenarios", [], (err, rows) => {
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
            test_scenarios.id as test_scenarios_id,
            test_scenarios.count as test_scenarios_count,
            test_scenarios.name as test_scenarios_name,
            test_scenarios.description as test_scenarios_description,
            test_scenarios.test_project_id as test_scenarios_test_project_id,
            test_cases.id as test_cases_id,
            test_cases.count as test_cases_count,
            test_cases.name as test_cases_name,
            test_cases.description as test_cases_description,
            test_cases.steps as test_cases_steps,
            test_cases.test_scenario_id as test_cases_test_scenario_id
        FROM test_scenarios 
        LEFT JOIN test_cases ON test_cases.test_scenario_id = test_scenarios.id`;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Query no banco falhou' });
        }

        // Organize the result into the desired format
        const scenariosMap = {};
        rows.forEach(row => {
            if (!scenariosMap[row.test_scenarios_id]) {
                scenariosMap[row.test_scenarios_id] = {
                    id: row.test_scenarios_id,
                    count: row.test_scenarios_count,
                    name: row.test_scenarios_name,
                    description: row.test_scenarios_description,
                    test_project_id: row.test_scenarios_test_project_id,
                    test_cases: []
                };
            }
            if (row.test_cases_id) {
                scenariosMap[row.test_scenarios_id].test_cases.push({
                    id: row.test_cases_id,
                    count: row.test_cases_count,
                    name: row.test_cases_name,
                    description: row.test_cases_description,
                    steps: row.test_cases_steps,
                    test_scenario_id: row.test_cases_test_scenario_id
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
    db.get("SELECT * FROM test_scenarios WHERE id = ?", [id], (err, row) => {
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
    const { name, description, test_project_id } = req.body;
    if (!name || !description || !test_project_id) {
        return res.status(400).json({ error: 'Nome, descrição e ID do projeto de teste são obrigatórios.' });
    }

    db.run(
        "INSERT INTO test_scenarios (name, description, test_project_id) VALUES (?, ?, ?)",
        [name, description, test_project_id],
        function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Query no banco falhou.' });
            }
            res.status(201).json({ id: this.lastID, name, description, test_project_id });
        }
    );
});

// Update a test scenario by ID
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, test_project_id } = req.body;
    if (!name || !description || !test_project_id) {
        return res.status(400).json({ error: 'Nome, descrição e ID do projeto de teste são obrigatórios.' });
    }

    db.run(
        "UPDATE test_scenarios SET name = ?, description = ?, test_project_id = ? WHERE id = ?",
        [name, description, test_project_id, id],
        function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Query no banco falhou.' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Cenário de teste não encontrado' });
            }
            res.status(200).json({ id, name, description, test_project_id });
        }
    );
});

// Delete a test scenario by ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM test_scenarios WHERE id = ?", [id], function (err) {
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