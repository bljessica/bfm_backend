# bfm_backend
豆瓣书影音微信小程序nodejs后端

## 运行

### 安装依赖
```
cd bfm_backend

npm i
```

### 将书影音数据存入数据库

如已存在bfm数据库，需要先删除

```
node utils/saveDataToDB.js
```

### 开发环境热更新
```
npm run dev
```
