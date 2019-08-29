var appRoot = require('app-root-path');
var winston = require('winston');

// const consoleTransport = new winston.transports.Console({
//     level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
//     handleExceptions: true,
//     json: false,
//     colorize: true
// })

const fileTransport = new winston.transports.File({
    level: 'info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
})

const debugTransport = new winston.transports.Console({
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
})

const errorTransport = new winston.transports.File({
     filename:  `${appRoot}/logs/errors.log`
    , level: 'error' 
})
const myWinstonOptions = {
    transports: [
      new winston.transports.File({ filename: `${appRoot}/logs/combined.log` }),
      // debugTransport,
    ],  
    exitOnError: false,
}


const logger = new winston.createLogger(myWinstonOptions)

logger.stream = {
  write : (message: string) => {
      logger.info(message);
  }
}

export default logger