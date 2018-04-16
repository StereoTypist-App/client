
const $ = require('jquery')


class Chart {
    
    constructor(users) {
        this.option = {
            width: '450px',
            height: '450px',
            donut: true,
            donutWidth: 100,
            donutSolid: true,
            startAngle: 270,
            showLabel: true
        }
        this.users = users
        this.data = {
            // to display the same portion for each user in chart
            labels: this.users,
            series: [1, 1, 1, 1]
          }
        this.chart = new Chartist.Pie('.ct-chart', this.data, this.option);
    }

    updateChart(usersInfo, wpm){
        
        this.newUsers = []
        this.newSeries = []
        usersInfo.forEach(element => {
            this.newUsers.push(element.name);
            this.newSeries.push(element.wpm);
        });
        this.chart.update({labels: this.newUsers,
                           series: this.newSeries
        })
    }

}

module.exports = Chart


