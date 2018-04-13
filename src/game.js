const $ = require('jquery')
const Queue = require('./queue')

class Game {
    constructor() {
        this.paragraph = null
        this.textContainer = $('#promptText')
        this.wordInput = $('#typeInput')
        this.wordInput.on('input', this.valueChange)
    }

    setText(rawText) {
        this.paragraph = new Paragraph(rawText)
        this.paragraph.renderTextToElement(this.textContainer)
    }

    get valueChange() {
        const thisRef = this
        return () => {
            if (thisRef.paragraph.checkWord(thisRef.wordInput.val())) {
                const next = thisRef.paragraph.nextWord()
                thisRef.wordInput.val(null)

                if (!next) {
                    this.paragraph = new Paragraph('new paragraph text')
                    this.paragraph.renderTextToElement(this.textContainer)
                }
            }
        }
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
            this.currentWord.correct()
            return true
        } else {
            this.currentWord.incorrect(text)
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

    incorrect(incorrectText) {
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

    correct() {
        for (let key in this.letterMap$) {
            this.letterMap$[key].css({ 'background-color': 'transparent' })
        }
        this.wordElement.css({ 'background-color': 'rgba(76,175,80,0.5)' })
    }
}

$(document).ready(() => {
    const game = new Game()
    game.setText('Lose eyes get fat shew.')
})