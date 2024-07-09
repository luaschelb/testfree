const express = require('express');
const pool = require("../db");
const router = express.Router();

router.get('/', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM testcases");
        console.log(rows);
        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Query no banco falhou' });
    } finally {
        if (conn) conn.release(); // release to pool
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM testcases WHERE id = ?", [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Caso de teste não encontrado' });
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

router.post('/', async (req, res) => {
    const { description, steps, testcenario_id } = req.body;
    if (!description || !steps || !testcenario_id) {
        return res.status(400).json({ error: 'Descrição, passos e ID do cenário são obrigatórios.' });
    }

    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query("INSERT INTO testcases (description, steps, testcenario_id) VALUES (?, ?, ?)", [description, steps, testcenario_id]);
        console.log("Post sucesso", result);
        res.status(201).json({ id: result.insertId, description, steps, testcenario_id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Query no banco falhou.' });
    } finally {
        if (conn) conn.release(); // release to pool
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { description, steps, testcenario_id } = req.body;
    if (!description || !steps || !testcenario_id) {
        return res.status(400).json({ error: 'Descrição, passos e ID do cenário são obrigatórios.' });
    }

    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query("UPDATE testcases SET description = ?, steps = ?, testcenario_id = ? WHERE id = ?", [description, steps, testcenario_id, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Caso de teste não encontrado' });
        }
        console.log("Put sucesso", result);
        res.status(200).json({ id, description, steps, testcenario_id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Query no banco falhou.' });
    } finally {
        if (conn) conn.release(); // release to pool
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query("DELETE FROM testcases WHERE id = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Caso de teste não encontrado' });
        }
        console.log("Delete sucesso", result);
        res.status(200).json({ message: 'Caso de teste deletado com sucesso' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Query no banco falhou.' });
    } finally {
        if (conn) conn.release(); // release to pool
    }
});

module.exports = router;