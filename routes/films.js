const express = require('express')
const router = express.Router()
const { Film } = require('../db/connect')

router.get('/allFilms', async(req, res) => {
  let obj = req.query
  const data = await Film.find().skip((obj.pageSize || 0) * ((obj.pageIdx - 1) || 0)).limit(10)
  res.send(JSON.stringify({
    code: 0,
    msg: '获取成功',
    data
  }))
})

module.exports = router
