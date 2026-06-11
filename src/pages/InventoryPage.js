'use strict';

// Mirrors: pages/InventoryPage.java

const { expect } = require('@playwright/test');

class InventoryPage {

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;

        // ─── Locators ────────────────────────────────────────────────────────
        // ID-based locators
        this.cartLink   = page.locator('#shopping_cart_container');
        this.menuButton = page.locator('#react-burger-menu-btn');
        this.logoutLink = page.locator('#logout_sidebar_link');

        // XPath string locators
        this.cartBadge     = "//span[@data-test='shopping-cart-badge']";
        this.inventoryList = "//div[@data-test='inventory-list']";
    }

    // ─── Public Actions ──────────────────────────────────────────────────────

    async verifyInventoryPageLoaded() {
        // Mirrors: assertThat(page).hasURL(Pattern.compile(".*inventory.*"))
        await expect(this.page).toHaveURL(/.*inventory.*/);
        await this.page.locator(this.inventoryList).isVisible();
    }

    async addProductToCart(productName) {
        // Mirrors: allItems.filter(...).getByRole(BUTTON, "Add to cart").click()
        const allItems = this.page.locator("//div[@class='inventory_item']");
        await allItems
            .filter({ hasText: productName })
            .getByRole('button', { name: 'Add to cart' })
            .click();
    }

    async openCart() {
        await this.cartLink.click();
    }

    async getCartCount() {
        const badge = this.page.locator(this.cartBadge);
        if (await badge.isVisible()) {
            return parseInt((await badge.textContent()).trim(), 10);
        }
        return 0;
    }

    async logout() {
        await this.menuButton.click();
        await this.logoutLink.click();
    }

    async isInventoryListVisible() {
        return await this.page.locator(this.inventoryList).isVisible();
    }
}

module.exports = InventoryPage;
