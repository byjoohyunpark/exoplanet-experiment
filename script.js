var margin = {
        top: 20,
        right: 40,
        bottom: 40,
        left: 40
    },
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom;

var svg = d3.select(".container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

d3.csv("./data.csv").then(function (data) {

    var x = d3.scaleLinear()
        .domain(d3.extent(data, function (d) {
            return d["P. Mean Distance (AU)"];
        }))
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add a scale for bubble size
    var z = d3.scaleLinear()
        .domain(d3.extent(data, function (d) {
            return d["P. Radius (EU)"];
        }))
        .range([2, 40]);

    // Add dots
    svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return x(d["P. Mean Distance (AU)"]);
        })
        .attr("cy", height / 2)
        .attr("r", function (d) {
            return Math.random() * 20;
        })
        .style("fill", "#69b3a2")
        .style("opacity", "0.7")
        .attr("stroke", "black")
    
});
