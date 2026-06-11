'use strict';

// Mirrors: base/BaseTest.java
// Java ThreadLocal<Playwright/Browser/Context/Page> -> Playwright Test built-in fixtures
// @BeforeMethod / @AfterMethod -> test.beforeEach / fixture teardown

const { test: base, expect } = require('@playwright/test');
const path     = require('path');
const fs       = require('fs');
const QAConfig = require('../config/QAConfig');

const BaseTest = base.extend({

    // Mirrors: setUp @BeforeMethod — creates context with baseURL, viewport, tracing
    context: async ({ browser }, use, testInfo) => {

        // Mirrors: Files.createDirectories(...)
        fs.mkdirSync(QAConfig.SCREENSHOTS_DIR, { recursive: true });
        fs.mkdirSync(QAConfig.TRACES_DIR,      { recursive: true });

        console.log(`[BaseTest] Launched ${testInfo.project.name} (headless=${QAConfig.HEADLESS})`);

        // Mirrors: browser.newContext(contextOptions) with baseURL + viewport
        const context = await browser.newContext({
            baseURL:  QAConfig.BASE_URL,
            viewport: { width: QAConfig.VIEWPORT_WIDTH, height: QAConfig.VIEWPORT_HEIGHT },
        });

    
        try { await context.tracing.stop(); } catch (_) { /* not running — that's fine */ }

await context.tracing.start({
    screenshots: true,
    snapshots:   true,
    sources:     true,
});

        await use(context);

        // Mirrors: tearDown @AfterMethod — save trace only on failure
        const failed = testInfo.status !== testInfo.expectedStatus;

        if (failed) {
            const tracePath = path.join(QAConfig.TRACES_DIR, `${testInfo.title}.zip`);
            await context.tracing.stop({ path: tracePath });
            console.log(`[BaseTest] Trace saved -> ${tracePath}`);
            console.log(`           Open with:  npx playwright show-trace ${tracePath}`);
        } else {
            // Stop tracing without writing — no waste for green tests
            await context.tracing.stop();
        }

        await context.close();
    },

    // Mirrors: screenshot on failure in tearDown
    page: async ({ context }, use, testInfo) => {
        const page = await context.newPage();

        await use(page);

        const failed = testInfo.status !== testInfo.expectedStatus;

        if (failed) {
            const timestamp      = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 15);
            const screenshotPath = path.join(
                QAConfig.SCREENSHOTS_DIR,
                `${testInfo.title}_${timestamp}.png`
            );
            await page.screenshot({ path: screenshotPath, fullPage: true });
            console.log(`[BaseTest] Screenshot -> ${screenshotPath}`);
        }

        await page.close();
    },
});

module.exports = { BaseTest, expect };
