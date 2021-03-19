var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

var usersRouter = require('./routes/user')
var filmRouter = require('./routes/film')
var musicRouter = require('./routes/music')
var bookRouter = require('./routes/book')
var detailRouter = require('./routes/detail')
var recordRouter = require('./routes/record')
var likeCommentRouter = require('./routes/likeComment')
var searchRouter = require('./routes/search')

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
app.use('/', recordRouter)
app.use('/', likeCommentRouter)
app.use('/', searchRouter)

module.exports = app;
