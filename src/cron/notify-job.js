const schedule = require('./cron')
const SiteRequestModel = require('../site-request/sr-model')
const SiteExecutionModel = require('../site-execution/se-model')
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

const validateAndNotify = async (req) => {
    try {
            
        if (req.options.onlyChanged && !req.lastExecution.hashChanged) 
            throw 'hash not changed'

        if (req.options.onlyUnique) {
            const isUnique = await SiteExecutionModel.countDocuments({hashTarget: req.lastExecution.hashTarget}) <= 0
            if (!isUnique) throw 'is not unique'
        }

        await notifyChannels(req)
    } catch (error) {
        console.info('Notification not sent: ', error)
    }            
}

const executeSiteRequests = (req) => execute(req)
    .then(async (exect) => {
        if (!exect.isSuccess) return
        
        const hashChanged = req.lastExecution.hashTarget != exect.hashTarget

        // Copy execution into requisition.lastExecution
        Object.assign(req, { lastExecution: parseUpdateData(exect) })
        req.lastExecution.hashChanged = hashChanged

        await validateAndNotify(req)

        return req.save()    
    })

const initSchedulesRequests = () => SiteRequestModel.find()
    .then(requests => requests.map(req => {
        console.info(`Starting job for ${req.url} runing each ${req.options.hitTime} minute`)
        return schedule(() => {
            return executeSiteRequests(req)
        // },`*/${req.options.hitTime} * * * * *` )
        },`*/30 * * * * *` )
    }))
    


module.exports = initSchedulesRequests

// module.exports = () => {
    // executeSiteRequests()
    // schedule(executeSiteRequests)
// }

