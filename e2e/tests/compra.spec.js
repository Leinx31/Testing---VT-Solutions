import { test, expect } from '@playwright/test';

import { LoginPage } from '../pages/LoginPage.js';
import { CatalogoPage } from '../pages/CatalogoPage.js';
import { CarritoPage } from '../pages/CarritoPage.js';

import usuarios from '../data/usuarios.json';

test.describe('Flujo de compra - VT Solutions', () => {

	async function iniciarSesion(page) {
		const loginPage = new LoginPage(page);

		await loginPage.goto();

		await loginPage.login(
			usuarios.loginExitoso.email,
			usuarios.loginExitoso.password
		);

		await expect(page).toHaveURL(/principal\.html/);
	}


	test('E2E-06 - Agregar producto al carrito', async ({ page }) => {

		// 1. Iniciar sesión
		await iniciarSesion(page);

		// 2. Ir al catálogo
		const catalogoPage = new CatalogoPage(page);

		await catalogoPage.ir();
		await catalogoPage.esperarProductos();

		// 3. Obtener información del primer producto
		const producto = await catalogoPage.obtenerPrimerProducto();

		// 4. Agregar producto al carrito
		await catalogoPage.agregarPrimerProducto();

		// 5. Ir al carrito
		const carritoPage = new CarritoPage(page);

		await carritoPage.ir();
		await carritoPage.esperarCarga();

		// 6. Verificar que el producto aparece en el carrito
		await expect(carritoPage.cartBody)
			.toContainText(producto.name);

		// 7. Verificar que el botón de checkout está disponible
		await expect(carritoPage.checkoutButton)
			.toBeVisible();

		await expect(carritoPage.checkoutButton)
			.not.toHaveClass(/disabled/);
	});

	test('E2E-07 - Actualizar cantidad de producto en el carrito', async ({ page }) => {

		// 1. Iniciar sesión
		await iniciarSesion(page);

		// 2. Ir al catálogo
		const catalogoPage = new CatalogoPage(page);

		await catalogoPage.ir();
		await catalogoPage.esperarProductos();

		// 3. Agregar primer producto
		await catalogoPage.agregarPrimerProducto();

		// 4. Ir al carrito
		const carritoPage = new CarritoPage(page);

		await carritoPage.ir();
		await carritoPage.esperarCarga();

		// 5. Verificar que existe el campo de cantidad
		await expect(carritoPage.quantityInputs.first())
			.toBeVisible();

		// 6. Cambiar cantidad a 2
		await carritoPage.cambiarCantidad(2);

		// 7. Verificar que la cantidad cambió
		await expect(carritoPage.quantityInputs.first())
			.toHaveValue('2');
	});

	test('E2E-08 - Eliminar producto del carrito', async ({ page }) => {

		// 1. Iniciar sesión
		await iniciarSesion(page);

		// 2. Ir al catálogo
		const catalogoPage = new CatalogoPage(page);

		await catalogoPage.ir();
		await catalogoPage.esperarProductos();

		// 3. Obtener información del primer producto
		const producto = await catalogoPage.obtenerPrimerProducto();

		// 4. Agregar producto al carrito
		await catalogoPage.agregarPrimerProducto();

		// 5. Ir al carrito
		const carritoPage = new CarritoPage(page);

		await carritoPage.ir();
		await carritoPage.esperarCarga();

		// 6. Verificar que el producto aparece
		await expect(carritoPage.cartBody)
			.toContainText(producto.name);

		// 7. Eliminar el primer producto
		await carritoPage.eliminarPrimerProducto();

		// 8. Esperar actualización del carrito
		await carritoPage.esperarCarga();

		// 9. Verificar que el producto ya no aparece
		await expect(carritoPage.cartBody)
			.not.toContainText(producto.name);
	});

	test('E2E-09 - Modificar cantidad de producto en el carrito', async ({ page }) => {

		// 1. Iniciar sesión
		await iniciarSesion(page);

		// 2. Ir al catálogo
		const catalogoPage = new CatalogoPage(page);

		await catalogoPage.ir();
		await catalogoPage.esperarProductos();

		// 3. Obtener primer producto
		const producto = await catalogoPage.obtenerPrimerProducto();

		// 4. Agregar producto al carrito
		await catalogoPage.agregarPrimerProducto();

		// 5. Ir al carrito
		const carritoPage = new CarritoPage(page);

		await carritoPage.ir();
		await carritoPage.esperarCarga();

		// 6. Verificar producto
		await expect(carritoPage.cartBody)
			.toContainText(producto.name);

		// 7. Verificar cantidad inicial
		await expect(carritoPage.quantityInputs.first())
			.toHaveValue('1');

		// 8. Cambiar cantidad a 2
		await carritoPage.cambiarCantidad(2);

		// 9. Esperar actualización
		await carritoPage.esperarCarga();

		// 10. Verificar nueva cantidad
		await expect(carritoPage.quantityInputs.first())
			.toHaveValue('2');
	});

});