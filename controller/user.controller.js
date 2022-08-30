
const mongoose = require('mongoose')
const userModel = require('../model/user.model')
const transferModel = require('../model/user.transfer')
const inflowModel = require('../model/inflow')
const outflowModel = require('../model/outflow')
let userIdentification;
let signinValidation = '';
const signupPost = (req, res) => {
    console.log(req.body)
    let form = new userModel(req.body)
    userModel.findOne({ email: req.body.email }, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            if (result) {
                res.send({ message: 'Email Already Exist', status: false })
            } else {
                form.save((err, result) => {
                    if (err) {
                        res.send({ message: 'Unsucessful Registartion' })
                    } else {
                        signinValidation = result.id
                        res.send({ message: 'Registered Succesfully', status: true, userIdentification: result.id })

                    }
                })
            }
        }
    })


}

const signinPost = (req, res) => {

    userModel.findOne({ email: req.body.email }, (err, result) => {
        if (err) {
            console.log('cant find user')
        } else {
            if (result) {
                if (result.email === req.body.email && result.password === req.body.password) {
                    console.log('equal')
                    res.send({ status: true, userid: result.id })
                    signinValidation = result.id
                } else {
                    res.send({ message: 'Invalid Password', status: false })
                }
            } else {
                res.send({ message: 'Invalid Credentails', status: false })
            }
        }
    })

}

const dashboardetails = (req, res) => {
    userModel.findOne({ _id: signinValidation }, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
}
let user
const fundAccount = (req, res) => {

    userModel.findOne({ _id: signinValidation }, (err, result) => {
        user = result
        user.accountBalance = Number(result.accountBalance) + Number(req.body.accountBalance)
        user.accountPin = Number(req.body.accountPin)
        console.log(user)
        userModel.findOneAndUpdate({ _id: signinValidation }, user, (err) => {
            if (err) {
                console.log('unablet to save')
            } else {
                console.log('saved')
                res.send(result)
            }
        })

    })
}
const transferDebit = (req, res) => {
    console.log(req.body.amounttransferred)
    userModel.findOne({ _id: signinValidation }, (err, result) => {
        user = result;
        user.accountBalance = Number(result.accountBalance) - Number(req.body.amounttransferred)
        console.log(user)
        userModel.findByIdAndUpdate({ _id: signinValidation }, user, (err, result) => {
            if (err) {
                console.log('failed transcation')
            } else {
                console.log('transfer succesful')
            }
        })
    })
}
const fundingaccountHistory = (req, res) => {
    console.log(req.body)
    let form = new transferModel(req.body)
    form.save((err, result) => {
        if (err) {
            console.log('unable to save')
        } else {
            console.log('able to save')
        }
    })
}

const outflow = (req, res) => {

}
const inflow = (req, res) => {
    console.log(req.body)

}
const transactionHistory = (req, res) => {
    transferModel.find({ transferid: signinValidation }, (err, result) => {
        res.send(result)
    })
}





module.exports = { signupPost, signinPost, dashboardetails, fundAccount, transferDebit, fundingaccountHistory, transactionHistory, outflow, inflow }