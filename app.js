// setting up the app and the dependencies

const express = require("express")
const morgan = require("morgan")
const expressLayouts = require("express-ejs-layouts")
const path = require("path")
const crypto = require("crypto")

const session = require("express-session") //authentication

const app = express()
const port = 3000

app.set("view engine", "ejs")
app.use(morgan("dev")) // to get morgan working
app.use(express.urlencoded({ extended: true })) // for parsing app/x-www-form-urlencoded, instead of body-parser

//app.set('views', path.join(__dirname, 'views')) // was in Harry's project (?)
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(expressLayouts)

// files created by us which are used by our app

app.set("layout", "pages/layouts/basiclayout")
const utils = require("./utils.js")
const database = require('./database')

//for authentication

const session_name = "project4coffee"

app.use(session({
  name: session_name, // to know this session from other apps' sessions
  resave: false,
  saveUninitialized: false,
  secret: "imasecretkey",
  cookie: {
    maxAge: 1000 * 60 * 60 * 2, // means the session will last for 2 hours
    sameSite: true,
    secure: false, // change to true for launch
  }
}))
// this ^^^ creates an object 'req.session' 

// to hash passwords
// used SHA256 instead of what Ahmad started with, as we have SHA256 encoded passwords in the seed by Jake

function hashPassword(password) {
  const hash = crypto.createHash("sha256").update(password).digest("hex").toUpperCase()
  return hash
}

// custom middleware to know the details of the currently logged in user:

app.use((req, res, next) => {
  const userId = req.session.userId
  if (userId) {
    // database.one("SELECT * FROM users WHERE id = $1;", userId)
    database.one("SELECT * FROM users WHERE id = $1;", userId)
      .then((current_user) => {
        res.locals.current_user = current_user
        next()
      })
      .catch(error => {
        res.send(error)
      })
  } else {
    next()
  }
})

// whenever you should know the details of user that logged in, you do
// const current_user = res.locals.current_user

// the routes

const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect("/login")
  } else {
    next() // this means that if user is logged in, the code will execute further
  }
}

const redirectHome = (req, res, next) => {
  if (req.session.userId) {
    res.redirect("/")
  } else {
    next() // this means that if user is logged in, the code will execute further
  }
}

// 1) homepage

app.get("/", redirectLogin, (req, res) => {

  //authentication

  const { userId } = req.session //logged out
  // const userId = 1 //logged in


  database.any("SELECT * FROM schedules JOIN users ON users.id = schedules.user_id;") // joins 2 tables and finds corresponding user for each schedule
    .then((joined_array) => {
      res.render("pages/home", { schedules: joined_array, weekDays: utils.weekDays, userId: userId })
    })
    .catch(error => {
      res.send({ error: error, stack: error.stack })
      console.log("Error:", error) // added a console log to get specific error message
    })
})

// 2) login
app.get("/login", redirectHome, (req, res) => {
  // req.session.userId = 
  res.render("pages/login")
})

app.post("/login", redirectHome, (req, res) => {
  const { email, password } = req.body

  if (email && password) {

    database.one("SELECT * FROM users WHERE email = $1 AND password = $2;", [email, hashPassword(password)])

      .then((current_user) => {
        req.session.userId = current_user.id
        res.redirect("/")
      })
      .catch(() => {
        res.redirect("/login")
      })
  } else {
    res.redirect("/login")
  }
})

// 3) logout route (no page)

app.post("/logout", redirectLogin, (req, res) => {

  req.session.destroy() // to delete the token from the server
  res.clearCookie(session_name) // to delete the token from the cookie

  res.redirect("/login")

})

// 4) employee page
app.get("/employee/:userId(\\d+)", redirectLogin, (req, res) => { // To have more control over the exact string that can be matched by a route parameter, you can append a regular expression in parentheses (())
  database.any("SELECT * FROM users LEFT JOIN schedules ON schedules.user_id = users.id WHERE users.id = $1;", [req.params.userId], profile => {

  }) // use $1 to ensure that req.params.userId is an integer (prevents sql injection)
    .then((user_profile) => {
      res.render("pages/employee", { schedules: user_profile, weekDays: utils.weekDays })
    })
    .catch(error => {
      res.send({ error: error, stack: error.stack })
      console.log("Error:", error) // added a console log to get specific error message
    })
})

// 5) schedule management
app.get("/addschedule", redirectLogin, (req, res) => {
  const current_user = res.locals.current_user

  database.any("SELECT * FROM users LEFT JOIN schedules ON schedules.user_id = users.id WHERE users.id = $1;", [current_user.id]) // query list of user's schedule from current_user.id
  .then((user_schedule) => {
    res.render("pages/addschedule", { current_user: current_user, user_schedule: user_schedule, weekDays: utils.weekDays })
  })
  .catch(error => {
    res.send({ error: error, stack: error.stack })
    console.log("Error:", error) // added a console log to get specific error message
  })
})

// 5) POST: schedule management - adding new schedule for logged in user
app.post("/addschedule", redirectLogin, (req, res) => {

  const current_user = res.locals.current_user // to be stored as user_id in the schedules table.
  const {day_of_week, start_time, end_time} = req.body

  database.none("INSERT INTO schedules(user_id, day_of_week, start_time, end_time) VALUES ($1, $2, $3, $4);", [current_user.id, day_of_week, start_time, end_time])
  .then(() => {
    res.redirect("/addschedule")
  })
  .catch(error => {
    res.send({ error: error, stack: error.stack })
    console.log("Error:", error) // added a console log to get specific error message
  })
})

// 6) signup
app.get("/signup", redirectHome, (req, res) => {
  res.render("pages/signup")
})

// form validation
//  { id: 1, surname: "Aringay", first_name: "Jake", email: 

app.post("/signup", redirectHome, async (req, res) => {

  const { first_name, surname, email, password, password2 } = req.body;

  console.log({ first_name, surname, email, password, password2 });

  let errors = [];

  if (!first_name || !surname || !email || !password || !password2) {
    errors.push({ message: "Please enter all fields" });
  }

  if (password.length < 6) {
    errors.push({ message: "Password should be at least 6 characters" });
  }

  if (password != password2) {
    errors.push({ message: "Passwords do not match!" });
  }


  /* WILL DO ON SUNDAY
  
    database.any("SELECT * FROM users WHERE email = $1;", email)
    const exists = users.some( //addDB
      user => user.email === email
    )
  
    if (exists) {
      errors.push({ message: "User with this email is already registered!" });
    }
  
    */

  if (errors.length > 0) {
    res.render("pages/signup", { errors });

  } else {

    // form validation has passed

    database.one("INSERT INTO users(first_name, surname, email, password) VALUES ($1, $2, $3, $4) RETURNING *", [first_name, surname, email, hashPassword(password)])

      .then((new_user) => {
        req.session.userId = new_user.id
        res.redirect("/")
      })
      .catch(error => {
        res.send(error)
      })
  }
});

// starting the server

app.listen(3000, () => {
  console.log('listening on 3000')
})