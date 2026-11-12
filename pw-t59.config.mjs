import base from './playwright.config.mjs';
export default { ...base, reporter: [['line']], projects: [{ name: 'chrome', use: { channel: 'chrome', viewport: { width: 1440, height: 900 } } }] };
