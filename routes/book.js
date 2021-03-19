const express = require('express')
const router = express.Router()
const { Book } = require('../db/connect')

router.get('/allBooksByType', async(req, res) => {
  let obj = req.query
  obj.pageSize = parseInt(obj.pageSize)
  const total = await Book.find({type: obj.type}).count()
  const data = await Book.find({type: obj.type}).skip((obj.pageSize || 0) * ((obj.pageIdx - 1) || 0)).limit(obj.pageSize)
  res.send(JSON.stringify({
    code: 0,
    msg: '获取成功',
    data,
    total
  }))
})

module.exports = router
