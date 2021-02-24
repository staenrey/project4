// setting up the app and the dependencies

const express = require("express")
const morgan = require("morgan")
const expressLayouts = require("express-ejs-layouts")
const path = require("path")
const crypto = require("crypto")

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
        res.send({error: error, stack: error.stack})
        console.log("Error:", error) // added a console log to get specific error message
      })
})

// 2) login
app.get("/login", (req, res) => {
    res.render("pages/login")
})

// 3) logout route (no page)

// 4) employee page
app.get("/employee/:userId(\\d+)", (req, res) => { // To have more control over the exact string that can be matched by a route parameter, you can append a regular expression in parentheses (())
  database.any(`SELECT * FROM users LEFT JOIN schedules ON schedules.user_id = users.id WHERE users.id = $1;`, [req.params.userId], profile => {

  }) // use $1 to ensure that req.params.userId is an integer (prevents sql injection)
    .then((user_profile) => {
      res.render("pages/employee", {schedules: user_profile, weekDays: utils.weekDays})
    })
    .catch(error => {
      res.send({error: error, stack: error.stack})
      console.log("Error:", error) // added a console log to get specific error message
    })
})

// 5) schedule management
app.get("/addschedule", (req, res) => {
  res.render("pages/addschedule")
})

// 6) signup
app.get("/signup", (req, res) => {
  res.render("pages/signup")
})


// form validation
app.post("/signup", async (req,res) => {
  let { name, surname, email, password, password2 } = req.body;

  console.log({name, surname, email, password, password2 });

  let errors = [];

  if (!name || !surname || !email || !password || !password2){
    errors.push({ message: "Please enter all fields" });
  }

  if (password.length < 6) {
    errors.push({ message: "Password should be at least 6 characters" });
  }

  if(password != password2) {
    errors.push({ message: "Passwords do not match!" });
  }

  if (errors.length > 0) {
    res.render("pages/signup", { errors });
  } else {
    //form validation has passed 

    var mykey = crypto.createCipher('aes-128-cbc', 'password');
    var mystr = mykey.update('abc', 'utf8', 'hex')
    mystr += mykey.final('hex');
    console.log(mystr);

    
  }
});


// starting the server

app.listen(3000, () => {
  console.log('listening on 3000')
})