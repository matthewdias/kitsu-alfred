const alfy = require('alfy')
const Kitsu = require('devour-client')

const host = 'http://staging.kitsu.io'
const kitsu = new Kitsu({ apiUrl: host + '/api/edge' })

kitsu.define('user', {
  name: '',
  // avatar: { medium: '' }
})

const searchUsers = (query) => {
  return new Promise((pass, fail) => {
    kitsu.findAll('user', {
      filter: { query },
      include: 'waifu'
    }).then((users) => {
      pass(users)
    })
  })
}

searchUsers(encodeURI(alfy.input)).then((user) => {
  alfy.output(user.map((user) => {
    let url = host + '/users/' + user.name
    return {
      uid: user.id,
      title: user.name,
      arg: url,
      // icon: { path: user.posterImage.medium },
      autocomplete: user.name,
      text: { copy: url, largetype: url },
      quicklookurl: url
    }
  }))
})
