import { test, expect } from '@playwright/test'
import { randomInt } from 'crypto'

const baseUrl = process.env.REACT_APP_API_BASE_URL

test('Adicionar projeto (cria novo projeto)', async ({ page }) => {
  await page.goto('projetos')
  await page.getByRole("button", { name: "Adicionar projeto" }).click()
  await page.waitForURL('**/criar_projeto')

  const projectName = "Auto Test Project Title " + randomInt(1000)
  const projectDescription = "Auto Test Project Description " + randomInt(1000)
  await page.getByTestId("inputProjectName").fill(projectName)
  await page.getByTestId("inputProjectDescription").fill(projectDescription)

  const requestPromise = page.waitForRequest(req =>
    req.url() === `${baseUrl}/projetos` && req.method() === 'POST'
  )

  await page.getByRole("button", { name: "Cadastrar" }).click()
  const request = await requestPromise
  const response = await request.response()
  expect(response?.status()).toBe(201)

  const responseJson = await response?.json()
  expect(responseJson).toHaveProperty('id')
  expect(responseJson).toHaveProperty('name', projectName)

  await page.waitForURL('**/projetos')

  const correctRow = page.locator(`tbody > tr:has(td:text-is("${responseJson.id}"))`)
  await expect(correctRow.locator('td').nth(1)).toHaveText(projectName)
  await expect(correctRow.locator('td').nth(2)).toHaveText(projectDescription)
})


test('Editar projeto com ID 2', async ({ page }) => {
  const projectId = 2
  await page.goto('projetos')

  // Encontrar linha com ID 2 e clicar em editar
  const targetRow = page.locator(`tbody > tr:has(td:text-is("${projectId}"))`)
  await expect(targetRow).toHaveCount(1)

  await targetRow.getByLabel('Editar').click()
  await page.waitForURL(`**/editar_projeto/${projectId}`)

  const newName = `Auto Test Project Title Editado ${randomInt(1000)}`
  const newDescription = `Auto Test Project Description Editado ${randomInt(1000)}`
  await page.getByTestId("inputProjectName").fill(newName)
  await page.getByTestId("inputProjectDescription").fill(newDescription)

  const requestPromise = page.waitForRequest(req =>
    req.url() === `${baseUrl}/projetos/${projectId}` && req.method() === 'PUT'
  )

  await page.getByRole("button", { name: "Atualizar" }).click()
  const request = await requestPromise
  const response = await request.response()
  expect(response?.status()).toBe(200)

  await page.waitForURL('**/projetos')

  const updatedRow = page.locator(`tbody > tr:has(td:text-is("${projectId}"))`)
  await expect(updatedRow.locator('td').nth(1)).toHaveText(newName)
  await expect(updatedRow.locator('td').nth(2)).toHaveText(newDescription)
})


test('Deletar projeto com ID 3', async ({ page }) => {
  const projectId = 3
  await page.goto('projetos')

  const targetRow = page.locator(`tbody > tr:has(td:text-is("${projectId}"))`)
  await expect(targetRow).toHaveCount(1)

  const requestPromise = page.waitForRequest(req =>
    req.url() === `${baseUrl}/projetos/${projectId}` && req.method() === 'DELETE'
  )

  page.once('dialog', dialog => dialog.accept())
  await targetRow.getByLabel('Deletar').click()

  const request = await requestPromise
  const response = await request.response()
  expect(response?.status()).toBe(200)

  // Verifica se o ID sumiu da tabela
  await expect(page.locator(`tbody > tr:has(td:text-is("${projectId}"))`)).toHaveCount(0)
})
