import express from 'express'
import prisma from '../db';

const router = express.Router();

router.get('/', async (req : any, res : any) => {
    const projects = await prisma.projects.findMany()
    res.json(projects)
});

router.get('/:id', async (req : any, res : any) => {
    const { id } = req.params;
    const project = await prisma.projects.findFirst({
        where: {
            id: Number(id)
        }
    }) 
    res.json(project);
});

router.post('/', async (req, res) => {
    const { name, description } = req.body;

    const result = await prisma.projects.create({
        data: {name, description}
    })

    res.status(201).json(result)
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try
    {
        const result = await prisma.projects.update({
            where: {
                id: Number(id)
            },
            data: {
                name, description
            }
        })
        res.json(result)
    }
    catch (error)
    {
        console.error(error)
        return res.status(404).json({ error: 'Projeto de teste não encontrado' });
    }
});

router.delete('/:id',  async (req, res) => {
    const { id } = req.params;
    try
    {
        const result = await prisma.projects.delete({where: {id: Number(id)}})
        res.json(result)
    }
    catch (error)
    {
        console.error(error)
        return res.status(404).json({ error: 'Projeto de teste não encontrado' });
    }
});


// Get count for test_scenarios, builds, test_executions, e test_plans for the project
router.get('/count/:id',  async (req, res) => {
    const { id } = req.params;
    const result: any = await prisma.$queryRaw`
        SELECT
            (SELECT COUNT(*) FROM test_scenarios WHERE test_project_id = p.id) AS test_scenarios_count,
            (SELECT COUNT(*) FROM builds WHERE project_id = p.id) AS builds_count,
            (SELECT COUNT(*) FROM test_executions te
            INNER JOIN builds b ON te.build_id = b.id
            WHERE b.project_id = p.id) AS test_executions_count,
            (SELECT COUNT(*) FROM test_plans WHERE project_id = p.id) AS test_plans_count
        FROM projects p
        WHERE p.id = ${Number(id)}
    `
        if(result[0] === undefined || result[0] === null ) 
        {
            res.status(404).json({ error: 'Query no banco falhou' })
        }

        const counts = {
            test_scenarios_count: Number(result[0].test_scenarios_count),
            builds_count: Number(result[0].builds_count),
            test_executions_count: Number(result[0].test_executions_count),
            test_plans_count: Number(result[0].test_plans_count),
        };
        
        res.json(counts)
});

module.exports = router;