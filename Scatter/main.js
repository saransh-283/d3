const svgh = 500
const svgw = 700
const padding = 50
const tooltip = document.getElementById("tooltip");
const legends = document.getElementById('legend')
const title = document.getElementById('title')
const xlabel = document.getElementById('xlabel')
const ylabel = document.getElementById('ylabel')

tooltip.style.display = 'none'


const svg = d3.select('#graph')
    .append('svg')
    .attr('height', svgh)
    .attr('width', svgw)

legends.style.top = `${svgh-200}px`
legends.style.left = `${svgw-100}px`

function round(x) {
    return 10 * (Math.round(x / 10))
}

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
    .then(res => res.json())
    .then(data => {
        console.log(data)

        const xScale = d3.scaleLinear()
            .domain([round(d3.min(data, obj => obj.Year)),
                round(d3.max(data, obj => obj.Year))
            ])
            .range([padding, svgw - padding])
        const yScale = d3.scaleLinear()
            .domain([d3.min(data, obj => obj.Seconds), d3.max(data, obj => obj.Seconds) + 10])
            .range([padding, svgh - padding])

        const xAxis = d3.axisBottom(xScale)
        const yAxis = d3.axisLeft(yScale)

        var circle = svg.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', (d, i) => xScale(d.Year))
            .attr('cy', (d, i) => yScale(d.Seconds))
            .attr('r', 5)
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .attr("style", (d, i) => `fill:${d.Doping?'rgb(101, 158, 243)':'rgb(216, 81, 99)'};opacity:.9`)
            .attr('class', 'dot')
            .attr('data-xvalue', (d, i) => (d.Year))
            .attr('data-yvalue', (d, i) => (d.Time.split('').slice(0, 3).join('')))

        circle.on("mouseenter", (e, d) => {
            tooltip.innerHTML = `
			<p>${d.Name}; ${d.Nationality}</p>
			<p>Year: ${d.Year}; Time: ${d.Time}</p>
			${d.Doping?`
			<p>&nbsp;</p>
			<p>${d.Doping}</p>
			`:``}
			`;
            tooltip.style.top = `${e.target.getBoundingClientRect().top+10}px`;
            tooltip.style.left = `${e.target.getBoundingClientRect().left+10}px`;
            tooltip.style.zIndex = 1000
            tooltip.style.display = 'block';
            tooltip.setAttribute('data-year', e.target.getAttribute('data-xvalue'))
        });

        circle.on("mouseleave", (d, i) => {
            tooltip.style.display = 'none';
        })

        svg.append('g')
            .attr('transform', `translate(${0},${svgh-padding})`)
            .attr('id', 'x-axis')
            .call(xAxis)

        svg.append('g')
            .attr('transform', `translate(${padding},${0})`)
            .attr('id', 'y-axis')
            .call(yAxis)

        const xaxis = document.getElementById('x-axis').getBoundingClientRect()
        const yaxis = document.getElementById('y-axis').getBoundingClientRect()

        xlabel.style.top = `${xaxis.top-20}px`
        xlabel.style.left = `${xaxis.width/2}px`

        ylabel.style.top = `${(yaxis.top+yaxis.height)/2}px`
        ylabel.style.left = `${(yaxis.width/2)-10}px`

        var xticks = Array.from(document.querySelectorAll('#x-axis g text'))
        xticks.map((elem, idx) => elem.innerHTML = data[idx].Year)

        var yticks = Array.from(document.querySelectorAll('#y-axis g text'))
        yticks.map((elem, idx) => elem.innerHTML = data[idx].Time)
    })