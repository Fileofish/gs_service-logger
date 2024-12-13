import db from "../utils/db.js";
import { sendTelegramMessage } from "../utils/telegram.js";

export const saveLog = (level: string, message: string, source?: string) => {
  try {
    // Подготовка SQL-запроса для вставки лога
    const stmt = db.prepare(
      "INSERT INTO logs (level, message, source) VALUES (?, ?, ?)"
    );

    // Выполнение запроса
    stmt.run(level, message, source || null);

    console.log(`Log saved: [${level.toUpperCase()}] ${message}`);

    if (level === "error") {
      const notification = `🚨 *Error Logged* 🚨
  - Message: ${message}
  - Source: ${source || "unknown"}`;
      sendTelegramMessage(notification);
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Failed to save log: ${err.message}`);
    } else {
      console.error(`Failed to save log: ${JSON.stringify(err)}`);
    }
  }
};
