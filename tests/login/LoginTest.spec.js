'use strict';

// Mirrors: tests/LoginTest.java

const { BaseTest, expect } = require('../../src/base/BaseTest');
const QAConfig      = require('../../src/config/QAConfig');
const LoginPage     = require('../../src/pages/LoginPage');
const InventoryPage = require('../../src/pages/InventoryPage');

let loginPage;
let inventoryPage;

// Mirrors: @BeforeMethod initPages()
BaseTest.beforeEach(async ({ page }) => {
    loginPage     = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
});

// ─── T-001: Successful Login ──────────────────────────────────────────────────
BaseTest('T-001: Successful login with valid credentials', async ({ page }) => {

    // Step 1: Open application
    await loginPage.navigate();

    // Step 2: Login with valid credentials
    await loginPage.login(QAConfig.VALID_USERNAME, QAConfig.VALID_PASSWORD);

    // Assertion 1: URL should contain "inventory"
    expect(
        page.url().includes('inventory'),
        `FAIL - Expected URL to contain 'inventory' after login. Actual: ${page.url()}`
    ).toBeTruthy();

    // Assertion 2: Product list must be visible
    expect(
        await inventoryPage.isInventoryListVisible(),
        'FAIL - Product inventory list is not visible after login.'
    ).toBeTruthy();
});

// ─── T-002: Failed Login ──────────────────────────────────────────────────────
BaseTest('T-002: Failed login with invalid credentials', async ({ page }) => {

    // Step 1: Open application
    await loginPage.navigate();

    // Step 2: Login with invalid credentials
    await loginPage.login(QAConfig.INVALID_USERNAME, QAConfig.INVALID_PASSWORD);

    // Assertion 1: Error message must be displayed
    const errorText = await loginPage.getErrorMessage();
    expect(
        errorText.toLowerCase().includes('username and password do not match'),
        `FAIL - Error message unexpected. Actual: ${errorText}`
    ).toBeTruthy();

    // Assertion 2: User remains on login page
    expect(
        page.url().includes('inventory'),
        'FAIL - User was redirected to inventory page with invalid credentials.'
    ).toBeFalsy();

    // Assertion 3: Login button still visible
    expect(
        await loginPage.isLoginPageDisplayed(),
        'FAIL - Login button is no longer visible.'
    ).toBeTruthy();
});

// ─── T-003: Logout ────────────────────────────────────────────────────────────
BaseTest('T-003: Successful logout redirects to login page', async ({ page }) => {

    // Step 1: Login with valid credentials
    await loginPage.navigate();
    await loginPage.login(QAConfig.VALID_USERNAME, QAConfig.VALID_PASSWORD);

    // Pre-condition guard
    expect(
        page.url().includes('inventory'),
        'PRE-CONDITION FAIL - Could not reach inventory page.'
    ).toBeTruthy();

    await inventoryPage.logout();

    // Assertion 1: Redirected to login page
    const currentUrl = page.url().replace(/\/$/, '');
    const baseUrl    = QAConfig.BASE_URL.replace(/\/$/, '');
    expect(currentUrl).toBe(baseUrl,
        `FAIL - After logout URL should be base URL.\n  Expected: ${baseUrl}\n  Actual: ${currentUrl}`
    );

    // Assertion 2: Login button is visible
    expect(
        await loginPage.isLoginPageDisplayed(),
        'FAIL - Login button not visible after logout.'
    ).toBeTruthy();
});
