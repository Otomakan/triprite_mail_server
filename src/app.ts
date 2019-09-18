import * as express from "express";
import * as bodyParser from "body-parser"
import * as cors from "cors"
import * as compression from "compression"


import  logger  from './config/winston'
import * as morgan from 'morgan'


import IssueController from './issueTicket/issueTicketController'


const app = express()

const corsOptions = {
  origin: ['http://localhost:8080', 
  'http://localhost:3000',
  'https://tripriteadmin.laeeto.com',  'http://tripriteadmin.laeeto.com', 
  'http://34.217.79.170', 'https://triprite.laeeto.com',
  'http://triprite.laeeto.com', 'http://35.164.35.109',  
  'https://35.164.35.109', 'http://3.13.226.214',
  'https://3.13.226.214','http://3.13.226.214:8080','https://3.13.226.214:8080', 
  'http://triprite.com',  'https://triprite.com', 
  'http://www.triprite.com',  'https://www.triprite.com', 
  'http://flights.triprite.com', 
  'https://flights.triprite.com'],  
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }
  app.use(compression())

app.use(cors(corsOptions))

app.use(bodyParser.urlencoded({ extended: false }))


const logRequest = (req, res, next) => {
  logger.info(req.url)
  next()
}
app.use(logRequest)

const logError = (err, req, res, next) => {
  logger.error(err)
  next()
}
app.use(logError)

app.use(morgan('combined', { stream: logger.stream }))


// parse application/json
app.use(bodyParser.json())

const issueController =  new IssueController()
app.post('/api/v1/issue-confirmation-ticket',issueController.issueTicket)


export default app
