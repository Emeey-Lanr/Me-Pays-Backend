const mongoose = require('mongoose')
const transferSchema = mongoose.Schema({
    transferid: { type: String },
    beneficiaryName: { type: String, required: true },
    beneficiaryAccountNumber: { type: Number, required: true },
    amountTransfer: { type: Number, required: true },
    decription: { type: String },
    refrenceid: { type: String },
    mode: { type: String },
    date: { type: String },
    year: { type: String },
    month: { type: String },
    time: { type: String },

})



const transferModel = mongoose.model('transactions', transferSchema);

module.exports = transferModel