const express = require('express');
const pool = require("../db");
const router = express.Router();

// Get all test projects
router.get('/', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM testprojects");
        console.log(rows);
        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Query no banco falhou' });
    } finally {
        if (conn) conn.release(); // release to pool
    }
});

// Get test project by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM testprojects WHERE id = ?", [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Projeto de teste não encontrado' });
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

// Create a new test project
router.post('/', async (req, res) => {
    const { name, description } = req.body;
    if (!name || !description) {
        return res.status(400).json({ error: 'Nome e descrição são obrigatórios.' });
    }

    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query("INSERT INTO testprojects (name, description) VALUES (?, ?)", [name, description]);
        console.log("Post sucesso", result);
        res.status(201).json({ id: result.id, name, description });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Query no banco falhou.' });
    } finally {
        if (conn) conn.release(); // release to pool
    }
});

// Update a test project by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    if (!name || !description) {
        return res.status(400).json({ error: 'Nome e descrição são obrigatórios.' });
    }

    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query("UPDATE testprojects SET name = ?, description = ? WHERE id = ?", [name, description, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Projeto de teste não encontrado' });
        }
        console.log("Put sucesso", result);
        res.status(200).json({ id, name, description });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Query no banco falhou.' });
    } finally {
        if (conn) conn.release(); // release to pool
    }
});

// Delete a test project by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query("DELETE FROM testprojects WHERE id = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Projeto de teste não encontrado' });
        }
        console.log("Delete sucesso", result);
        res.status(200).json({ message: 'Projeto de teste deletado com sucesso' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Query no banco falhou.' });
    } finally {
        if (conn) conn.release(); // release to pool
    }
});

module.exports = router;