const $ = require('cheerio');
const baseUrl = "https://www.mangakawaii.com"
const cloudscraper = require('cloudscraper')
const axios = require('axios')

module.exports.allManga = (page) => {
  return cloudscraper.get(baseUrl + `/filterLists?page=${page}&sortBy=views&asc=false`)
    .then(function(html){
      let data = []
      $('a.manga-block-item__content', html).each((i, elem) => {
        data.push({
          name: $(elem).find('h3').text().trim(),
          url: baseUrl + elem.attribs.href,
          thumbnail_url: elem.attribs['data-background-image']
        })
      })
      return data
    })
    .catch(function(err){
      return 'Une erreur est survenue !'
    })
}

module.exports.latestManga = () => {
  return cloudscraper.get(baseUrl)
    .then(function(html){
      let data = []
      $('.manga-list li div.updates__left a', html).each((i, elem) => {
        data.push({
          name: elem.attribs.title,
          url: elem.attribs.href,
          thumbnail_url: $(elem).find('img')['0'].attribs['data-src']
        })
      })
      return data
    })
    .catch(function(err){
      return 'Une erreur est survenue !'
    })
}

module.exports.searchManga = (query) => {
  return cloudscraper.get(baseUrl + '/recherche?query=' + query)
    .then(function(json){
      const jsonParse = JSON.parse(json)
      let data = []
      for (let i = 0; i < jsonParse.suggestions.length; i++) {
        data.push({
          name: jsonParse.suggestions[i].value,
          url: baseUrl + '/manga/' + jsonParse.suggestions[i].data,
          thumbnail_url: jsonParse.suggestions[i].imageUrl
        })
      }
      return data
    })
    .catch(function(err){
      return 'Une erreur est survenue !'
    })
}

module.exports.chapterList = (urlManga) => {
  return cloudscraper.get(urlManga)
    .then(function(html){
      let data = []
      $('div.chapter-item.volume-0, div.chapter-item.volume-', html).each((i, elem) => {
        data.push({
          name: $(elem).find('a.list-item__title').text().trim(),
          url: baseUrl + $(elem).find('a.list-item__title')['0'].attribs.href,
          chapter_number: $(elem).find('a.list-item__title').text().replace("\n", "").trim()
        })
      })
      return data
    })
    .catch(function(err){
      return 'Une erreur est survenue !'
    })
}

module.exports.mangaDetails = (urlManga) => {
  return cloudscraper.get(urlManga)
    .then(function(html){
      return {
        thumbnail_url: $('img.manga__cover', html)['0'].attribs.src,
        description: $('div.info-desc__content', html).text(),
        author: $('a[href*=author]', html).text(),
        artist: $('a[href*=artist]', html).text()
      }
    })
    .catch(function(err){
      return 'Une erreur est survenue !'
    })
}

module.exports.pageList = (urlManga, chapter) => {
  return cloudscraper.get(urlManga + '/' + chapter + '/1')
    .then(function(html){
      let data = []
      $('#page-list option', html).each((i, elem) => {
        data.push({
          page: $(elem).text(),
          url: 'https://cdn.mangakawaii.com/uploads/manga/kimetsu-no-yaiba/chapters/' + chapter + '/' + $(elem).text() + '.jpg'
        })
      })
      return data
    })
    .catch(function(err){
      return 'Une erreur est survenue !'
    })
}