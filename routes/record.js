const express = require('express')
const router = express.Router()
const { Record, LikeComment } = require('../db/connect')

router.post('/addRecord', async(req, res) => {
  let obj = req.body
  if (obj.status === 'doing' || obj.status === 'none') {
    await Record.deleteOne(obj)
  }
  await Record.create(obj)
  res.send(JSON.stringify({
    code: 0,
    msg: '添加成功'
  }))
})

router.get('/itemComments', async(req, res) => {
  let obj = req.query
  const data = await Record.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'openid',
        foreignField: 'openid',
        as: 'user'
      }
    },
    {$unwind: '$user'},
    {$match: {kind: obj.kind, name: obj.name, status: obj.status}},
    {$sort: {commentTime: -1}}
  ])
  for(let comment of data) {
    const liked = await LikeComment.findOne({
      openid: obj.openid,
      recordId: comment._id
    })
    if (liked) {
      comment.liked = true
    } else {
      comment.liked = false
    }
  }
  res.send(JSON.stringify({
    code: 0,
    msg: '添加成功',
    data
  }))
})

router.get('/userAnalysis', async(req, res) => {
  let obj = req.query
  const data = await Record.aggregate([
    {$match: {openid: obj.openid}},
    {
      $group: {
        _id: {status: '$status', kind: '$kind'},
        count: {$sum: 1}
      }
    }
  ])
  res.send(JSON.stringify({
    code: 0,
    msg: '查询成功',
    data
  }))
})

router.get('/userAnalysisDetail', async (req, res) => {
  const obj = req.query
  const data = {
    book: {},
    film: {},
    music: {}
  }
  const kinds = ['book', 'film', 'music']
  const status = ['after', 'want', 'doing']
  for(let kind of kinds) {
    for(let statusCur of status) {
      data[kind][statusCur] = await Record.aggregate([
        {$lookup: {
          from: kind + 's',
          localField: 'name',
          foreignField: 'name',
          as: kind
        }},
        {$match: {openid: obj.openid, status: statusCur, kind}},
        {$unwind: '$' + kind}
      ])
      for(let item of data[kind][statusCur]) {
        Object.assign(item, item[kind])
        delete item[kind]
      }
      if (kind === 'book') {
        // 去重
        data[kind][statusCur] = data[kind][statusCur].filter((item, idx) => 
          (data[kind][statusCur].findIndex(cur => cur.name === item.name) === idx)
        )
      }
    }
  }
  res.send(JSON.stringify({
    code: 0,
    msg: '查询成功',
    data
  }))
})

router.get('/filmTagAnalysis', async (req, res) => {
  let obj = req.query
  const records = await Record.aggregate([
    {
      $match: {openid: obj.openid, kind: 'film', status: obj.status || 'after'}
    },
    {
      $lookup: {
        from: 'films',
        localField: 'name',
        foreignField: 'name',
        as: 'films'
      }
    },
    {$unwind: '$films'},
    {$project: {type: '$films.type'}}
  ])
  let data = {}
  records.forEach(record => {
    const item = record.type.substring(0, record.type.length - 1)
    const tags = item.split(' ')
    tags.forEach(tag => {
      if (data[tag]) {
        data[tag]++
      } else {
        data[tag] = 1
      }
    })
  })
  res.send(JSON.stringify({
    code: 0,
    msg: '查询成功',
    data
  }))
})

module.exports = router

