const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phoneNumber: { type: Number, required: true },
    password: { type: String, required: true },
    accountBalance: { type: Number },
    accounNumber: { type: Number },
    accountPin: { type: Number },
    imgUrl: { type: String },

})



const userModel = mongoose.model('me_pays_user_details', userSchema)




module.exports = userModel