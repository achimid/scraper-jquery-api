const schedule = require('./cron')
const SiteRequestModel = require('../site-request/sr-model')
const { execute } = require('../site-execution/se-service')
const Telegram = require('../notification/telegram/telegram')

const parseUpdateData = (exect) => {
    const updateData = { isSuccess: exect.isSuccess}
    if (exect.isSuccess) {
        updateData.hashTarget = exect.hashTarget
        updateData.extractedTarget = exect.extractedTarget
        updateData.extractedContent = exect.extractedContent
    } else {
        updateData.errorMessage = exect.errorMessage
    }
    
    return updateData    
}

const buildMessage = (site) => {
    return `${site.message} \n [${site.extractedContent}]`
}

const notifyChanels = async (site) => {
    const message = buildMessage(site)
    return Telegram.notifyAll(message)
}

const executeSiteRequests = async () => {
    const sites = await SiteRequestModel.find()
    
    const executions = sites.map(site => {
        return execute(site).then(exect => {
            if (!exect.isSuccess) return

            const hashChanged = site.hashTarget != exect.hashTarget
            Object.assign(site, parseUpdateData(exect))

            // if (hashChanged) 
            notifyChanels(site)

            return site.save()    
        })        
    })
    
    await Promise.all(executions)
}

module.exports = () => {
    executeSiteRequests()
    // schedule(executeSiteRequests)
}

