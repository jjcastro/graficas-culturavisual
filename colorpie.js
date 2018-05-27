
var div = d3.select("body").append("div").attr("class", "toolTip");

d3.csv(paisescsv, function(data) {

  var colors = ["rgb(56, 119, 175)", "rgb(198, 57, 51)"];

  var total = 0;
  data.forEach(function(element) {
    total += Number(element.total);
  });

  console.log(total);

  for (var i = 0; i < data.length; i++) {
    var val = (data[i].total / total) * 100.0;
    data[i]["porcentaje"] = Number(val.toFixed(1))
  }

  console.log(data);
  var width = 960,
      height = 500,
      radius = Math.min(width, height) / 2;

  var arc = d3.svg.arc()
      .outerRadius(radius - 10)
      .innerRadius(radius - 100);

  var pie = d3.layout.pie()
      .sort(null)
     .startAngle(1.1*Math.PI)
      .endAngle(3.1*Math.PI)
      .value(function(d) { return d.total; });

  var svg = d3.select("body").append("svg")
      // .attr("width", width)
      // .attr("height", height)
      .attr("preserveAspectRatio", "xMinYMin meet")
   .attr("viewBox", "0 0 960 500")
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


   var g = svg.selectAll(".arc")
        .data(pie(data))
      .enter().append("g")
        .attr("class", "arc");

    var curr = 0;

    g.append("path")
    .style("fill", function(d) {
      console.log(colors[parseInt(d.color)]);
      return colors[parseInt(d.data.color)-1];
    })
      .transition()
      .delay(function(d,i) {
        console.log(curr);
        const temp = curr;
        curr += 50 + (20 * d.data.porcentaje);
        return temp;
      })
      .duration(function(d,i) { return 100 + (20 * d.data.porcentaje); })
      .attrTween('d', function(d) {
        var i = d3.interpolate(d.startAngle+0.01, d.endAngle);
        return function(t) {
          d.endAngle = i(t); 
          return arc(d)
          }
      }); 
    g.append("text")
        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
        .attr("dy", ".35em")
      .transition()
      .delay(1000)
        .text(function(d) {
          var value = "(" + d.value + ")";
          return (d.data.porcentaje > 5 ? d.data.porcentaje + "% " : "") + value;
        });

    d3.selectAll("path").on("mousemove", function(d) {
        div.style("left", d3.event.pageX+10+"px");
        div.style("top", d3.event.pageY-25+"px");
        div.style("display", "inline-block");
      div.html((d.data.name)+"<br>"+(d.data.total) + "<br>"+(d.data.porcentaje) + "%");
  });
      
  d3.selectAll("path").on("mouseout", function(d){
      div.style("display", "none");
  });
      
      
  //d3.select("body").transition().style("background-color", "#d3d3d3");
  function type(d) {
    d.total = +d.total;
    return d;
  }
});