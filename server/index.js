var express = require('express')
var app = express()
var path = require('path')

var port = 3000

app.use(express.static(path.join(__dirname, '../dist')))

app.listen(port, function() {
    console.log('server is listening to ' + port)
})

module.exports = app
