const { create } = require('./sr-service')


const createRequest = (req, res) => {
    return create(req.body)
        .then(response => res.json(response))
        .catch(error => res.send(error))
}

module.exports = (prefix) => (app) => {    
    app.post(`${prefix}/v1/notify`, createRequest)    
}
