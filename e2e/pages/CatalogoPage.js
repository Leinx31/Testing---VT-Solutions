export class CatalogoPage {
  constructor(page) {
    this.page = page;

    this.productsGrid = page.locator('#products-grid');
    this.productCards = page.locator('#products-grid .product-card');
  }

  async ir() {
    await this.page.goto('/catalogo.html');
  }

  async esperarProductos() {
    await this.productCards.first().waitFor();
  }

  async obtenerPrimerProducto() {
    const product = this.productCards.first();

    return {
      card: product,
      name: (await product.locator('.card-title').textContent()).trim()
    };
  }

  async agregarPrimerProducto() {
    const product = this.productCards.first();

    await product.getByRole('button', {
      name: 'Agregar al carrito'
    }).click();
  }
}