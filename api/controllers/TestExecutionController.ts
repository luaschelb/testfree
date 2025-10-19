import express from 'express'
import prisma from '../db'
const router = express.Router()

// Get all executions
router.get('/', async (req, res) => {
    const result = await prisma.test_executions.findMany(); 
    res.json(result)
});

// Rota para listar execuções com o nome do plano de teste e versão da build
router.get('/list', async (req, res) => {
    const result = await prisma.test_executions.findMany({
        include: {
            test_plan : true,
            build: true
        }
    })

    res.status(200).json(result);
});


// Get all executions by project
router.get('/project/:project_id', async (req, res) => {
    const { project_id } = req.params;
    const result = await prisma.test_executions.findMany({
        where: {
            test_plan: {
                project_id: Number(project_id)
            }
        },
        include: {
            test_plan: true,
            build: true
        }
    })
    res.status(200).json(result);
});

// Get execution by ID with related test cases and files
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const result = await prisma.test_executions.findFirst({
        where: {id : Number(id)},
        include: {
            test_executions_test_cases: {
                include: {
                    test_case: true,
                    files: true
                }
            },
            build: {
                include: {
                    project: true
                }
            },
            test_plan: true
        }
    })
    res.json(result)
});

// Create a new execution
router.post('/', async (req, res) => {
    const { start_date, end_date, test_plan_id, build_id, status, comments } = req.body;

    const result = await prisma.test_executions.create({
        data: {
            start_date, end_date, test_plan_id, build_id, status: status ?? 1, comments: comments ?? null
        }
    })

    res.status(201).json(result);
});

// Update an execution by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { start_date, end_date, test_plan_id, build_id, status, comments } = req.body;

    try {
        const result = await prisma.test_executions.update({
        where: { id: Number(id) },
        data: { start_date, end_date, test_plan_id, build_id, status: status ?? 1, comments: comments ?? null }
        })
        res.json(result)
    } catch (error) {
        return res.status(404).json({ error: 'Execução não encontrada' })
    }
});

// Delete an execution by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await prisma.test_cases.delete({
            where: { id: Number(id) }
        })
        res.json(result)
    } catch (error) {
        return res.status(404).json({ error: 'Execução não encontrada' })
    }
});

module.exports = router;