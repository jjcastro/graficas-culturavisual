d3.csv("bars.csv", function(data) { 
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
    d["obras"] = +d["obras"];
  });

  // Scale the range of the data
  x.domain(data.map(function (d) { return d["tema"]; }));
  y.domain([0, d3.max(data, function (d) { return d["obras"]; })]);

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
      .style("fill", function (d) { return colors(d["obras"]) } )
      .attr("x", function (d) { return 0; })
      .attr("width", function (d) { return y(d["obras"]); } )
      .attr("y", function (d) { return x(d["tema"]); })
      .attr("height", x.rangeBand() )

  .on("mouseover", function(d) {      
        div.transition()        
          .duration(200)      
          .style("opacity", .9);   

        div.select("h3")
          .text(d["obras"]);
        div.select("p")
          .text(d["tema"]);
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
})