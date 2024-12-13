import db from "../utils/db";

export const initLogsTable = () => {
  db.exec(`
      CREATE TABLE IF NOT EXISTS logs (
        id TEXT PRIMARY KEY DEFAULT (uuid()),                                    -- Уникальный идентификатор UUID
        timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,                   -- Автоматическое время записи
        level TEXT NOT NULL CHECK (level IN ('info', 'warn', 'error', 'debug')), -- Уровень логирования
        message TEXT NOT NULL,                                                   -- Текст сообщения лога
        source TEXT                                                              -- Источник лога
      )
    `);
};
