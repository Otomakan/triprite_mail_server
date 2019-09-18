import {createServer} from "http"
import  app from './app'
import * as dotenv from "dotenv";

dotenv.config()

const { PORT = 43243 } = process.env
const server = createServer(app)
  server.listen(PORT, () =>
    console.log(`Server is running http://localhost:${PORT}...`)
  )