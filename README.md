# MangaKawaii

```js
const lirescan = require("./src/main")
```
### lirescan.allManga(page: int)
Récupère tous les mangas.

```js
lirescan.allManga(1).then(data => {
  console.log(data)
})
```

### lirescan.latestManga()
Récupère les mangas ayant eux des chapitres ajoutés récemment.
```js
lirescan.latestManga().then(data => {
  console.log(data)
})
```

### lirescan.searchManga(query)
Recherche des mangas.
```js
lirescan.searchManga('kimetsu').then(data => {
  console.log(data)
})
```

### lirescan.chapterList(urlManga)
Liste tous les chapitres d'un manga.
```js
lirescan.chapterList('https://www.mangakawaii.com/manga/kimetsu-no-yaiba').then(data => {
  console.log(data)
})
```

### lirescan.mangaDetails(urlManga)
Détaille un manga.
```js
lirescan.mangaDetails('https://www.mangakawaii.com/manga/kimetsu-no-yaiba').then(data => {
  console.log(data)
})
```

### lirescan.pageList(urlManga, chapter)
Récupère toutes les pages d'un chapitre
```js
lirescan.pageList('https://www.mangakawaii.com/manga/kimetsu-no-yaiba', 27).then(data => {
  console.log(data)
})
```

## BONUS
Pour télécharger tout les mangas sur MangaKawaii faites juste
```
node downloader
```

C'est moi qui régale tkt