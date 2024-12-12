import axios from "axios";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.DEV_TELEGRAM_CHAT_ID;

if (!BOT_TOKEN || !CHAT_ID) {
  console.error("Telegram bot token or chat ID is not configured.");
}

export const sendTelegramMessage = async (message: string) => {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.error("Telegram bot token or chat ID is not set.");
    return;
  }

  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    await axios.post(url, {
      chat_id: CHAT_ID,
      text: message,
    });
    console.log("Telegram notification sent.");
  } catch (err) {
    console.error("Failed to send Telegram message:", err);
  }
};