// setting up the app and the dependencies

const express = require("express")
const morgan = require("morgan")
const expressLayouts = require("express-ejs-layouts")
const path = require("path")

const app = express()
const port = 3000

app.set("layout", "pages/layouts/basiclayout")
app.set("view engine", "ejs")
app.use(morgan("dev")) // to get morgan working

app.use(express.urlencoded({ extended: true })) // for parsing app/x-www-form-urlencoded

//app.set('views', path.join(__dirname, 'views')) // was in Harry's project (?)
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(expressLayouts)


// files created by us which are used by our app



// the routes

app.get("/login", (req, res) => {
    res.render("pages/login")
})


// starting the server

app.listen(3000, () => {
  console.log('listening on 3000')
})