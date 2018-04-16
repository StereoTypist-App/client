
const $ = require('jquery')


$(document).ready(() => {
   
	chart = new Chartist.Pie('.ct-chart', {
		series: [20, 10, 30, 40]
	  }, {
		donut: true,
		donutWidth: 60,
		donutSolid: true,
		startAngle: 270,
		showLabel: true
	  });
	 
	  newSeries = [50,20,10,20]
	  setTimeout(()=>{
		chart.update({series: newSeries})
	  },5000)
})


