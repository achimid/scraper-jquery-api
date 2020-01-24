const mongoose = require("mongoose")

const schema = mongoose.Schema({
    site: { 
        type: mongoose.SchemaTypes.String, 
        required: true
    },
    title: { 
        type: mongoose.SchemaTypes.String
    },
    content: { 
        type: mongoose.SchemaTypes.String
    }
}, { versionKey: false, timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })

const TelegramChat = mongoose.model("telegram-chat", schema)
module.exports = TelegramChat