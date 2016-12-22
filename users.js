const alfy = require('alfy')
const Kitsu = require('devour-client')
const fs = require('fs')
const got = require('got')

const host = 'https://kitsu.io'
const kitsu = new Kitsu({ apiUrl: host + '/api/edge' })

kitsu.headers['User-Agent'] = 'Alfred/1.0.6'

kitsu.define('user', {
  name: '',
  avatar: { medium: '' }
})

const searchUsers = (query) => {
  return kitsu.findAll('user', {
    filter: { query }
  })
}

searchUsers(encodeURI(alfy.input)).then((users) => {
  alfy.output(users.map((user) => {
    let url = host + '/users/' + user.name
    let output = {
      uid: user.id,
      title: user.name,
      arg: url,
      autocomplete: user.name,
      text: { copy: url, largetype: url },
      quicklookurl: url
    }

    if (user.avatar) {
      let path = `./cache/users/${user.id}.jpg`
      if (!fs.existsSync(path)) {
        got(user.avatar.medium).then((response) => {
          got.stream(user.avatar.medium).pipe(fs.createWriteStream(path))
        }).catch((error) => { output = { title: error } })
      }
      output.icon = { path }
    }

    return output
  }))
})
