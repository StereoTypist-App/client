const MatchConnection = require('./models/match')
const $ = require('jquery')

const connection = new MatchConnection()

$(document).ready(() => {
    connection.joinMatch('1234')
    setInterval(() => {
        connection.sendWPM(parseInt(Math.floor(Math.random() * 100) + 1))
    },3000)
})

