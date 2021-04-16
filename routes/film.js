const express = require('express')
const router = express.Router()
const { Film, Record } = require('../db/connect')

router.get('/allFilms', async(req, res) => {
  let obj = req.query
  obj.pageSize = parseInt(obj.pageSize)
  const total = await Film.find().count()
  const data = await Film.find().skip((obj.pageSize || 0) * ((obj.pageIdx - 1) || 0)).limit(obj.pageSize).sort({_id: -1})
  res.send(JSON.stringify({
    code: 0,
    msg: '获取成功',
    data,
    total
  }))
})

router.get('/filmTagAnalysis', async (req, res) => {
  let obj = req.query
  const records = await Record.aggregate([
    {
      $match: {openid: obj.openid, kind: 'film', status: obj.status || 'after', newest: true}
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
