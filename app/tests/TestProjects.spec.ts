import { test, expect } from '@playwright/test'
import { describe } from 'node:test'


describe("Testes para a página de projetos", () => {
  test('Adicionar projeto', async ({ page }) => {
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
    const responseJson = await response?.json()
    await page.waitForURL('**/projetos')
    // check if project created in is table
    const cellWithNewEntry = await page.locator("tbody > tr:last-child > td").all()
    expect(cellWithNewEntry[0]).toHaveText(`${responseJson.id}`)
    expect(cellWithNewEntry[1]).toHaveText(`${responseJson.name}`)
    expect(cellWithNewEntry[2]).toHaveText(`${responseJson.description}`)
  })
})

