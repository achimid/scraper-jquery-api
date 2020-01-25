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

const executeSiteRequests = (req) => execute(req)
    .then(exect => {
        if (!exect.isSuccess) return
        
        const hashChanged = req.lastExecution.hashTarget != exect.hashTarget
        
        Object.assign(req, { lastExecution: parseUpdateData(exect) })
        
        if ((hashChanged && req.options.onlyChanged) || !req.options.onlyChanged) 
            notifyChannels(req)

        return req.save()    
    })

const initSchedulesRequests = () => SiteRequestModel.find()
    .then(requests => requests.map(req => {
        console.info(`Starting job for ${req.url} runing each ${req.options.hitTime} minute`)
        return schedule(() => {
            return executeSiteRequests(req)
        },`*/${req.options.hitTime} * * * *` )
    }))
    


module.exports = initSchedulesRequests

// module.exports = () => {
    // executeSiteRequests()
    // schedule(executeSiteRequests)
// }

