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
})

const SiteRequest = mongoose.model("SiteRequest", schema)
module.exports = SiteRequest;