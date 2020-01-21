const SiteRequest = require('./sr-model')

const create = (body) => new SiteRequest(body).save()

module.exports = {
    create
}