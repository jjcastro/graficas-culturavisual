
d3.csv("data.csv", function(data) { 
    // ====================

  var colors = d3.scale.category20();

  var extramargin = 0;
  var maxWidth = -1;
  var maxWidthSuper = -1;

  maxWidthSuper *= 1.2;
  maxWidth *= 1.2;

  extramargin = maxWidthSuper + maxWidth;

  var div = d3.select("body")
  .append("div")   
  .attr("class", "tooltip")               
  .style("opacity", 0);

    // Tooltip
  d3.select("div.tooltip")
    .append("h3");
  d3.select("div.tooltip")
    .append("p");

  var svg3 = d3.select("body")
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox",
      "0 0 300 300")
    .append("g");

  var height = 0;
  var latest = null;
  var maxWidth1 = -1;

  svg3.selectAll(".bar")
      .data(data)
      .enter()
      .append('text')
      .attr("x", 20)
      .attr("y", function(d,i) {
        height += 30;
        return height;
      })
      .text(function(d,i) {
        if (latest == d["values"]) {
          return "";
        } else {
          latest = d["values"];
          return d["values"];
        }
      })
      .each(function(d,i) {
        var width = this.getComputedTextLength();
        if (width > maxWidth1) {
          maxWidth1 = width;
        }
      });

  height = 0;
  latest = null;
  maxWidth1 *= 1.2;
  var maxWidth2 = -1;

  svg3.selectAll(".lines")
    .data(data)
    .enter()
    .append("line")
      .attr("x1", 0)
      .attr("y1", function(d) {
        d["height"] = height + 10;
        height += 30;
        return d["height"];
      })
      .attr("x2", 300)
      .attr("y2", function(d) {
        return d["height"];
      })
      .attr("opacity", function(d) {
        if (latest != d["values"]) {
          latest = d["values"];
          return 1;
        } else {
          return 0;
        }
      })

  height = 0;
  latest = null;

});




