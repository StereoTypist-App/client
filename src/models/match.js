const ActionCable = require("actioncable")

class MatchConnection {
    constructor() {
        this.cable = ActionCable.createConsumer('ws://localhost:3000/cable')
    }

    joinMatch(matchId,doneCallback,dataCallback) {
        this.matchId = matchId
        this.channel = this.cable.subscriptions.create({channel: "MatchChannel", match_id: matchId },{
            connected: () => {
                console.log("Cable Connected")
            },
            disconnected: () => {
                console.log("Cable Disconnected")
            },
            received: (data) => {
                if(data.complete) {
                    this.channel.unsubscribe()
                    return doneCallback(data)
                }
                dataCallback(data)
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

    startMatch() {
        this.channel.send({start: true})
        console.log("Sent start match")
    }
}

module.exports = MatchConnection