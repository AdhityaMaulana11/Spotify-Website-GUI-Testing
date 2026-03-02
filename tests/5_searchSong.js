const { By, until } = require("selenium-webdriver");
const createDriver = require("../driver");

(async () => {
  const driver = await createDriver();

  try {
    const keyword = "Tarot";
    const searchUrl = `https://open.spotify.com/search/${encodeURIComponent(keyword)}`;

    // Buka langsung halaman pencarian dengan query
    await driver.get(searchUrl);

    // Inject cookie login
    await driver.manage().addCookie({
      name: "sp_dc",
      value: "value",
      domain: "open.spotify.com",
      path: "/",
      secure: true,
    });

    await driver.manage().addCookie({
      name: "sp_key",
      value: "value",
      domain: "open.spotify.com",
      path: "/",
      secure: true,
    });

    // Refresh setelah inject cookie
    await driver.navigate().refresh();

    console.log(`✅ Halaman pencarian '${keyword}' dibuka melalui URL`);

    // Tunggu hasil pencarian muncul
    const track = await driver.wait(
      until.elementLocated(By.css('[data-testid="tracklist-row"]')),
      10000,
    );
    await driver.wait(until.elementIsVisible(track), 5000);
    console.log(`✅ Lagu '${keyword}' ditemukan`);

    // Screenshot hasil
    const screenshot = await driver.takeScreenshot();
    require("fs").writeFileSync("search-success.png", screenshot, "base64");
    console.log("🖼️ Screenshot disimpan sebagai search-success.png");
  } catch (err) {
    console.error("❌ Search test failed:", err.message);
    const screenshot = await driver.takeScreenshot();
    require("fs").writeFileSync("search-error.png", screenshot, "base64");
    console.log("🖼️ Screenshot disimpan sebagai search-error.png");
  } finally {
    await driver.quit();
  }
})();
