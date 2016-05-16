function makePie() {
  // From: http://bl.ocks.org/mbostock/3887235
  // Set the dimensions
  var width  = 960,
      height = 500,
      radius = Math.min(width, height) / 2;

  var totals = {};
  var color  = d3.scale.category20b();

  // variable for pie pieces
  var arc = d3.svg.arc()
      .outerRadius(radius - 10)
      .innerRadius(0);

  // D3 provides a helper function for creating the pie and slices
  var pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return totals[d]; });

  // add the pie chart to the page
  var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  // fetch the data
  $.getJSON('/residential/data', function(data) {
    totals = data.totals;
    // make each pie piece
    var g = svg.selectAll(".arc")
        .data(pie(d3.keys(totals)))
      .enter().append("g")
        .attr("class", "arc")
      .on("mouseover", function(d) {
        d3.select(this).select("text").style("font-weight", "bold")
        d3.select(this).select("text").style("font-size", "1.25em")
      })
      .on("mouseout", function(d) {
        d3.select(this).select("text").style("font-weight", "normal")
        d3.select(this).select("text").style("font-size", "1em")
      })
    ;

    // fill in the color
    g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color(d.data); });

    // put the labels outside the pie (in a new arc/circle)
    var pos = d3.svg.arc().innerRadius(radius + 20).outerRadius(radius + 20);
    g.append("text")
        .attr("transform", function(d) {
          return "translate(" + pos.centroid(d) + ")";
        })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .text(function(d) { return d.data; });
  });
}

function makeBar() {
  // From: http://bl.ocks.org/mbostock/5977197
  var margin = {top: 20, right: 20, bottom: 50, left: 50},
      width  = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var xValue = function(d) { return d.zipcode; },                  // data -> value
      xScale = d3.scale.ordinal().rangeRoundBands([0, width], .1), // value -> display
      xMap   = function(d) { return xScale(xValue(d)); },          // data -> display
      xAxis  = d3.svg.axis().scale(xScale).orient("bottom");

  var yValue = function(d) { return d.median_value; },    // data -> value
      yScale = d3.scale.linear().range([height, 0]),      // value -> display
      yMap   = function(d) { return yScale(yValue(d)); }, // data -> display
      yAxis  = d3.svg.axis().scale(yScale).orient("left");

  var svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  $.getJSON('/residential/bar_data', function(data) {
    data = data.bar_data;
    xScale.domain(data.map(xValue));
    yScale.domain([0, d3.max(data, yValue)]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .selectAll("text")
        .attr("x", 8)
        .attr("y", -5)
        .style("text-anchor", "start")
        .attr("transform", "rotate(90)");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Median Value");

    svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
       .style("fill", "blue")
        .attr("x", xMap)
        .attr("width", xScale.rangeBand)
        .attr("y", yMap)
        .attr("height", function(d) { return height - yMap(d); });
  });
}
