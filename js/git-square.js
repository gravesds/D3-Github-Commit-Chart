var chart_data = [];
var rollup_data = [];

var svgHeight = 600,
    svgWidth = 960,
    margin = { top: 40, right: 20, bottom: 40, left: 40 },
    height = svgHeight - margin.top - margin.bottom,
    width = svgWidth - margin.left - margin.right;

var xValue = function(d) { return d.comm_date; },
    xScale = d3.scaleTime().range([0, width]),
    xMap = function(d) { return xScale(xValue(d)); },
    xAxis = d3.axisBottom().scale(xScale).ticks(10);

var yValue = function(d) { return d.commits; },
    yScale = d3.scaleLinear().range([height, 0]),
    yMap = function(d) { return yScale(yValue(d)); },
    yAxis = d3.axisLeft().scale(yScale).ticks(10);

var svg = d3.select('.chart')
    .attr('height', svgHeight)
    .attr('width', svgWidth).append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

svg.append('g')
    .attr('class','xaxis')
    .attr('transform','translate(0,' + height + ')');

svg.append('g')
    .attr('class','yaxis');

d3.csv("http://localhost:8000/commits.csv", function(d,i) { 
        return { row: i,
                 comm_date: new Date(d.date),
                 commits: +d.commits};
})
    .then( function(data) { 
        
        chart_data = data;
        rollup_data = update_data(chart_data);

        xScale.domain([d3.min(data, xValue), d3.max(data, xValue)]);
        yScale.domain([0, d3.max(data, yValue)+20]);

    svg.selectAll('.dot')
        .data(data).enter().append('circle')
            .attr('class','dot')
            .attr('cx', xMap)
            .attr('cy', yMap)
            .attr('r', 4)
            .attr('fill','steelblue');

    svg.select('.xaxis').call(xAxis);
    svg.select('.yaxis').call(yAxis);

    

        

    })
    .catch( function(err) { console.log(err); });

var update_data = function(data) {
    var rolledup = d3.nest()
        .key( function(d) { 
            var result = new Date(d.comm_date);
            result.setDate(result.getDate() - d.comm_date.getDay());
            return result; })
        .key( function(d) { return d.comm_date.getDay(); })
        .rollup( function (v) { return d3.sum(v, function(d) { return d.commits; }); })
        .entries(data);

    return rolledup;
}

