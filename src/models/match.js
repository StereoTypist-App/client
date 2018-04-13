const ActionCable = require("actioncable")

class MatchConnection {
    constructor() {
        this.cable = ActionCable.createConsumer('ws://localhost:3000/cable')
    }

    joinMatch(matchId) {
        this.matchId = matchId
        this.channel = this.cable.subscriptions.create({channel: "MatchChannel", match_id: matchId },{
            connected: () => {
                console.log("Cable Connected")
            },
            disconnected: () => {
                console.log("Cable Disconnected")
            },
            received: (data) => {
                console.log("Received: " + data)
            },
            rejected: () => {
                console.log("Data Rejected")
            }
        })
    }

    sendWPM(wpm) {
        this.channel.send({wpm: wpm, match_id: this.matchId})
        console.log("Sent " + wpm + " wpm")
    }

    startMatch() {
        this.channel.send({start: true, match_id: this.matchId})
        console.log("Sent start match")
    }
}

module.exports = MatchConnection