const express = require('express')
const router = express.Router()
const { Film, Music, Book } = require('../db/connect')

router.post('/search', async(req, res) => {
  const obj = req.body
  if (!obj.searchText) {
    res.send(JSON.stringify({
      code: 0,
      msg: '查询成功',
      data: []
    }))
    return
  }
  const filmData = await Film.aggregate([
    {$match: {name: {$regex: '.*' + obj.searchText + '.*'}}},
    {$project: {kind: 'film', name: 1, coverSrc: 1, publishTime: 1, score: 1,country: 1, type: 1, director: 1, actors: 1}}
  ])
  const musicData = await Music.aggregate([
    {$match: {name: {$regex: '.*' + obj.searchText + '.*'}}},
    {$project: {kind: 'music', name: 1, coverSrc: 1, publishTime: 1, score: 1,singer: 1}}
  ])
  let bookData = await Book.aggregate([ 
    {$match: {name: {$regex: '.*' + obj.searchText + '.*'}}},
    {$project: {kind: 'book', name: 1, coverSrc: 1, publishTime: 1, score: 1,author: 1, publisher: 1}}
  ])
  const data = filmData.concat(musicData).concat(bookData).concat([])
  data.sort((a, b) => {
    return a.name.indexOf(obj.searchText) - b.name.indexOf(obj.searchText)
  })
  res.send(JSON.stringify({
    code: 0,
    msg: '查询成功',
    data
  }))
})

module.exports = router
