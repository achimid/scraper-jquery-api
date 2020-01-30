require('dotenv').config()

const express = require('express')
const compression = require('compression')
const errorhandler = require('errorhandler')
const monitor = require('express-status-monitor')
const statup = require('./config/startup')

const app = express()

app.use(monitor())
app.use(compression())
app.use(express.json())
app.use('/execute', express.static('public'));
app.use(errorhandler())


// Endpoin registration
// ================
const prefix = process.env.API_PREFIX
require('./site-request/sr-controller')(prefix)(app)
require('./site-execution/se-controller')(prefix)(app)
require('./config/healthcheck')(prefix)(app)
// ================

statup()
app.listen(process.env.PORT)