const cache = require('../memory-cache')
var crypto = require('crypto');

const defaults = {
    script: '$("html").html()',
    importJquery: true,
    waitTime: false
}


function validateNotNull(value, message) {
    if (!value) {
        throw { erro: message }
    }
}

const scraperUrl = ({ url, options }) => {
    validateNotNull(url, 'Url não pode ser null')
    const opts = Object.assign(defaults, options)

    console.info('Criando nova pagina')
    return global.browser.newPage()
        .then(async (page) => { 
            
            console.info('Navegando para Url')
            await page.goto(url)

            if (opts.importJquery) await page.addScriptTag({ url: process.env.JQUERY_URL_INJECTION })
            if (opts.waitTime) await page.waitFor(opts.waitTime)

            console.info('Executando Script')
            response = await page.evaluate(opts.script)

            console.info('Fechando pagina')
            await page.close()

            return { response }
        })
}


const evaluate = (req, res) => {
    return scraperUrl(req.body)
        .then(response => res.send(response))
}

const hashign = (req, res) => {
    return scraperUrl(req.body)
        .then(({response}) => crypto.createHash('md5').update(JSON.stringify(response)).digest("hex"))
        .then(hash => res.send({ hash }))
}

module.exports = (app) => {
    app.post(`/api/evaluate`, cache(), evaluate),
    app.post(`/api/hash`, cache(), hashign)
}