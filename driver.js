const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

module.exports = async function createDriver() {
  const options = new chrome.Options();

  options.addArguments('--disable-headless');
  options.addArguments('--start-maximized');
  options.addArguments('--disable-notifications');

  return await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
};

