'use strict';

const { defineConfig, devices } = require('@playwright/test');
const QAConfig = require('./src/config/QAConfig');

module.exports = defineConfig({

    testDir: './tests',

    fullyParallel: true,

    forbidOnly: !!process.env.CI,

    // Mirrors RetryAnalyzer MAX_RETRY_COUNT = 2
    retries: QAConfig.MAX_RETRY_COUNT,

    // Mirrors testng.xml thread-count="4"
    workers: 4,

    timeout: 60000,

    expect: {
        timeout: 10000,
    },

    // Mirrors testng.xml JUnitReportReporter listener + HTML report
    reporter: [
        ['html',  { outputFolder: 'test-output/html-report', open: 'never' }],
        ['junit', { outputFile:   'test-output/junitreports/results.xml'   }],
        ['list'],
    ],

    use: {
        baseURL:           QAConfig.BASE_URL,
        trace:             'on-first-retry',
        screenshot:        'only-on-failure',
        video:             'off',
        actionTimeout:     15000,
        navigationTimeout: 30000,
        viewport:          { width: QAConfig.VIEWPORT_WIDTH, height: QAConfig.VIEWPORT_HEIGHT },
        ignoreHTTPSErrors: true,
    },

    // Mirrors testng.xml <test> blocks
    // Short hyphenated names — no spaces, works on all OS shells
    projects: [

        // Mirrors: <test name="Login Tests - Chromium">
        {
            name:    'login-chromium',
            testDir: './tests/login',
            use: {
                ...devices['Desktop Chrome'],
                headless: QAConfig.HEADLESS,
            },
        },

        // Mirrors: <test name="Login Tests - Firefox">
        {
            name:    'login-firefox',
            testDir: './tests/login',
            use: {
                ...devices['Desktop Firefox'],
                headless: QAConfig.HEADLESS,
            },
        },

        // Mirrors: <test name="Buy Product Tests - Chromium">
        {
            name:    'buy-chromium',
            testDir: './tests/buyProduct',
            use: {
                ...devices['Desktop Chrome'],
                headless: QAConfig.HEADLESS,
            },
        },

        // Mirrors: <test name="Buy Product Tests - Firefox">
        {
            name:    'buy-firefox',
            testDir: './tests/buyProduct',
            use: {
                ...devices['Desktop Firefox'],
                headless: QAConfig.HEADLESS,
            },
        },

        // Data-Driven Login Tests - Chromium
        {
            name:    'ddt-chromium',
            testDir: './tests/dataDriven',
            use: {
                ...devices['Desktop Chrome'],
                headless: QAConfig.HEADLESS,
            },
        },

        // Data-Driven Login Tests - Firefox
        {
            name:    'ddt-firefox',
            testDir: './tests/dataDriven',
            use: {
                ...devices['Desktop Firefox'],
                headless: QAConfig.HEADLESS,
            },
        },
    ],

    outputDir: 'test-results/',
});
