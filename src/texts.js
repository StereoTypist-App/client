module.exports = class Texts {
    constructor(textArray) {
        this.texts = textArray
        this.textIndex = 0
    }

    getText() {
        return this.texts[this.textIndex++ % this.texts.length]
    }
}