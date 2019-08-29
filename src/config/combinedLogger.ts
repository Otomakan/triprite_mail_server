var appRoot = require('app-root-path');
var winston = require('winston');

const myWinstonOptions = {
    transports: [
      new winston.transports.File({ filename: `${appRoot}/logs/combined.log` }),
    ],  
    timestamp: true,
    exitOnError: false,
}


const logger = new winston.createLogger(myWinstonOptions)

logger.stream = {
  write : (message: string) => {
      logger.info(message);
  }
}
const uniqueLogger = (type, body) => {
  const date = new Date().toString()
  logger.info(body, {type, date})
  logger.info(body,{type,date})
}
export{
  uniqueLogger
}
export default logger