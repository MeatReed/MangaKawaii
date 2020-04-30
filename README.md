# MangaKawaii

```js
const mangakawaii = require("./src/main")
```
### mangakawaii.allManga(page: int)
Récupère tous les mangas.

```js
mangakawaii.allManga(1).then(data => {
  console.log(data)
})
```

### mangakawaii.latestManga()
Récupère les mangas ayant eux des chapitres ajoutés récemment.
```js
mangakawaii.latestManga().then(data => {
  console.log(data)
})
```

### mangakawaii.searchManga(query)
Recherche des mangas.
```js
mangakawaii.searchManga('kimetsu').then(data => {
  console.log(data)
})
```

### mangakawaii.chapterList(urlManga)
Liste tous les chapitres d'un manga.
```js
mangakawaii.chapterList('https://www.mangakawaii.com/manga/kimetsu-no-yaiba').then(data => {
  console.log(data)
})
```

### mangakawaii.mangaDetails(urlManga)
Détaille un manga.
```js
mangakawaii.mangaDetails('https://www.mangakawaii.com/manga/kimetsu-no-yaiba').then(data => {
  console.log(data)
})
```

### mangakawaii.pageList(urlManga, chapter)
Récupère toutes les pages d'un chapitre
```js
mangakawaii.pageList('https://www.mangakawaii.com/manga/kimetsu-no-yaiba', 27).then(data => {
  console.log(data)
})
```

## BONUS
Pour télécharger tout les mangas sur MangaKawaii faites juste
```
node downloader
```

C'est moi qui régale tkt
