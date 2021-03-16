var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

var usersRouter = require('./routes/user')
var filmRouter = require('./routes/film')
var musicRouter = require('./routes/music')
var bookRouter = require('./routes/book')
var detailRouter = require('./routes/detail')
var recordDetail = require('./routes/record')

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
app.use('/', detailRouter)
app.use('/', recordDetail)

module.exports = app;
