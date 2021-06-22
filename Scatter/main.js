const svgh=400
const svgw=600
const padding=40

const svg=d3.select('body')
            .append('svg')
            .attr('height',svgh)
            .attr('width',svgw)
          
function round(x){
	return 10*(Math.round(x/10))
}

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
.then(res=>res.json())
.then(data=>{
	console.log(data)
	
	const xScale=d3.scaleLinear()
				   .domain([round(d3.min(data,obj=>obj.Year)),
							round(d3.max(data,obj=>obj.Year))])
				   .range([padding,svgw-padding]	)
	const yScale=d3.scaleLinear()
				   .domain([d3.min(data,obj=>obj.Seconds),d3.max(data,obj=>obj.Seconds)+10])
				   .range([padding,svgh-padding])
				   
	const xAxis=d3.axisBottom(xScale)
	const yAxis=d3.axisLeft(yScale)
	
	svg.selectAll('circle')
	   .data(data)
	   .enter()
	   .append('circle')
	   .attr('cx',(d,i)=>xScale(d.Year))
	   .attr('cy',(d,i)=>yScale(d.Seconds))
	   .attr('r',5)
	   .style('fill','red !important')
	   
	
	svg.selectAll('text')
	   .data(data)
	   .enter()
	   .append('text')
	   .attr('x',(d,i)=>xScale(d.Year))
	   .attr('y',(d,i)=>yScale(d.Seconds))
	   .text((d,i)=>i)
	
	
	
	svg.append('g')
	   .attr('transform',`translate(${0},${svgh-padding})`)
	   .call(xAxis)
	
	svg.append('g')	   
	   .attr('transform',`translate(${padding},${0})`)
       .call(yAxis)
	
})