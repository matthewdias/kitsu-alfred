const alfy = require('alfy')
const Kitsu = require('devour-client')
const fs = require('fs')
const got = require('got')

const host = 'https://kitsu.io'
const kitsu = new Kitsu({ apiUrl: host + '/api/edge' })

kitsu.headers['User-Agent'] = 'Alfred/1.0.5'

kitsu.define('anime', {
  canonicalTitle: '',
  slug: '',
  posterImage: { tiny: '' },
  showType: ''
}, { collectionPath: 'anime' })

const searchAnime = (text) => {
  return kitsu.findAll('anime', {
    filter: { text }
  })
}

searchAnime(encodeURI(alfy.input)).then((anime) => {
  alfy.output(anime.map((anime) => {
    let url = host + '/anime/' + anime.slug
    let output = {
      uid: anime.id,
      title: anime.canonicalTitle,
      subtitle: anime.showType.charAt(0).toUpperCase() + anime.showType.slice(1),
      arg: url,
      autocomplete: anime.canonicalTitle,
      text: { copy: url, largetype: url },
      quicklookurl: url
    }

    if (anime.posterImage) {
      let path = `./cache/anime/${anime.id}.jpg`
      if (!fs.existsSync(path)) {
        got(anime.posterImage.tiny).then((response) => {
          got.stream(anime.posterImage.tiny).pipe(fs.createWriteStream(path))
        }).catch((error) => {})
      }
      output.icon = { path }
    }

    return output
  }))
})
