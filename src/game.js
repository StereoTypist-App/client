const $ = require('jquery')

class Game {
    constructor() {
        this.paragraph = null
        this.numCorrect = 0
        this._wpm = 0
        this.startTime = -1
        this.textContainer = $('#promptText')
        this.wordInput = $('#typeInput')
        this.wordInput.on('input', this.valueChange)
    }

    start() {
        this.startTime = Date.now()

        // Update WPM
        const thisRef = this
        setInterval(() => {
            $('#wpm').text(thisRef.WPM.toFixed(2))
        }, 1000)
    }

    setText(rawText) {
        this.paragraph = new Paragraph(rawText)
        this.paragraph.renderTextToElement(this.textContainer)
        this.paragraph.currentWord.startClock()
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
                    thisRef.setText('new paragraph text')
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
    const game = new Game()
    game.setText('Lose eyes get fat shew.')
    game.start()
})