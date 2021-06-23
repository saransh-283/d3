const xlabel = $('#xlabel')
const tooltip = $('#tooltip')
const legend = $('#legend')
const svgh = 500
const svgw = 1500
const padding = 70
const colors = ['#2b6999',
    '#3c97da',
    '#9ecbec',
    '#ffceaa',
    '#fe9c52',
    '#b36e3a'
]

tooltip.css('display', 'none')

const svg = d3.select('#graph')
    .append('svg')
    .attr('height', svgh)
    .attr('width', svgw)

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function round(x) {
    return Math.round((x) * 10) / 10
}

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
    .then(res => res.json())
    .then(data => {
        console.log(data)

        const years = Array.from(new Set(data.monthlyVariance.map(obj => obj.year)))

        const xScale = d3.scaleBand()
            .domain(years)
            .range([padding, svgw - padding])
        const xScaleDisplay = d3.scaleLinear()
            .domain([d3.min(years), d3.max(years)])
            .range([padding, svgw - padding])
        const yScale = d3.scaleBand()
            .domain(monthNames)
            .range([padding, svgh - padding])
        const colorScale = d3.scaleQuantize()
            .domain([
                d3.min(data.monthlyVariance, obj => obj.variance),
                d3.max(data.monthlyVariance, obj => obj.variance)
            ])
            .range(colors)



        const yAxis = d3.axisLeft(yScale)
        const xAxisDisplay = d3.axisBottom(xScaleDisplay)

        const rects = svg.selectAll('rect')
            .data(data.monthlyVariance)
            .enter()
            .append('rect')
            .attr('class', 'cell')
            .attr('data-month', d => d.month - 1)
            .attr('data-year', d => d.year)
            .attr('data-temp', d => data.baseTemperature + d.variance)
            .attr("x", function(d) {
                return xScale(d.year)
            })
            .attr("y", function(d) {
                return yScale(monthNames[d.month - 1])
            })
            .attr("width", xScale.bandwidth())
            .attr("height", yScale.bandwidth())
            .style("fill", function(d) {
                return colorScale(d.variance)
            })
            .attr('stroke', 'black')
            .attr('stroke-width', .1)

        rects.on('mouseenter', (e, d) => {
            tooltip.css({
                'display': 'unset',
                'top': `${e.clientY+10}px`,
                'left': `${e.clientX+10}px`
            })
            var html = `<p>${d.year} - ${monthNames[d.month]}</p>
            <p>${round(data.baseTemperature+d.variance)}&deg;C</p>
            <p>${d.variance>0?`+${round(d.variance)}`:`${round(d.variance)}`}&deg;C</p>`
            tooltip.html(html)
            tooltip.attr('data-year', d.year);
        })

        rects.on('mouseleave', (e, d) => {
            tooltip.css('display', 'none')
        })

        svg.append('g')
            .attr('transform', `translate(${0},${svgh-padding})`)
            .attr('id', 'x-axis')
            .call(xAxisDisplay)

        svg.append('g')
            .attr('transform', `translate(${padding},${0})`)
            .attr('id', 'y-axis')
            .call(yAxis)

        const xaxis = document.querySelector('#x-axis').getBoundingClientRect()

        xlabel.css({
            'top': `${xaxis.top-50}px`,
            'left': `${xaxis.width/2}px`
        })

        var xticks = Array.from(document.querySelectorAll('#x-axis g text'))
        xticks.map((elem, idx) => elem.innerHTML = elem.innerHTML.split(',').join(''))
    })