require('dotenv').config()

const {sendEMail} = require('./src/notification/email/email-dispatcher')

sendEMail('achimid@hotmail.com', 'Hi lolos, teste')