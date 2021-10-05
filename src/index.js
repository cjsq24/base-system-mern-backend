import http from 'http'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
//Para manejar las variables de entorno
import 'dotenv/config'
import dbConnection from './dbConnection'
import routes from './modules/routes'
//import socket from './socket'

const app = express()
const server = http.createServer(app);
//socket(server)

//middlewares
//Para mostrar en la consola las peticiones
app.use(morgan('dev'))
app.use(cors())
//Para que el servidor pueda recibir en formato json
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/api', routes)

app.get('/', (req, res) => {
   res.send('Este es el backend base-system-mern (backend)')
})

server.listen(process.env.PORT || 3000, () => {
   console.log(`Server on port ${process.env.PORT || 3000}`)
   dbConnection()
})