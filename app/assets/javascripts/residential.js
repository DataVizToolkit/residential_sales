$(function() {
  // From: http://bl.ocks.org/mbostock/3887235
  // Set the dimensions
  var width  = 960,
      height = 500,
      radius = Math.min(width, height) / 2;

  var totals = {};
  var color  = d3.scale.category20c();

  // variable for pie pieces
  var arc = d3.svg.arc()
      .outerRadius(radius - 10)
      .innerRadius(0);

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
        .attr("class", "arc");

    // fill in the color
    g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color(d.data); });

    // add the jurisdiction name
    g.append("text")
      .attr("transform", function(d) {
        return "translate(" + arc.centroid(d) + ")";
       })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.data; });
  });
});
