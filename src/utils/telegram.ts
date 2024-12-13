import dotenv from "dotenv";

dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.DEV_TELEGRAM_CHAT_ID;

export const sendTelegramMessage = async (message: string) => {
  if (!BOT_TOKEN || !CHAT_ID) {
    return " Telegram bot token or chat ID is not set.";
  }

  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
      }),
    });

    const responseBody = await response.json();

    if (!response.ok) {
      const errorMessage = ` Failed to send Telegram message: ${response.status}, ${responseBody.description}`;
      return errorMessage;
    } else {
      return ` TG message sent successfully`;
    }
  } catch (err) {
    let errorMessage: string;
    if (err instanceof Error) {
      errorMessage = ` Error occurred while sending Telegram message: ${err.message}`;
    } else {
      errorMessage = ` Error occurred while sending Telegram message: ${JSON.stringify(err)}`;
    }
    return errorMessage;
  }
};