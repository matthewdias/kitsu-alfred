const alfy = require('alfy')
const Kitsu = require('devour-client')

const host = 'http://staging.kitsu.io'
const kitsu = new Kitsu({ apiUrl: host + '/api/edge' })

kitsu.define('anime', {
  canonicalTitle: '',
  slug: '',
  // posterImage: { medium: '' },
  showType: ''
}, { collectionPath: 'anime' })

const searchAnime = (text) => {
  return new Promise((pass, fail) => {
    kitsu.findAll('anime', {
      filter: { text }
    }).then((anime) => {
      pass(anime)
    })
  })
}

searchAnime(encodeURI(alfy.input)).then((anime) => {
  alfy.output(anime.map((anime) => {
    let url = host + '/anime/' + anime.slug
    return {
      uid: anime.id,
      title: anime.canonicalTitle,
      subtitle: anime.showType.charAt(0).toUpperCase() + anime.showType.slice(1),
      arg: url,
      // icon: { path: anime.posterImage.medium },
      autocomplete: anime.canonicalTitle,
      text: { copy: url, largetype: url },
      quicklookurl: url
    }
  }))
})
