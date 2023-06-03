// Import for server
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { createServer } from 'http'
import routes from './routes/routes.js'

const app = express()
const server = createServer(app)

// Server config
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))
app.use(routes)

server.listen(4000, () => console.log('Server on port', 4000))

export default server
