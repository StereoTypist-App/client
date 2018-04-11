const $ = require('jquery')

class Game {
    constructor() {
        console.log($(document))
    }
}

$(document).ready(() => {
    new Game()
})