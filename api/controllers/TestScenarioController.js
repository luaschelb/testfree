const express = require('express');
const pool = require("../db");
const router = express.Router();

// Get all test scenarios
router.get('/', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM testscenarios");
        console.log(rows);
        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Query no banco falhou' });
    } finally {
        if (conn) conn.release(); // release to pool
    }
});

// Get all test scenarios with test cases
router.get('/eager', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(`
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
            LEFT JOIN testcases ON testcases.testscenario_id = testscenarios.id
        `);

        // Transform rows into the desired format
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

        console.log(grouped);
        res.status(200).json(grouped);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Query no banco falhou' });
    } finally {
        if (conn) conn.release(); // release to pool
    }
});

// Get test scenario by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM testscenarios WHERE id = ?", [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Cenário de teste não encontrado' });
        }
        console.log(rows[0]);
        res.status(200).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Query no banco falhou' });
    } finally {
        if (conn) conn.release(); // release to pool
    }
});

// Create a new test scenario
router.post('/', async (req, res) => {
    const { name, description, testproject_id } = req.body;
    if (!name || !description || !testproject_id) {
        return res.status(400).json({ error: 'Nome, descrição e ID do projeto de teste são obrigatórios.' });
    }

    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query("INSERT INTO testscenarios (name, description, testproject_id) VALUES (?, ?, ?)", [name, description, testproject_id]);
        console.log("Post sucesso", result);
        res.status(201).json({ id: result.id, name, description, testproject_id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Query no banco falhou.' });
    } finally {
        if (conn) conn.release(); // release to pool
    }
});

// Update a test scenario by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, testproject_id } = req.body;
    if (!name || !description || !testproject_id) {
        return res.status(400).json({ error: 'Nome, descrição e ID do projeto de teste são obrigatórios.' });
    }

    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query("UPDATE testscenarios SET name = ?, description = ?, testproject_id = ? WHERE id = ?", [name, description, testproject_id, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cenário de teste não encontrado' });
        }
        console.log("Put sucesso", result);
        res.status(200).json({ id, name, description, testproject_id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Query no banco falhou.' });
    } finally {
        if (conn) conn.release(); // release to pool
    }
});

// Delete a test scenario by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query("DELETE FROM testscenarios WHERE id = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cenário de teste não encontrado' });
        }
        console.log("Delete sucesso", result);
        res.status(200).json({ message: 'Cenário de teste deletado com sucesso' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Query no banco falhou.' });
    } finally {
        if (conn) conn.release(); // release to pool
    }
});

module.exports = router;