const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 使用原生promise，mongoose自带promise不再支持
// mongoose.Promise = global.Promise

const url = 'mongodb://127.0.0.1/bfm'

mongoose.set('useCreateIndex', true)
mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log('数据库连接成功'))
  .catch((err) => console.log('数据库连接失败' + err))

const db = mongoose.connection

//集合规则
const userSchema = new Schema({
  openId: {
    type: Number,
    required: true,
    unique: true
  }
})
const bookSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  author: {
    type: String
  },
  publisher: {
    type: String
  },
  publishTime: {
    type: String
  },
  coverSrc: {
    type: String
  },
  introduction: {
    type: String
  },
  authorIntroduction: {
    type: String
  },
  score: {
    type: String
  },
  bookType: {
    type: String,
    enum: ['计算机图书', '小说', '名著']
  }
})
bookSchema.index({name: 1, bookType: 1}, {unique: true})

const filmSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  foreignName: {
    type: String
  },
  coverSrc: {
    type: String
  },
  introduction: {
    type: String
  },
  relatedInfo: {
    type: String
  },
  score: {
    type: String
  }
})

const musicSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  singer: {
    type: String
  },
  publishTime: {
    type: String
  },
  musicType: {
    type: String
  },
  coverSrc: {
    type: String
  },
  score: {
    type: String
  }
})

exports.User = mongoose.model('User', userSchema)
exports.Book = mongoose.model('Book', bookSchema)
exports.Film = mongoose.model('Film', filmSchema)
exports.Music = mongoose.model('Music', musicSchema)
