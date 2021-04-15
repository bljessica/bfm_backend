const {Book, Film, Music, Record, LikeComment} =  require('../db/connect')
const express = require('express')
const router = express.Router()

router.get('/detail', async(req, res) => {
  let obj = req.query
  let kind = obj.kind
  let data = null
  let status = 'none'
  let myScore = null
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
    myScore = (record.score === undefined) ? null : record.score 
  }
  res.send(JSON.stringify({
    code: 0,
    msg: '获取成功',
    data,
    status,
    myScore
  }))
})

router.delete('/deleteItem', async (req, res) => {
  const obj = req.body
  if (obj.kind === 'book') {
    await Book.deleteOne({_id: obj._id})
  } else if (obj.kind === 'film') {
    await Film.deleteOne({_id: obj._id})
  } else if (obj.kind === 'music') {
    await Music.deleteOne({_id: obj._id})
  } else {
    res.send(JSON.stringify({
      code: 1,
      msg: '种类不存在'
    }))
    return
  }
  const records = await Record.find({
    kind: obj.kind,
    openid: obj.openid,
    name: obj.name
  })
  for (let record of records) {
    await LikeComment.deleteOne({
      recordId: record._id,
      openid: obj.openid
    })
  }
  await Record.deleteMany({
    kind: obj.kind,
    openid: obj.openid,
    name: obj.name
  })
  res.send(JSON.stringify({
    code: 0,
    msg: '删除成功'
  }))
})

module.exports = router
