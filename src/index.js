const $ = require('jquery')
const Match = require('./models/match')

$(document).ready(() => {
    const match = new Match()

    match.getMatches((matchData) => {
        console.log(matchData)
    })
})