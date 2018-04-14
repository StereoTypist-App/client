const MatchConnection = require('./models/match')
const $ = require('jquery')

const connection = new MatchConnection()

$(document).ready(() => {
    connection.joinMatch('1234',() => {
        console.log("Match Started")
    },(data) => {
        console.log("Match Done",data)
    },(data) => {
        console.log("Received data",data)
    })
    setTimeout(() => {
        connection.startMatch()
    },10000)
    setInterval(() => {
        connection.sendWPM(parseInt(Math.floor(Math.random() * 100) + 1))
    },3000)
})

