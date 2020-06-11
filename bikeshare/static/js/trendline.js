    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 1400 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;
    
    // append the svg object to the body of the page
    var svg2 = d3.select("#trendline")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
    
    //Read the data
    d3.csv("../grouped_data.csv",function(d){
        return { date : d3.timeParse("%Y/%m/%d")(d.Date), value : d.Ave_duration/60 }
      },
    
      
      function(data) {
        var x = d3.scaleTime()
          .domain(d3.extent(data, function(d) { return d.date; }))
          .range([ 0, width ]);
        xAxis = svg2.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));
    
        // Add Y axis
        var y = d3.scaleLinear()
          .domain([0, d3.max(data, function(d) { return +d.value; })])
          .range([ height, 0 ]);
        yAxis = svg2.append("g")
          .call(d3.axisLeft(y));
    
        // Add a clipPath
        var clip = svg2.append("defs").append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr("width", width )
            .attr("height", height )
            .attr("x", 0)
            .attr("y", 0);
    
        // Add brushing
        var brush = d3.brushX()                   //s Add the brush feature using the d3.brush function
            .extent( [ [0,0], [width,height] ] )  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
            .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function
    
        // Create the area variable: where both the area and the brush take place
        var area = svg2.append('g')
          .attr("clip-path", "url(#clip)")
    
        // Create an area generator
        var areaGenerator = d3.area()
          .x(function(d) { return x(d.date) })
          .y0(y(0))
          .y1(function(d) { return y(d.value) })
    
        // Add the area
        area.append("path")
          .datum(data)
          .attr("class", "myArea")  // I add the class myArea to be able to modify it later on.
          .attr("fill", "#839ae6")
          .attr("fill-opacity", .3)
          .attr("stroke", "black")
          .attr("stroke-width", 1)
          .attr("d", areaGenerator )
    
        // Add the brushing
        area
          .append("g")
            .attr("class", "brush")
            .call(brush);
    
        // A function that set idleTimeOut to null
        var idleTimeout
        function idled() { idleTimeout = null; }
    
        // A function that update the chart for given boundaries
        function updateChart() {
    
          // What are the selected boundaries?
          extent = d3.event.selection
    
          // If no selection, back to initial coordinate. Otherwise, update X axis domain
          if(!extent){
            if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
            x.domain([ 4,8])
          }else{
            x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
            area.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
          }
    
          // Update axis and area position
          xAxis.transition().duration(1000).call(d3.axisBottom(x))
          area
              .select('.myArea')
              .transition()
              .duration(1000)
              .attr("d", areaGenerator)
        }
    
        // If user double click, reinitialize the chart
        svg2.on("dblclick",function(){
          x.domain(d3.extent(data, function(d) { return d.date; }))
          xAxis.transition().call(d3.axisBottom(x))
          area
            .select('.myArea')
            .transition()
            .attr("d", areaGenerator)
        });
    
    })
    
    