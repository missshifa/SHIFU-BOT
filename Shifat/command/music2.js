const fetch = require("node-fetch");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const ytSearch = require("yt-search");
const https = require("https");
const http = require("http");

module.exports = {
  config: {
    name: "music",
    version: "1.0.4",
    hasPermssion: 0,
    credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭 + Modified by Kawsar",
    description: "Download YouTube song from keyword search and link",
    commandCategory: "Media",
    usages: "[song name] [audio|video]",
    cooldowns: 5,
    dependencies: {
      "node-fetch": "",
      "yt-search": "",
    },
  },

  run: async function ({ api, event, args }) {
    let songName, type;

    if (
      args.length > 1 &&
      (args[args.length - 1] === "audio" || args[args.length - 1] === "video")
    ) {
      type = args.pop();
      songName = args.join(" ");
    } else {
      songName = args.join(" ");
      type = "audio";
    }

    if (!songName) {
      return api.sendMessage("❌ Please provide a song name.", event.threadID, event.messageID);
    }

    const processingMessage = await api.sendMessage(
      "✅ Processing your request. Please wait...",
      event.threadID,
      null,
      event.messageID
    );

    try {
      const searchResults = await ytSearch(songName);
      if (!searchResults || !searchResults.videos.length) {
        throw new Error("❌ No results found for your search query.");
      }

      const topResult = searchResults.videos[0];
      const videoId = topResult.videoId;

      const apiKey = "priyansh-here";
      const apiUrl = `https://priyansh-ai.onrender.com/youtube?id=${videoId}&type=${type}&apikey=${apiKey}`;

      api.setMessageReaction("⌛", event.messageID, () => {}, true);

      const downloadResponse = await axios.get(apiUrl);
      const downloadUrl = downloadResponse.data.downloadUrl;

      if (!downloadUrl || typeof downloadUrl !== "string") {
        throw new Error("❌ Failed to get a valid download URL.");
      }

      const safeTitle = topResult.title.replace(/[^a-zA-Z0-9 \-_]/g, "");
      const filename = `${safeTitle}.${type === "audio" ? "mp3" : "mp4"}`;
      const downloadDir = path.join(__dirname, "cache");
      const downloadPath = path.join(downloadDir, filename);

      if (!fs.existsSync(downloadDir)) {
        fs.mkdirSync(downloadDir, { recursive: true });
      }

      const file = fs.createWriteStream(downloadPath);

      // Recursive function to follow redirects
      await new Promise((resolve, reject) => {
        const makeRequest = (url) => {
          const client = url.startsWith("https") ? https : http;

          client.get(url, (response) => {
            if (response.statusCode === 200) {
              response.pipe(file);
              file.on("finish", () => {
                file.close(resolve);
              });
            } else if (response.statusCode === 301 || response.statusCode === 302) {
              console.warn(`⚠️ Redirected to: ${response.headers.location}`);
              makeRequest(response.headers.location);
            } else {
              reject(
                new Error(`❌ Failed to download file. Status code: ${response.statusCode}`)
              );
            }
          }).on("error", (error) => {
            if (fs.existsSync(downloadPath)) fs.unlinkSync(downloadPath);
            reject(new Error(`❌ Error during download: ${error.message}`));
          });
        };

        makeRequest(downloadUrl);
      });

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      await api.sendMessage(
        {
          attachment: fs.createReadStream(downloadPath),
          body: `✅ Title: ${topResult.title}\n\nHere is your ${type === "audio" ? "audio" : "video"} file.`,
        },
        event.threadID,
        () => {
          fs.unlinkSync(downloadPath);
          api.unsendMessage(processingMessage.messageID);
        },
        event.messageID
      );
    } catch (error) {
      console.error("❌ Error in music command:", error);
      api.sendMessage(
        `${error.message || "❌ Unknown error occurred while downloading."}`,
        event.threadID,
        event.messageID
      );
    }
  },
};
