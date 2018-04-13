const ActionCable = require("actioncable")

class MatchConnection {
    constructor() {
        this.cable = ActionCable.createConsumer('ws://localhost:3000/cable')
    }

    joinMatch(matchId) {
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
        this.channel.send({wpm: wpm})
        console.log("Sent " + wpm + " wpm")
    }
}

module.exports = MatchConnection