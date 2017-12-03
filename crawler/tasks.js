const cli = require('axios')
let axios = cli.create()
const telegram = require('./tgMsg')
const parser = require('./parser')
const Agent = require('socks5-http-client/lib/Agent')
const config = require('./config')
const chalk = require('chalk')
const log = console.log
const pool = require('./db')
const eachLimit = require('async/eachLimit')

axios.defaults.baseURL = 'http://coldfilm.ru'
axios.defaults.timeout = 60000
axios.defaults.httpAgent = new Agent({
  socksHost: config.tor.host,
  socksPort: config.tor.port
})

/**
 * Генерация массива ссылок на поиск новых категорий
 * @param start
 * @param count
 * @returns {Array} - Возращаем массив объектов с ID и URL
 */
function generateUrlCategories (start, count) {
  let urls = []
  for (let i = start; i < start + count; i++)
    urls.push({id: i, url: `/news/1-0-${i}`})
  return urls
}

/**
 * Получение с сайта и обновление списка категорий
 * @param urls
 */
async function getCategoryFromSite (urls) {
  log(chalk.bgBlue.bold(' >>> '), `Start getCategoryFromSite: (${urls.length})`)
  for (const item of urls) {
    try {
      const {data} = await axios.get(item.url)
      let filmInfo = parser.getSeasonInfoFromHtml(data)
      filmInfo.id = item.id
      try {
        await pool.query('INSERT INTO seasons (id, season, last_series, title, img) VALUES($1,$2,$3,$4,$5)',
          [
            filmInfo.id, filmInfo.season, filmInfo.series, filmInfo.title, filmInfo.img
          ])
      } catch (e) {
        log(chalk.bgRed.bold(' >>> '), e.message)
      }
    } catch (e) {
      if (e.request.status !== 404)
        log(chalk.bgRed.bold(' >>> '), `axios error: (${item.url})`, e.message)
    }
  }
  log(chalk.bgBlue.bold(' >>> '), `End getCategoryFromSite: (${urls.length})`)
}

/**
 * Добавление одиночной категории для отслеживания
 * @param id - Идентификатор категории с сайта coldfilm
 */
exports.addCategory = async (id) => {
  return await getCategoryFromSite(generateUrlCategories(id, 1))
}

/**
 *  Обновление списка категорий (сезонов / разделов) сайта,
 *  обновления проверяются от максимального индекса (id) в базе с интервалом +20
 * */
exports.getCategory = async () => {

  try {
    let {rows} = await pool.query('SELECT MAX(id) FROM seasons', [])
    let max = Number(rows[0].max)
    let urls = generateUrlCategories(max + 1, 20)

    log(chalk.bgBlue.bold(' >>> '), `Start items: (${urls.length})`)

    eachLimit(urls, 5, async (item) => {
      try {
        const {data} = await axios.get(item.url)
        let filmInfo = parser.getSeasonInfoFromHtml(data)
        filmInfo.id = item.id
        try {
          await pool.query('INSERT INTO seasons (id, season, last_series, title, img) VALUES($1,$2,$3,$4,$5)',
            [
              filmInfo.id, filmInfo.season, filmInfo.series, filmInfo.title, filmInfo.img
            ])
        } catch (e) {
          log(chalk.bgRed.bold(' >>> '), e.message)
        }
      } catch (e) {
        if (e.request.status !== 404)
          log(chalk.bgRed.bold(' >>> '), `axios error: (${item.url})`, e.message)
      }
    }, (err) => {
      if (err) {
        log(chalk.bgRed.bold(' >>> '), 'A URL failed to process', err.message)
      }
    })
  } catch (e) {
    log(chalk.bgRed.bold(' >>> '), `error fetching client from pool`, e.message)
  }
}

/**
 *  Получение ID страницы с фильмом из активных для мониторинга разделов
 * */
exports.crawlerFilmsIdsFromCategory = async () => {

  try {
    let {rows} = await pool.query('SELECT id FROM seasons WHERE status = $1 ORDER BY id ASC', [1])
    // ids - массив с ID разделов, которые нужно мониторить
    let urls = []
    for (const item of rows) {
      urls.push({id: item.id, url: `/news/1-0-${item.id}`})
    }

    eachLimit(urls, 5, async (item) => {
      try {
        let {data} = await axios.get(item.url)
        let films = parser.getFilmInfoFromHtml(data)

        for (let film of films) {
          film.category = item.id
          film.create = new Date()
          try {
            await pool.query('INSERT INTO check_films (film_id, status, payload) VALUES ($1, DEFAULT, $2) ON CONFLICT (film_id) DO NOTHING', [film.id, film])
          } catch (e) {
            log(chalk.bgRed.bold(' >>> '), 'INSERT INTO check_films', e.message)
          }
        }
      } catch (e) {
        if (e.request.status !== 404)
          log(chalk.bgRed.bold(' >>> '), `error: (${item.url})`, e.message)
      }
    }, (err) => {
      if (err) {
        log(chalk.bgRed.bold(' >>> '), 'A URL failed to process', err.message)
      }
      log(chalk.bgBlue.bold(' >>> '), `End crawlerFilmsIdsFromCategory`)
    })
  } catch (e) {
    log(chalk.bgRed.bold(' >>> '), e.message)
  }
}

/**
 * В случае успеха возращаем номера последней серии, иначе 0
 *
 * @param {String|number} value
 * @return {number}
 */
function getLastSeriesNub (value) {
  if (typeof value === 'number') return value
  let info = value.match(/\d+-(\d+)/i)
  if (info) {
    return Number(info[1])
  }
  return 0
}

exports.checkTranslated = async () => {
  try {
    let {rows} = await  pool.query('SELECT x.* FROM check_films, jsonb_to_record(payload) AS x(id INT, category INT) WHERE status = 1 ORDER BY id ASC', [])

    let urls = []
    for (const item of rows) {
      urls.push({url: `/news/2017-03-28-${item.id}`, id: item.id, category: item.category})
    }

    log(chalk.bgRed.bold(' >>'), `urls: ${urls.length}`)

    eachLimit(urls, 5, async (item) => {

      let {data} = await axios.get(item.url)
      let film = parser.checkTranslatedFromHtml(data)
      film.id = item.id
      film.category = item.category

      // Если это обзор / удален по требованию правообладателя / переведен, то снимаем с мониторинга
      if (film.copyright || film.translated || film.review) {

        film.update = new Date()

        try {
          await Promise.all([
            pool.query(`UPDATE check_films SET payload = payload || $2::jsonb, status = 0 WHERE film_id = $1;`, [film.id, film]),
            pool.query(`UPDATE seasons SET last_series = $2::int WHERE id = $1;`, [film.category, getLastSeriesNub(film.series)])
          ])
          // await pool.query(`UPDATE check_films t1, seasons t2 SET t1.payload = t1.payload || $1::jsonb, t1.status = 0, t2.last_series = $2::int WHERE t1.film_id = $3 AND t2.id = $4;`,
          //   [
          //     film,
          //     getLastSeriesNub(film.series),
          //     film.id,
          //     film.category
          //   ])
          telegram.sendPost(film)
        } catch (e) {
          log(chalk.bgRed.bold(' >>> '), e.message)
        }
      }
      // telegram.sendPost(film)
    })
  } catch (e) {
    log(chalk.bgRed.bold(' >>> '), e.message)
  }
}
