//Bar API
const req = new XMLHttpRequest()
req.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
req.send()
req.onload = () => {
	const json = JSON.parse(req.responseText)
	console.log(json)

	const xScale = d3.scaleLinear()
		.domain([0, json.data.length])
		.range([0, svgw - yPad - 10])

	const yScale = d3.scaleLinear()
		.domain([0, d3.max(json.data, row => row[1])])
		.range([svgh - xPad - 30, 0])

	const xAxis = d3.axisBottom(xScale)
	const yAxis = d3.axisLeft(yScale)

	svg.selectAll('rect')
		.data(json.data)
		.enter()
		.append('rect')
		.attr('height', (d, i) => svgh - yScale(d[1]) - yPad)
		.attr('width', 1)
		.attr('x', (d, i) => yPad + xScale(i))
		.attr('y', (d, i) => yScale(d[1]) + 20)


	svg.append('g')
		.attr('transform', `translate(${yPad}, ${svgh-xPad})`)
		.call(xAxis)

	svg.append('g')
		.attr('transform', `translate(${yPad},${xPad})`)
		.call(yAxis)
}




// Bar Graph d3
const svgh = 400
const svgw = 600
const xPad = 30
const yPad = 50

const svg = d3.select('body').append('svg').attr('height', svgh).attr('width', svgw)