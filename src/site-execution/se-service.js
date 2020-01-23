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

const retryIframe = async (page, {scriptTarget, scriptContent}) => {
    for (const frame of page.mainFrame().childFrames()){
        const promisses = getPromissesEvaluation(frame, {scriptTarget, scriptContent}) 
        [responseTarget, responseContent] = await Promise.all(promisses)    
        return [responseTarget, responseContent]
    }
    return [null, null]
}

const execute = async ({url, scriptTarget, scriptContent}) => {

    const startTime = process.hrtime()
    
    const execution = new SiteExecutionModel({ url, scriptTarget, scriptContent })

    console.info('Criando nova pagina')
    const page = await global.browser.newPage();

    try {

        console.info('Navegando para Url', url)
        await page.goto(url, { waitUntil: 'networkidle0' })

        if (opts.importJquery) await page.addScriptTag({ url: process.env.JQUERY_URL_INJECTION })        

        console.info('Executando script')
        
        const promisses = getPromissesEvaluation(page, {scriptTarget, scriptContent})        
        let [responseTarget, responseContent] = await Promise.all(promisses)
        
        console.info('Retorno do script target', url, responseTarget.trim())
        console.info('Retorno do script content', url, responseContent)

        if (!responseTarget) {            
            [responseTarget, responseContent] = await retryIframe(page, {scriptTarget, scriptContent})
        }

        if (!responseTarget) {
            throw `Inválid response target: ${url} ==> ${responseTarget}`
        }        

        execution.isSuccess = true
        if (responseTarget) execution.extractedTarget = responseTarget.trim()
        if (responseContent) execution.extractedContent = responseContent.trim()
        execution.hashTarget = toMD5({result: responseTarget.trim()})

    } catch (error) {
        execution.isSuccess = false
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