const express = require("express")
const morgan = require("morgan")
const path = require("path")
const expressLayouts = require("express-ejs-layouts")

const app = express()

app.set("view engine", "ejs")

app.use(morgan('dev'))

app.set('views', path.join(__dirname, 'views')) // was in Harry's project (?)
app.use('/static', express.static(path.join(__dirname, 'public')))