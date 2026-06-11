'use strict';

// Mirrors: pages/CartPage.java

class CartPage {

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;

        // ─── Locators ────────────────────────────────────────────────────────
        this.checkoutButton = "//button[text()='Checkout']";
    }

    async proceedToCheckout() {
        await this.page.locator(this.checkoutButton).click();
    }
}

module.exports = CartPage;
