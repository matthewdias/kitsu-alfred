const alfy = require('alfy')
const Kitsu = require('devour-client')

const host = 'http://staging.kitsu.io'
const kitsu = new Kitsu({ apiUrl: host + '/api/edge' })

kitsu.define('manga', {
  canonicalTitle: '',
  slug: '',
  // posterImage: { medium: '' },
  mangaType: ''
}, { collectionPath: 'manga' })

const searchManga = (text) => {
  return new Promise((pass, fail) => {
    kitsu.findAll('manga', {
      filter: { text }
    }).then((manga) => {
      pass(manga)
    })
  })
}

searchManga(encodeURI(alfy.input)).then((manga) => {
  alfy.output(manga.map((manga) => {
    let url = host + '/manga/' + manga.slug
    return {
      uid: manga.id,
      title: manga.canonicalTitle,
      subtitle: manga.mangaType.charAt(0).toUpperCase() + manga.mangaType.slice(1),
      arg: url,
      // icon: { path: manga.posterImage.medium },
      autocomplete: manga.canonicalTitle,
      text: { copy: url, largetype: url },
      quicklookurl: url
    }
  }))
})
