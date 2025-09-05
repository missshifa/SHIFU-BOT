const axios = require("axios");

async function startPing() {
  let url = process.env.RENDER_EXTERNAL_URL;

  if (!url) {
    console.log("[SELF-PING] ❌ Error: RENDER_EXTERNAL_URL is not set in environment variables.");
    return;
  }

  if (!url.startsWith("http")) {
    url = "https://" + url;
  }

  console.log(`\n[SELF-PING] link: ${url}\n`);

  setInterval(async () => {
    try {
      await axios.get(url);
      console.log(`[SELF-PING] ✅ Ping success: ${url}`);   // Success emoji
    } catch (error) {
      console.log(`[SELF-PING] ❌ Ping failed: ${error.message}`);  // Fail emoji
    }
  }, 5 * 60 * 1000);
}

module.exports = startPing;
