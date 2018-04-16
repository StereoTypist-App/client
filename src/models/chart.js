
const $ = require('jquery')


class Chart {
    
    constructor() {
        this.option = {
            width: '450px',
            height: '450px',
            donut: true,
            donutWidth: 100,
            donutSolid: true,
            startAngle: 270,
            showLabel: true
        }
        this.data = {
            // to display the same portion for each user in chart
            labels: [],
            series: [1, 1, 1, 1]
          }
        this.chart = new Chartist.Pie('.ct-chart', this.data, this.option);
    }

    updateChart(usersInfo, wpm){
        this.newUsers = []
        this.newSeries = []
        // for (userInfo of usersInfo) {
        //     this.newUsers.push(userInfo.name);
        //     this.newSeries.push(userInfo.wpm);
        // }
        usersInfo.forEach(element => {
            this.newUsers.push(element.name);
            this.newSeries.push(element.wpm);
        });
        this.chart.update({labels: this.newUsers,
                        series: this.newSeries})
    }
}

module.exports = Chart


