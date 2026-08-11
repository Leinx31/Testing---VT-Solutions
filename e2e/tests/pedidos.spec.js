import { test, expect } from '@playwright/test';

import { LoginPage } from '../pages/LoginPage.js';
import { CatalogoPage } from '../pages/CatalogoPage.js';
import { CarritoPage } from '../pages/CarritoPage.js';
import { PedidosPage } from '../pages/PedidosPage.js';

import usuarios from '../data/usuarios.json';

test.describe('Pedidos - VT Solutions', () => {

	async function iniciarSesion(page) {
		const loginPage = new LoginPage(page);

		await loginPage.goto();

		await loginPage.login(
			usuarios.loginExitoso.email,
			usuarios.loginExitoso.password
		);

		await expect(page).toHaveURL(/principal\.html/);
	}

	async function crearPedido(page) {

		// 1. Ir al catálogo
		const catalogoPage = new CatalogoPage(page);

		await catalogoPage.ir();
		await catalogoPage.esperarProductos();

		// 2. Agregar producto
		await catalogoPage.agregarPrimerProducto();

		// 3. Ir al carrito
		const carritoPage = new CarritoPage(page);

		await carritoPage.ir();
		await carritoPage.esperarCarga();

		// 4. Ir al checkout
		await carritoPage.irAlCheckout();

		await expect(page).toHaveURL(/checkout\.html/);
		await expect(page.locator('#checkout-form')).toBeVisible();

		// 5. Completar dirección
		await page.locator('#shipping-address')
			.fill('San José, Costa Rica');

		// 6. Ejecutar submit
		await page.locator('#checkout-form')
			.evaluate(form => form.requestSubmit());

		// 7. Dar tiempo para que la aplicación procese el pedido
		await page.waitForTimeout(3000);

	}

	test('E2E-10 - Visualizar pedidos realizados', async ({ page }) => {

		// 1. Iniciar sesión
		await iniciarSesion(page);

		// 2. Crear un pedido
		await crearPedido(page);

		// 3. Ir a la sección de pedidos
		const pedidosPage = new PedidosPage(page);

		await pedidosPage.ir();
		await pedidosPage.esperarCarga();

		// 4. Verificar que existe al menos un pedido
		await expect(pedidosPage.orderCards.first())
			.toBeVisible();

		// 5. Verificar información básica del pedido
		await expect(pedidosPage.ordersContainer)
			.toContainText('Total');
	});

});