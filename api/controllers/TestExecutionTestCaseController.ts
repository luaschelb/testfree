import express from 'express'
import prisma from '../db'
const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const rows = await prisma.test_executions_test_cases.findMany()
        res.status(200).json(rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Query no banco falhou' })
    }
})

router.get('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const row = await prisma.test_executions_test_cases.findUnique({
            where: { id: Number(id) }
        })
        if (!row) {
            return res.status(404).json({ error: 'Caso de teste não encontrado' })
        }
        res.status(200).json(row)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Query no banco falhou' })
    }
})

router.post('/', async (req, res) => {
    const { created_at, comment, passed, skipped, failed, test_execution_id, test_case_id } = req.body
    try {
        const result = await prisma.test_executions_test_cases.create({
            data: {
                created_at: new Date(created_at),
                comment,
                passed,
                skipped,
                failed,
                test_execution_id,
                test_case_id
            }
        })
        res.status(201).json({ id: result.id })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Query no banco falhou.' })
    }
})

router.put('/:id', async (req, res) => {
    const { id } = req.params
    const { created_at, comment, passed, skipped, failed, test_execution_id, test_case_id } = req.body
    try {
        const updated = await prisma.test_executions_test_cases.update({
            where: { id: Number(id) },
            data: {
                created_at: new Date(created_at),
                comment,
                passed,
                skipped,
                failed,
                test_execution_id,
                test_case_id
            }
        })
        res.status(200).json({ id: updated.id })
    } catch (err: any) {
        if (err.code === 'P2025') {
            return res.status(404).json({ error: 'Caso de teste não encontrado' })
        }
        console.error(err)
        res.status(500).json({ error: 'Query no banco falhou.' })
    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params
    try {
        await prisma.test_executions_test_cases.delete({
            where: { id: Number(id) }
        })
        res.status(200).json({ message: 'Caso de teste deletado com sucesso' })
    } catch (err: any) {
        if (err.code === 'P2025') {
            return res.status(404).json({ error: 'Caso de teste não encontrado' })
        }
        console.error(err)
        res.status(500).json({ error: 'Query no banco falhou.' })
    }
})

module.exports