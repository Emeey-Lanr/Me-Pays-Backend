const mongoose = require('mongoose')
const outflow = mongoose.Schema({
    amount: { type: Number },
    userid: { type: String },
})

const outflowModel = mongoose.model('outflow_collection', outflow)



module.exports = outflowModel