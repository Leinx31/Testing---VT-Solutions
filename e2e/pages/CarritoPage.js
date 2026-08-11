export class CarritoPage {
	constructor(page) {
		this.page = page;

		this.cartBody = page.locator('#cart-tbody');
		this.checkoutButton = page.locator('#checkout-btn');
		this.quantityInputs = page.locator('.qty-input');
	}

	async ir() {
		await this.page.goto('/carrito.html');
	}

	async esperarCarga() {
		await this.cartBody.waitFor();
	}

	async contieneProducto(nombre) {
		return this.cartBody.toContainText(nombre);
	}

	async obtenerCantidad() {
		return await this.quantityInputs.first().inputValue();
	}

	async cambiarCantidad(cantidad) {
		await this.quantityInputs.first().fill(String(cantidad));
		await this.quantityInputs.first().press('Enter');
	}

	async eliminarPrimerProducto() {
		await this.cartBody
			.getByRole('button', { name: 'Eliminar' })
			.first()
			.click();
	}

	async irAlCheckout() {
		await this.checkoutButton.click();
	}
}