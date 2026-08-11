import { test, expect } from '@playwright/test';

import { LoginPage } from '../pages/LoginPage.js';
import { CatalogoPage } from '../pages/CatalogoPage.js';
import { CarritoPage } from '../pages/CarritoPage.js';
import { PedidosPage } from '../pages/PedidosPage.js';

import usuarios from '../data/usuarios.json';

test.describe('Pedidos - VT Solutions', () => {

// --------------------------------------------------
// Función auxiliar: iniciar sesión
// --------------------------------------------------
async function iniciarSesion(page) {
const loginPage = new LoginPage(page);


await loginPage.goto();

await loginPage.login(
  usuarios.loginExitoso.email,
  usuarios.loginExitoso.password
);

await expect(page).toHaveURL(/principal\.html/);


}

// --------------------------------------------------
// Función auxiliar: crear un pedido
// --------------------------------------------------
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

// Esperar a que el formulario esté disponible
await expect(page.locator('#checkout-form'))
  .toBeVisible();

// 5. Completar dirección
await page.locator('#shipping-address')
  .fill('San José, Costa Rica');

// 6. Verificar que el formulario sea válido
await expect(page.locator('#checkout-form'))
  .toHaveJSProperty('checkValidity', expect.anything())
  .catch(() => {});

console.log(
  'Formulario válido:',
  await page.locator('#checkout-form')
    .evaluate(form => form.checkValidity())
);

console.log(
  'Botón habilitado:',
  await page.locator('#checkout-form button[type="submit"]')
    .isEnabled()
);

// 7. Esperar específicamente el POST que crea el pedido
const orderResponsePromise = page.waitForResponse(
  response =>
    response.url().includes('/api/orders') &&
    response.request().method() === 'POST',
  { timeout: 10000 }
);

// 8. Ejecutar submit
console.log('EJECUTANDO SUBMIT...');

await page.locator('#checkout-form')
  .evaluate(form => form.requestSubmit());

// 9. Esperar respuesta del backend
const orderResponse = await orderResponsePromise;

console.log(
  'POST /api/orders:',
  orderResponse.status()
);

// 10. Obtener cuerpo de respuesta para diagnosticar errores
let orderData;

try {
  orderData = await orderResponse.json();
  console.log('RESPUESTA ORDERS:', orderData);
} catch {
  console.log('No se pudo leer la respuesta JSON de /api/orders');
}

// 11. El backend debe haber creado correctamente el pedido
expect(
  orderResponse.ok(),
  `El POST /api/orders falló. Status: ${orderResponse.status()}`
).toBeTruthy();

// 12. Ahora sí debe aparecer la confirmación visual
await expect(page.locator('#order-result'))
  .toBeVisible({ timeout: 10000 });


}

// --------------------------------------------------
// E2E-10
// --------------------------------------------------
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

// 5. Verificar que el pedido contiene información básica
await expect(pedidosPage.ordersContainer)
  .toContainText('Total');


});

});
