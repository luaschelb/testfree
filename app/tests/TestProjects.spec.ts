import { test, expect } from '@playwright/test';

test('Add project', async ({ page }) => {
  await page.goto('projetos');
  await page.getByText("Adicionar projeto", {exact: false}).click();
  await expect(page).toHaveURL('/criar_projeto')
  await page.getByTestId("inputProjectName").fill("Auto Test Project Title")
  await page.getByTestId("inputProjectDescription").fill("Auto Test Project Description")
  const request = page.waitForRequest(request =>
    request.url() === 'http://localhost:8080/projetos' && request.method() === 'POST',
  );
  await page.getByTestId("buttonRegisterProject").click()
  await page.waitForURL('**/projetos');
  await page.screenshot({path: "screenshot1.png"})
  console.log(await (await (await request).response())?.json());
});

