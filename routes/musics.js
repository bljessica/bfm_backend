const express = require('express')
const router = express.Router()
const { Music } = require('../db/connect')

router.get('/allMusics', async(req, res) => {
  let obj = req.query
  obj.pageSize = parseInt(obj.pageSize)
  const total = await Music.find().count()
  const data = await Music.find().skip((obj.pageSize || 0) * ((obj.pageIdx - 1) || 0)).limit(obj.pageSize)
  res.send(JSON.stringify({
    code: 0,
    msg: '获取成功',
    data,
    total
  }))
})

module.exports = router
