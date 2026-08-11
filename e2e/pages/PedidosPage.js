export class PedidosPage {
	constructor(page) {
		this.page = page;

		this.ordersContainer = page.locator('#orders-container');
		this.emptyMessage = page.locator('#empty-msg');
		this.orderCards = page.locator('[id^="order-card-"]');
	}

	async ir() {
		await this.page.goto('/pedidos.html');
	}

	async esperarCarga() {
		await this.ordersContainer.waitFor();
	}

	async obtenerCantidadPedidos() {
		return await this.orderCards.count();
	}

	async obtenerPrimerPedido() {
		return this.orderCards.first();
	}

	async contieneTexto(texto) {
		return this.ordersContainer.toContainText(texto);
	}
}