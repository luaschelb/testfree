const express = require('express');
import prisma from '../db';
const router = express.Router();

router.get('/project/:project_id', async (req : any, res : any) => {
    const { project_id } = req.params;
    const result = await prisma.projects.findFirst({
        where: { id: Number(project_id)},
        include: {
            builds: true,
        },
    })
    res.json(result)
});

router.get('/', async (req : any, res : any) => {
    const build = await prisma.builds.findMany()
    res.json(build)
});

router.get('/:id', async (req : any, res : any) => {
    const { id } = req.params;
    const build = await prisma.builds.findFirst({
        where: { id: Number(id)}
    })
    res.json(build)
});

router.post('/', async (req : any, res : any) => {
    const { title, version, description, active, project_id } = req.body;

    const result = await prisma.builds.create({
        data: {title, version, description, active, project_id}
    })

    res.status(201).json(result)
});

router.put('/:id', async (req : any, res : any) => {
    const { id } = req.params;
    const { title, version, description, active, project_id } = req.body;
    try
    {
        const result = await prisma.builds.update({
            where: { id: Number(id)},
            data: { title, version, description, active, project_id }
        })
        res.json(result)
    }
    catch (error)
    {
        return res.status(404).json({ error: 'Build não encontrada' });
    }
});

router.delete('/:id', async (req : any, res : any) => {
    try
    {
        const { id } = req.params;
        const result = await prisma.builds.delete({where: {id: Number(id)}})
        res.json(result)
    }
    catch (error)
    {
        return res.status(404).json({ error: 'Build não encontrada' });
    }
});

module.exports = router;