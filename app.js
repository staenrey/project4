// setting up the app and the dependencies

const express = require("express")
const morgan = require("morgan")
const expressLayouts = require("express-ejs-layouts")
const path = require("path")

const app = express()
const port = 3000

app.set("view engine", "ejs")
app.use(morgan("dev")) // to get morgan working

app.use(express.urlencoded({ extended: true })) // for parsing app/x-www-form-urlencoded

//app.set('views', path.join(__dirname, 'views')) // was in Harry's project (?)
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(expressLayouts)

// files created by us which are used by our app

app.set("layout", "pages/layouts/basiclayout")
const utils = require("./utils.js")
const database = require('./database')

// the routes

// 1) homepage

app.get("/", (req, res) => {
  database.any("SELECT * FROM schedules JOIN users ON users.id = schedules.user_id;") // joins 2 tables and finds corresponding user for each schedule
      .then((joined_array) => {
          res.render("pages/home", {schedules: joined_array, weekDays: utils.weekDays})
      })
      .catch(error => {
          res.send(error)
      })
})

// 2) login
app.get("/login", (req, res) => {
    res.render("pages/login")
})

// 3) logout route (no page)

// 4) employee page
app.get("/employee", (req, res) => {
  res.render("pages/employee")
})

// 5) schedule management
app.get("/addschedule", (req, res) => {
  res.render("pages/addschedule")
})

// 6) signup
app.get("/signup", (req, res) => {
  res.render("pages/signup")
})

// starting the server

app.listen(3000, () => {
  console.log('listening on 3000')
})