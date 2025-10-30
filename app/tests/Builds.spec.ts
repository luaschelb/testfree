import { test, expect } from '@playwright/test';
const baseUrl = process.env.REACT_APP_API_BASE_URL

test('Create Build', async ({ page }) => {
  await page.goto('http://localhost:3000/Builds');
  await page.getByRole('button', { name: 'Adicionar Build' }).click();
  await page.getByRole('textbox').first().click();
  await page.getByRole('textbox').first().fill('Build TestAuto Create');
  await page.getByRole('textbox').nth(1).click();
  await page.getByRole('textbox').nth(1).fill('2.0.1');
  await page.locator('textarea').click();
  await page.locator('textarea').fill('Build testauto create descricao');
  await page.once('dialog', dialog => dialog.accept())
  await page.getByRole('button', { name: 'Cadastrar' }).click();
});

test('Update Build', async ({ page }) => {
  const buildId = 2
  await page.goto('http://localhost:3000/Builds');
  const targetRow = page.locator(`tbody > tr:has(td:text-is("${buildId}"))`)
  await targetRow.getByLabel('Editar').click();
  await page.locator('#title').click();
  await page.locator('#title').fill('Build TestAuto Create Editado');
  await page.locator('#version').click();
  await page.locator('#version').fill('2.0.1.editado');
  await page.locator('#description').fill('Build testauto create descricao editado');
  await page.locator('#active').uncheck();
  await page.getByRole('button', { name: 'Atualizar' }).click();
  await page.once('dialog', dialog => dialog.accept())
  const updatedRow = page.locator(`tbody > tr:has(td:text-is("${buildId}"))`)
  await expect(updatedRow.locator('td').nth(1)).toHaveText('Build TestAuto Create Editado')
  await expect(updatedRow.locator('td').nth(2)).toHaveText('2.0.1.editado')
  await expect(updatedRow.locator('td').nth(3)).toHaveText('Build testauto create descricao editado')
});

test('Delete Build', async ({ page }) => {
    const buildId = 3
    await page.goto('http://localhost:3000/Builds');
    const targetRow = page.locator(`tbody > tr:has(td:text-is("${buildId}"))`)
    await expect(targetRow).toBeVisible()
    // const requestPromise = page.waitForRequest(req =>
    //     req.url() === `${baseUrl}/build/${buildId}` && req.method() === 'DELETE'
    // )

    page.once('dialog', dialog => dialog.accept())
    await targetRow.getByLabel('Deletar').click()

    // const request = await requestPromise
    // const response = await request.response()
    // expect(response?.status()).toBe(200)

    // Verifica se o ID sumiu da tabela
    await expect(page.locator(`tbody > tr:has(td:text-is("${buildId}"))`)).toHaveCount(0)
});