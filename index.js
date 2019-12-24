const express = require('express')
const puppeteer = require('puppeteer');
const compression = require('compression');

const urlJquery = {url: 'https://code.jquery.com/jquery-3.2.1.min.js'}
const defaults = {
    script: '$("html").html();',
    importJquery: true
}

const app = express()
let browser = null

app.use(compression());
app.use(express.json())

function validateNotNull(value, message)  {
    if (!value) {
        throw { erro: message}
    }
}

const preparePage = ({ importJquery = defaults.importJquery }) => async (page) => {
    if (importJquery) 
        await page.addScriptTag(urlJquery)
    
    return page    
}

const scraperUrl = ({url, options}) => {    
    validateNotNull(url)    

    return browser.newPage()
        .then(preparePage(options))
        .then(async (page) => {
            await page.goto(url)
            const retorno = await page.evaluate(options.script || defaults.script)
            await page.close()
            return retorno
        })
}

app.post('/evaluate', (req, res) => {
    return scraperUrl(req.body)
        .then(response => res.send(response))
        .catch(erro => res.send(erro))
})

const initBrowser = async () => {
    browser = await puppeteer.launch();
}

init()
app.listen(process.env.PORT || 9000)