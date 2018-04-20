const ActionCable = require("actioncable")

class MatchConnection {
    constructor() {
        // const url = 'ws://localhost:3000/'
        const url = 'ws://10.186.151.197:3000/'
        this.cable = ActionCable.createConsumer(url + 'cable')
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