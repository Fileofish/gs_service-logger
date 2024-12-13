import cron from "node-cron";
import dotenv from "dotenv";
import { initLogsTable } from "./models/logs.js";
import { startSocketServer } from "./utils/socketHandler.js";
import { archiveLogs } from "./utils/archiver.js";

dotenv.config();

initLogsTable();
console.log("Logs table initialized.");

startSocketServer();

cron.schedule("0 0 * * *", () => {
  console.log("Starting archive task...");
  archiveLogs();
});
