const express = require('express')
const puppeteer = require('puppeteer');
const compression = require('compression');

const urlJquery = { url: 'https://code.jquery.com/jquery-3.2.1.min.js' }
const defaults = {
    script: '$("html").html()',
    importJquery: true,
    waitTime: false
}

const repository = {}

const app = express()
let browser = null

app.use(compression());
app.use(express.json())

function validateNotNull(value, message) {
    if (!value) {
        throw { erro: message }
    }
}

const scraperUrl = ({ url, options }) => {
    validateNotNull(url, 'Url não pode ser null')
    const opts = Object.assign(defaults, options)

    const jsonHash = JSON.stringify({ url, options})
    const contentCache = repository[jsonHash]
    const hasCache = !!contentCache

    if (hasCache)
        return Promise.resolve({retorno: contentCache })

    return browser.newPage()
        .then(async (page) => {            
            try {    
                const response = {}            

                await page.goto(url)                                 

                if (opts.importJquery) await page.addScriptTag(urlJquery)
                if (opts.waitTime) await page.waitFor(opts.waitTime)

                response.retorno = await page.evaluate(opts.script)
                await page.close()
                
                repository[jsonHash] = response.retorno

                return response
            } catch (error) {
                Promise.reject(error)
          }            
        })
}

app.post('/evaluate', (req, res) => {
    return scraperUrl(req.body)
        .then(response => res.send({response: response, sucess:'true' }))
        .catch(erro => res.send({erro}))
})

const initBrowser = async () => {
    browser = await puppeteer.launch();
}

app.use(function(err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

initBrowser()
app.listen(process.env.PORT || 9000)