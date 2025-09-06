import express from 'express'
import prisma from '../db'

const router = express.Router()

router.get('/', async (req, res) => {
    const testplans = await prisma.test_plans.findMany();
    res.json(testplans)
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    const testplans = await prisma.test_plans.findFirst({
        where: { id: Number(id) },
        include: {
            testplans_testcases: true
        }
    })
    res.json(testplans)
});

router.get('/project/:project_id', async (req, res) => {
    const { project_id } = req.params;
    const testplans = await prisma.test_plans.findFirst({
        where: { project_id: Number(project_id) },
        include: {
            testplans_testcases: true
        }
    })
    res.json(testplans)
});

router.post('/', async (req, res) => {
    const { name, description, active, project_id, testCases} = req.body;

    const result = await prisma.test_plans.create({
        data: {name, description, active, project_id}
    })
    const testPlanId = result.id;

    // se passado uma lista de ids de testcases, adicionar 
    if (Array.isArray(testCases)) {
        if (testCases.length > 0) {
            await prisma.testplans_testcases.createMany({
                data: testCases.map((test_case_id: number) => ({
                    test_plan_id: Number(testPlanId),
                    test_case_id
                }))
            });
        }
    }

    res.status(201).json({
        id: testPlanId,
        name,
        description,
        active,
        project_id,
        test_case_ids: testCases
    });
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, active, project_id, testCases } = req.body;

    try {
        // Atualiza o plano de teste
        const updatedPlan = await prisma.test_plans.update({
            where: { id: Number(id) },
            data: { name, description, active, project_id }
        });

        // Se testCases for um array, atualiza as associações
        if (Array.isArray(testCases)) {
            // Remove todas as associações antigas
            await prisma.testplans_testcases.deleteMany({
                where: { test_plan_id: Number(id) }
            });

            if (testCases.length > 0) {
                await prisma.testplans_testcases.createMany({
                    data: testCases.map((test_case_id: number) => ({
                        test_plan_id: Number(id),
                        test_case_id
                    }))
                });
            }
        }

        return res.status(200).json({
            id,
            name,
            description,
            active,
            project_id,
            test_case_ids: testCases
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao atualizar o plano de teste.' });
    }
});

// Delete a test plan by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.test_plans.delete({
            where: { id: Number(id) }
        });
        res.status(200).json({ message: 'Plano de teste deletado com sucesso' });
    } catch (err: any) {
        if (err.code === 'P2025') {
            return res.status(404).json({ error: 'Plano de teste não encontrado' });
        }
        console.error(err);
        return res.status(500).json({ error: 'Erro ao deletar o plano de teste.' });
    }
});

module.exports = router;