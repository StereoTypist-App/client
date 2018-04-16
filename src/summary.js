
const Chart = require('./models/chart')
const $ = require('jquery')

let users = ['bob', 'amy', 'andy', 'zet']

const chart = new Chart(users)

$(document).ready(() => {
   
	
	 

	  let newSeries = [{ name: 'user1', wpm: 50},
	  { name: 'user2', wpm: 40},{ name: 'user3', wpm: 30},{ name: 'user4', wpm: 10}]
	  setTimeout(()=>{
		chart.updateChart(newSeries,55)
	  },2000)
})


