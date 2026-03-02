const { By, until } = require('selenium-webdriver');
const createDriver = require('../driver');
const fs = require('fs');

(async () => {
  const driver = await createDriver();
  try {
    await driver.get('https://accounts.spotify.com/en/login?login_hint=%40gmail.com&allow_password=1&continue=https%3A%2F%2Fopen.spotify.com%2F%3Fflow_ctx%3D46df7ae9-106a-4d9c-95e2-60e6e85e777d%3A1751653024&flow_ctx=46df7ae9-106a-4d9c-95e2-60e6e85e777d%3A1751653024');

    await driver.findElement(By.id('login-username')).sendKeys('invalid@example.com');
    await driver.findElement(By.id('login-password')).sendKeys('wrongpassword');

    await driver.findElement(By.id('login-button')).click();

    const errorMsg = await driver.wait(until.elementLocated(By.className('Message-sc-15vkh7g-0')), 5000);
    const text = await errorMsg.getText();

    console.log('⚠️ Error message appeared as expected:', text);

    // Screenshot jika error message tampil
    const screenshot = await driver.takeScreenshot();
    fs.writeFileSync('invalid-login-success.png', screenshot, 'base64');
    console.log('🖼️ Screenshot disimpan sebagai invalid-login-success.png');
  } catch (e) {
    console.error('❌ Failed invalid login test:', e);
  } finally {
    await driver.quit();
  }
})();
