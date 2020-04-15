const lirescan = require("./src/main")
const fetch = require('node-fetch')
const axios = require('axios')
const fs = require('fs')
const sanitize = require('sanitize-filename')

if (!fs.existsSync('output')) {
	fs.mkdirSync('output')
}

lirescan.allManga().then(async data => {
  for (let i = 0; i < data.length; i++) {
    await downloadManga(data[i])
    console.log(`\tDone oid: ${data[i].name}`)
  }
})

function downloadManga(manga) {
	return lirescan.mangaDetails(manga.url)
		.then(data => {
			return new Promise((resolve, reject) => {
        if (!fs.existsSync('output/' + sanitize(data.name))) {
          fs.mkdir('output/' + sanitize(data.name), err => {
            if (err) {
              return reject(err)
            }

            console.log("Made the folder for the download. 'output/" + sanitize(data.name) + "/'")
            
            resolve(data)
          })
        } else {
          console.log("Updated the folder for the download. 'output/" + sanitize(data.name) + "/'")
            
          resolve(data)
        }
			})
		})
		.then(async data => {
      const chapters = await lirescan.chapterList(data.url)
      let outDir = 'output/' + sanitize(data.name)

      if (!fs.existsSync(outDir + '/Chapiters/')) {
        fs.mkdirSync(outDir + '/Chapiters/')
      }
      
      fs.writeFile(outDir + '/info.json', JSON.stringify(data), 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.")
            return console.log(err)
        }
     
        console.log("JSON file has been saved.")
      })

      await downloadThumbnail(data.thumbnail_url, outDir)

			for (let i = 0; i < chapters.length; i++) {
				await downloadChapter(data.url, chapters[i], outDir)
				console.log("\tDone with chapter #" + i + " '" + chapters[i].name + "' " + i + "/" + chapters.length)
      }

      console.log('\tDone download all chapiters ' + sanitize(data.name))
		}).catch(err => {
      return
    })
}

async function downloadChapter(manga, chapter, outDir) {
	return await lirescan.pageList(manga, chapter.chapter_number)
		.then(data => {
			console.log("\tStarting chapter '" + chapter.name + "'")
			return new Promise(async (resolve, reject) => {
        if (!fs.existsSync(outDir + '/Chapiters/' + sanitize(chapter.name))) {
          fs.mkdir(outDir + '/Chapiters/' + sanitize(chapter.name), err => {
            if (err) {
              return reject(err)
            }

            console.log("\tMade the folder for the chapter download. '" + outDir + '/Chapiters/' + sanitize(chapter.name) + "/'")

            resolve(data)
          })
        } else {
          console.log("\tUpdated the folder for the chapter download. '" + outDir + '/Chapiters/' + sanitize(chapter.name) + "/'")

          resolve(data)
        }
			})
		})
		.then(async data => {
			fs.readdir(outDir + '/Chapiters/' + sanitize(chapter.name), function(error, files) {
				if (files.length === data.length) return
			})

			const outDirComplete = outDir + '/Chapiters/' + sanitize(chapter.name) + '/'

      let promises = []
			
			for (let i = 0; i < data.length; i++) {
        if(data[i].png) {
          if (fs.existsSync(outDirComplete + sanitize((i + 1) + '.png'))) return
				  promises.push(await downloadPage(data[i].url, outDirComplete + sanitize((data[i].page) + '.png')))
        } else {
          if (fs.existsSync(outDirComplete + sanitize((i + 1) + '.jpg'))) return
				  promises.push(await downloadPage(data[i].url, outDirComplete + sanitize((data[i].page) + '.jpg')))
        }
			}

			return Promise.all(promises)
		})
		.catch(err => {
      console.log(err)
			return
		})
}

async function downloadPage(url, outputDir) {
	await fetch(url)
		.then(async buffer => {
			console.log("\t\nPage To", outputDir)
      const dest = fs.createWriteStream(outputDir)
      await buffer.body.pipe(dest)
      console.log("\t\tWrote ", outputDir)
		})
		.catch(err => {
			console.log("Download")
			return
		})
}

function downloadThumbnail(url, outputDir) {
	fetch(url)
		.then(async buffer => {
			console.log("\t\nThumbnail To", outputDir)
      const dest = fs.createWriteStream(outputDir + '/thumbnail.png')
      await buffer.body.pipe(dest)
      console.log("\t\tWrote ", outputDir)
		})
		.catch(err => {
			console.log("No access to thumbnail")
			return
		})
}