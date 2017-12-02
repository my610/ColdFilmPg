const cronJob = require('cron').CronJob
const chalk = require('chalk')
const log = console.log
const task = require('./tasks')

log(chalk.bgBlue.bold(' >>> '), chalk.blue.bold('INFO Start crawler >'), new Date())

// Проверка на наличия новых разделов на сайте раз в сутки
new cronJob('3 */6 * * *', async () => {
  log(chalk.bgBlue.bold(' >>> '), chalk.blue.bold('INFO Start getCategory >'), new Date())
  await task.getCategory()
}, null, true)

// Проверка на новые посты в разделах фильмов раз в 30 мин.
new cronJob('*/30 * * * *', () => {
  log(chalk.bgBlue.bold(' >>> '), chalk.blue.bold('INFO Start crawlerFilmsIdsFromCategory >'), new Date())
  task.crawlerFilmsIdsFromCategory()
}, null, true)

// Проверка на перевод раз в 5 минут
new cronJob('*/5 * * * *', () => {
  log(chalk.bgBlue.bold(' >>> '), chalk.blue.bold('INFO Start checkTranslated >'), new Date())
  task.checkTranslated()
}, null, true);

// task.checkTranslated()
// task.getLastSeries()
task.crawlerFilmsIdsFromCategory()
// task.getCategory()


// const cli = require('axios')
// let axios = cli.create()
// // axios.defaults.baseURL = 'http://coldfilm.ru'
// axios.defaults.timeout = 60000
//
// // const pool = require('./db')
// const main = async () => {
//   // let {rows} = await pool.query('SELECT x.* FROM check_films, jsonb_to_record(payload) AS x(id INT, category INT) WHERE status = 1 ORDER BY id ASC', [])
//   // let {rows} = await pool.query('SELECT MAX(id) FROM seasons', [])
//   // let max = rows[0].max
//
//   let {data} = await axios.get('http://exploringjs.com/es6/ch_for-of.html')
//   log(data)
//   return data
// }
//
// main()
