import cron from "node-cron";
import dotenv from "dotenv";
import { initLogsTable } from "./models/logs";
import { startSocketServer } from "./utils/socketHandler";
import { archiveLogs } from "./utils/archiver";

dotenv.config();

initLogsTable();
console.log("Logs table initialized.");

startSocketServer();

cron.schedule("0 0 * * *", () => {
  console.log("Starting archive task...");
  archiveLogs();
});
