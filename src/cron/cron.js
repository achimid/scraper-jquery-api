const cron = require('node-cron');

const schedule = (callback) => new Promise((resolve, reject) => {
    cron.schedule(process.env.CRON_TIME , () => {
        console.log('Iniciando execução do Job')
        try {
            resolve(callback())
        } catch (error) {
            console.error('Erro ao executar o Job', error)
            reject(error)
        }
        console.log('Finalizando execução do Job')
    })    
})

module.exports = schedule