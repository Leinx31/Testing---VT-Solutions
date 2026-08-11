export class CheckoutPage {
  constructor(page) {
    this.page = page;

    this.form = page.locator('#checkout-form');
    this.shippingAddress = page.locator('#shipping-address');
    this.submitButton = this.form.locator('button[type="submit"]');

    this.orderResult = page.locator('#order-result');
    this.orderNumber = page.locator('#order-number');
    this.orderTotal = page.locator('#order-total');
    this.orderStatus = page.locator('#order-status');
  }

  async llenarDireccion(direccion) {
    await this.shippingAddress.fill(direccion);
  }

  async confirmarPedido() {
    await this.submitButton.click();
  }

  async esperarConfirmacion() {
    await this.orderResult.waitFor();
  }
}