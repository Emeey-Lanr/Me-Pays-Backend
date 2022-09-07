const mongoose = require('mongoose')
const userModel = require('../model/user.model')
const transferModel = require('../model/user.transfer')
const inflowModel = require('../model/inflow')
const outflowModel = require('../model/outflow')
const walletModel = require('../model/wallet')
const nodemailer = require('nodemailer')
require('dotenv').config()
const cloudinary = require('cloudinary')
cloudinary.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.APIKEY,
    api_secret: process.env.APISECRET,
});

let registeredUserEmail
let registeredUserFirstName
let registeredUserLastName
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
                        res.send({ message: 'Registered Succesfully', status: true, userIdentification: result.id })
                        signinValidation = result.id
                        registeredUserEmail = result.email
                        registeredUserFirstName = result.firstName
                        registeredUserLastName = result.lastName



                    }
                    let inflowobject = {
                        amount: 0,
                        userid: result.id
                    }
                    let inflowform = new inflowModel(inflowobject)
                    inflowform.save((err, result) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log(result)
                        }
                    })
                    let outflowobject = {
                        amount: 0,
                        userid: result.id
                    }
                    let outflowform = new outflowModel(outflowobject)
                    outflowform.save((err, result) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log(result)
                        }
                    })

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
            res.send({ err: true })
        } else {
            if (result) {

                result.Validatepassword(req.body.password, (err, same) => {
                    if (err) {
                        res.send({ message: 'an error occured', status: false })
                    } else {
                        if (same) {
                            signinValidation = result.id
                            res.send({ message: 'welcome', status: true, userid: result.id })
                        } else {
                            res.send({ message: 'Invalid password', status: false })
                        }
                    }

                })

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
let user;
//funding of account post request
const fundAccount = (req, res) => {

    userModel.findOne({ _id: signinValidation }, (err, result) => {
        user = result
        user.accountBalance = Number(result.accountBalance) + Number(req.body.accountBalance)
        user.accountPin = Number(req.body.accountPin)
        console.log(user)
        userModel.findOneAndUpdate({ _id: signinValidation }, user, (err, result) => {
            if (err) {
                console.log('unable to save')
            } else {
                console.log('saved')
                res.send({ message: 'succesful', status: true })
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
                // console.log('failed transcation')
                res.send({ mesage: 'Transaction Not Succesful', status: false })
            } else {
                // console.log('transfer succesful')
                res.send({ mesage: 'Transaction Succesful', status: true })
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
// A post request updating the outflow of money
let outflowUpdate;
const outflow = (req, res) => {
    console.log(`${req.body.amount}yes it is`)
    outflowModel.findOne({ userid: signinValidation }, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            console.log(result)
            outflowUpdate = result
            outflowUpdate.amount = Number(result.amount) + Number(req.body.amount)
            outflowModel.findOneAndUpdate({ userid: signinValidation }, outflowUpdate, (err, result) => {
                if (err) {
                    console.log(err)
                } else {
                    res.send({ status: true })
                }
            })
        }
    })


}
//A get request for the outflow that shows the data available
const outflowGet = (req, res) => {
    outflowModel.findOne({ userid: signinValidation }, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })

}

// A post request updating the inflow of money
let inflowupdate;
const inflow = (req, res) => {
    let { amount } = req.body
    inflowModel.findOne({ userid: signinValidation }, (err, result) => {
        if (err) {
            console.log('unable, to find inflow')
        } else {
            inflowupdate = result
            inflowupdate.amount = Number(result.amount) + Number(amount)
            inflowModel.findOneAndUpdate({ userid: signinValidation }, inflowupdate, (err, result) => {
                if (err) {
                    console.log('unable to update inflow')
                } else {
                    res.send({ message: 'updated', status: true })
                }
            })
        }
    })

}
//inflow get
const inflowGet = (req, res) => {
    inflowModel.findOne({ userid: signinValidation }, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
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
//deleting of wallet
const deleteWallet = (req, res) => {

    walletModel.findByIdAndDelete({ _id: req.body['walletid'] }, (err, result) => {
        if (err) {
            res.send({ message: 'unable to delete' })
        } else {
            if (result) {
                res.send({ message: 'Deleted Sucessfully', status: true })
            }
        }
    })
}
//fund wallet \
let userResult
let walletResult
const fundWallet = (req, res) => {
    console.log(req.body)
    userModel.findOne({ _id: signinValidation }, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            userResult = result
            walletModel.findOne({ _id: req.body.walletid }, (err, result) => {
                if (err) {
                    console.log('error')
                } else {
                    walletResult = result
                    walletResult.fund = result.targetAmount
                    userResult.accountBalance = Number(userResult.accountBalance) - Number(walletResult.targetAmount)
                    walletModel.findOneAndUpdate({ _id: req.body.walletid }, walletResult, (err, result) => {
                        if (err) {
                            res.send({ message: 'Unable to fund', status: false })
                        } else {
                            res.send({ message: 'Succesfull', staus: true })
                            userModel.findOneAndUpdate({ _id: signinValidation }, userResult, (err, result) => {
                                if (err) {
                                    console.log(err)
                                } else {
                                    console.log(result)
                                }
                            })
                        }
                    })


                }
            })
        }
    })

}

//image upload using cloudinary
let img = '';
const imgUpload = (req, res) => {

    cloudinary.v2.uploader.upload(req.body.imgurl, { public_id: "user_img" }, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            img = result.secure_url
            userModel.findOne({ _id: signinValidation }, (err, result) => {
                if (err) {
                    console.log(`can't find user`)
                } else {
                    user = result
                    user.imgUrl = img
                    userModel.findOneAndUpdate({ _id: signinValidation }, user, (err, result) => {
                        if (err) {
                            console.log(err)
                        } else {
                            res.send({ status: true })
                        }
                    })
                }
            })

        }

    });

}

//deltransaction
const delTransaction = (req, res) => {
    console.log(req.body)
    transferModel.findByIdAndDelete({ _id: req.body.tid }, (err, result) => {
        if (err) {
            console.log('unableto delete')
        } else {
            console.log('deleted')
            res.send({ message: 'deleted', status: true })
        }
    })

}
//transaction history get requests
const transactionHistory = (req, res) => {
    transferModel.find({ transferid: signinValidation }, (err, result) => {
        res.send(result)
    })
}


//
const editAccount = (req, res) => {
    console.log(req.body)
    userModel.findOne({ _id: signinValidation }, (err, result) => {
        if (err) {
            console.log(`unable to find user ${err}`)
        } else {
            user = result
            user.firstName = req.body.firstName
            user.lastName = req.body.lastName
            user.phoneNumber = req.body.phoneNumber
            user.accountPin = req.body.accountPin
            userModel.findByIdAndUpdate({ _id: signinValidation }, user, (err, result) => {
                if (err) {
                    console.log(`unable to update account ${err}`)
                    res.send({ message: 'unable to update', status: false })
                } else {
                    console.log('accounted edited')
                    res.send({ message: 'updated succesfully', status: true })
                }
            })
        }
    })
}



module.exports = {
    signupPost,
    signinPost,
    dashboardetails,
    fundAccount,
    transferDebit,
    fundingaccountHistory,
    delTransaction,
    transactionHistory,
    outflow,
    outflowGet,
    inflow,
    inflowGet,
    walletCreation,
    wallet,
    deleteWallet,
    fundWallet,
    imgUpload,
    editAccount
}