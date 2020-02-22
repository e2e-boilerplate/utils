const winston = require("winston");

const consoleTransport = new winston.transports.Console();
const myWinstonOptions = {
  transports: [consoleTransport]
};

const logger = new winston.createLogger(myWinstonOptions);

module.exports = logger;
