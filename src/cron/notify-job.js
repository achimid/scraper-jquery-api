const schedule = require('./cron')
const SiteRequestModel = require('../site-request/sr-model')
const { execute } = require('../site-execution/se-service')

const executeSiteRequests = async () => {
    const executions = await SiteRequestModel.find().lean().then(sites => sites.map(execute))

    const results = await Promise.all(executions)
    console.log(results)
}


module.exports = executeSiteRequests
    // schedule(executeSiteRequests)