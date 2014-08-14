var magrathea = require('magrathea')
var WebSocket = require('ws')
var mongo = require('../index')

var stringify = (obj) => {
  return JSON.stringify(obj)
}

var proxy = magrathea()

proxy.useIn((req, res, next) => {
  var request = JSON.parse(req)
  next()
})

proxy.useOut(mongo)

proxy.listen()

var ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
  var connect = {
    type: 'connect',
		connection: {
      server: 'irc.freenode.net',
  		nick: 'magrathea-mongo',
  		channels: ['#pekkabot']
    }
  }
  var message = stringify(connect)

  ws.send(message)
})

ws.on('message', (data) => {
  //console.log(data)
})
