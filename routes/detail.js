const {Book, Film, Music, Record, LikeComment} =  require('../db/connect')
const express = require('express')
const router = express.Router()

router.get('/detail', async(req, res) => {
  const obj = req.query
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
    name: obj.name
  })
  for (let record of records) {
    await LikeComment.deleteMany({
      recordId: record._id
    })
  }
  await Record.deleteMany({
    kind: obj.kind,
    name: obj.name
  })
  res.send(JSON.stringify({
    code: 0,
    msg: '删除成功'
  }))
})

router.post('/addItem', async(req, res) => {
  const obj = req.body
  if (obj.kind === 'book') {
    const item = await Book.findOne({name: obj.info.name})
    if (item) {
      res.send(JSON.stringify({
        code: 1,
        msg: '此名字的图书已存在'
      }))
      return
    }
    await Book.create(obj.info)
  } else if (obj.kind === 'film') {
    const item = await Film.findOne({name: obj.info.name})
    if (item) {
      res.send(JSON.stringify({
        code: 1,
        msg: '此名字的电影已存在'
      }))
      return
    }
    await Film.create(obj.info)
  } else if (obj.kind === 'music') {
    const item = await Music.findOne({name: obj.info.name})
    if (item) {
      res.send(JSON.stringify({
        code: 1,
        msg: '此名字的音乐已存在'
      }))
      return
    }
    await Music.create(obj.info)
  } else {
    res.send(JSON.stringify({
      code: 1,
      msg: '种类不存在'
    }))
    return
  }
  res.send(JSON.stringify({
    code: 0,
    msg: '添加成功'
  }))
})

router.put('/updateItem', async(req, res) => {
  const obj = req.body
  if (obj.kind === 'book') {
    const item = await Book.findOne({name: obj.info.name})
    if (item && item._id != obj._id) {
      res.send(JSON.stringify({
        code: 1,
        msg: '此名字的图书已存在'
      }))
      return
    }
    await Book.updateOne({_id: obj._id}, obj.info)
  } else if (obj.kind === 'film') {
    const item = await Film.findOne({name: obj.info.name})
    if (item && item._id != obj._id) {
      res.send(JSON.stringify({
        code: 1,
        msg: '此名字的电影已存在'
      }))
      return
    }
    await Film.updateOne({_id: obj._id}, obj.info)
  } else if (obj.kind === 'music') {
    const item = await Music.findOne({name: obj.info.name})
    if (item && item._id != obj._id) {
      res.send(JSON.stringify({
        code: 1,
        msg: '此名字的音乐已存在'
      }))
      return
    }
    await Music.updateOne({_id: obj._id}, obj.info)
  } else {
    res.send(JSON.stringify({
      code: 1,
      msg: '种类不存在'
    }))
    return
  }
  res.send(JSON.stringify({
    code: 0,
    msg: '修改成功'
  }))
})

module.exports = router
