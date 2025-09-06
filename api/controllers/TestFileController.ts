import express, { Request, Response } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import prisma from '../db'

const router = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../screenshots'))
    },
    filename: (req, file, cb) => {
        const sanitizedFilename = `${Date.now()}-${file.originalname.replace(/[\s]/g, '_')}`
        cb(null, sanitizedFilename)
    }
})
const upload = multer({ storage })

router.use('/screenshots', express.static(path.join(__dirname, '../screenshots')))

router.get('/:testExecutionTestCaseId/files', async (req: Request, res: Response) => {
    const { testExecutionTestCaseId } = req.params
    try {
        const files = await prisma.files.findMany({
            where: { test_executions_test_cases_id: Number(testExecutionTestCaseId) }
        })
        const filesWithUrl = files.map(file => ({
            ...file,
            url: `${req.protocol}://${req.get('host')}/testfiles/screenshots/${path.basename(file.path ?? '')}`
        }))
        res.status(200).json(filesWithUrl)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Query no banco falhou' })
    }
})

router.post('/:testExecutionTestCaseId/files', upload.single('file'), async (req: Request, res: Response) => {
    const { testExecutionTestCaseId } = req.params
    const file = req.file

    if (!file) {
        return res.status(400).json({ error: 'Nenhum arquivo foi enviado.' })
    }

    const filePath = path.posix.join('/screenshots', file.filename)

    try {
        const result = await prisma.files.create({
            data: {
                name: file.filename,
                path: filePath,
                test_executions_test_cases_id: Number(testExecutionTestCaseId)
            }
        })
        const url = `${req.protocol}://${req.get('host')}${filePath}`
        res.status(201).json({
            id: result.id,
            name: file.filename,
            path: filePath,
            url,
            test_executions_test_cases_id: testExecutionTestCaseId
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Query no banco falhou.' })
    }
})

router.delete('/files/:fileId', async (req: Request, res: Response) => {
    const { fileId } = req.params
    try {
        const file = await prisma.files.findUnique({
            where: { id: Number(fileId) }
        })
        if (!file) {
            return res.status(404).json({ error: 'Arquivo não encontrado' })
        }
        const filePath = path.join(__dirname, '..', file.path ?? '')
        fs.unlink(filePath, async (err) => {
            if (err) {
                console.error(err)
                return res.status(500).json({ error: 'Falha ao excluir o arquivo físico' })
            }
            await prisma.files.delete({
                where: { id: Number(fileId) }
            })
            res.status(200).json({ message: 'Arquivo deletado com sucesso' })
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Query no banco falhou' })
    }
})

module.exports = router