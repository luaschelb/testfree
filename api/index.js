const express = require('express');
const cors = require('cors');
const mariadb = require('mariadb');

const app = express();

// Create a connection pool to MariaDB
const pool = mariadb.createPool({
  host: 'localhost', 
  user: 'schelb', 
  password: 'Abc@123',
  database: 'testfree',
  port: 3306,
  connectionLimit: 5
});

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
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
});


const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});