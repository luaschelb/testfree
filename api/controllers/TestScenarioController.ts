import express from 'express'
import prismaClient from '../db'

const router = express.Router()

router.get('/', async (req, res) => {
  const scenarios = await prismaClient.test_scenarios.findMany()
  res.json(scenarios)
})

router.get('/project/:projectId', async (req, res) => {
  const { projectId } = req.params
  const scenarios = await prismaClient.test_scenarios.findMany({
    where: { test_project_id: Number(projectId) },
    include: {
      test_cases: true
    }
  })
  res.json(scenarios)
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const scenario = await prismaClient.test_scenarios.findFirst({
    where: { id: Number(id) },
    include: {
      test_cases: true
    }
  })
  res.json(scenario)
})

router.post('/', async (req, res) => {
  const { name, description, test_project_id } = req.body
  const result = await prismaClient.test_scenarios.create({
    data: { name, description, test_project_id: Number(test_project_id) }
  })
  res.status(201).json(result)
})

router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { name, description, test_project_id } = req.body

  try {
    const result = await prismaClient.test_scenarios.update({
      where: { id: Number(id) },
      data: { name, description, test_project_id: Number(test_project_id) }
    })
    res.json(result)
  } catch (error) {
    return res.status(404).json({ error: 'Cenário de teste não encontrado' })
  }
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const result = await prismaClient.test_scenarios.delete({
      where: { id: Number(id) }
    })
    res.json(result)
  } catch (error) {
    return res.status(404).json({ error: 'Cenário de teste não encontrado' })
  }
})

module.exports = router