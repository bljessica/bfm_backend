const express = require('express')
const router = express.Router()
const { LikeComment, Record } = require('../db/connect')

router.put('/likeOrUnlikeComment', async(req, res) => {
  let obj = req.body
  const likeRecord = await LikeComment.findOne(obj)
  if (likeRecord) {
    await LikeComment.deleteOne(obj)
    await Record.updateOne({
      _id: obj.recordId
    }, {$inc: {commentLikedNum: -1}})
  } else {
    await LikeComment.create(obj)
    await Record.updateOne({
      _id: obj.recordId
    }, {$inc: {commentLikedNum: 1}})
  }
  res.send(JSON.stringify({
    code: 0,
    msg: '成功'
  }))
})

module.exports = router