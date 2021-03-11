var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

var usersRouter = require('./routes/users')
var filmRouter = require('./routes/films')
var musicRouter = require('./routes/musics')
var bookRouter = require('./routes/books')

var app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', usersRouter)
app.use('/', filmRouter)
app.use('/', musicRouter)
app.use('/', bookRouter)

module.exports = app;
