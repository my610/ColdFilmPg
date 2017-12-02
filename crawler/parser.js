const cheerio = require('cheerio')

/**
 *
 * @param value
 * @return {number}
 */
exports.filterInt = filterInt
function filterInt(value) {
  if (/^([0-9]+)$/.test(value))
    return Number(value);
  return 0;
}

/**
 * В случае успеха возращаем номера сезона, иначе 0
 *
 * @param {String} value
 * @return {number}
 */
function getSeasonNub(value) {
  let info = value.match(/(\d+)\sсезон/i)
  if (info) {
    return Number(info[1])
  }
  return 0;
}

/**
 * В случае успеха возращаем номера серии, иначе 0
 *
 * @param {String} value
 * @return {number}
 */
function getSeriesNub(value) {
  let info = value.match(/(\d+)\sсерия/i)
  if (info) {
    return Number(info[1])
  }
  return 0
}

/**
 * Получение "чистого" названия фильма
 *
 * @param {String} value
 * @return {*}
 */
function getTitleFilm(value) {
  let info = value.match(/(.*?)\s(\d+\sсезон|\d+\sсмотреть|\[обзор)/i)
  if (info) {
    return info[1].trim()
  }
  return value
}

/**
 * Проверка на "удаление" правообладателя
 *
 * @param {String} value
 * @return {boolean}
 */
function checkCopyright(value) {
  return (/удалено/i.test(value))
}

/**
 * Проверка на "обзор"
 *
 * @param {String} value
 * @return {boolean}
 */
function checkReview(value) {
  return (/обзор/i.test(value))
}

/**
 * Парсинг страници и получение сведеней о названии фильма/сериала, сезоне, последней серии, URL на постер
 *
 * @param {String} html - HTML text
 * @return {Object}
 * */
exports.getSeasonInfoFromHtml = function (html) {

  let $ = cheerio.load(html)
  let text = $('.kino-h').eq(0).attr('title').trim()
  const img = $('div.kino-img.img-box > img').eq(0)
  const picture = {src: img.attr('src'), title: img.attr('title')}

  return {
    season: getSeasonNub(text) !== 0 ? getSeasonNub(text) : getSeasonNub(picture.title),
    series: getSeriesNub(text) !== 0 ? getSeriesNub(text) : getSeriesNub(picture.title),
    title: getTitleFilm(text),
    img: picture.src
  }
}

/**
 * Получение списка ID записей из выбранной категории
 *
 * @param {String} html
 * @return {Array}
 */
exports.getFilmInfoFromHtml = function (html) {

  let $ = cheerio.load(html)
  let ids = []

  $('a.kino-h').each(function (i, link) {
    const title = $(this).attr('title').trim()

    let film = {
      season: getSeasonNub(title),
      series: getSeriesNub(title),
      title: getTitleFilm(title)
    }

    let url = $(this).attr('href')
    let idUrl = url.match(/\/(\d{4}-\d{2}-\d{2})-(\d+)/i)
    if (idUrl) {
      film.id = filterInt(idUrl[2])
      film.date = idUrl[1]
      ids.push(film)
    }
  })
  return ids
}

/**
 * Проверка наличия перевода фильма
 *
 * @param {String} html
 * @return {Object}
 */
exports.checkTranslatedFromHtml = function (html) {

  const $ = cheerio.load(html)
  const title = $('title').text()
  const eMessage = $('div.player-box.visible.full-text > div')
  const spans = eMessage.children('span[style*="font-size:12pt"], span[style*="font-size: 12pt"]')
  const text = spans.last().children('span').first()

  let film = {
    season: getSeasonNub(title),
    series: getSeriesNub(title) !== 0 ? getSeriesNub(title) : `${getSeriesNub(spans.eq(0).text())}-${getSeriesNub(spans.eq(-2).text())}`,
    title: getTitleFilm(title),
    img: $('div.kino-desc.full-text.clearfix > img').attr('src'),
    copyright: checkCopyright(text.text()),
    review: checkReview(text.text()),
    translated: false
  }

  let torrents = []
  let regexp = new RegExp(/href="(.+\.torrent)".+>.+\[(\d+)p\]/g)
  let match
  while (match = regexp.exec(eMessage.html())) {
    torrents.push({torrent: match[1], quality: match[2]})
  }
  if (torrents.length > 0) {
    film.translated = true
    film.torrents = torrents
  }
  return film
}
