require('dotenv').config()

const express = require('express')
const compression = require('compression')
const errorhandler = require('errorhandler')
const statup = require('./startup')

const app = express()

app.use(compression());
app.use(express.json())
app.use(errorhandler())

// Endpoin registration
// ================
require('./api/scraper-api')(app)
// ================

statup()
app.listen(process.env.PORT)