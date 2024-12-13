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

    console.log("Response status:", response.status);  // Логируем статус ответа
    const responseBody = await response.json();
    console.log("Response body:", responseBody);  // Логируем тело ответа

    if (!response.ok) {
      const errorMessage = `Failed to send Telegram message: ${response.status}, ${responseBody.description}`;
      console.error(errorMessage);
      return errorMessage;
    } else {
      console.log("Telegram notification sent.");
      // Возвращаем успешный ответ с message_id
      return `Message sent successfully: ${responseBody.result.message_id}`;
    }
  } catch (err) {
    let errorMessage: string;
    if (err instanceof Error) {
      errorMessage = `Error occurred while sending Telegram message: ${err.message}`;
      console.error(errorMessage);
    } else {
      errorMessage = `Error occurred while sending Telegram message: ${JSON.stringify(err)}`;
    }
    console.error(errorMessage);
    return errorMessage;
  }
};