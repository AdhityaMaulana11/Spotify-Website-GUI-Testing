require('dotenv').config();
const { By } = require('selenium-webdriver');
const createDriver = require('../driver');
const fs = require('fs');

(async () => {
  const driver = await createDriver();
  try {
    await driver.get('https://accounts.spotify.com/en/login?login_hint=%40gmail.com&allow_password=1&continue=https%3A%2F%2Fopen.spotify.com%2F%3Fflow_ctx%3D46df7ae9-106a-4d9c-95e2-60e6e85e777d%3A1751653024&flow_ctx=46df7ae9-106a-4d9c-95e2-60e6e85e777d%3A1751653024');

    await driver.findElement(By.id('login-username')).sendKeys(process.env.SPOTIFY_EMAIL);
    await driver.findElement(By.id('login-password')).sendKeys(process.env.SPOTIFY_PASSWORD);

    console.log('✅ Email and password fields filled successfully');

    // Screenshot jika sukses
    const screenshot = await driver.takeScreenshot();
    fs.writeFileSync('fill-form-success.png', screenshot, 'base64');
    console.log('🖼️ Screenshot disimpan sebagai fill-form-success.png');
  } catch (e) {
    console.error('❌ Failed to fill login form:', e);
  } finally {
    await driver.quit();
  }
})();
