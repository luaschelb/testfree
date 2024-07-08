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

router.post('/', async (req, res) => {
    const { description, steps } = req.body;
    if (!description || !steps) {
        return res.status(400).json({ error: 'Descrição e passos são obrigatórios.' });
    }

    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query("INSERT INTO testcases (description, steps) VALUES (?, ?)", [description, steps]);
        console.log("Post sucesso", result);
        res.status(201).json({ id: result.id, description, steps });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Query no banco falhou.' });
    } finally {
        if (conn) conn.release(); // release to pool
    }
});

module.exports = router;