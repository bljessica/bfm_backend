const {Book, Film, Music, Record} =  require('../db/connect')
const express = require('express')
const router = express.Router()

router.get('/detail', async(req, res) => {
  let obj = req.query
  let kind = obj.kind
  let data = null
  let status = 'none'
  if (kind === 'book') {
    data = await Book.findOne({_id: obj._id})
  } else if (kind === 'film') {
    data = await Film.findOne({_id: obj._id})
  } else if (kind === 'music') {
    data = await Music.findOne({_id: obj._id})
  }
  const record = await Record.findOne({
    openid: obj.openid,
    kind: obj.kind,
    name: data.name,
    newest: true
  }).sort({_id: -1})
  if (record) {
    status = record.status
  }
  res.send(JSON.stringify({
    code: 0,
    msg: '获取成功',
    data,
    status
  }))
})

module.exports = router
