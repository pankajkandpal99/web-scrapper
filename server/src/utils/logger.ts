import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf, colorize } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}] ${stack || message}`;
});

export const logger = createLogger({
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
  format: combine(
    colorize(),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    logFormat
  ),
  transports: [new transports.Console()],
});
