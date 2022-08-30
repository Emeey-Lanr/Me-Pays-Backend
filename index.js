const express = require('express')
const app = express()

require('dotenv').config()
PORT = process.env.PORT
URI = process.env.URI

const cors = require('cors')
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(express.json({ limit: '50mb' }))
app.use(cors())
const user_route = require('./route/user.route')
app.use('/user', user_route)

const mongoose = require('mongoose')
mongoose.connect(URI, (err) => {
    if (err) {
        console.log('not connected')
    } else {
        console.log('connected')
    }
})












app.listen(PORT)