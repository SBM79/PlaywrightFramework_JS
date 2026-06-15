'use strict';

// Mirrors: tests/LoginDataDrivenTest.java
// Java @DataProvider + CSV -> fs.readFileSync + for...of loop

const { BaseTest, expect } = require('../../src/base/BaseTest');
const LoginPage     = require('../../src/pages/LoginPage');
const InventoryPage = require('../../src/pages/InventoryPage');
const CartPage      = require('../../src/pages/CartPage');
const CheckoutPage  = require('../../src/pages/CheckoutPage');
const fs   = require('fs');
const path = require('path');

// ─── CSV location — mirrors src/test/resources/testdata/login_data.csv ────────
const CSV_FILE  = path.join(__dirname, '../../testdata/login_data.csv');
const DELIMITER = ',';

// ─── loginData() — mirrors Java @DataProvider(name = "loginData") ─────────────
function loginData() {
    const rows = [];

    if (!fs.existsSync(CSV_FILE)) {
        throw new Error(
            `[loginData] CSV file not found: '${CSV_FILE}'.\n` +
            `Ensure the file exists at testdata/login_data.csv`
        );
    }

    const lines       = fs.readFileSync(CSV_FILE, 'utf-8').split(/\r?\n/);
    let   isHeader    = true;
    let   lineNumber  = 0;

    for (const line of lines) {
        lineNumber++;

        if (isHeader) {
            isHeader = false;               // skip header row
            console.log(`[loginData] Header  (line ${lineNumber}) skipped : ${line}`);
            continue;
        }

        // mirrors Java: line.split(DELIMITER, -1)
        const cols     = line.split(DELIMITER);
        const username = cols.length > 0 ? cols[0].trim() : '';
        const password = cols.length > 1 ? cols[1].trim() : '';

        rows.push({ username, password });

        console.log(
            `[loginData] Data row (line ${lineNumber}) loaded : ` +
            `username=${username === '' ? '<empty>' : username}  ` +
            `password=${password === '' ? '<empty>' : '****'}`
        );
    }

    return rows;
}

// Parse CSV once at module load — mirrors static @DataProvider
const CSV_ROWS = loginData();

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

// ─── Data-Driven Test — one test per CSV row ──────────────────────────────────
// Mirrors: @Test(dataProvider = "loginData") testLoginWithCsvData(String, String)
for (const { username, password } of CSV_ROWS) {

    const displayUser = username === '' ? '<empty>' : username;
    const displayPass = password === '' ? '<empty>' : '****';

    BaseTest(
        `T-DDT-001: Data-driven login [${displayUser}]`,
        async ({ page }) => {

            // STEP 1 - Open login page
            await loginPage.navigate();
            expect(
                await loginPage.isLoginPageDisplayed(),
                'STEP 1 FAIL - Login page did not load; login button not visible.'
            ).toBeTruthy();

            // STEP 2 - Attempt login with CSV credentials
            console.log(`-- STEP 2: Login -> username='${displayUser}'`);
            await loginPage.login(username, password);

            // STEP 3 - Branch on post-login URL
            const loginSucceeded = page.url().includes('inventory');

            if (loginSucceeded) {
                // ── SUCCESS PATH ──────────────────────────────────────────────
                console.log('-- STEP 3 [SUCCESS PATH]: Verify inventory page --');
                expect(
                    page.url().includes('inventory'),
                    `SUCCESS FAIL - URL should contain 'inventory'.\n  username='${username}'\n  Actual URL: ${page.url()}`
                ).toBeTruthy();
                console.log(`\u2714  LOGIN PASSED -> username='${username}' reached inventory page.`);

            } else {
                // ── FAILURE PATH ──────────────────────────────────────────────
                console.log('-- STEP 3 [FAILURE PATH]: Verify error state --');
                const errorText = await loginPage.getErrorMessage();
                console.log('error message = ' + errorText);

                expect(errorText,
                    `FAILURE FAIL - Error message element not found. username='${username}'`
                ).not.toBeNull();

                expect(errorText,
                    `FAILURE FAIL - Error message is empty. username='${username}'`
                ).not.toBe('');

                expect(
                    page.url().includes('inventory'),
                    `FAILURE FAIL - User unexpectedly redirected to inventory.\n  username='${username}'\n  Actual URL: ${page.url()}`
                ).toBeFalsy();

                expect(
                    await loginPage.isLoginPageDisplayed(),
                    `FAILURE FAIL - Login button no longer visible. username='${username}'`
                ).toBeTruthy();
            }
        }
    );
}
