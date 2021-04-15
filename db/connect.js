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
  openid: {
    type: String,
    required: true,
    unique: true
  },
  nickName: {
    type: String
  },
  avatarUrl: {
    type: String
  },
  city: {
    type: String
  },
  gender: {
    type: Number,
    enum: [1, 2] // 1 男, 2 女
  },
  isAdmin: {
    type: Boolean,
    default: false
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
  type: {
    type: String,
    enum: ['计算机图书', '小说', '名著']
  }
})

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
  director: {
    type: String
  },
  actors: {
    type: String
  },
  publishTime: {
    type: String
  },
  country: {
    type: String
  },
  type: {
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
  type: {
    type: String
  },
  coverSrc: {
    type: String
  },
  score: {
    type: String
  }
})

const recordSchema = new Schema({
  openid: {
    type: String,
    required: true
  },
  kind: {
    type: String,
    enum: ['book', 'film', 'music']
  },
  name: {
    type: String
  },
  status: {
    type: String,
    default: 'none',
    enum: ['want', 'doing', 'after', 'none']
  },
  comment: { // want, after才有
    type: String,
    default: ''
  },
  commentTime: {
    type: String
  },
  commentLikedNum: {
    type: Number,
    default: 0
  },
  score: {  // after 才有
    type: Number
  },
  newest: {
    type: Boolean,
    default: true
  },
  time: {
    type: Number
  }
})
recordSchema.index({openid: 1, kind: 1, name: 1, status: 1, time: 1}, {unique: true})

const likeCommentSchema = new Schema({
  openid: {
    type: String
  },
  recordId: {
    type: Schema.ObjectId
  }
})
likeCommentSchema.index({openid: 1, recordId: 1}, {unique: true})

exports.User = mongoose.model('User', userSchema)
exports.Book = mongoose.model('Book', bookSchema)
exports.Film = mongoose.model('Film', filmSchema)
exports.Music = mongoose.model('Music', musicSchema)
exports.Record = mongoose.model('Record', recordSchema)
exports.LikeComment = mongoose.model('LikeComment', likeCommentSchema)
