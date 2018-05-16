d3.csv("data.csv", function(data) { 
    // ====================

  var colors = d3.scale.category20();

  var margin = { top: 30, right: 40, bottom: 30, left: 200 },
  width = 500 - margin.left - margin.right,
  height = 900 - margin.top - margin.bottom;

  var x = d3.scale.ordinal().rangeBands([0, width], .5); // <-- to change the width of the columns, change the .09 at the end to whatever
  var y = d3.scale.linear().range([0, height]);

  var xAxis = d3.svg.axis().scale(x)
    .orient("left");

  var yAxisLeft = d3.svg.axis().scale(y)
    .orient("top");

  var svg3 = d3.select("body")
    .append("svg")
    .attr("width", height + margin.left + margin.right)
    .attr("height", width + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  // Get the data
  data.forEach(function (d) {
    d["val1"] = +d["val1"];
  });

  var max = d3.max(data, function (d) { return d["val1"]; });

  // Scale the range of the data
  x.domain(data.map(function (d) { return d["nombre"]; }));
  y.domain([-max, max]);

  // Add the X Axis
  svg3.append("g")
      .attr("class", "x axis")
      // .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  // Add the Y Axis
  svg3.append("g")
      .attr("class", "y axis")
      .style("fill", "steelblue")
      .call(yAxisLeft);

  // Draw the bars
  svg3.selectAll("bar")
      .data(data)
      .enter()
      .append("rect")
      .style("fill", function (d) { return colors(d["val1"]) } )
      .attr("x", function (d) { return y(0); })
      .attr("width", function (d) { return y(d["val1"])/2; } )
      .attr("y", function (d) { return x(d["nombre"]); })
      .attr("height", x.rangeBand() )

    svg3.selectAll("bar")
      .data(data)
      .enter()
      .append("rect")
      .style("fill", function (d) { return colors(d["val2"]) } )
      .attr("x", function (d) { return y(0) - y(d["val2"])/2; })
      .attr("width", function (d) { return y(d["val2"])/2; } )
      .attr("y", function (d) { return x(d["nombre"]); })
      .attr("height", x.rangeBand() )

  .on("mouseover", function(d) {      
        div.transition()        
          .duration(200)      
          .style("opacity", .9);   

        div.select("h3")
          .text(d["val1"]);
        div.select("p")
          .text(d["nombre"]);
        div
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
  .on("mouseout", function(d) {       
        div.transition()
          .duration(500)
          .style("opacity", 0);   
      }); 

  });