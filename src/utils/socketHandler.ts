import net from "net";
import fs from "fs";
import { saveLog } from "../controllers/logs.js";

const SOCKET_PATH = process.env.SOCKET_PATH || "/tmp/gs_logger.sock";

export const startSocketServer = () => {
  if (fs.existsSync(SOCKET_PATH)) {
    try {
      fs.unlinkSync(SOCKET_PATH);
    } catch (err) {
      if (err instanceof Error) {
        console.error(`Error: ${err.message}`);
      } else {
        console.error(`Unknown error: ${JSON.stringify(err)}`);
      }
      process.exit(1);
    }
  }

  // Создаём сервер
  const server = net.createServer((connection) => {
    console.log("Client connected to log service");

    connection.on("data", (data) => {
      try {
        const log = JSON.parse(data.toString()); // Парсим JSON из запроса
        const { level, message, source } = log;

        // Проверяем наличие обязательных полей
        if (!level || !message) {
          throw new Error(
            "Invalid log format: level and message are required."
          );
        }

        // Сохраняем лог в базе данных
        saveLog(level, message, source);

        // Отправляем подтверждение клиенту
        connection.write("Log saved\n");
      } catch (err) {
        if (err instanceof Error) {
          console.error(`Error processing log: ${err.message}`);
          connection.write(`Error: ${err.message}\n`);
        } else {
          console.error(`Error processing log: ${JSON.stringify(err)}`);
          connection.write(`Error: ${JSON.stringify(err)}\n`);
        }
      }
    });

    connection.on("end", () => {
      console.log("Client disconnected");
    });

    connection.on("error", (err) => {
      console.error(`Connection error: ${err.message}`);
    });
  });

  // Запускаем сервер
  server.listen(SOCKET_PATH, () => {
    console.log(`Log service running at ${SOCKET_PATH}`);
    fs.chmodSync(SOCKET_PATH, 0o770); // Ограничиваем доступ к сокету
  });

  server.on("error", (err) => {
    console.error(`Server error: ${err.message}`);
    process.exit(1);
  });
};
