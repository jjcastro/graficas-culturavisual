
var nombres = {};
nombres["United States"] = "Estados Unidos";
nombres["Argentina"] = "Argentina";
nombres["Bolivia"] = "Bolivia";
nombres["Brazil"] = "Brasil";
nombres["Chile"] = "Chile";
nombres["Colombia"] = "Colombia";
nombres["Costa Rica"] = "Costa Rica";
nombres["Cuba"] = "Cuba";
nombres["Dominican Rep."] = "Rep. Dominicana";
nombres["Ecuador"] = "Ecuador";
nombres["Guatemala"] = "Guatemala";
nombres["Haiti"] = "Haiti";
nombres["Honduras"] = "Honduras";
nombres["Italy"] = "Italia";
nombres["Mexico"] = "México";
nombres["Nicaragua"] = "Nicaragua";
nombres["Panama"] = "Panamá";
nombres["Paraguay"] = "Paraguay";
nombres["Uruguay"] = "Uruguay";
nombres["Peru"] = "Perú";
nombres["Puerto Rico"] = "Puerto Rico";
nombres["Spain"] = "España";
nombres["United Kingdom"] = "Reino Unido";
nombres["Venezuela"] = "Venezuela";
nombres["Suriname"] = "Surinam";
nombres["French Guiana"] = "Guyana Francesa";
nombres["Guiana"] = "Guyana";

// d3.js
// ==========================
var width = 600;
var height = 750;

var projection = d3.geo.mercator()
  .translate( [780, 300])
  .scale([350]);
var path = d3.geo.path().projection(projection);

var color = d3.scale.linear()
  .range(["#CBB5A0", "#C82528"]); 

var svg = d3.select("div#maps")
  .append("svg")
   .attr("preserveAspectRatio", "xMinYMin meet")
   .attr("viewBox", "0 0 600 800")
  .append("g");

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
    .attr("preserveAspectRatio", "xMinYMin meet")
   .attr("viewBox", "0 0 600 800")
    .attr("class", "bubble");

// d3.csv("total.csv", function(datatotal) { 
  d3.csv(paisescsv, function(data) { 

    d3.json(typeof mapgeojson != 'undefined' ? mapgeojson : "../../../map.geojson", function(json) {

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

          if (json.features[j].properties.conteo > max) {
              max = json.features[j].properties.conteo;
            }
        }

        if (!match) {
          data.splice(i, 1);
          i--;
        }
      }

      // for (var i = 0; i < datatotal.length; i++) {
      //   var dataName = datatotal[i].pais;
      //   var dataValue = datatotal[i].conteo;

      //   var match = false;
      //   for (var j = 0; j < json.features.length && !match; j++)  {
      //     var jsonName = json.features[j].properties.sovereignt;
      //     if (dataName == jsonName) {
      //       match = true;
      //       var val = json.features[j].properties.conteo;
      //       var pct = val / dataValue * 100;
      //       json.features[j].properties.conteo = Math.floor(pct * 100) / 100;
            
      //       if (json.features[j].properties.conteo > max) {
      //         max = json.features[j].properties.conteo;
      //       }
      //     }
      //   }

      //   if (!match) {
      //     datatotal.splice(i, 1);
      //     i--;
      //   }
      // }

      color.domain([0, max]);
           
      svg.selectAll("path")
        .append("div")
        .data(json.features)
        .enter()
        .append("path")
        .attr("id", function(d) { return d.properties.postal; })
        .attr("d", path)
        .style("stroke", "#fff")
        .style("stroke-width", "1.5")
        .style("fill", function(d) {
          console.log(d);
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
          .text(nombres[d.properties.sovereignt]);

        if (!isNaN(d.properties.conteo)) {
          div.select("p")
            .text(d.properties.conteo);
        } else {
          div.select("p")
            .text("");
        }
        div
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })   
       
      .on("mouseout", function(d) {       
        div.transition()
          .duration(500)
          .style("opacity", 0);   
      });

      var text = svg.selectAll("text")
        .data(json.features)
        .enter()
        .append("text");

      var textLabels = text
        .attr("x", function(d) { 
          if (d.properties.postal == "US")
            return 170;
          else 
            return path.centroid(d)[0];
        })
        .attr("y", function(d) { 
          if (d.properties.postal == "US")
            return 60;
          else 
            return path.centroid(d)[1];
        })
        .text( function (d) {
          if (!isNaN(d.properties.conteo))
            return d.properties.conteo;
          else
            return "";
        })
        .attr("text-anchor", function (d) {
          if (d.properties.postal == "PE" || d.properties.postal == "PY" || d.properties.postal == "CL")
            return "end"; 
          else
            return "middle";
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "10px")
        .attr("fill", "white");

      var bubbledata = json.features.map(function(d){
        d.pais = nombres[d.properties.sovereignt];
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

      var text2 = svg2.selectAll("text")
        .data(nodes)
        .enter()
        .append("text");

      var textLabels2 = text2
        .attr("x", function(d) { 
          return d.x;
        })
        .attr("y", function(d) { 
          return d.y + 7;
        })
        .text( function (d) {
          return nombres[d.properties.sovereignt];
        })
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", "14px")
        .attr("fill", "white");
    });
  });
// });
