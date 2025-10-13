import fs from "fs";
import path from "path";

const logFilePath = path.join(process.cwd(), "logs.txt");

export const loggerMiddleware = (req, res, next) => {
  const log = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;
  fs.appendFile(logFilePath, log, (err) => {
    if (err) console.error("Logging error:", err);
  });
  console.log(log.trim());
  next();
};
