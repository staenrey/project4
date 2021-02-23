// my database for the project

const pgp = require("pg-promise")() // require('pg-promise') returns a function that we immediately call, and store the result in a pgp var

// const { user, password, port } = require("./config")

// const connection = `postgres://${user}${password}@localhost:${port}/project4db`

const connection = {
    host: 'localhost', // 'localhost' is the default;
    port: 5432, // 5432 is the default;
    database: 'project4db',
    user: 'project4admin',
    password: 'Project4'
};// database connection object, we store in a variable 'connection' the info

const db = pgp(connection) // var db equals to a result of a function pgp that processed a connection var

module.exports = db // says that when in a file (in our case, index.js) we say require("./database"), we get db as a result