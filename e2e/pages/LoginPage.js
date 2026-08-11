export class LoginPage {
	constructor(page) {
		this.page = page;

		// Localizadores
		this.emailInput = page.locator('#loginEmail');
		this.passwordInput = page.locator('#loginPassword');
		this.loginButton = page.locator('#loginForm button[type="submit"]');
		this.alert = page.locator('#vt-alert');
	}

	// Navegación
	async goto() {
		await this.page.goto('/login.html');
	}

	// Acción principal
	async login(email, password) {
		await this.emailInput.fill(email);
		await this.passwordInput.fill(password);
		await this.loginButton.click();
	}
}