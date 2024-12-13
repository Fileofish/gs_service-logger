const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.DEV_TELEGRAM_CHAT_ID;

if (!BOT_TOKEN || !CHAT_ID) {
  console.error("Telegram bot token or chat ID is not configured.");
}

export const sendTelegramMessage = async (message: string) => {
  console.log('check telegram');
  if (!BOT_TOKEN || !CHAT_ID) {
    console.error("Telegram bot token or chat ID is not set.");
    return;
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

    if (!response.ok) {
      const errorResponse = await response.text();
      console.error("Failed to send Telegram message:", response.status, errorResponse);
    } else {
      console.log("Telegram notification sent.");
    }
  } catch (err) {
    console.error("Error occurred while sending Telegram message:", err);
  }
};
