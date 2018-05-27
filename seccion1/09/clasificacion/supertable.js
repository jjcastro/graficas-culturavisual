
d3.csv("data.csv", function(data) { 
    // ====================

  var colors = d3.scale.category20();

  var extramargin = 0;
  var maxWidth = -1;
  var maxWidthSuper = -1;

  // // text width calculations
  // d3.select("body")
  //   .append("svg")
  //   .append('g')
  //   .selectAll('.dummyText')
  //   .data(data)
  //   .enter()
  //   .append("text")
  //   .attr("font-family", "Lora")
  //   .attr("font-size", "12px")
  //   .text(function(d) { return d["categoria1"]})
  //   .each(function(d,i) {
  //       var width = this.getComputedTextLength();
  //       if (width > maxWidth) {
  //         maxWidth = width;
  //       }
  //   })
  //   .text(function(d) { return d["supertema"]})
  //   .attr("font-family", "Lora")
  //   .attr("font-size", "12px")
  //   .each(function(d,i) {
  //       var width = this.getComputedTextLength();
  //       if (width > maxWidthSuper) {
  //         maxWidthSuper = width;
  //       }
  //   })

  maxWidthSuper *= 1.2;
  maxWidth *= 1.2;

  extramargin = maxWidthSuper + maxWidth;

  // d3.selectAll("svg").remove();

  var margin = { top: 30, right: 40, bottom: 30, left: 50 + extramargin },
  width = 900 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

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
      "0 0 800 800")
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  // Get the data
  // data.forEach(function (d) {
  //   d["obras"] = +d["obras"];
  // });
 
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
        if (latest == d["categoria1"]) {
          return "";
        } else {
          latest = d["categoria1"];
          return d["categoria1"];
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
      .attr("x2", 700)
      .attr("y2", function(d) {
        return d["height"];
      })
      .attr("opacity", function(d) {
        if (latest != d["categoria1"]) {
          latest = d["categoria1"];
          return 1;
        } else {
          return 0;
        }
      })

  height = 0;
  latest = null;

  // -----------------------------

  svg3.selectAll(".bar2")
      .data(data)
      .enter()
      .append('text')
      .attr("x", maxWidth1 + 30)
      .attr("y", function(d,i) {
        height += 30;
        return height;
      })
      .text(function(d,i) {
        if (latest == d["categoria2"]) {
          return "";
        } else {
          d["bar"] = true;
          latest = d["categoria2"];
          return d["categoria2"];
        }
      })
      .each(function(d,i) {
        var width = this.getComputedTextLength();
        if (width > maxWidth2) {
          maxWidth2 = width;
        }
      });

  height = 0;
  latest = null;
  maxWidth2 *= 1.2;
  var maxWidth3 = -1;

  svg3.selectAll(".lines")
    .data(data)
    .enter()
    .append("line")
      .attr("x1", maxWidth1 + 30)
      .attr("y1", function(d) {
        d["height"] = height + 10;
        height += 30;
        return d["height"];
      })
      .attr("x2", 700)
      .attr("y2", function(d) {
        return d["height"];
      })
      .attr("opacity", function(d) {
        if (latest != d["categoria2"]) {
          latest = d["categoria2"];
          return 1;
        } else {
          return 0;
        }
      })

  height = 0;
  latest = null;

  // -----------------------------

  svg3.selectAll(".bar2")
      .data(data)
      .enter()
      .append('text')
      .attr("x", maxWidth1 + maxWidth2 + 30)
      .attr("y", function(d,i) {
        height += 30;
        return height;
      })
      .text(function(d,i) {
        if (latest == d["categoria3"]) {
          return "";
        } else {
          d["bar"] = true;
          latest = d["categoria3"];
          return d["categoria3"];
        }
      })
      .each(function(d,i) {
        var width = this.getComputedTextLength();
        if (width > maxWidth3) {
          maxWidth3 = width;
        }
      });

  height = 0;
  latest = null;
  maxWidth3 *= 1.2;
  var maxWidth4 = -1;

  svg3.selectAll(".lines")
    .data(data)
    .enter()
    .append("line")
      .attr("x1", maxWidth1 + maxWidth2 + 30)
      .attr("y1", function(d) {
        d["height"] = height + 10;
        height += 30;
        return d["height"];
      })
      .attr("x2", 700)
      .attr("y2", function(d) {
        return d["height"];
      })
      .attr("opacity", function(d) {
        if (latest != d["categoria3"]) {
          latest = d["categoria3"];
          return 1;
        } else {
          return 0;
        }
      })

  height = 0;
  latest = null;

  // -----------------------------

  svg3.selectAll(".bar2")
      .data(data)
      .enter()
      .append('text')
      .attr("x", maxWidth1 + maxWidth2 + maxWidth3 + 30)
      .attr("y", function(d,i) {
        height += 30;
        return height;
      })
      .text(function(d,i) {
        if (latest == d["categoria4"]) {
          return "";
        } else {
          d["bar"] = true;
          latest = d["categoria4"];
          return d["categoria4"];
        }
      })
      .each(function(d,i) {
        var width = this.getComputedTextLength();
        if (width > maxWidth4) {
          maxWidth4 = width;
        }
      });

  height = 0;
  latest = null;
  maxWidth4 *= 1.2;

  svg3.selectAll(".lines")
    .data(data)
    .enter()
    .append("line")
      .attr("x1", maxWidth1 + maxWidth2 + maxWidth3 + 30)
      .attr("y1", function(d) {
        d["height"] = height + 10;
        height += 30;
        return d["height"];
      })
      .attr("x2", 700)
      .attr("y2", function(d) {
        return d["height"];
      })
      .attr("opacity", function(d) {
        if (latest != d["categoria4"]) {
          latest = d["categoria4"];
          return 1;
        } else {
          return 0;
        }
      })

  height = 0;
  latest = null;

  console.log(data);

});




