const mongoose = require("mongoose")

const schema = mongoose.Schema({
    url: { 
        type: mongoose.SchemaTypes.String, 
        required: true
    },
    siteName: { 
        type: mongoose.SchemaTypes.String, 
        required: true 
    },
    message: { 
        type: mongoose.SchemaTypes.String, 
        required: true 
    },
    scriptTarget: { 
        type: mongoose.SchemaTypes.String, 
        required: true 
    },
    scriptContent: { 
        type: mongoose.SchemaTypes.String
    },
    isSuccess: {
        type: mongoose.SchemaTypes.Boolean
    },    
    hashTarget: {
        type: mongoose.SchemaTypes.String
    },
    extractedTarget: {
        type: mongoose.SchemaTypes.String
    },
    extractedContent: { 
        type: mongoose.SchemaTypes.String         
    },
    errorMessage: {
        type: mongoose.SchemaTypes.String
    }    
}, { versionKey: false, timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })

const SiteRequest = mongoose.model("site-request", schema)
module.exports = SiteRequest