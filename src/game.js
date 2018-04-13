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
        if(text.trim() === this.currentWord.toString()) {
            this.currentWord.correct()
            return true
        } else {
            this.currentWord.incorrect()
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
        this.text = wordText

        // Build element
        this.wordElement = $('<span>', {
            text: this.text.trim() + ' '
        })
    }

    getElement$() {
        return this.wordElement
    }

    toString() {
        return this.text.trim()
    }

    incorrect(diff) {
        console.log('incorrect')
        this.wordElement.css({ 'background-color': 'rgba(244,67,54,0.5)' })
    }

    correct() {
        console.log('correct')
        this.wordElement.css({ 'background-color': 'rgba(76,175,80,0.5)' })
    }
}

$(document).ready(() => {
    const game = new Game()
    game.setText('Lose eyes get fat shew.')
})