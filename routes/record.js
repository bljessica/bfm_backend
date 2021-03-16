const express = require('express')
const router = express.Router()
const { Record } = require('../db/connect')

router.post('/addOrUpdateRecord', async(req, res) => {
  let obj = req.body
  const record = await Record.findOne({
    openid: obj.openid,
    kind: obj.kind,
    name: obj.name
  })
  if (record) {
    await Record.updateOne({
      openid: obj.openid,
      kind: obj.kind,
      name: obj.name
    }, obj)
  } else {
    await Record.create(obj)
  }
  res.send(JSON.stringify({
    code: 0,
    msg: '添加成功'
  }))
})

module.exports = router

