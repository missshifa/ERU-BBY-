const axios = require("axios");

const baseUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`
  );
  return base.data.api;
};

module.exports.config = {
  name: "gpt4",
  aliases: [],
  version: "1.0.0",
  role: 0,
  author: "ALVI",
  description: "Gpt4 ai with multiple conversation",
  usePrefix: true,
  guide: "[message]",
  category: "Ai",
  countDown: 5,
};

// Reply Handler
module.exports.onReply = async function ({ api, event, Reply }) {
  const { author } = Reply;
  if (author != event.senderID) return;

  const reply = event.body;
  if (!reply) return;

  try {
    const response = await axios.get(
      `${await baseUrl()}/gpt4?text=${encodeURIComponent(reply)}&senderID=${author}`
    );
    const ok = response.data.data;

    await api.sendMessage(ok, event.threadID, (error, info) => {
      if (error) return console.log(error);
      global.GoatBot.onReply.set(info.messageID, {
        commandName: module.exports.config.name,
        type: "reply",
        messageID: info.messageID,
        author: event.senderID,
        link: ok,
      });
    }, event.messageID);
  } catch (err) {
    console.log(err.message);
    api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
  }
};

// Start Handler
module.exports.onStart = async function ({ api, args, event }) {
  try {
    const author = event.senderID;
    const dipto = args.join(" ").trim();

    if (!dipto) {
      return api.sendMessage(
        "Please provide a question to answer\n\nExample:\n!gpt4 hey",
        event.threadID,
        event.messageID
      );
    }

    const response = await axios.get(
      `${await baseUrl()}/gpt4?text=${encodeURIComponent(dipto)}&senderID=${author}`
    );
    const mg = response.data.data;

    await api.sendMessage({ body: mg }, event.threadID, (error, info) => {
      if (error) return console.log(error);
      global.GoatBot.onReply.set(info.messageID, {
        commandName: module.exports.config.name,
        type: "reply",
        messageID: info.messageID,
        author,
        link: mg,
      });
    }, event.messageID);
  } catch (error) {
    console.log(`Failed to get an answer: ${error.message}`);
    api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
  }
};
