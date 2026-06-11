'use strict';

// Mirrors: tests/BuyProductTest.java

const { BaseTest, expect } = require('../../src/base/BaseTest');
const QAConfig      = require('../../src/config/QAConfig');
const LoginPage     = require('../../src/pages/LoginPage');
const InventoryPage = require('../../src/pages/InventoryPage');
const CartPage      = require('../../src/pages/CartPage');
const CheckoutPage  = require('../../src/pages/CheckoutPage');

// ─── Test Data ────────────────────────────────────────────────────────────────
const PRODUCT_NAME          = 'Sauce Labs Backpack';
const FIRST_NAME            = 'Jane';
const LAST_NAME             = 'Automation';
const ZIP_CODE              = '94105';
const EXPECTED_CONFIRMATION = 'Thank you for your order';

let loginPage;
let inventoryPage;
let cartPage;
let checkoutPage;

// Mirrors: @BeforeMethod initPages()
BaseTest.beforeEach(async ({ page }) => {
    loginPage     = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage      = new CartPage(page);
    checkoutPage  = new CheckoutPage(page);
});

// ─── T-E2E-001: Full End-to-End Purchase ─────────────────────────────────────
BaseTest('T-E2E-001: Full end-to-end purchase of Sauce Labs Backpack', async ({ page }) => {

    // STEP 1 - Login
    await loginPage.navigate();
    await loginPage.login(QAConfig.VALID_USERNAME, QAConfig.VALID_PASSWORD);
    expect(page.url().includes('inventory'),
        `STEP 1 FAIL - Login did not redirect to inventory. URL: ${page.url()}`
    ).toBeTruthy();

    // STEP 2 - Verify Inventory page loaded
    await inventoryPage.verifyInventoryPageLoaded();

    // STEP 3 - Add product to cart
    await inventoryPage.addProductToCart(PRODUCT_NAME);

    // STEP 4 - Verify cart badge = 1
    const cartCount = await inventoryPage.getCartCount();
    expect(cartCount).toBe(1,
        `STEP 4 FAIL - Expected cart badge = 1, found: ${cartCount}`
    );

    // STEP 5 - Open cart
    await inventoryPage.openCart();
    expect(page.url().includes('cart'),
        `STEP 5 FAIL - Expected URL to contain 'cart'. Actual: ${page.url()}`
    ).toBeTruthy();

    // STEP 7 - Proceed to checkout
    await cartPage.proceedToCheckout();
    expect(page.url().includes('checkout-step-one'),
        `STEP 7 FAIL - Expected 'checkout-step-one'. Actual: ${page.url()}`
    ).toBeTruthy();

    // STEP 8 - Fill customer information
    await checkoutPage.fillCustomerInformation(FIRST_NAME, LAST_NAME, ZIP_CODE);
    expect(page.url().includes('checkout-step-two'),
        `STEP 8 FAIL - Expected 'checkout-step-two'. Actual: ${page.url()}`
    ).toBeTruthy();

    // STEP 9 - Finish checkout
    await checkoutPage.finishCheckout();
    expect(page.url().includes('checkout-complete'),
        `STEP 9 FAIL - Expected 'checkout-complete'. Actual: ${page.url()}`
    ).toBeTruthy();


    const confirmationMessage = await checkoutPage.getOrderConfirmationMessage();

// Playwright's toBeNull/toBe do NOT accept a message arg — use expect.soft or throw manually
if (confirmationMessage === null)
    throw new Error('STEP 10 FAIL - Confirmation message was null.');
if (confirmationMessage === '')
    throw new Error('STEP 10 FAIL - Confirmation message is empty.');

expect(
    confirmationMessage.includes(EXPECTED_CONFIRMATION),
    `STEP 10 FAIL - Confirmation did not contain '${EXPECTED_CONFIRMATION}'. Actual: ${confirmationMessage}`
).toBeTruthy();

    console.log(`\u2714  Order confirmation: "${confirmationMessage}"`);
    console.log('\n== TC-E2E-001 PASSED - Full purchase workflow completed. ==\n');
});

// ─── TC-NEG-001: Empty Cart Checkout ─────────────────────────────────────────
BaseTest('TC-NEG-001: Checkout with empty cart produces no order items', async ({ page }) => {

    // STEP 1 - Login
    await loginPage.navigate();
    await loginPage.login(QAConfig.VALID_USERNAME, QAConfig.VALID_PASSWORD);
    expect(page.url().includes('inventory'),
        `STEP 1 FAIL - Login did not reach inventory. URL: ${page.url()}`
    ).toBeTruthy();

    // STEP 2 - Open cart WITHOUT adding product
    await inventoryPage.openCart();
    expect(page.url().includes('cart'),
        `STEP 2 FAIL - Expected URL to contain 'cart'. Actual: ${page.url()}`
    ).toBeTruthy();

    // STEP 3 - Verify cart is empty
    const cartItemCount = await inventoryPage.getCartCount();
    expect(cartItemCount).toBe(0,
        `STEP 3 FAIL - Cart should have 0 items. Found: ${cartItemCount}`
    );

    const badgeCount = await inventoryPage.getCartCount();
    expect(badgeCount).toBe(0,
        `STEP 3 FAIL - Cart badge should show 0. Found: ${badgeCount}`
    );

    // STEP 4 - Proceed to checkout from empty cart
    await cartPage.proceedToCheckout();
    expect(page.url().includes('checkout-step-one'),
        `STEP 4 FAIL - Expected 'checkout-step-one'. Actual: ${page.url()}`
    ).toBeTruthy();

    // STEP 5 - Fill form with dummy data
    await checkoutPage.fillCustomerInformation(FIRST_NAME, LAST_NAME, ZIP_CODE);
    expect(page.url().includes('checkout-step-two'),
        `STEP 5 FAIL - Expected 'checkout-step-two'. Actual: ${page.url()}`
    ).toBeTruthy();

    // STEP 6 - Verify zero items in overview
    const overviewCount = await inventoryPage.getCartCount();
    expect(overviewCount).toBe(0,
        `STEP 6 FAIL - Overview should have 0 items. Found: ${overviewCount}`
    );

    // STEP 7 - Verify no order confirmation reached
    expect(page.url().includes('checkout-complete'),
        'STEP 7 FAIL - Should NOT have reached order-complete with empty cart.'
    ).toBeFalsy();
});
