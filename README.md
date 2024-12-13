# Logger Microservice

This project provides a **Logger Microservice** that handles logging, stores logs in a SQLite database, and sends notifications for errors via Telegram. Logs are archived daily.

## Features
- **Log storage**: Logs are stored in a SQLite database.
- **Error notifications**: Telegram notifications are sent for error-level logs.
- **Daily log archive**: The system automatically archives logs every day at midnight.

## Installation

### Environment Requirements

To run this microservice, the following environment variables are required:

- **`SOCKET_PATH`**: The path to the Unix socket for log communication. Default: `/tmp/gs_logger.sock`.
- **`TELEGRAM_BOT_TOKEN`**: The bot token for sending notifications via Telegram.
- **`TELEGRAM_CHAT_ID`**: The Telegram chat ID to which error messages will be sent.
- **`DATABASE_PATH`**: The path to the SQLite database file for storing logs. Default: `./logs/logger.db`.
- **`ARCHIVE_PATH`**: The directory where logs will be archived daily. Default: `./logs/archive`.

You can add these variables in your `.env` file in the project root.

### Install Dependencies

Install all required dependencies:

```bash
npm install
```

### Start Server

To start the log server, use the following command:

```bash
pm2 start ./src/index.ts --name 'logger-service' --watch
```

You can also ensure that the server starts on boot by using the following command:

```bash
pm2 startup systemd --user root
pm2 save
```

## Usage

### Logging Structure

Logs are inserted into the SQLite database using the following format:

```json
{
  "level": "error",       // Log level (e.g., 'info', 'warn', 'error', 'debug')
  "message": "This is an error message",
  "source": "myApp.js"    // Optional field, indicates the source of the log
}
```

### Types of Logs

The log system supports the following log levels:

- **`info`**: Standard informational logs.
- **`warn`**: Warnings about potential issues.
- **`error`**: Error messages; will trigger a Telegram notification.
- **`debug`**: Detailed debugging logs.

### Database Structure

The database stores logs in the logs table with the following structure:

| Column     | Type     | Description                                         |
|------------|----------|-----------------------------------------------------|
| `id`       | `TEXT`   | Unique identifier  (automatically generated)        |
| `timestamp`| `DATETIME`| Log timestamp (automatically generated)            |
| `level`    | `TEXT`   | Log level (`'info'`, `'warn'`, `'error'`, `'debug'`) |
| `message`  | `TEXT`   | The log message                                     |
| `source`   | `TEXT`   | The source of the log (optional)                    |

### Daily Archive

The logs are archived automatically every day at midnight using the cron job configured in the system. You can see the logs being saved and archived through the following steps in the source code:

```js
cron.schedule("0 0 * * *", () => {
  archiveLogs();
});
```
The archiveLogs function archives the logs and clears the database. Logs are archived in the directory specified by the ARCHIVE_PATH environment variable (default: ./logs/archive).

## Stack

- **Node.js**: The server is built using Node.js (v22).
- **SQLite**: Logs are stored in an SQLite database.
- **pm2**: Used to run the application as a service and ensure it stays alive.
- **Cron**: A cron job is set up to archive logs daily at midnight.
- **Telegram API**: Used to send notifications for error-level logs.

### System Dependencies

**`pm2`**: Ensure PM2 is installed globally for process management:

```bash
npm install -g pm2
```

## Build and Deployment (GitHub Actions)

### CI/CD Pipeline

The build and deployment process is automated using GitHub Actions. When a change is pushed to the **`main`** branch, the following steps are executed:

1. Checkout code: The latest code is checked out from the repository.
2. Set up Node.js: Node.js version **`22`** is set up for the project.
3. Install dependencies: All required dependencies are installed.
4. Build the project: The project is built using **`esbuild`** and bundled into the **`dist`** directory.
5. Deploy the build: The built files, along with **`package.json`**, are deployed to the server.
6. Install production dependencies: Production dependencies are installed on the server and unnecessary files are removed from **`node_modules`**.
7. Start the app: The app is started with PM2.
8. Ensure PM2 starts on boot: PM2 is set up to automatically start on server reboot.