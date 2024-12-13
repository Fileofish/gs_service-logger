import db from "../utils/db";
import { sendTelegramMessage } from "../utils/telegram";

export const saveLog = async (level: string, message: string, source?: string) => {
  let tgLog = '';
  try {
    if (level === "error") {
      const notification = `🚨 *Error Logged* 🚨
  - Message: ${message}
  - Source: ${source || "unknown"}`;
      tgLog = await sendTelegramMessage(notification) || 'undefiend';
    }

    const stmt = db.prepare(
      "INSERT INTO logs (level, message, source) VALUES (?, ?, ?)"
    );

    stmt.run(level, message + tgLog, source || null);

    console.log(`Log saved: [${level.toUpperCase()}] ${message}`);

  } catch (err) {
    if (err instanceof Error) {
      console.error(`Failed to save log: ${err.message}`);
    } else {
      console.error(`Failed to save log: ${JSON.stringify(err)}`);
    }
  }
};
