const express = require('express');
const db = require("../db"); // Importa o banco de dados sqlite
const router = express.Router();

// Get all builds
router.get('/project/:project_id', (req, res) => {
    const { project_id } = req.params;
    db.all("SELECT * FROM builds where builds.project_id == ?", [project_id], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Query no banco falhou' });
        }
        res.status(200).json(rows);
    });
});

// Get build by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    console.log(id)
    db.get("SELECT * FROM builds WHERE builds.id == ?", [id], (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Query no banco falhou' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Build não encontrada' });
        }
        res.status(200).json(row);
    });
});

// Create a new build
router.post('/', (req, res) => {
    const { title, version, description, active, project_id } = req.body;
    if (!title || !version || !project_id) {
        return res.status(400).json({ error: 'Título, versão e ID do projeto são obrigatórios.' });
    }

    db.run(
        "INSERT INTO builds (title, version, description, active, project_id) VALUES (?, ?, ?, ?, ?)",
        [title, version, description, active, project_id],
        function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Query no banco falhou.' });
            }
            res.status(201).json({ id: this.lastID, title, version, description, active, project_id });
        }
    );
});

// Update a build by ID
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { title, version, description, active, project_id } = req.body;

    if (!title || !version || !project_id) {
        return res.status(400).json({ error: 'Título, versão e ID do projeto são obrigatórios.' });
    }

    db.run(
        `UPDATE builds SET 
            title = ?,
            version = ?,
            description = ?, 
            active = ?, 
            project_id = ?
        WHERE id = ?`,
        [title, version, description, active, project_id, id],
        function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Query no banco falhou.' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Build não encontrada' });
            }
            res.status(200).json({ id, title, version, description, active, project_id });
        }
    );
});

// Delete a build by ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM builds WHERE id = ?", [id], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Query no banco falhou.' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Build não encontrada' });
        }
        res.status(200).json({ message: 'Build deletada com sucesso' });
    });
});

module.exports = router;