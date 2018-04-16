
const $ = require('jquery')


class Chart {
    constructor(users) {
        this.option = {
            // width: '450px',
            // height: '450px',
            // donut: true,
            // donutWidth: 60,
            // donutSolid: true,
            // startAngle: 0,
            distributeSeries: true
        }
        this.series = []
        // to display the same portion for each user in the beginning
        users.forEach(user => {
            this.series.push(1);
        })
        this.users = users.map((userObj) => { return userObj.name })
        this.data = {
            labels: this.users,
            series: this.series
        }
        this.chart = new Chartist.Bar('.ct-chart', this.data, this.option);
    }

    updateChart(usersInfo, wpm) {
        this.newUsers = []
        this.newSeries = []
        usersInfo.forEach(userInfo => {
            this.newUsers.push(userInfo.name);
            this.newSeries.push(userInfo.wpm);
        });
        this.chart.update({
            labels: this.newUsers,
            series: this.newSeries
        })
        $('#changewpm').text(wpm);
    }
}

module.exports = Chart


