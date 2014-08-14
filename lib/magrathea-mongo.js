var sha1 = require('sha1')
var moment = require('moment')
var mongoose = require('mongoose')

var Log = mongoose.model('Log', {
  doc_id: String,
  date: Date,
  logs: Array
})

var parseRequest = (req) => {
  return JSON.parse(req)
}

var doc_id = (key, date) => {
  var parsed = moment(date).format("YYYYMMDD")
  return sha1(parsed + key)
}

var MagratheaMongo = (req, res, next) => {
  var request = parseRequest(req)
  var data = request
  var key = request.key
  var date = new Date()
  var id = doc_id(key, date)

  var saveCb = (err, logs) => {
    if (err) return console.error(err)
  }

  var createLog = (data) => {
    var log = new Log({
      doc_id: id,
      date: date,
      logs: [data]
    })

    log.save(saveCb)
  }

  var updateLog = (log, data) => {
    log.logs.push(data)
    log.save(saveCb)
  }

  var createOrUpdate = (logs) => {
    if (logs.length == 0) {
      createLog(id, data, data)
    } else {
      logs.forEach((log) => {
        updateLog(log, data)
      })
    }
  }

  if(data.rawCommand != 'PRIVMSG') return

  Log.find({ doc_id: id }, (err, logs) => {
    if (err) throw Error(err)
    createOrUpdate(logs)
  })

  next()
}

mongoose.connect('mongodb://localhost/test')

module.exports = MagratheaMongo
