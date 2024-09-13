const express = require('express');
const db = require("../db"); // Importa o banco de dados sqlite
const router = express.Router();

// Get all test projects
router.get('/', (req, res) => {
    db.all("SELECT * FROM testprojects", [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Query no banco falhou' });
        }
        res.status(200).json(rows);
    });
});

// Get test project by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM testprojects WHERE id = ?", [id], (err, row) => {
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
        "INSERT INTO testprojects (name, description) VALUES (?, ?)",
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
        "UPDATE testprojects SET name = ?, description = ? WHERE id = ?",
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
    db.run("DELETE FROM testprojects WHERE id = ?", [id], function (err) {
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