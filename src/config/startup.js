const puppeteer = require('puppeteer')  
const databaseInit = require('./database')

const initBrowser = async () => {
    console.info('Inicializando browser......')
    global.browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    console.info('Browser inicializado')
}

module.exports = () => {
    initBrowser()
    databaseInit()
}
