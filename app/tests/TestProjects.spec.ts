import { test, expect } from '@playwright/test'
import { randomInt } from 'crypto'

test('Adicionar projeto', async ({ page }) => {
  await page.goto('projetos')
  await page.getByRole("button", {name: "Adicionar projeto"}).click()
  await page.waitForURL('**/criar_projeto')
  await page.getByTestId("inputProjectName").fill("Auto Test Project Title")
  await page.getByTestId("inputProjectDescription").fill("Auto Test Project Description")
  const request = page.waitForRequest(request =>
    request.url() === process.env.REACT_APP_API_BASE_URL + '/projetos' && request.method() === 'POST',
  )
  await page.getByRole("button", {name: "Cadastrar"}).click()
  const response = await (await request).response()
  expect(response?.status()).toBe(201)
  const responseJson = await response?.json()
  await page.waitForURL('**/projetos')
  const cellWithNewEntry = await page.locator("tbody > tr:last-child > td")
  expect(cellWithNewEntry.nth(0)).toHaveText(`${responseJson.id}`)
  expect(cellWithNewEntry.nth(1)).toHaveText(`${responseJson.name}`)
  expect(cellWithNewEntry.nth(2)).toHaveText(`${responseJson.description}`)
})

test.skip("Editar projeto", async ({page}) => {
  await page.goto('projetos')
  // wait for at least of valid row to be rendered
  await expect(await page.getByLabel('Editar').count()).toBeGreaterThan(0)
  await page.getByLabel('Editar').last().click();
  await page.waitForURL("**/editar_projeto/**")

  const newName = "Auto Test Project Title Editado " + randomInt(1000)
  const newDescription = "Auto Test Project Description Editado " + randomInt(1000)
  await page.getByTestId("inputProjectName").fill(newName)
  await page.getByTestId("inputProjectDescription").fill(newDescription)
  const request = page.waitForRequest(request =>
    request.url().startsWith(process.env.REACT_APP_API_BASE_URL + '/projetos') &&
    request.method() === 'PUT'
  );
  // await page.getByRole("button", {name: "Atualizar"}).click()
  await page.getByTestId("buttonRegisterProject").click()
  const response = await (await request).response();
  expect(response?.status()).toBe(200);
  await page.waitForURL('**/projetos')

  const cellWithNewEntry = await page.locator("tbody > tr:last-child > td")
  expect(cellWithNewEntry.nth(1)).toHaveText(newName)
  expect(cellWithNewEntry.nth(2)).toHaveText(newDescription)
})

test.skip("Deletar projeto", async ({page}) => {
  await page.goto('projetos')
  // wait for at least of valid row to be rendered
  await expect(await page.getByLabel('Editar').count()).toBeGreaterThan(0)
  const lengthBeforeDelete = await page.getByLabel('Deletar').count()
  const request = page.waitForRequest(request =>
    request.url().startsWith(process.env.REACT_APP_API_BASE_URL + '/projetos/') && request.method() === 'DELETE',
  )
  page.once('dialog', dialog => { dialog.accept() });
  await page.getByLabel('Deletar').first().click();
  const response = await (await request).response()

  await expect(page.getByLabel('Deletar')).toHaveCount(lengthBeforeDelete - 1);
})