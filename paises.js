
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

d3.csv("total.csv", function(datatotal) { 
  d3.csv(paisescsv, function(data) { 

    d3.json("../../map.geojson", function(json) {

      var max = -1;

      for (var i = 0; i < data.length; i++) {
        var dataName = data[i].pais;
        var dataValue = data[i].conteo;

        var match = false;
        for (var j = 0; j < json.features.length && !match; j++)  {
          var jsonName = json.features[j].properties.sovereignt;
          if (dataName == jsonName) {
            match = true;
            json.features[j].properties.conteo = dataValue;
          }
        }

        if (!match) {
          data.splice(i, 1);
          i--;
        }
      }

      for (var i = 0; i < datatotal.length; i++) {
        var dataName = datatotal[i].pais;
        var dataValue = datatotal[i].conteo;

        var match = false;
        for (var j = 0; j < json.features.length && !match; j++)  {
          var jsonName = json.features[j].properties.sovereignt;
          if (dataName == jsonName) {
            match = true;
            var val = json.features[j].properties.conteo;
            var pct = val / dataValue * 100;
            json.features[j].properties.conteo = Math.floor(pct * 100) / 100;
            
            if (json.features[j].properties.conteo > max) {
              max = json.features[j].properties.conteo;
            }
          }
        }

        if (!match) {
          datatotal.splice(i, 1);
          i--;
        }
      }

      color.domain([0, max]);
          
      svg.selectAll("path")
        .append("div")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("stroke", "#fff")
        .style("stroke-width", "1.5")
        .style("fill", function(d) {

        var value = d.properties.conteo;
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
          .text(d.properties.conteo);
        div
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })   
       
      .on("mouseout", function(d) {       
        div.transition()
          .duration(500)
          .style("opacity", 0);   
      }); 

      var bubbledata = json.features.map(function(d){
        d.pais = d.properties.sovereignt;
        d.value = d.properties.conteo;
        return d;
      }).filter(function(d) {
        return !isNaN(d.properties.conteo);
      });

      var nodes = bubble.nodes({children:bubbledata}).filter(function(d) { return !d.children; });

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
          .text(d["value"]);
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
  });
});

