const mongoose = require('mongoose')

// 使用原生promise，mongoose自带promise不再支持
// mongoose.Promise = global.Promise

const url = 'mongodb://127.0.0.1/bfm'

mongoose.set('useCreateIndex', true);
mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log('数据库连接成功'))
  .catch((err) => console.log('数据库连接失败' + err))

const db = mongoose.connection;

//集合规则
const userSchema = new mongoose.Schema({
  openId: {
    type: Number,
    required: true,
    unique: true
  }
})

exports.User = mongoose.model('User', userSchema)
