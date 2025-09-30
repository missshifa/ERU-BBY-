const moment = require("moment-timezone");

module.exports.config = {
  name: "autotime",
  version: "4.0.0",
  hasPermssion: 2,
  credits: "ALVI",
  description: "বট চালু হলেই প্রতি ঘন্টা সময়, তারিখ ও দোয়া পাঠাবে",
  commandCategory: "system",
  usages: "autotime",
  cooldowns: 5,
};

const runningGroups = new Set();

function sendTime(api, threadID) {
  if (!runningGroups.has(threadID)) return;

  const timeZone = "Asia/Dhaka";
  const now = moment().tz(timeZone);
  const time = now.format("hh:mm A");
  const date = now.format("DD/MM/YYYY, dddd");

  const msg = `╭╼╾╼🌸╾╼╾╮  
🌺𝐁𝐃~𝐓𝐈𝐌𝐄🌺  
╰╼╾╼🌸╾╼╾╯ 

⏰ সময়: ${time}  
📅 তারিখ: ${date}  
🌍 টাইমজোন: ${timeZone}  

━━━━━━━━━━━━━━━
উচ্চারণ : আল্লাহুম্মা মা আসবাহাবি মিন নিমাতিন আও বি আহাদিন মিন খালক্বিকা ফামিনকা ওয়াহদাকা লা শারিকা লাকা ফালাকাল হামদু ওয়া লাকাশ শুকরু।  

অর্থ : হে আল্লাহ! (আজ) সকালে আমি যে অনুগ্রহ পেলাম, অথবা তোমার প্রত্যেক সৃষ্টি যে অনুগ্রহ পেলো, তা সবই কেবল তোমারই দান। তোমার কোনো অংশীদার নেই, তাই সব প্রশংসা কেবল তুমিই প্রাপ্য, আর কৃতজ্ঞতাও কেবল তোমারই।  

📖 (আবু দাউদ)  

আল্লাহ তাআলা মুমিন মুসলমানকে সকাল-সন্ধ্যা একবার করে এ দোয়াটি পড়ার মাধ্যমে দিন-রাতের শুকরিয়া আদায় করার তাওফিক দান করুন। আমিন।  

𝐂𝐫𝐞𝐚𝐭𝐨𝐫 ━➢ 𝗔𝗟𝗩𝗜 𝗖𝗛𝗔𝗧 𝗕𝗢𝗧`;

  api.sendMessage(msg, threadID);
}

module.exports.run = async function ({ api, event }) {
  const threadID = event.threadID;

  if (runningGroups.has(threadID)) {
    return api.sendMessage("⏰ এই গ্রুপে ইতিমধ্যে AutoTime চলছে!", threadID);
  }

  runningGroups.add(threadID);
  api.sendMessage("✅ বট চালু হয়েছে। এখন থেকে প্রতি ঘন্টা সময়, তারিখ ও দোয়া পাঠানো হবে।", threadID);

  const timeZone = "Asia/Dhaka";
  const now = moment().tz(timeZone);
  const nextHour = now.clone().add(1, "hour").startOf("hour");
  let delay = nextHour.diff(now);

  setTimeout(function tick() {
    if (!runningGroups.has(threadID)) return;

    sendTime(api, threadID);

    setInterval(() => {
      if (!runningGroups.has(threadID)) return;
      sendTime(api, threadID);
    }, 60 * 60 * 1000);

  }, delay);
};

module.exports.handleEvent = async function ({ api, event }) {
  const threadID = event.threadID;

  // বট চালু হবার সাথে সাথে সব গ্রুপে AutoTime চালু হয়ে যাবে
  if (!runningGroups.has(threadID)) {
    runningGroups.add(threadID);

    const timeZone = "Asia/Dhaka";
    const now = moment().tz(timeZone);
    const nextHour = now.clone().add(1, "hour").startOf("hour");
    let delay = nextHour.diff(now);

    setTimeout(function tick() {
      if (!runningGroups.has(threadID)) return;

      sendTime(api, threadID);

      setInterval(() => {
        if (!runningGroups.has(threadID)) return;
        sendTime(api, threadID);
      }, 60 * 60 * 1000);

    }, delay);
  }
};
