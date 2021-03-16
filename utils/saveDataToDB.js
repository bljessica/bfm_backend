const { Book, Film, Music } = require('../db/connect')
const fs = require('fs')

async function saveFilmsToDB () {
  const data = fs.readFileSync('data/films_Top250.txt', 'utf8')
  console.log('films_Top250.txt文件读取完成')
  const dataArr = data.split('\n')
  for(let line of dataArr) {
    const arr = line.split('\t')
    if (/.*http.*/.test(arr[1])) {
      await Film.create({
        name: arr[2],
        foreignName: arr[3],
        coverSrc: arr[1],
        introduction: arr[6],
        relatedInfo: arr[7],
        score: arr[4]
      }).catch(err => {
        console.log(err)
      })
    }
  }
}

async function saveMusicsToDB () {
  const data = fs.readFileSync('data/musics_Top250.txt', 'utf8')
  console.log('musics_Top250.txt文件读取完成')
  const dataArr = data.split('\n')
  for(let line of dataArr) {
    const arr = line.split('\t')
    if (/.*http.*/.test(arr[7])) {
      await Music.create({
        name: arr[1],
        singer: arr[2],
        publishTime: arr[3],
        musicType: arr[4],
        coverSrc: arr[7],
        score: arr[5]
      }).catch(err => {
        console.log(err)
      })
    }
  }
}

async function saveBooksToDB (bookType, filePath) {
  const data = fs.readFileSync(filePath, 'utf8')
  console.log(filePath + '文件读取完成')
  const dataArr = data.split('\n')
  for(let line of dataArr) {
    const arr = line.split('\t')
    if (/.*http.*/.test(arr[5])) {
      await Book.create({
        name: arr[0],
        author: arr[1],
        publisher: arr[2],
        publishTime: arr[3],
        coverSrc: arr[5],
        introduction: arr[6],
        authorIntroduction: arr[7],
        score: arr[8],
        bookType
      }).catch(err => {
        console.log(err)
      })
    }
  }
}

(async function () {
  await saveFilmsToDB()
  await saveMusicsToDB()
  await saveBooksToDB('计算机图书', 'data/computer_books_info.txt')
  await saveBooksToDB('名著', 'data/masterpiece_books_info.txt')
  await saveBooksToDB('小说', 'data/novel_books_info.txt')
})()
