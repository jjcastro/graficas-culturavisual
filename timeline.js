
var colors = d3.scale.category20();

// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = 900 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;

// Parse the date / time
var parseDate = d3.time.format("%Y").parse;

var div = d3.select("body")
  .append("div")   
  .attr("class", "tooltip")               
  .style("opacity", 0);

// Tooltip
div.append("h3")
    .attr("class", "categoria");
div.append("h3")
    .attr("class", "anio");
div.append("p");

// Set the ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

console.log(x.range());

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

// Define the line
var valueline = d3.svg.line()
    .x(function(d) { return x(d.anio); })
    .y(function(d) { return y(d.conteo); });
    
// Adds the svg canvas
var svg = d3.select("body")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv(timelinecsv, function(error, data) {

    const categories = [...new Set(data.map(item => item.categoria))];
    const result = categories.filter(function(d){
            return d != "";
        }); 

    data.forEach(function(d) {
        d.anio = parseDate(d.anio);
        d.conteo = +d.conteo;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.anio; }));
    y.domain([0, d3.max(data, function(d) { return d.conteo; })]);

    var legendRectSize = 10;                                  
    var legendSpacing = 10; 

    

    var legend = svg.selectAll('.legend')                     
          .data(result)                                   
          .enter()                                                
          .append('g')                                            
          .attr('class', 'legend')
          .attr('transform', function(d, i) {
            var height = legendRectSize + legendSpacing;
            var horz = 10;
            var vert = i * height;
            return 'translate(' + horz + ',' + vert + ')';
          });                                            

        legend.append('circle')                                     
          .attr('r', legendRectSize/2)                          
          .attr('cx', 5)                         
          .style('fill', function(d) { return colors(d); });                                
          
        legend.append('text')                                     
          .attr('x', legendRectSize + legendSpacing)              
          .attr('y', (legendRectSize - legendSpacing) + legendRectSize/2)
          .text(function(d) { return d; });



    result.forEach(function(categoria) {
        var filteredData = data.filter(function(d){
            return d.categoria == categoria;
        });
        
        var fixedData = filteredData.filter(function(d){
            return d.conteo != 0;
        }); 
        // console.log(fixedData);

        // var fixedData = x.ticks(d3.time.year).map(function(yearBucket) {
        //     return _.find(filteredData, { anio: yearBucket }) || {anio: yearBucket, conteo: 0};
        // });

        // // Add the valueline path.



        svg.append("path")
            .attr("class", "line")
            .style("stroke", colors(categoria))
            .attr("d", valueline(fixedData));

                // Add the X Axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.selectAll("dot")
            .data(fixedData)
          .enter().append("circle")
            .attr("r", 3.5)
            .style("fill", function(d) { return colors(d.categoria); })
            .attr("cx", function(d) { return x(d.anio); })
            .attr("cy", function(d) { return y(d.conteo); })

        .on("mouseover", function(d) {      
            div.transition()        
              .duration(200)      
              .style("opacity", .9);   

            div.select("h3.categoria")
              .text("Categoria: " + d["categoria"]);
            div.select("h3.anio")
              .text("Año: " + d["anio"].getFullYear());
            div.select("p")
              .text("Obras: " + d["conteo"]);
            div
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - 28) + "px");
          })

        .on("mouseout", function(d) {       
            div.transition()
              .duration(500)
              .style("opacity", 0);   
          }); 

        // Add the Y Axis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);
    });


});
