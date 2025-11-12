
const express = require('express')
const mongoose = require('mongoose')
const graminRouter = require('./Router/graminRouter')
const connectDB = require('./DB/DbConnect')
const mukhiyaRouter = require("./Router/mukhiyaRouter")
const session = require('express-session')
require('dotenv').config()
const app = express()

app.use(session({
    secret:`${process.env.SECRET}`,
    resave:false,
    saveUninitialized:false
}))

app.set("view engine", "ejs")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

connectDB()

app.use(mukhiyaRouter)
app.use(graminRouter)



PORT = process.env.PORT||3000

app.listen(PORT, () => {
    console.log(`server run on http://localhost:${PORT}`)
})