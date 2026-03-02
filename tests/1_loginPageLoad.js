require('dotenv').config();
const { By, until } = require('selenium-webdriver');
const createDriver = require('../driver');
const fs = require('fs');

(async () => {
  const driver = await createDriver();
  try {
    console.log("🌐 Membuka halaman login Spotify...");
    await driver.get('https://accounts.spotify.com/en/login');

    // 1. Isi email dari .env
    const emailInput = await driver.wait(until.elementLocated(By.id('login-username')), 10000);
    await emailInput.sendKeys(process.env.SPOTIFY_EMAIL);
    console.log("✅ Email berhasil diinput");

    // 2. Klik tombol Continue
    const continueBtn = await driver.wait(
      until.elementLocated(By.xpath("//span[text()='Continue']/ancestor::button")),
      10000
    );
    await continueBtn.click();
    console.log("✅ Tombol Continue berhasil diklik");

    // 3. Klik tombol "Log in with a password"
    try {
      const loginWithPassword = await driver.wait(
        until.elementLocated(By.xpath("//button[contains(., 'Log in with a password')]")),
        5000
      );
      await loginWithPassword.click();
      console.log("✅ Klik 'Log in with a password' berhasil");
    } catch {
      console.warn("⚠️ Tombol 'Log in with a password' tidak muncul, mungkin langsung masuk ke form password.");
    }

    // 4. Tunggu input password muncul
    const passwordInput = await driver.wait(
      until.elementLocated(By.id('login-password')),
      10000
    );
    await driver.wait(until.elementIsVisible(passwordInput), 5000);
    console.log("✅ Form password berhasil ditampilkan");

    // 5. Screenshot
    const screenshot = await driver.takeScreenshot();
    fs.writeFileSync('login-password-form.png', screenshot, 'base64');
    console.log('🖼️ Screenshot disimpan sebagai login-password-form.png');

  } catch (err) {
    console.error("❌ Terjadi error:", err.message);
    const screenshot = await driver.takeScreenshot();
    fs.writeFileSync('login-error.png', screenshot, 'base64');
    console.log('🖼️ Screenshot disimpan sebagai login-error.png');
  } finally {
    await driver.quit();
  }
})();
