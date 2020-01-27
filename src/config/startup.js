const puppeteer = require('puppeteer')  
const databaseInit = require('./database')
const notifyJobInit = require('../cron/notify-job')
const { telegramStartup } = require('../notification/telegram/telegram')

const initBrowser = async () => {
    console.info('Inicializando browser......')
    global.browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    console.info('Browser inicializado')
}

module.exports = () => {
    initBrowser()
    databaseInit()
    notifyJobInit()
    telegramStartup()
}
