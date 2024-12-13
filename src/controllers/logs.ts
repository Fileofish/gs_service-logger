import db from "../utils/db";
import { sendTelegramMessage } from "../utils/telegram";

export const saveLog = async (
  level: string,
  message: string,
  source?: string
) => {
  if (level === "error") {
    const notification = `🚨 *Error Logged* 🚨
  — Message: ${message}
  — Source: ${source || "unknown"}`;
    await sendTelegramMessage(notification);
  }

  const stmt = db.prepare(
    "INSERT INTO logs (level, message, source) VALUES (?, ?, ?)"
  );

  stmt.run(level, message, source || null);
};
