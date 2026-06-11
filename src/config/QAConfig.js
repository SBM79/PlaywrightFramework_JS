'use strict';

// Mirrors: config/QAConfig.java
const QAConfig = {
    BASE_URL:         'https://www.saucedemo.com',
    VALID_USERNAME:   'standard_user',
    VALID_PASSWORD:   'secret_sauce',
    INVALID_USERNAME: 'not_a_real_user',
    INVALID_PASSWORD: 'wrong_password_123',
    HEADLESS:         true,
    VIEWPORT_WIDTH:   1280,
    VIEWPORT_HEIGHT:  720,
    MAX_RETRY_COUNT:  2,
    SCREENSHOTS_DIR:  'screenshots',
    TRACES_DIR:       'traces',
};

module.exports = QAConfig;
