
// dropcaps
// ==========================
var dropcaps = document.querySelectorAll(".dropcap");
window.Dropcap.layout(dropcaps, 2);


// d3.js
// ==========================
var width = 600;
var height = 700;

var projection = d3.geo.mercator()
  .translate( [750, 250])
  .scale([350]);
var path = d3.geo.path().projection(projection);

var color = d3.scale.linear()
  .range(["#CBB5A0", "#C82528"]); 

var svg = d3.select("div#maps")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Tooltip
var div = d3.select("body")
  .append("div")   
  .attr("class", "tooltip")               
  .style("opacity", 0);

// Tooltip
d3.select("div.tooltip")
  .append("h3");
d3.select("div.tooltip")
  .append("p");

var diameter = 500;

var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5);

var svg2 = d3.select("div#maps")
    .append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");

d3.csv("maps.csv", function(data) { 

  d3.json("map.geojson", function(json) {

    for (var i = 0; i < data.length; i++) {
      var dataName = data[i].pais;
      var dataValue = data[i].normalizado;

      var match = false;
      for (var j = 0; j < json.features.length && !match; j++)  {
        var jsonName = json.features[j].properties.sovereignt;
        if (dataName == jsonName) {
          match = true;
          json.features[j].properties.normalizado = dataValue;
        }
      }

      if (!match) {
        data.splice(i, 1);
        i--;
      }
    }

    color.domain([0, 24]);
        
    svg.selectAll("path")
      .append("div")
      .data(json.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("stroke", "#fff")
      .style("stroke-width", "1.5")
      .style("fill", function(d) {

      var value = d.properties.normalizado;
      console.log("a");

      if (value) {
        return color(value);
      } else {
        return "rgb(213,222,217)";
      }

    })

    .on("mouseover", function(d) {      
      div.transition()        
        .duration(200)      
        .style("opacity", .9);   

      div.select("h3")
        .text(d.properties.sovereignt);
      div.select("p")
        .text(d.properties.normalizado);
      div
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
    })   
     
    .on("mouseout", function(d) {       
      div.transition()
        .duration(500)
        .style("opacity", 0);   
    }); 

    data = data.map(function(d){ d.value = +d["normalizado"]; return d; });

    var nodes = bubble.nodes({children:data}).filter(function(d) { return !d.children; });

    var bubbles = svg2.append("g")
        .attr("transform", "translate(0,0)")
        .selectAll(".bubble")
        .data(nodes)
        .enter();

    bubbles.append("circle")
        .attr("r", function(d){ return d.r; })
        .attr("cx", function(d){ return d.x; })
        .attr("cy", function(d){ return d.y; })
        .style("fill", function(d) { return color(d.value); })

    .on("mouseover", function(d) {      
      div.transition()        
        .duration(200)      
        .style("opacity", .9);   

      div.select("h3")
        .text(d["pais"]);
      div.select("p")
        .text(d["normalizado"]);
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
