const alfy = require('alfy')
const Kitsu = require('devour-client')
const fs = require('fs')
const got = require('got')

const host = 'https://kitsu.io'
const kitsu = new Kitsu({ apiUrl: host + '/api/edge' })

kitsu.headers['User-Agent'] = 'Alfred/1.0.6'

kitsu.define('manga', {
  canonicalTitle: '',
  slug: '',
  posterImage: { tiny: '' },
  subtype: ''
}, { collectionPath: 'manga' })

const searchManga = (text) => {
  return kitsu.findAll('manga', {
    filter: { text }
  })
}

searchManga(encodeURI(alfy.input)).then((manga) => {
  alfy.output(manga.map((manga) => {
    let url = host + '/manga/' + manga.slug
    let output = {
      uid: manga.id,
      title: manga.canonicalTitle,
      subtitle: manga.subtype.charAt(0).toUpperCase() + manga.subtype.slice(1),
      arg: url,
      autocomplete: manga.canonicalTitle,
      text: { copy: url, largetype: url },
      quicklookurl: url
    }

    if (manga.posterImage) {
      let path = `./cache/manga/${manga.id}.jpg`
      if (!fs.existsSync(path)) {
        got(manga.posterImage.tiny).then((response) => {
          got.stream(manga.posterImage.tiny).pipe(fs.createWriteStream(path))
        }).catch((error) => {})
      }
      output.icon = { path }
    }

    return output
  }))
})
