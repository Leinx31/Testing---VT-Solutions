import { test, expect } from '@playwright/test';
import { RegistroPage } from '../pages/RegistroPage.js';
import registroData from '../data/registro.json' with { type: 'json' };

test.describe('Registro - VT Solutions', () => {

	test('E2E-04 - Registro exitoso', async ({ page }) => {

		const registroPage = new RegistroPage(page);

		const timestamp = Date.now();

		const nombre = registroData.registroExitoso.nombre;
		const correo = `${registroData.registroExitoso.correo}${timestamp}@test.com`;
		const password = registroData.registroExitoso.password;
		const confirmPassword = registroData.registroExitoso.confirmPassword;

		await registroPage.goto();

		await registroPage.registrar(
			nombre,
			correo,
			password,
			confirmPassword
		);

		await expect(page).toHaveURL(/principal\.html/);

		await expect(page.locator('body'))
			.toContainText(/bienvenido|VT Solutions/i);
	});


	test('E2E-05 - Registro con contraseñas diferentes', async ({ page }) => {

		const registroPage = new RegistroPage(page);

		const timestamp = Date.now();

		const nombre = registroData.registroPasswordDiferente.nombre;
		const correo = `${registroData.registroPasswordDiferente.correo}${timestamp}@test.com`;
		const password = registroData.registroPasswordDiferente.password;
		const confirmPassword =
			registroData.registroPasswordDiferente.confirmPassword;

		await registroPage.goto();

		await registroPage.registrar(
			nombre,
			correo,
			password,
			confirmPassword
		);

		const confirmacion = page.locator(
			'#confirmPassword + .mensaje-validacion'
		);

		await expect(confirmacion).toBeVisible();

		await expect(confirmacion).toContainText(/contraseña|coincid/i);

		await expect(page).toHaveURL(/registro\.html/);

		await expect(page).toHaveURL(/registro\.html/);
	});

});