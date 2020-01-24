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

const notifyChannels = async (site) => {
    const message = buildMessage(site)
    return Telegram.notifyAll(message)
}

const executeSiteRequests = async () => {
    const requests = await SiteRequestModel.find()
    
    const executions = requests.map(req => {
        return execute(req).then(exect => {
            if (!exect.isSuccess) return
            
            const hashChanged = req.last_execution.hashTarget != exect.hashTarget
            
            Object.assign(req, { last_execution: parseUpdateData(exect) })
            
            if (hashChanged || !req.options.only_changed) 
                notifyChannels(req)

            return req.save()    
        })        
    })
    
    await Promise.all(executions)
}

module.exports = () => {
    executeSiteRequests()
    // schedule(executeSiteRequests)
}

