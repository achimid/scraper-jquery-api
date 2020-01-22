const SiteExecutionModel = require('./se-model')
const crypto = require('crypto');

const opts = {
    script: '$("html").html()',
    importJquery: true,
    waitTime: 1000
}

const toMD5 = (data) => crypto.createHash('md5').update(JSON.stringify({data})).digest("hex")

const getExecutionTime = (startTime) => process.hrtime(startTime)[1] / 1000000 // 0 = seconds, 1 = milisseconds

const getPromissesEvaluation = (artifact, {scriptTarget, scriptContent}) => {
    const promisses = [artifact.evaluate(scriptTarget)]

    if (scriptContent) promisses.push(artifact.evaluate(scriptContent))

    return promisses
}

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
        
        const promisses = getPromissesEvaluation(page, {scriptTarget, scriptContent})        
        let [responseTarget, responseContent] = await Promise.all(promisses)
        
        console.info('Retorno do script target', url, responseTarget)
        // console.info('Retorno do script content', url, responseContent)

        // Iframe re-try
        if (!responseTarget) {            
            for (const frame of page.mainFrame().childFrames()){
                const promisses = getPromissesEvaluation(frame, {scriptTarget, scriptContent}) 
                [responseTarget, responseContent] = await Promise.all(promisses)    
                if (responseTarget) {
                    break
                }            
            }
        }

        if (!responseTarget) {
            throw `Inválid response target: ${url} ==> ${responseTarget}`
        }

        execution.isSucess = true
        execution.extractedTarget = responseTarget
        execution.extractedContent = responseContent
        execution.hashTarget = toMD5({responseTarget})

    } catch (error) {
        execution.isSucess = false
        execution.errorMessage = error

        console.error(error)
    }

    execution.executionTime = getExecutionTime(startTime)
    console.info('Execution Time =======>>>>>>>>', execution.executionTime)

    await Promise.all([
        execution.save(),
        page.close()
    ])

    return execution
}

module.exports = {
    execute
}