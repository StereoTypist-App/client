const ActionCable = require("actioncable")

class MatchConnection {
    constructor() {
        // const url = 'ws://localhost:3000/'
        const url = 'wss://stereotypist.herokuapp.com/'
        console.log(url)
        this.cable = ActionCable.createConsumer(url + 'cable')
    }

    getMatches(updateCallback) {
        this.matchmakingChannel = this.cable.subscriptions.create({ channel: "MatchChannel", matchmaking: true }, {
            connected: () => {
                console.log("Matchmaking Cable Connected")
            },
            disconnected: () => {
                console.log("Cable Disconnected")
            },
            received: (data) => {
                updateCallback(data)
            },
            rejected: () => {
                console.log("Data Rejected")
            }
        })
    }

    joinMatch(matchId, startCallback, doneCallback, dataCallback) {
        this.matchId = matchId
        this.channel = this.cable.subscriptions.create({ channel: "MatchChannel", match_id: matchId }, {
            connected: () => {
                console.log("Cable Connected")
            },
            disconnected: () => {
                console.log("Cable Disconnected")
            },
            received: (data) => {
                if (data.complete) {
                    this.channel.unsubscribe()
                    return doneCallback(data)
                }
                if (data.started) {
                    return startCallback(data)
                }
                dataCallback(data)
            },
            rejected: () => {
                console.log("Data Rejected")
            }
        })
    }

    sendWPM(wpm) {
        this.channel.send({ wpm: wpm })
        console.log("Sent " + wpm + " wpm")
    }

    startMatch() {
        this.channel.send({ start: true })
        console.log("Sent start match")
    }
}

module.exports = MatchConnection