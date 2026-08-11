export class RegistroPage {
	constructor(page) {
		this.page = page;

		this.nombreInput = page.locator('#nombre');
		this.correoInput = page.locator('#correo');
		this.passwordInput = page.locator('#password');
		this.confirmPasswordInput = page.locator('#confirmPassword');

		this.registrarButton = page.locator(
			'#registroForm button[type="submit"]'
		);

		this.alert = page.locator('#vt-alert');
		this.validationMessages = page.locator('.mensaje-validacion');
	}

	async goto() {
		await this.page.goto('/registro.html');
	}

	async registrar(nombre, correo, password, confirmPassword) {
		await this.nombreInput.fill(nombre);
		await this.correoInput.fill(correo);
		await this.passwordInput.fill(password);
		await this.confirmPasswordInput.fill(confirmPassword);

		await this.registrarButton.click();
	}
}