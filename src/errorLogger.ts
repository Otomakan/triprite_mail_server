var appRoot = require('app-root-path');
var winston = require('winston');
const uuidv1 = require('uuid/v1');

const myWinstonOptions = {
    transports: [
      new winston.transports.File({ filename: `${appRoot}/logs/errors.log` }),
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
const errorLogger = (type, err) => {
  const uuid = uuidv1()

  logger.info(err,{type, uuid})
}
export {
    errorLogger
}
export default logger