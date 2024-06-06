import winston from "winston";

// Define logger configuration
const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: "mpesa.log", // Specify the log file name
      level: "info", // Specify the log level
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],
});

module.exports = logger;
