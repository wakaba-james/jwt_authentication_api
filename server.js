require("dotenv").config()
const express = require("express")

const bodyParser = require('body-parser')
const cors = require('cors')
const appRoute = require('./routes/routes.js')

const app = express()
const PORT = process.env.APP_PORT
app.use(bodyParser.json())


app.use('/api/users', appRoute);

app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})