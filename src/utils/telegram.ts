import dotenv from "dotenv";

dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.DEV_TELEGRAM_CHAT_ID;

export const sendTelegramMessage = async (message: string) => {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parse_mode: "markdown",
      chat_id: CHAT_ID,
      text: message,
    }),
  });
};
