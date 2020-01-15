const mongoose = require("mongoose")

const schema = mongoose.Schema({
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
    },
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

const SiteRequest = mongoose.model("SiteRequest", schema)
module.exports = SiteRequest;