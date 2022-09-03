const express = require('express')
const route = express.Router()
const mongoose = require('mongoose')
const { signupPost,
    signinPost,
    dashboardetails,
    fundAccount,
    transferDebit,
    fundingaccountHistory,
    delTransaction,
    transactionHistory,
    inflow,
    outflow,
    inflowGet,
    walletCreation,
    wallet,
    deleteWallet,
    fundWallet,
    imgUpload
} = require('../controller/user.controller')


route.post('/signup', signupPost)
route.post('/signin', signinPost)
route.get('/dashboard', dashboardetails)
route.post('/fundaccount', fundAccount)
route.post('/transfer', transferDebit)
route.post('/fundacchistory', fundingaccountHistory)
route.post('/deletetransaction', delTransaction)
route.get('/transactionhistory', transactionHistory)
route.post('/inflow', inflow)
route.get('/inflowget', inflowGet)
route.post('/outflow', outflow)
route.post('/walletcreation', walletCreation)
route.get('/wallet', wallet)
route.post('/deletewallet', deleteWallet)
route.post('/fundwallet', fundWallet)
route.post('/imgupload', imgUpload)






module.exports = route