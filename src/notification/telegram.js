const TelegramBot = require('node-telegram-bot-api')
const TelegramChatModel = require('./telegram-chat-model')

// const port = process.env.PORT || 8443;
// const host = process.env.HOST;
// const bot = new TelegramBot(TOKEN, {webHook: {port, host}})
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {polling: true})

const telegramStartup = () => {
    
    bot.onText(/\/start/, (msg, match) => {
        new TelegramChatModel(msg.chat).save()
            .then(() => console.log('Telegram-Chat cadastrado com sucesso'))
            .catch(() => console.info('Telegram-Chat já existe'))
    })

    bot.onText(/\/stop/, (msg, match) => {
        TelegramChatModel.deleteOne({id: msg.chat.id})
            .then(() => console.log('Telegram-Chat removido com sucesso'))
            .catch(() => console.log('Erro ao remover Telegram-Chat'))
    })
    
}

const notify = (chat, message) => {
    bot.sendMessage(chat.id, message)
}


const notifyAll = (message) => TelegramChatModel.find().lean()
    .then(chats => chats.map(chat => notify(chat, message)))

module.exports = {
    telegramStartup,
    notify,
    notifyAll
}