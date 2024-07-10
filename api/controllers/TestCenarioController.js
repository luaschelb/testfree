const express = require('express');
const pool = require("../db");
const router = express.Router();

// Get all test scenarios
router.get('/', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM testcenarios");
        console.log(rows);
        res.status(200).json(rows);
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
        const rows = await conn.query("SELECT * FROM testcenarios WHERE id = ?", [id]);
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
        const result = await conn.query("INSERT INTO testcenarios (name, description, testproject_id) VALUES (?, ?, ?)", [name, description, testproject_id]);
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
        const result = await conn.query("UPDATE testcenarios SET name = ?, description = ?, testproject_id = ? WHERE id = ?", [name, description, testproject_id, id]);
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
        const result = await conn.query("DELETE FROM testcenarios WHERE id = ?", [id]);
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