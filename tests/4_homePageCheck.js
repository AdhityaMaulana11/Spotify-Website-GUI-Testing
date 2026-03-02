const { By, until } = require("selenium-webdriver");
const createDriver = require("../driver");
const fs = require("fs");

(async () => {
  const driver = await createDriver();

  try {
    // Buka Spotify untuk set cookie
    await driver.get("https://open.spotify.com");

    // Tambahkan cookie hasil login manual
    await driver.manage().addCookie({
      name: "sp_dc",
      value: "value",
      domain: ".spotify.com",
      path: "/",
      secure: true,
    });

    await driver.manage().addCookie({
      name: "sp_key",
      value: "value",
      domain: ".spotify.com",
      path: "/",
      secure: true,
    });

    // Refresh agar cookie login dibaca
    await driver.navigate().refresh();

    // Tunggu tombol Search muncul
    await driver.wait(
      until.elementLocated(By.css('button[aria-label="Search"]')),
      15000,
    );
    console.log("✅ Homepage terbuka, tombol Search muncul");

    const homeBtn = await driver.findElement(
      By.css('button[aria-label="Home"]'),
    );
    console.log("✅ Tombol Home juga muncul, berarti login berhasil");

    // Screenshot jika berhasil
    const screenshot = await driver.takeScreenshot();
    fs.writeFileSync("homepage-success.png", screenshot, "base64");
    console.log("🖼️ Screenshot disimpan sebagai homepage-success.png");
  } catch (err) {
    console.error("❌ Gagal membuka homepage setelah login:", err.message);

    const screenshot = await driver.takeScreenshot();
    fs.writeFileSync("homepage-error.png", screenshot, "base64");
    console.log("🖼️ Screenshot disimpan sebagai homepage-error.png");
  } finally {
    await driver.quit();
  }
})();
