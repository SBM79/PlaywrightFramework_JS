'use strict';

// Mirrors: pages/LoginPage.java

const QAConfig = require('../config/QAConfig');

class LoginPage {

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;

        // ─── Locators ────────────────────────────────────────────────────────
        // ID-based selectors
        this.usernameInput = page.locator('#user-name');
        this.passwordInput = page.locator('#password');

        // Role-based selector: button with accessible name "Login"
        this.loginButton = page.getByRole('button', { name: 'Login' });

        // Relative XPath using data-test attribute for the error heading
        this.errorMessage = page.locator("//h3[@data-test='error']");
    }

    async navigate() {
        await this.page.goto(QAConfig.BASE_URL);
    }

    async login(username, password) {
        await this.usernameInput.clear();
        await this.usernameInput.fill(username);
        await this.passwordInput.clear();
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async getErrorMessage() {
        await this.errorMessage.waitFor();
        return (await this.errorMessage.textContent()).trim();
    }

    async isLoginPageDisplayed() {
        return await this.loginButton.isVisible();
    }
}

module.exports = LoginPage;
