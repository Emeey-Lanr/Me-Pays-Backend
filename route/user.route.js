const express = require('express')
const route = express.Router()
const mongoose = require('mongoose')
const { signupPost, signinPost, dashboardetails, fundAccount, transferDebit, fundingaccountHistory, transactionHistory, inflow, outflow } = require('../controller/user.controller')


route.post('/signup', signupPost)
route.post('/signin', signinPost)
route.get('/dashboard', dashboardetails)
route.post('/fundaccount', fundAccount)
route.post('/transfer', transferDebit)
route.post('/fundacchistory', fundingaccountHistory)
route.get('/transactionhistory', transactionHistory)
route.post('/inflow', inflow)
route.post('/outflow', outflow)







module.exports = route