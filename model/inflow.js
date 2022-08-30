const mongoose = require('mongoose')
const inflow = mongoose.Schema({
    amount: { type: Number },
    userid: { type: String },
})

const inflowModel = mongoose.model('inflow_collection', inflow)


module.exports = inflowModel