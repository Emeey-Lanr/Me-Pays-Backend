const mongoose = require('mongoose')
const brycrpt = require('bcryptjs')
const bcrypt = require('bcryptjs/dist/bcrypt')
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

// const brycrptjs = ('', function (next) {
//     brycrptjs.has
// })
let saltRound = 5
userSchema.pre('save', function (next) {
    console.log(this.password)
    brycrpt.hash(this.password, saltRound, (err, res) => {
        if (err) {
            console.log('unable to covert')
        } else {
            this.password = res
            next()
        }
    })
})

userSchema.methods.Validatepassword = function (password, callb) {
    console.log(this)
    brycrpt.compare(password, this.password, (err, res) => {
        // console.log(res)
        callb(err, res)
    })
}

const userModel = mongoose.model('me_pays_user_details', userSchema)




module.exports = userModel