const config = require('./config.json')
const tg = require('telegram-node-bot')(config.token)
// const TelegramBot = require('node-telegram-bot-api')
// Create a bot that uses 'polling' to fetch new updates
// const tg = new TelegramBot(config.token, {polling: false})
const chalk = require('chalk')
const log = console.log

/**
 *
 * @param {Object} film
 */
exports.sendPost = function (film) {

  // Если переведен, то постим в ленту о выходе новой серии
  if (film.translated) {
    const date = new Date()
    let title = film.title
    if (film.season)
      title += ` ${film.season} сезон`
    if (film.series)
      title += ` ${film.series} серия`

    let keyboard = {inline_keyboard: []}

    keyboard.inline_keyboard.push([
      {
        text: '🔗 Перейти на сайт',
        url: `http://coldfilm.ru/news/${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${film.id}`
      }
    ])

    let torrents = []

    film.torrents.forEach(function (item) {
      torrents.push(
        {
          text: `💿 ${item.quality}`,
          url: item.torrent,
          callback_data: `${item.id}|${item.quality}`
        }
      )
    })

    keyboard.inline_keyboard.push(torrents)

    tg.sendMessage(config.channel, `<b>${title}</b>`, {
      parse_mode: 'HTML',
      reply_markup: JSON.stringify(keyboard)
    }, res => {

      log(
        chalk.bgBlue.bold(' >>> '),
        chalk.blue.bold('tg.sendMessage >>> ')
      )
      console.dir(res)
      console.dir(res.result.entities)
    })
  }

  // Публиковать обзор
  if (film.review) {
    let html = `<b>${film.title}</b>`

    tg.sendMessage(config.channel, html, {parse_mode: 'HTML'})
  }

}

// tg.answerCallbackQuery(callbackQueryId, text, showAlert, [options])

// tg.on('polling_error', (error) => {
//   console.log(error.code);  // => 'EFATAL'
// });

// const film = {
//   id: 7501,
//   season: 1,
//   series: 2,
//   title: 'Good film',
//   img: '',
//   copyright: false,
//   review: false,
//   translated: true,
//   torrents: [
//     {torrent: 'http://dev.in/test.torrent', quality: '1080'},
//     {torrent: 'http://dev.in/test.torrent', quality: '720'},
//     {torrent: 'http://dev.in/test.torrent', quality: '400'}
//   ]
// }
// sendPost(film)
//
// setTimeout(() => {
//   process.exit(0)
// }, 10000)


