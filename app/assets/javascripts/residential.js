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

function makeScatter() {
  // From http://bl.ocks.org/weiglemc/6185069
  var margin = {top: 20, right: 20, bottom: 100, left: 150},
      width  = 960,
      height = 500 - margin.top - margin.bottom;

  /*
   * value accessor - returns the value to encode for a given data object.
   * scale - maps value to a visual display encoding, such as a pixel position.
   * map function - maps from data value to display value
   * axis - sets up axis
   */

  // setup x
  var xValue = function(d) { return d.total_sales;},     // data -> value
      xScale = d3.scale.linear().range([0, width]),      // value -> display
      xMap   = function(d) { return xScale(xValue(d));}, // data -> display
      xAxis  = d3.svg.axis().scale(xScale).orient("bottom");

  // setup y
  var yValue = function(d) { return d.median_value;},    // data -> value
      yScale = d3.scale.linear().range([height, 0]),     // value -> display
      yMap   = function(d) { return yScale(yValue(d));}, // data -> display
      yAxis  = d3.svg.axis().scale(yScale).orient("left");

  // setup fill color
  var cValue = function(d) { return d.jurisdiction;},
      color  = d3.scale.category20b();

  // add the graph canvas to the body of the webpage
  var svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // add the tooltip area to the webpage
  var tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  $.getJSON('/residential/scatter_data', function(data) {
    data = data.scatter_data;

    // don't want dots overlapping axis, so add in buffer to data domain
    xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
    yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

    // x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Total Sales");

    // y-axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Median Value");

    // draw dots
    svg.selectAll(".dot")
        .data(data)
      .enter().append("circle")
        .attr("class", function(d) {
          return "dot " + cValue(d).replace(/\W+/g, "");
        })
        .attr("r", 3.5)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .style("fill", function(d) { return color(cValue(d));})
        .on("mouseover", function(d) {
            tooltip.transition()
                 .duration(200)
                 .style("opacity", .9);
            tooltip.html(d.zipcode + "<br/> (" + xValue(d)
            + ", $" + yValue(d) + ")")
                 .style("left", (d3.event.pageX + 5) + "px")
                 .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                 .duration(500)
                 .style("opacity", 0);
        });

    // draw legend
    var legend = svg.selectAll(".legend")
        .data(color.domain())
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {
          numCols = 8;
          xOff = (i % numCols) * 120 + 50;
          yOff = Math.floor(i / numCols) * 20
          return "translate(" + xOff + "," + yOff + ")"
        });

    // draw legend colored rectangles
    legend.append("rect")
        .attr("x", margin.left - 100)
        .attr("y", height + margin.top)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color)
        .on("mouseover", function(d, i) {
          name = d.replace(/\W+/g, "")
          $('.dot').hide();
          $('.' + name).show();
        })
        .on("mouseout", function(d, i) {
          $('.dot').show(1);
        });

    // draw legend text
    legend.append("text")
        .attr("x", margin.left - 105)
        .attr("y", height + 29)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; })
  });
}

// Returns a function to compute the interquartile range.
function iqr(k) {
  return function(d, i) {
    var q1 = d.quartiles[0],
        q3 = d.quartiles[2],
        iqr = (q3 - q1) * k,
        i = -1,
        j = d.length;
    while (d[++i] < q1 - iqr);
    while (d[--j] > q3 + iqr);
    return [i, j];
  };
}
function makeBoxplot() {
  // From: http://bl.ocks.org/mbostock/4061502
  // From: http://bl.ocks.org/jensgrubert/7789216
  var margin = {top: 30, right: 50, bottom: 95, left: 50},
      width  = 900 - margin.left - margin.right;
      height = 450 - margin.top - margin.bottom,
      min    = Infinity,
      max    = -Infinity,
      labels = false; // show the text labels beside individual boxplots?

  $.getJSON('/residential/scatter_data', function(d) {
    // map-reduce (transform) the data!
    // Create arrays of median values for each jurisdiction
    data = d.scatter_data.reduce(function(accum, obj) {
      indices = accum.map(function(arr) { return arr[0]; });
      idx = indices.indexOf(obj.jurisdiction);
      value = +obj.median_value;
      if (idx > -1) {
        accum[idx][1].push(value);
      } else {
        accum.push([obj.jurisdiction, [value]]);
      }
      if (value > max) { max = value; }
      if (value < min) { min = value; }
      return accum;
    }, []);

    var chart = d3.box()
      .whiskers(iqr(1.5))
      .height(height)
      .domain([min, max])
      .showLabels(labels);

    var svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("class", "box")
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // the x-axis
    var x = d3.scale.ordinal()
      .domain( data.map(function(d) { return d[0] } ) )
      .rangeRoundBands([0 , width], 0.7, 0.3);

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

    // the y-axis
    var y = d3.scale.linear()
      .domain([min, max])
      .range([height + margin.top, 0 + margin.top]);

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

    // draw the boxplots
    svg.selectAll(".box")
        .data(data)
      .enter().append("g")
      .attr("transform", function(d) { return "translate(" +  x(d[0])  + "," + margin.top + ")"; } )
        .call(chart.width(x.rangeBand()));

    // add a title
    svg.append("text")
       .attr("x", (width / 2))
       .attr("y", 0 + (margin.top / 2))
       .attr("text-anchor", "middle")
       .style("font-size", "18px")
       //.style("text-decoration", "underline")
       .text("Median Home Sale Value By Jurisdiction");

    // draw y axis
    svg.append("g")
       .attr("class", "y axis")
       .call(yAxis);

    // draw x axis
    svg.append("g")
       .attr("class", "x axis")
       .attr("transform", "translate(0," + (height  + margin.top) + ")")
       .call(xAxis)
     .selectAll("text")
       .attr("x", -5)
       .attr("y", 5)
       .style("text-anchor", "end")
       .attr("transform", "rotate(-45)");
  });
}
