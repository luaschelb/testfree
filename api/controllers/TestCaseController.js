const express = require('express')
const pool = require("../db")
const router = express.Router()

router.get('/', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM testcases");
        console.log(rows)
        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database query failed' });
    } finally {
        if (conn) conn.release(); // release to pool
    }
})

module.exports = router