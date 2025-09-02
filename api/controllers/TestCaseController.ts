import express from 'express'
import prismaClient from '../db'

const router = express.Router()

router.get('/', async (req, res) => {
  const testCases = await prismaClient.test_cases.findMany()
  res.json(testCases)
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const testCase = await prismaClient.test_cases.findFirst({
    where: { id: Number(id) }
  })
  res.json(testCase)
})

router.post('/', async (req, res) => {
  const { name, description, steps, test_scenario_id } = req.body

  const result = await prismaClient.test_cases.create({
    data: { name, description, steps, test_scenario_id: Number(test_scenario_id) }
  })

  res.status(201).json(result)
})

router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { name, description, steps, test_scenario_id } = req.body

  try {
    const result = await prismaClient.test_cases.update({
      where: { id: Number(id) },
      data: { name, description, steps, test_scenario_id: Number(test_scenario_id) }
    })
    res.json(result)
  } catch (error) {
    return res.status(404).json({ error: 'Caso de teste não encontrado' })
  }
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const result = await prismaClient.test_cases.delete({
      where: { id: Number(id) }
    })
    res.json(result)
  } catch (error) {
    return res.status(404).json({ error: 'Caso de teste não encontrado' })
  }
})

module.exports = router