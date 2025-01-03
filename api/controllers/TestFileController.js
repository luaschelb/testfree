const express = require('express');
const multer = require('multer'); // Middleware para lidar com upload de arquivos
const path = require('path');
const fs = require('fs');
const db = require("../db"); // Importa o banco de dados sqlite
const router = express.Router();

// Configura o multer para salvar arquivos na pasta "screenshots"
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.posix.join(__dirname, '../screenshots')); // Pasta onde os arquivos serão salvos
    },
    filename: (req, file, cb) => {
        const sanitizedFilename = `${Date.now()}-${file.originalname.replace(/[\s]/g, '_')}`;
        cb(null, sanitizedFilename);
    }
});
const upload = multer({ storage });

// Middleware para servir arquivos estáticos
router.use('/screenshots', express.static(path.posix.join(__dirname, '../screenshots')));

// Get all files for a specific test_executions_test_cases_id
router.get('/:testExecutionTestCaseId/files', (req, res) => {
    const { testExecutionTestCaseId } = req.params;

    db.all(
        "SELECT * FROM files WHERE test_executions_test_cases_id = ?",
        [testExecutionTestCaseId],
        (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Query no banco falhou' });
            }
            // Adiciona a URL completa para renderização pelo frontend
            const filesWithUrl = rows.map(file => ({
                ...file,
                url: `${req.protocol}://${req.get('host')}/testfiles/screenshots/${path.basename(file.path)}`
            }));
            res.status(200).json(filesWithUrl);
        }
    );
});

// Upload and save a file for a specific test_executions_test_cases_id
router.post('/:testExecutionTestCaseId/files', upload.single('file'), (req, res) => {
    const { testExecutionTestCaseId } = req.params;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: 'Nenhum arquivo foi enviado.' });
    }

    const filePath = path.posix.join('/screenshots', file.filename);

    db.run(
        "INSERT INTO files (name, path, test_executions_test_cases_id) VALUES (?, ?, ?)",
        [file.filename, filePath, testExecutionTestCaseId],
        function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Query no banco falhou.' });
            }
            const url = `${req.protocol}://${req.get('host')}${filePath}`;
            res.status(201).json({
                id: this.lastID,
                name: file.filename,
                path: filePath,
                url,
                test_executions_test_cases_id: testExecutionTestCaseId
            });
        }
    );
});

// Delete a file by fileId
router.delete('/files/:fileId', (req, res) => {
    const { fileId } = req.params;

    // Primeiro, recuperamos o caminho do arquivo para excluí-lo
    db.get(
        "SELECT path FROM files WHERE id = ?",
        [fileId],
        (err, row) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Query no banco falhou' });
            }
            if (!row) {
                return res.status(404).json({ error: 'Arquivo não encontrado' });
            }

            const filePath = path.posix.join(__dirname, '..', row.path);

            // Excluímos o arquivo do sistema de arquivos
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Falha ao excluir o arquivo físico' });
                }

                // Removemos o registro do banco de dados
                db.run(
                    "DELETE FROM files WHERE id = ?",
                    [fileId],
                    function (err) {
                        if (err) {
                            console.error(err);
                            return res.status(500).json({ error: 'Query no banco falhou' });
                        }
                        if (this.changes === 0) {
                            return res.status(404).json({ error: 'Arquivo não encontrado' });
                        }
                        res.status(200).json({ message: 'Arquivo deletado com sucesso' });
                    }
                );
            });
        }
    );
});

module.exports = router;