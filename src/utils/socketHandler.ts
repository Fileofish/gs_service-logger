import net from "net";
import fs from "fs";
import { saveLog } from "../controllers/logs";

const SOCKET_PATH = process.env.SOCKET_PATH || "/tmp/gs_logger.sock";

export const startSocketServer = () => {
  if (fs.existsSync(SOCKET_PATH)) {
    try {
      fs.unlinkSync(SOCKET_PATH);
    } catch (err) {
      process.exit(1);
    }
  }

  const server = net.createServer(async (connection) => {
    connection.on("data", async (data) => {
      const log = JSON.parse(data.toString());
      const { level, message, source } = log;
      if (!level || !message) {
        throw new Error("Invalid log format: level and message are required.");
      }
      await saveLog(level, message, source);
      connection.write("Log saved\n");
    });
  });

  // Запускаем сервер
  server.listen(SOCKET_PATH, () => {
    fs.chmodSync(SOCKET_PATH, 0o770);
  });

  server.on("error", (err) => {
    process.exit(1);
  });
};
