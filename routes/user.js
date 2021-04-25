const express = require('express')
const router = express.Router()
const { User } = require('../db/connect')

router.post('/addUser', async(req, res) => {
  const obj = req.body
  const user = await User.findOne({openid: obj.openid})
  if (!user) {
    await User.create(obj, (err) => {
      if (err) {
        res.send(JSON.stringify({
          code: 1,
          msg: err
        }))
        console.log(err)
      } else {
        res.send(JSON.stringify({
          code: 0,
          msg: '成功添加用户'
        }))
      }
    })
  } 
  else {
    res.send(JSON.stringify({
      code: 0,
      msg: '用户已存在'
    }))
  }
})

router.get('/userInfo', async(req, res) => {
  const obj = req.query
  const data = await User.findOne({
    openid: obj.openid
  })
  if (data) {
    res.send(JSON.stringify({
      code: 0,
      msg: '查询成功',
      data
    }))
  } else {
    res.send(JSON.stringify({
      code: 1,
      msg: '用户不存在'
    }))
  }
})

router.put('/updateUser', async(req, res) => {
  const obj = req.body
  await User.updateOne({openid: obj.openid}, obj)
  res.send(JSON.stringify({
    code: 0,
    msg: '成功更新用户信息'
  }))
})

router.get('/allUserInfo', async(req, res) => {
  const data = await User.find()
  res.send(JSON.stringify({
    code: 0,
    msg: null,
    data
  }))
})

router.delete('/user', async(req, res) => {
  const obj = req.body
  await User.deleteOne({openid: obj.openid})
  res.send(JSON.stringify({
    code: 0,
    msg: null
  }))
})

module.exports = router
