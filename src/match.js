const MatchConnection = require('./models/match')
const $ = require('jquery')

const connection = new MatchConnection()

$(document).ready(() => {
    connection.joinMatch('1234')
    setTimeout(() => {
        connection.startMatch()
    },10000)
    setInterval(() => {
        connection.sendWPM(parseInt(Math.floor(Math.random() * 100) + 1))
    },3000)
})

