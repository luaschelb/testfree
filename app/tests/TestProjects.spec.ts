import { test, expect } from '@playwright/test'

test('Adicionar projeto', async ({ page }) => {
  await page.goto('projetos')
  await page.getByText("Adicionar projeto", {exact: false}).click()
  await page.waitForURL('**/criar_projeto')
  await page.getByTestId("inputProjectName").fill("Auto Test Project Title")
  await page.getByTestId("inputProjectDescription").fill("Auto Test Project Description")
  const request = page.waitForRequest(request =>
    request.url() === process.env.REACT_APP_API_BASE_URL + '/projetos' && request.method() === 'POST',
  )
  await page.getByTestId("buttonRegisterProject").click()
  const response = await (await request).response()
  expect(response?.status()).toBe(201)
  const responseJson = await response?.json()
  await page.waitForURL('**/projetos')
  const cellWithNewEntry = await page.locator("tbody > tr:last-child > td")
  expect(cellWithNewEntry.nth(0)).toHaveText(`${responseJson.id}`)
  expect(cellWithNewEntry.nth(1)).toHaveText(`${responseJson.name}`)
  expect(cellWithNewEntry.nth(2)).toHaveText(`${responseJson.description}`)
})

test("Deletar projeto", async ({page}) => {
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