const $ = require('jquery')

$(document).ready(() => {

    new Chartist.Pie('.ct-chart', {
        labels: ['a', 'b', 'c', 'd'],
        series: [20, 10, 35, 40]
      }, {
        donut: true,
        donutWidth: 60,
        donutSolid: true,
        startAngle: 270,
        showLabel: true
      });
      

    console.log('hi');
})