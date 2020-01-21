require('dotenv').config()

const express = require('express')
const compression = require('compression')
const errorhandler = require('errorhandler')
const statup = require('./config/startup')

const app = express()

app.use(compression());
app.use(express.json())
app.use(errorhandler())

// Endpoin registration
// ================
const prefix = process.env.API_PREFIX
require('./site-request/sr-controller')(prefix)(app)
// ================

statup()
app.listen(process.env.PORT)