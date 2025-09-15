import { test, expect } from '@playwright/test'

test('Add project', async ({ page }) => {
  await page.goto('projetos')
  await page.getByText("Adicionar projeto", {exact: false}).click()
  await page.waitForURL('**/criar_projeto')
  await page.getByTestId("inputProjectName").fill("Auto Test Project Title")
  await page.getByTestId("inputProjectDescription").fill("Auto Test Project Description")
  const request = page.waitForRequest(request =>
    request.url() === 'http://localhost:8080/projetos' && request.method() === 'POST',
  )
  await page.getByTestId("buttonRegisterProject").click()
  const response = (await (await request).response())
  expect(response?.status()).toBe(201)
  console.log(await response?.json())
  await page.waitForURL('**/projetos')
})

