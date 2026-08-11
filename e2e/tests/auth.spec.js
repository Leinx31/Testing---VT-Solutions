import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import usuarios from '../data/usuarios.json' with { type: 'json' };

test.describe('Autenticación - VT Solutions', () => {

  test('E2E-01 - Login exitoso', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login(
      usuarios.loginExitoso.email,
      usuarios.loginExitoso.password
    );

    await expect(page).toHaveURL(/principal\.html/);
  });


  test('E2E-02 - Login con credenciales incorrectas', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login(
      usuarios.loginCredencialesIncorrectas.email,
      usuarios.loginCredencialesIncorrectas.password
    );

    await expect(loginPage.alert).toBeVisible();
    await expect(loginPage.alert).toContainText('Credenciales inválidas');

    await expect(page).toHaveURL(/login\.html/);
  });


  test('E2E-03 - Login sin completar campos', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login('', '');

    await expect(loginPage.alert).toBeVisible();
    await expect(loginPage.alert).toContainText(
      'Todos los campos son obligatorios'
    );
  });

});