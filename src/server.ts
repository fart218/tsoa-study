import dotenv from 'dotenv'
import path from 'path'

const env = process.env.NODE_ENV || 'development'
dotenv.config({path: path.join(__dirname.replace('build', ''), '..', `.env.${env}`)})

import { app } from "./app"

const port = process.env.SERVER_PORT || 3000

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
)