'use strict';

// Mirrors: pages/CheckoutPage.java

class CheckoutPage {

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;

        // ─── Step 1 Locators — Customer Information ───────────────────────────
        // ID-based locators — form inputs
        this.firstNameInput = page.locator('#first-name');
        this.lastNameInput  = page.locator('#last-name');
        this.zipCodeInput   = page.locator('#postal-code');

        this.continueButton     = "//input[@value='Continue']";
        this.finishButton       = "//button[@id='finish']";
        this.confirmationHeader = "//h2[@data-test='complete-header']";
    }

    // ─── Public Actions ──────────────────────────────────────────────────────

    async fillCustomerInformation(firstName, lastName, zipCode) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.zipCodeInput.fill(zipCode);
        await this.page.locator(this.continueButton).click();
    }

    async finishCheckout() {
        await this.page.locator(this.finishButton).click();
    }

    async getOrderConfirmationMessage() {
        return (await this.page.locator(this.confirmationHeader).textContent()).trim();
    }
}

module.exports = CheckoutPage;
