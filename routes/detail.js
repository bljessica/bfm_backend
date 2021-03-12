const {Book, Film, Music} =  require('../db/connect')
const express = require('express')
const router = express.Router()

router.get('/detailById', async(req, res) => {
  let obj = req.query
  let kind = obj.kind
  let data = null
  if (kind === 'book') {
    data = await Book.findOne({_id: obj._id})
  } else if (kind === 'film') {
    data = await Film.findOne({_id: obj._id})
  } else if (kind === 'music') {
    data = await Music.findOne({_id: obj._id})
  }
  res.send(JSON.stringify({
    code: 0,
    msg: '获取成功',
    data
  }))
})

module.exports = router
