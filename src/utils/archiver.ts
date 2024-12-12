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
  try {
    const timestamp = new Date().toISOString().split("T")[0]; // Формат YYYY-MM-DD
    const archiveFile = path.join(ARCHIVE_PATH, `${timestamp}.log`);
    if (!fs.existsSync(ARCHIVE_PATH)) {
      fs.mkdirSync(ARCHIVE_PATH, { recursive: true });
    }
    const logs = db.prepare("SELECT * FROM logs").all() as Log[];

    if (logs.length === 0) {
      console.log("No logs to archive.");
      return;
    }
    const logData = logs
      .map(
        (log) =>
          `[${log.timestamp}] ${log.level.toUpperCase()}: ${log.message} ${
            log.source ? `(source: ${log.source})` : ""
          }`
      )
      .join("\n");
    fs.writeFileSync(archiveFile, logData, { flag: "w" });
    console.log(`Archived logs to ${archiveFile}`);
    db.prepare("DELETE FROM logs").run();
    console.log("Archived logs removed from database.");
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Failed to archive logs: ${err.message}`);
    } else {
      console.error(`Failed to archive logs: ${JSON.stringify(err)}`);
    }
  }
};
