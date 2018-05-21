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

var margin = {top: 40, right: 60, bottom: 107, left: 120},
    width = 960 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;
  
var x = d3.scale.linear().range([0, width]);

var y = d3.scale.ordinal().rangeRoundBands([0, height]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("top")
    .ticks(0);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickPadding([10])
    .innerTickSize([0]);
    
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

d3.csv("bidata.csv", function(error, data) {

  var colors = d3.scale.category20();

  data.forEach(function(d) {
    d.conteo1 = +d.conteo1;
    d.conteo2 = +d.conteo2;
    return d;
  });
  
  data.sort(function(a,b){ return (b.conteo1+b.conteo2) - (a.conteo1+a.conteo2)});

  var max1 = 4563;
  var max2 = 711;
  var factor = max1 / max2;
  var maxPadded = max1 + 600;
  
  x.domain([0, maxPadded]);
  y.domain(data.map(function(d) {return nombres[d.pais]; }));

  svg.append("g")
      .attr("class", "x axis")
      .call(xAxis);

  svg.append("rect")
      .attr("x", -100)
      .attr("y", -4)
      .attr("width", width + 100)
      .attr("height", 5)
      .style("fill", "#BBBBBB");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  svg.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .style("fill",  function(d) { return colors(d.pais); })
      .attr("x", function(d) {
        return width/2.0 - x(d.conteo1)/2.0;
      })
      .attr("y", function(d) { return y(nombres[d.pais]) + 3; })
      .attr("width", function(d) {
        return x(d.conteo1)/2.0;
      })
      .attr("height", 13);

  svg.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .style("fill",  function(d) { return colors(d.pais); })
      .attr("x", function(d) {
        return width/2.0;
      })
      .attr("y", function(d) { return y(nombres[d.pais]) + 3; })
      .attr("width", function(d) {
        console.log(x(d.conteo2 * factor)/2.0);
        return x(d.conteo2 * factor)/2.0;
      })
      .attr("height", 13);

  svg.append("line")
      .attr("x1", width/2)
      .attr("y1", -6)
      .attr("x2", width/2)
      .attr("y2", height);

  // TEXT LABELS

  var text1 = svg.selectAll("omg")
      .data(data)
      .enter()
      .append("text");
  var text2 = svg.selectAll("omg")
      .data(data)
      .enter()
      .append("text");

  var textLabels1 = text1
    .text( function (d) {
      return d.conteo2;
    })
    .attr("text-anchor", "start")
    .attr("font-size", "14px")
    .attr("fill", "black")
    .attr("x", function (d) {
      return (x(d.conteo2 * factor)/2.0) + width/2.0 + 5; } )
    .attr("y", function (d) {
     return y(nombres[d.pais]) + 15;
    });

  var textLabels2 = text2
    .text( function (d) {
      return d.conteo1;
    })
    .attr("text-anchor", "end")
    .attr("font-size", "14px")
    .attr("fill", "black")
    .attr("x", function (d) {
      return (width/2.0 - x(d.conteo1)/2.0) - 5;
    })
    .attr("y", function (d) {
     return y(nombres[d.pais]) + 15;
    });

  svg.append("text")
    .attr("x", width/2)
    .attr("y", -15)
    .attr("text-anchor", "middle")
    .text("VS")
    .style("fill", "#000000")
    .style("font-weight", "bold");

    svg.append("text")
    .attr("x", width *  0.25)
    .attr("y", -15)
    .attr("text-anchor", "middle")
    .text("Obras")
    .style("fill", "#000000")
    .style("font-weight", "bold");

    svg.append("text")
    .attr("x", width * 0.75)
    .attr("y", -15)
    .attr("text-anchor", "middle")
    .text("Ubicación Actual")
    .style("fill", "#000000")
    .style("font-weight", "bold");

});