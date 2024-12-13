import fs from "fs";
import path from "path";
import db from "./db";

interface Log {
  id: string;
  timestamp: string;
  level: "info" | "warn" | "error" | "debug";
  message: string;
  source?: string;
}

const ARCHIVE_PATH = process.env.ARCHIVE_PATH || "./logs/archive";

export const archiveLogs = () => {
  const timestamp = new Date().toISOString().split("T")[0]; // Формат YYYY-MM-DD
  const archiveFile = path.join(ARCHIVE_PATH, `${timestamp}.log`);
  if (!fs.existsSync(ARCHIVE_PATH)) {
    fs.mkdirSync(ARCHIVE_PATH, { recursive: true });
  }
  const logs = db.prepare("SELECT * FROM logs").all() as Log[];

  if (logs.length === 0) return;
  const logData = logs
    .map(
      (log) =>
        `[${log.timestamp}] ${log.level.toUpperCase()}: ${log.message} ${
          log.source ? `(source: ${log.source})` : ""
        }`
    )
    .join("\n");
  fs.writeFileSync(archiveFile, logData, { flag: "w" });
  db.prepare("DELETE FROM logs").run();
};
