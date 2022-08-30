const mongoose = require('mongoose')

const walletSchema = mongoose.Schema({
    description: { type: String, required: true },
    fund: { type: Number },
    targetAmount: { type: Number },
    userid: { type: String },
})

const walletModel = mongoose.model('wallet_collection', walletSchema)
module.exports = walletModel