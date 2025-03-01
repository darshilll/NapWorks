import { createLogger, transports, format } from "winston";
import fs from "fs";
import path from "path";

const logDirectory = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}


const logFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
);

const logger = createLogger({
  level: "info", 
  format: logFormat,
  transports: [
    new transports.Console(), 
    new transports.File({ filename: path.join(logDirectory, "server.log") }) // Logs to file
  ],
});

export default logger;
