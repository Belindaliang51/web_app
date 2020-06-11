    // set the dimensions and margins of the graph
    var margin1 = {top: 10, right: 30, bottom: 30, left: 40},
        width1 = 1400 - margin1.left - margin1.right,
        height1 = 400 - margin1.top - margin1.bottom;
    
    // append the svg object to the body of the page
    var svg1 = d3.select("#boxplot")
      .append("svg")
        .attr("width", width1 + margin1.left + margin1.right)
        .attr("height", height1 + margin1.top + margin1.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin1.left + "," + margin1.top + ")");
    
    // Read the data and compute summary statistics for each month
    d3.csv("/static/grouped_data.csv", function(data) {
    
      var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
        .key(function(d) { return d.Date.split("/")[1];})
        .rollup(function(d) {
          q1 = d3.quantile(d.map(function(g) { return g.Ave_duration/60;}).sort(d3.ascending),.25)
          median = d3.quantile(d.map(function(g) { return g.Ave_duration/60;}).sort(d3.ascending),.5)
          q3 = d3.quantile(d.map(function(g) { return g.Ave_duration/60;}).sort(d3.ascending),.75)
          interQuantileRange = q3 - q1
          min = q1 - 1.5 * interQuantileRange
          max = q3 + 1.5 * interQuantileRange
          return({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})
        })
        .entries(data)
    
      // Show the X scale
      var x = d3.scaleBand()
        .range([ 0, width1 ])
        .domain(["1", "2", "3","4","5","6","7","8","9","10","11","12"])
        .paddingInner(1)
        .paddingOuter(.5)
      svg1.append("g")
        .attr("transform", "translate(0," + height1 + ")")
        .call(d3.axisBottom(x))
    
      // Show the Y scale
      var y = d3.scaleLinear()
        .domain([0,50])
        .range([height1, 0])
      svg1.append("g").call(d3.axisLeft(y))
    
      // Show the main vertical line
      svg1
        .selectAll("vertLines")
        .data(sumstat)
        .enter()
        .append("line")
          .attr("x1", function(d){return(x(d.key))})
          .attr("x2", function(d){return(x(d.key))})
          .attr("y1", function(d){return(y(d.value.min))})
          .attr("y2", function(d){return(y(d.value.max))})
          .attr("stroke", "black")
          .style("width", 40)
    
      // rectangle for the main box
      var boxWidth = 30
      svg1
        .selectAll("boxes")
        .data(sumstat)
        .enter()
        .append("rect")
            .attr("x", function(d){return(x(d.key)-boxWidth/2)})
            .attr("y", function(d){return(y(d.value.q3))})
            .attr("height", function(d){return(y(d.value.q1)-y(d.value.q3))})
            .attr("width", boxWidth )
            .attr("stroke", "black")
            .style("fill", "#69b3a2")
    
      // Show the median
      svg1
        .selectAll("medianLines")
        .data(sumstat)
        .enter()
        .append("line")
          .attr("x1", function(d){return(x(d.key)-boxWidth/2) })
          .attr("x2", function(d){return(x(d.key)+boxWidth/2) })
          .attr("y1", function(d){return(y(d.value.median))})
          .attr("y2", function(d){return(y(d.value.median))})
          .attr("stroke", "black")
          .style("width", 80)

    })