d3.csv("bars.csv", function(data) { 
    // ====================

  var colors = d3.scale.category20();

  var extramargin = 0;
  var maxWidth = -1;
  var maxWidthSuper = -1;

  d3.select("body")
    .append("svg")
    .append('g')
    .selectAll('.dummyText')
    .data(data)
    .enter()
    .append("text")
    .text(function(d) { return d["tema"]})
    .each(function(d,i) {
        var width = this.getComputedTextLength();
        if (width > maxWidth) {
          maxWidth = width;
        }
    })
    .text(function(d) { return d["supertema"]})
    .each(function(d,i) {
        var width = this.getComputedTextLength();
        if (width > maxWidthSuper) {
          maxWidthSuper = width;
        }
    })

    extramargin = maxWidthSuper + maxWidth;

    d3.selectAll("svg").remove();

  var margin = { top: 30, right: 40, bottom: 30, left: 50 + extramargin },
  width = 900 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

  var x = d3.scale.ordinal().rangeBands([0, height], .5); // <-- to change the width of the columns, change the .09 at the end to whatever
  var y = d3.scale.linear().range([0, width]);

  var xAxis = d3.svg.axis().scale(x)
    .orient("left").tickSize(0);

  var div = d3.select("body")
  .append("div")   
  .attr("class", "tooltip")               
  .style("opacity", 0);

    // Tooltip
  d3.select("div.tooltip")
    .append("h3");
  d3.select("div.tooltip")
    .append("p");

  var yAxisLeft = d3.svg.axis().scale(y)
    .orient("top");

  var svg3 = d3.select("body")
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + (width + margin.left + margin.right)+ " " + (height + margin.top + margin.bottom))
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  // Get the data
  data.forEach(function (d) {
    d["obras"] = +d["obras"];
  });

  // Scale the range of the data
  x.domain(data.map(function (d) { return d["supertema"] + d["tema"]; }));
  y.domain([0, d3.max(data, function (d) { return d["obras"]; })]);

  svg3.append("g")
      .attr("class", "x axis")
      // .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  // // Add the Y Axis
  svg3.selectAll("g.x")
      .selectAll('text')
      .style('text-anchor', 'start')
      .attr("x", -1 * (maxWidth + 10))
      .text(function(d,i) { return data[i]["tema"]});
      
  var currentST = "";
  svg3.selectAll("g.x")
      .selectAll('g.tick')
      .append('text')
      .attr("x", -1 * (maxWidth + maxWidthSuper + 30))
      .attr("y", ".32em")
      .text(function(d,i) {
        var tema = data[i]["supertema"];
        if(tema !== currentST) {
          currentST = tema;
          return tema;
        } else {
          return "";
        }
      });

  // Draw the bars
  svg3.selectAll("bar")
      .data(data)
      .enter()
      .append("rect")
      .style("fill", function (d) { return colors(d["obras"]) } )
      .attr("x", function (d) { return 0; })
      .attr("width", function (d) { return y(d["obras"]); } )
      .attr("y", function (d) { return x(d["supertema"] + d["tema"]); })
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
