let x, x2, y, y2, xScale, xAxis2;
let brush, zoom, focus, context, points, points2;

let svg = d3.select(".container").append("svg")
    .attr("width", window.innerWidth)
    .attr("height", window.innerHeight * 0.8);

let svg2 = d3.select(".indicator").append("svg")
    .attr("width", window.innerWidth)
    .attr("height", window.innerHeight * 0.2);

let margin = {
        top: 20,
        right: 40,
        bottom: 20,
        left: 40
    },
    margin2 = {
        top: 20,
        right: 40,
        bottom: 20,
        left: 40
    };

let width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    height2 = 100;


//d3.csv("./data.csv").then(function (originalData) {
//    let data = originalData.filter(function (el) {
//        return el["P. Mean Distance (AU)"] != "" && el["P. Radius (EU)"] != "";
//    });
//    //    data.map(d => d["P. Radius (EU)"] = Math.pow(d["P. Radius (EU)"], 2) / 20);
//    console.log(data);
//
//    init(data);
//
//});



let data = [];
for (let i = 0; i < 300; i++) {
    let test = {
        "distance": Math.random() * 2000,
        "radius": Math.random() * 2,
        "tag": null
    }
    data.push(test);
}

init(data);

function init(data) {

    x = d3.scaleTime().range([0, width]);
    x2 = d3.scaleTime().range([0, width]);
    y = d3.scaleLinear().range([height, 0]);
    y2 = d3.scaleLinear().range([height2, 0]);


    //    let max = d3.max(data.map(function (d) {
    //        return d["P. Mean Distance (AU)"];
    //    }));
    //    console.log(max);

    xScale = d3.scaleLinear()
        .range([0, width])
        .domain(d3.extent(data, function (d) {
            //            return d["P. Mean Distance (AU)"];
            return d.distance;
        }));
    xScale2 = d3.scaleLinear()
        .range([0, width])
        .domain(xScale.domain());

    //xScale.domain(d3.extent(data, function (d) {
    //    return d.distance;
    //}));
    //xScale2.domain(xScale.domain());


    //     let xAxis = d3.axisBottom(xScale);
    xAxis2 = d3.axisBottom(xScale2);
    //     let yAxis = d3.axisLeft(y);


    brush = d3.brushX()
        .extent([
                [0, 0],
                [width, height2]
            ])
        .on("brush end", brushed);

    zoom = d3.zoom()
        .scaleExtent([1, 40])
        .translateExtent([
                [0, 0],
                [width, height]
            ])
        .extent([
                [0, 0],
                [width, height]
            ])
        .on("zoom", zoomed);


    svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

    focus = svg.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    context = svg2.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");




    points = focus.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return xScale(d.distance);
            //            return xScale(d["P. Mean Distance (AU)"]);
        })
        .attr("cy", height / 2)
        .attr("r", function (d) {
            return d.radius;
            //            return d["P. Radius (EU)"];
        });


    points2 = context.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return xScale2(d.distance);
            //            return xScale2(d["P. Mean Distance (AU)"]);
        })
        .attr("cy", height2 / 2)
        .attr("r", function (d) {
            return d.radius;
            //            return d["P. Radius (EU)"];
        });


    context.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxis2);

    context.append("g")
        .attr("class", "brush")
        .call(brush)
        .call(brush.move, xScale.range());

    svg.append("rect")
        .attr("class", "zoom")
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(zoom);


}



function brushed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
    let s = d3.event.selection || xScale2.range();
    xScale.domain(s.map(xScale2.invert, xScale2));

    update();

    svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
        .scale(width / (s[1] - s[0]))
        .translate(-s[0], 0));

}

function zoomed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
    let t = d3.event.transform;
    xScale.domain(t.rescaleX(xScale2).domain());

    update();

    context.select(".brush").call(brush.move, xScale.range().map(t.invertX, t));
}


function update() {
    let selection = d3.select(".selection").attr("width");
    points
        .attr("cx", function (d) {
            return xScale(d.distance);
            //            return xScale(d["P. Mean Distance (AU)"]);
        })
        .attr("r", function (d) {
            return selection == null ? d.radius : Math.min(d.radius * width / selection, 100)
        })
}
