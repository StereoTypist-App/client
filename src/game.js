const $ = require('jquery')

class Game {
    constructor() {
        this.text = null
        this.textContainer = $('#promptText')
        this.wordInput = $('#typeInput')
        this.wordInput.on('input', this.valueChange)
    }

    setText(rawText) {
        this.text = rawText
        
        const textTokens = this.text.split(' ')
        textTokens.forEach((token) => {
            const word = new Word(token)
            this.textContainer.append(word.getElement$())
        })
    }

    get valueChange() {
        const thisRef = this
        return () => {
            console.log(thisRef.wordInput.val())
        }
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
        return this.text
    }
}

$(document).ready(() => {
    const game = new Game()
    game.setText('Lose eyes get fat shew. Winter can indeed letter oppose way change tended now. So is improve my charmed picture exposed adapted demands. Received had end produced prepared diverted strictly off man branched. Known ye money so large decay voice there to. Preserved be mr cordially incommode as an. He doors quick child an point at. Had share vexed front least style off why him.')
})