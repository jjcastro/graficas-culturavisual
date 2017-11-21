
// d3.js
// ==========================
var width = 600;
var height = 700;

var color = d3.scale.linear()
  .range(["#CBB5A0", "#C82528"]); 

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

d3.csv(bolascsv, function(data) { 

  var max = -1;

  for (var i = 0; i < data.length; i++)  {
    if (data[i].conteo > max) {
      max = data[i].conteo;
    }
  }

  color.domain([0, max]);

  var bubbledata = data.map(function(d){
        d.pais = d.pais;
        d.value = d.conteo;
        return d;
      }).filter(function(d) {
        return !isNaN(d.conteo);
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

