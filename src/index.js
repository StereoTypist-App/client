const $ = require('jquery')
const Match = require('./models/match')

function updateTable(tableData) {    
    $('#games-tbody').empty()

    if(!tableData) return

    tableData.forEach((match) => {
        const tr = $(`
            <tr>
                <td scope="row">
                    <i class="fa fa-gamepad font-weight-bold ml-1"></i>
                </td>
                <td class="hidden-md-down">${match.id}</td>
                <td>${match.count}</td>
                <td>
                    <a href="${"/game.html?match=" + match.id}" class="btn btn-sm btn-outline-indigo">JOIN</a>
                </td>
            </tr>
        `)

        tr.appendTo($('#games-tbody'))
    })
}

$(document).ready(() => {
    const match = new Match()

    match.getMatches((matchData) => {
        console.log('Open matches: ', matchData)
        updateTable(matchData)
    })
})