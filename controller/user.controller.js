
const mongoose = require('mongoose')
const userModel = require('../model/user.model')
const transferModel = require('../model/user.transfer')
const inflowModel = require('../model/inflow')
const outflowModel = require('../model/outflow')
const walletModel = require('../model/wallet')
let userIdentification;
let signinValidation = '';

//signup post request
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
//signin post request
const signinPost = (req, res) => {

    userModel.findOne({ email: req.body.email }, (err, result) => {
        if (err) {
            console.log(err)
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

//dashboard get request
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
//funding of account post request
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


//Tranfering of money post request
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

//Transaction Details post request
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

//wallet creation post request
const walletCreation = (req, res) => {
    console.log(req.body)
    let form = walletModel(req.body)
    form.save((err) => {
        if (err) {
            res.send({ message: 'unable to save', staus: false })
        } else {
            res.send({ message: 'succesful', status: true })
        }
    })

}
//wallet get request
const wallet = (req, res) => {
    walletModel.find({ userid: signinValidation }, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })

}
const deleteWallet = (req, res) => {

    walletModel.findByIdAndDelete({ _id: req.body['walletid'] }, (err, result) => {
        if (err) {
            res.send({ message: 'unable to delete' })
        } else {
            if (result) {
                res.send({ message: 'Deleted Sucessfully' })
            }
        }
    })
}
//transaction history get requests
const transactionHistory = (req, res) => {
    transferModel.find({ transferid: signinValidation }, (err, result) => {
        res.send(result)
    })
}





module.exports = {
    signupPost,
    signinPost,
    dashboardetails,
    fundAccount,
    transferDebit,
    fundingaccountHistory,
    transactionHistory,
    outflow,
    inflow,
    walletCreation,
    wallet,
    deleteWallet
}