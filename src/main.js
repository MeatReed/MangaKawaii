const $ = require('cheerio')
const baseUrl = 'https://www.mangakawaii.com'
const cloudscraper = require('cloudscraper')
const validUrl = require('valid-url')

module.exports.allManga = async () => {
  try {
    const json = await cloudscraper.get(baseUrl + '/recherche')
    const jsonParse = JSON.parse(json)
    const data = []
    for (let i = 0; i < jsonParse.suggestions.length; i++) {
      data.push({
        name: jsonParse.suggestions[i].value,
        url: baseUrl + '/manga/' + jsonParse.suggestions[i].data,
        thumbnail_url: jsonParse.suggestions[i].imageUrl
      })
    }
    return data
  } catch (err) {
    return 'Une erreur est survenue !'
  }
}

module.exports.latestManga = async () => {
  try {
    const html = await cloudscraper.get(baseUrl)
    const data = []
    $('.manga-list li div.updates__left a', html).each((i, elem) => {
      data.push({
        name: elem.attribs.title,
        url: elem.attribs.href,
        thumbnail_url: $(elem).find('img')['0'].attribs['data-src']
      })
    })
    return data
  } catch (err) {
    return 'Une erreur est survenue !'
  }
}

module.exports.searchManga = async (query) => {
  try {
    const json = await cloudscraper.get(baseUrl + '/recherche?query=' + query)
    const jsonParse = JSON.parse(json)
    const data = []
    for (let i = 0; i < jsonParse.suggestions.length; i++) {
      data.push({
        name: jsonParse.suggestions[i].value,
        url: baseUrl + '/manga/' + jsonParse.suggestions[i].data,
        thumbnail_url: jsonParse.suggestions[i].imageUrl
      })
    }
    return data
  } catch (err) {
    return 'Une erreur est survenue !'
  }
}

module.exports.chapterList = async (urlManga) => {
  try {
    const html = await cloudscraper.get(urlManga)
    const data = []
    $('div.chapter-item.volume-0, div.chapter-item.volume-', html).each(
      (i, elem) => {
        data.push({
          name: $(elem)
            .find('a.list-item__title')
            .text()
            .trim(),
          url: baseUrl + $(elem).find('a.list-item__title')['0'].attribs.href,
          chapter_number: $(elem)
            .find('a.list-item__title')
            .text()
            .replace('\n', '')
            .replace('Chapitre ', '')
            .trim()
        })
      }
    )
    return data
  } catch (err) {
    return 'Impossible de récupérer les chapitres, le manga est introuvable !'
  }
}

module.exports.mangaDetails = async (urlManga) => {
  try {
    const html = await cloudscraper.get(urlManga)
    return {
      name: $('div input[name="manga_name"]', html)['0'].attribs.value,
      other_name: $('div.info-list__row span', html)['0'].children[0].data.split(', '),
      manga_slug: $('div input[name="manga_slug"]', html)['0'].attribs.value,
      thumbnail_url: $('div.manga__image img.manga__cover', html)['0'].attribs
        .src,
      description: $('div.info-desc__content', html).text(),
      author: $('a[href*=author]', html).text(),
      artist: $('a[href*=artist]', html).text(),
      url: urlManga
    }
  } catch (err) {
    return 'Le mange est introuvable !'
  }
}

module.exports.pageList = async (urlManga, chapter) => {
  try {
    const html = await cloudscraper.get(urlManga + '/' + chapter + '/1')
    const data = []
    await this.mangaDetails(urlManga).then((mangaDetails) => {
      $('#page-list option', html).each((i, elem) => {
        let png = true
        let url =
          'https://cdn.mangakawaii.com/uploads/manga/' +
          mangaDetails.manga_slug +
          '/chapters/' +
          chapter +
          '/' +
          (parseInt($(elem).text()) < 10
            ? '0' + parseInt($(elem).text()).toString()
            : parseInt($(elem).text()).toString()) +
          '.png'
        if (validUrl.isUri(url)) {
          url =
            'https://cdn.mangakawaii.com/uploads/manga/' +
            mangaDetails.manga_slug +
            '/chapters/' +
            chapter +
            '/' +
            (parseInt($(elem).text()) < 10
              ? '0' + parseInt($(elem).text()).toString()
              : parseInt($(elem).text()).toString()) +
            '.jpg'
            png = false
        }
        data.push({
          page: $(elem).text(),
          url,
          png
        })
      })
    })
    return data
  } catch (err) {
    return 'Le manga ou le chapitre du manga recherché est introuvable !'
  }
}
