const $ = require('jquery')
const shortid = require('shortid')
const queryString = require('query-string')
const Texts = require('./texts')
const MatchConnection = require('./models/match')
const Chart = require('./models/chart')

class Game {
    constructor(connection) {
        this.paragraph = null
        this.numCorrect = 0
        this._wpm = 0
        this.startTime = -1
        this.WPMInterval = -1
        this.chart = null
        this.connection = connection
        this.textContainer = $('#promptText')
        this.wordInput = $('#typeInput')
        this.wordInput.on('input', this.valueChange)
        this.wordInput.prop('disabled', true)
    }

    start() {
        this.startTime = Date.now()
        this.wordInput.prop('disabled', false)
        this.wordInput.focus()
        // Update WPM
        const thisRef = this
        this.WPMInterval = setInterval(() => {
            $('#wpm').text(thisRef.WPM.toFixed(2) + ' wpm')
            this.connection.sendWPM(thisRef.WPM.toFixed(2))
        }, 1000)
    }

    end() {
        clearInterval(this.WPMInterval)
        $('#gameinfo').text('Game Complete')
        $('#gameinfo-row').show()
        this.wordInput.prop('disabled', true)
    }

    countdown(doneCallback) {
        $('#gameinfo-row').show()
        $('#gameinfo').text('Game starting in...')
        setTimeout(() => {
            $('#gameinfo').text('Game starting in 3...')
        }, 1000)
        setTimeout(() => {
            $('#gameinfo').text('Game starting in 2...')
        }, 2000)
        setTimeout(() => {
            $('#gameinfo').text('Game starting in 1...')
        }, 3000)
        setTimeout(() => {
            $('#gameinfo-row').hide()
            doneCallback()
        }, 4000)
    }

    setText(rawText) {
        this.paragraph = new Paragraph(rawText)
        this.paragraph.renderTextToElement(this.textContainer)
        this.paragraph.currentWord.startClock()
    }

    updateTable(data) {
        const results = data.result
        let users = []

        for (let user in results) {
            if (user === "active") continue
            const userWPM = results[user]
            users.push({
                name: user,
                wpm: userWPM
            })
        }

        users.sort((a, b) => {
            if (a.wpm > b.wpm)
                return -1
            if (a.wpm < b.wpm)
                return 1
            return 0
        })

        if(!this.chart) {
            this.chart = new Chart(users)
        }

        this.chart.updateChart(users, this.WPM)
    }

    get valueChange() {
        const thisRef = this
        return () => {
            if (thisRef.paragraph.checkWord(thisRef.wordInput.val())) {
                // Word is correct
                thisRef.numCorrect += 1
                const completionTime = thisRef.paragraph.currentWord.completionTime / 1000

                const next = thisRef.paragraph.nextWord()
                thisRef.wordInput.val(null)

                // Update text
                if (!next) {
                    thisRef.setText(exampleTexts.getText())
                } else {
                    next.startClock()
                }
            }
        }
    }

    get WPM() {
        const timeElapsed = (Date.now() - this.startTime) / (1000 * 60)
        return this.numCorrect / timeElapsed
    }
}

class Paragraph {
    constructor(text) {
        this.text = text
        this.words = []
        this.wordsStack = null
        this.currentWord = null

        this.text.split(' ').forEach((token) => {
            this.words.push(new Word(token))
        })

        this.wordsStack = [].concat(this.words).reverse()
        this.currentWord = this.wordsStack.pop()
    }

    renderTextToElement($element) {
        $element.empty()
        this.words.forEach((word) => {
            $element.append(word.getElement$())
        })
    }

    checkWord(text) {
        if (text.trim() === this.currentWord.toString()) {
            this.currentWord.endClock()
            this.currentWord.showCorrect()
            return true
        } else {
            this.currentWord.showIncorrect(text)
            return false
        }
    }

    nextWord() {
        this.currentWord = this.wordsStack.pop()
        return this.currentWord
    }
}

class Word {
    constructor(wordText) {
        this.text = wordText.trim()
        this.letterMap$ = []
        this.startTime = null
        this.completionTime = -1

        // Build element
        this.wordElement = $('<span>', {
            text: ' '
        }).css({
            'border-radius': '0.1em',
            'padding': '3px'
        })

        this.text.split('').forEach((c, index) => {
            const letter = $('<span>', { text: c })
            this.letterMap$[c + index] = letter
            this.wordElement.append(letter)
        })
    }

    getElement$() {
        return this.wordElement
    }

    toString() {
        return this.text
    }

    showIncorrect(incorrectText) {
        const text = incorrectText.trim()

        for (let key in this.letterMap$) {
            this.letterMap$[key].css({ 'background-color': 'transparent' })
        }

        if (this.text.startsWith(text)) {
            text.split('').forEach((c, index) => {
                const letter$ = this.letterMap$[c + index]
                letter$.css({
                    'background-color': 'rgba(244,67,54,0.5)',
                    'border-radius': '0.1em'
                })
            })
        }
        this.wordElement.css({ 'background-color': 'rgba(244,67,54,0.5)' })
    }

    showCorrect() {
        for (let key in this.letterMap$) {
            this.letterMap$[key].css({ 'background-color': 'transparent' })
        }
        this.wordElement.css({ 'background-color': 'rgba(76,175,80,0.5)' })
    }

    startClock() {
        this.startTime = Date.now()
    }

    endClock() {
        this.completionTime = Date.now() - this.startTime
    }
}

$(document).ready(() => {
    const url = 'http://localhost:3000/game.html'
    const connection = new MatchConnection()
    const game = new Game(connection)

    $('#rank-row').hide()
    $('#chart-row').hide()

    $('#startButton').on('click', () => {
        connection.startMatch()
    })

    $('#promptTitle').text("Click start to begin the game")

    const params = queryString.parse(location.search)
    let uid = shortid.generate()

    if (params.match) {
        uid = params.match
        $('#startButton').hide()
        $('#promptTitle').text("Waiting for host to start the game...")
    } else {
        $('#gameUrl').text(url + '?match=' + uid)
    }

    console.log('UID', uid)
    let texts = null
    connection.joinMatch(uid, (data) => {
        texts = new Texts(data.texts)
        
        $('#promptTitle').text("Type this text:")
        $('#startButton').hide()
        $('#gameUrl').hide()
        $('#lobby-row').hide()
        $('#players-row').hide()
        $('#gameinfo-row').hide()
        $('#chart-row').show()

        game.setText(texts.getText())
        game.countdown(() => game.start())
    }, (data) => {
        console.log("Match Done")
        game.updateTable(data)
        game.end()
    }, (data) => {
        game.updateTable(data)
    })
})