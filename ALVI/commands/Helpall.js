const fs = require("fs-extra");
const request = require("request");

module.exports.config = {
 name: "help",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "ALVI",
 description: "Displays all available commands in one page",
 commandCategory: "system",
 usages: "[No args]",
 cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
 const { commands } = global.client;
 const { threadID, messageID } = event;

 const allCommands = [];

 for (let [name] of commands) {
 if (name && name.trim() !== "") {
 allCommands.push(name.trim());
 }
 }

 allCommands.sort();

 const finalText = `╔═❖ 🌟 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐋𝐈𝐒𝐓 🌟 ❖══╗
${allCommands.map(cmd => `║ ➔ ${cmd}`).join("\n")}
╠═════ 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎 ═════╣
║ 🤖 𝐁𝐨𝐭: ─꯭─⃝‌‌𝑬𝒓𝒖 𝒃𝒃𝒚
║ 👑 𝐎𝐰𝐧𝐞𝐫: 𝑶𝒓𝒆𝒌𝒊
║ 📦 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐬: ${allCommands.length} 
╚════════════════╝`;

 
 const backgrounds = [
 "https://i.imgur.com/nW94ea9.jpeg"
 ];
 const selectedBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
 const imgPath = __dirname + "/cache/helpallbg.jpg";

 const callback = () =>
 api.sendMessage({ body: finalText, attachment: fs.createReadStream(imgPath) }, threadID, () => fs.unlinkSync(imgPath), messageID);

 request(encodeURI(selectedBg))
 .pipe(fs.createWriteStream(imgPath))
 .on("close", () => callback());
};
