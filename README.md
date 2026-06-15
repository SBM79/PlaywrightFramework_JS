
A Playwright-based UI test automation framework for [SauceDemo](https://www.saucedemo.com), covering login, buy-product, and data-driven login flows across Chromium and Firefox.

## Prerequisites

- [Node.js](https://nodejs.org/) >= 18.0.0
- npm (bundled with Node.js)

## Installation

1. Clone the repository and move into the project folder:

   ```bash
   cd playwright-js-framework
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Install the Playwright browsers (Chromium + Firefox) and their OS dependencies:

   ```bash
   npx playwright install --with-deps chromium firefox
   ```

## Configuration

All environment configuration lives in [src/config/QAConfig.js](src/config/QAConfig.js), which is consumed by [playwright.config.js](playwright.config.js).

| Setting | Default | Description |
|---------|---------|-------------|
| `BASE_URL` | `https://www.saucedemo.com` | Base URL the tests run against |
| `VALID_USERNAME` / `VALID_PASSWORD` | `standard_user` / `secret_sauce` | Credentials for successful login |
| `INVALID_USERNAME` / `INVALID_PASSWORD` | `not_a_real_user` / `wrong_password_123` | Credentials for negative login tests |
| `HEADLESS` | `true` | Run browsers headless or headed |
| `VIEWPORT_WIDTH` / `VIEWPORT_HEIGHT` | `1280` / `720` | Browser viewport size |
| `MAX_RETRY_COUNT` | `2` | Number of retries for failed tests |
| `SCREENSHOTS_DIR` / `TRACES_DIR` | `screenshots` / `traces` | Output folders for failure artifacts |

### Changing the base URL

To point the framework at a different environment (staging env/ prod ), update `BASE_URL` in `src/config/QAConfig.js`:

```js
const QAConfig = {
    BASE_URL: 'https://www.saucedemo.com', // <- change this to your target environment
    ...
};
```

Update `VALID_USERNAME` / `VALID_PASSWORD` (and the invalid equivalents) as needed if the new environment requires different credentials.

 run directly with npx (no npm scripts needed)

```bash
npx playwright test
npx playwright test --project=login-chromium	#login tests in chrome
npx playwright test --project=login-firefox  	#login tests in firefox
npx playwright test --project=buy-chromium	#buy product tests in chrome
npx playwright test --project=buy-firefox	#buy product tests in firefox
npx playwright test --project=ddt-chromium	#data-driven tests in chrome
npx playwright test --project=ddt-firefox	#data-driven tests in firefox
```



