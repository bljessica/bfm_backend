const { Book, Film, Music } = require('../db/connect')
const fs = require('fs')

async function saveFilmsToDB () {
  const data = fs.readFileSync('data/films_Top250.txt', 'utf8')
  const dataArr = data.split('\n')
  for(let line of dataArr) {
    const arr = line.split('\t')
    const intro = arr[7]
    const intros = intro?.split('@')
    const filmMakers = intros && intros[0]?.split('/')[0]?.split('???')
    if (/.*http.*/.test(arr[1])) {
      const film = await Film.findOne({name: arr[2]})
      if (!film) {
        await Film.create({
          name: arr[2],
          foreignName: arr[3],
          coverSrc: arr[1],
          introduction: arr[6],
          director: filmMakers[0],
          actors: filmMakers[1],
          publishTime: intros[1],
          country: intros[2],
          type: intros[3],
          score: arr[4]
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
}

async function saveMusicsToDB () {
  const data = fs.readFileSync('data/musics_Top250.txt', 'utf8')
  const dataArr = data.split('\n')
  for(let line of dataArr) {
    const arr = line.split('\t')
    if (/.*http.*/.test(arr[7])) {
      const music = await Music.findOne({name: arr[1]})
      if (!music) {
        await Music.create({
          name: arr[1],
          singer: arr[2],
          publishTime: arr[3],
          type: arr[4],
          coverSrc: arr[7],
          score: arr[5]
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
}

async function saveBooksToDB (type, filePath) {
  const data = fs.readFileSync(filePath, 'utf8')
  const dataArr = data.split('\n')
  for(let line of dataArr) {
    const arr = line.split('\t')
    if (/.*http.*/.test(arr[5])) {
      const book = await Book.findOne({name: arr[0]})
      if (book) {
        if (book.type !== type && book.type.indexOf(type) !== -1) {
          const bookType = book.type
          await Book.updateOne({name: arr[0]}, {type: bookType + ' ' + type})
        }
      } else {
        await Book.create({
          name: arr[0],
          author: arr[1],
          publisher: arr[2],
          publishTime: arr[3],
          coverSrc: arr[5],
          introduction: arr[6],
          authorIntroduction: arr[7],
          score: arr[8],
          type
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
}

(async function () {
  await saveMusicsToDB()
  console.log('音乐数据存储完毕，开始存储电影数据...')
  await saveFilmsToDB()
  console.log('电影数据存储完毕，开始存储书籍数据...')
  await saveBooksToDB('计算机图书', 'data/computer_books_info.txt')
  await saveBooksToDB('名著', 'data/masterpiece_books_info.txt')
  await saveBooksToDB('小说', 'data/novel_books_info.txt')
  console.log('书籍数据存储完毕')
  process.exit()
})()
