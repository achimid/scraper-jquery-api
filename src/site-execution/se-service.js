const SiteExecutionModel = require('./se-model')
const crypto = require('crypto');

const opts = {
    script: '$("html").html()',
    importJquery: true,
    waitTime: false
}

const toMD5 = (data) => crypto.createHash('md5').update(JSON.stringify({data})).digest("hex")

const execute = async ({url, scriptTarget, scriptContent}) => {

    const startTime = process.hrtime()

    console.info('Criando nova pagina')
    const page = await global.browser.newPage();

    console.info('Navegando para Url', url)
    await page.goto(url)

    if (opts.importJquery) await page.addScriptTag({ url: process.env.JQUERY_URL_INJECTION })
    if (opts.waitTime) await page.waitFor(opts.waitTime)
    
    const execution = new SiteExecutionModel({ url, scriptTarget, scriptContent })

    try {
        console.info('Executando script')

        const [responseTarget, responseContent] = await Promise.all([
            page.evaluate(scriptTarget),
            page.evaluate(scriptContent || opts.script)
        ])
        
        console.info('Retorno do script target', url, responseTarget)
        // console.info('Retorno do script content', url, responseContent)

        if (!responseTarget) {
            throw `Inválid response target: ${url} ==> ${responseTarget}`
        }

        execution.isSucess = true
        execution.extractedTarget = responseTarget
        // execution.extractedContent = responseContent
        execution.hashTarget = toMD5({responseTarget})

    } catch (error) {
        execution.isSucess = false
        execution.errorMessage = error

        console.error(error)
    }

    execution.executionTime = process.hrtime(startTime)[1] / 1000000 // 0 = seconds, 1 = milisseconds

    await Promise.all([
        execution.save(),
        page.close()
    ])        

    return execution
}

module.exports = {
    execute
}