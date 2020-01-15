const schedule = require('./cron')

const execute = () => {

const executeService = async () => {
    for (let index = 0; index < depositoryMonitoring.length; index++) {
        const site = depositoryMonitoring[index];
         
        const hash = await getHashFromUrl(site.data)
        console.log('hash', hash)

        // if (!isFirst) {
            if (hash != site.lastHash) {
                console.log('hash atualizado')
                site.lastHash = hash
                registredIds.forEach(chatId => {
                    bot.sendMessage(chatId, site.message)
                    console.log('notificando atualização no site......')
                })                    
            } else {
                console.log('hash igual')
            }
        // } else {
        //     site.lastHash = hash
        //     isFirst = false
        // }    

    }
}

schedule(execute)