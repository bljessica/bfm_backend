const express = require('express')
const router = express.Router()
const dayjs = require('dayjs')
const { Record, LikeComment } = require('../db/connect')

router.post('/addRecord', async(req, res) => {
  let obj = req.body
  if (obj.status === 'doing' || obj.status === 'none') {
    await Record.deleteOne(obj)
  }
  await Record.updateMany({
    openid: obj.openid,
    kind: obj.kind,
    name: obj.name
  }, {newest: false})
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
    {$match: {openid: obj.openid, newest: true}},
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
        {$match: {openid: obj.openid, status: statusCur, kind, newest: true}},
        {$unwind: '$' + kind}
      ])
      for(let item of data[kind][statusCur]) {
        Object.assign(item, item[kind])
        delete item[kind]
      }
    }
  }
  res.send(JSON.stringify({
    code: 0,
    msg: '查询成功',
    data
  }))
})

router.get('/userAnalysisSectionItems', async (req, res) => {
  const obj = req.query
  let data = await Record.aggregate([
    {$lookup: {
      from: obj.kind + 's',
      localField: 'name',
      foreignField: 'name',
      as: obj.kind
    }},
    {$match: {openid: obj.openid, status: obj.status, kind: obj.kind, newest: true}},
    {$unwind: '$' + obj.kind}
  ])
  for(let item of data) {
    Object.assign(item, item[obj.kind])
    delete item[obj.kind]
  }
  res.send(JSON.stringify({
    code: 0,
    msg: '查询成功',
    data
  }))
})

router.get('/doneItemsAnalysis', async(req, res) => {
  let obj = req.query
  const total = await Record.find({
    openid: obj.openid,
    status: 'after',
    kind: obj.kind,
    newest: true
  }).count()
  const recentDoneItems = await Record.aggregate([
    {
      $match: {openid: obj.openid, kind: obj.kind, status: 'after', newest: true}
    },
    {
      $lookup: {
        from: obj.kind + 's',
        localField: 'name',
        foreignField: 'name',
        as: 'item'
      }
    },
    {$unwind: '$item'},
    {$project: {coverSrc: '$item.coverSrc'}},
    {$sort: {_id: -1}},
    {$limit: 9}
  ])
  const records = await Record.aggregate([
    {
      $match: {openid: obj.openid, kind: obj.kind, status: 'after', newest: true}
    },
    {
      $lookup: {
        from: obj.kind + 's',
        localField: 'name',
        foreignField: 'name',
        as: 'item'
      }
    },
    {$unwind: '$item'},
    {$project: {type: '$item.type', publishTime: '$item.publishTime', country: '$item.country'}}
  ])
  const itemInfos = {
    type: {},
    publishTime: {}
  }
  if (obj.kind === 'film') {
    itemInfos.country = {}
  }
  records.forEach(record => {
    for(let tagType of Object.keys(itemInfos)) {
      let item = record[tagType].trim()
      if (tagType === 'publishTime') {
        item = item.substring(0, 4)
      }
      const tags = item.split(' ')
      tags.forEach(tag => {
        if (itemInfos[tagType][tag]) {
          itemInfos[tagType][tag]++
        } else {
          itemInfos[tagType][tag] = 1
        }
      })
    }
  })
  res.send(JSON.stringify({
    code: 0,
    msg: '查询成功',
    data: {
      total,
      recentDoneItems,
      itemInfos
    }
  }))
})

router.get('/timeLineData', async(req, res) => {
  const obj = req.query
  // 最近
  let latestContents = []
  const kinds = ['book', 'film', 'music']
  const status = ['after', 'want', 'doing']
  for(let kind of kinds) {
    for(let statusCur of status) {
      const arr = await Record.aggregate([
        {$lookup: {
          from: kind + 's',
          localField: 'name',
          foreignField: 'name',
          as: 'detail'
        }},
        {$match: {openid: obj.openid, status: statusCur, kind, newest: true,
          time: {$gte: dayjs().startOf('month').valueOf(), $lt: dayjs().endOf('month').valueOf()}}},
        {$unwind: '$detail'}
      ])
      latestContents = latestContents.concat(arr)
    }
  }
  latestContents.sort((a, b) => (b.time - a.time))
  const latestStatistics = await Record.aggregate([
    {$match: {openid: obj.openid, newest: true}},
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
    data: {
      latest: {
        name: '最近',
        contents: latestContents,
        statistics: latestStatistics
      }
    }
  }))
})

module.exports = router

