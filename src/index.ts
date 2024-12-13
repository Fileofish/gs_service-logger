import cron from "node-cron";
import dotenv from "dotenv";
import { initLogsTable } from "./models/logs";
import { startSocketServer } from "./utils/socketHandler";
import { archiveLogs } from "./utils/archiver";

dotenv.config();
initLogsTable();
startSocketServer();
cron.schedule("0 0 * * *", () => {
  archiveLogs();
});
