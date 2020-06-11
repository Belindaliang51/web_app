// SETUP SVG AREA
// Scalable Vector Graphic dimensions
var svgWidth = 1400;
var svgHeight = 500;

// Margins
var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

// Total widths for the chart after subtracting margins
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// AXISES
// Initial Params
var chosenXAxis = "Temp";
var chosenYAxis = "Ave_duration";

// function used for updating x-scale var upon click on axis label
function xScale(Data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(Data, d => d[chosenXAxis]) * 1.2,
      d3.max(Data, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);
  return xLinearScale;
}

// function used for updating y-scale var upon click on axis label
function yScale(Data, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(Data, d => d[chosenYAxis]) * 0.8,
      d3.max(Data, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);
  return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
  return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);
  yAxis.transition()
    .duration(1000)
    .call(leftAxis);
  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));
  return circlesGroup;
}
// Function used for updating text in circles group with a transition to new text.
function renderText(circletextGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
  circletextGroup.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]))
      .attr("y", d => newYScale(d[chosenYAxis]));
  
  return circletextGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
  // conditions for X Axis
  if (chosenXAxis === "Temp") {
    var xlabel = "Temp (C)";
  }
  else if (chosenXAxis === "Rain") {
    var xlabel = "Rain (mm)";
  }
  else {
    var xlabel = "Snow (mm)";
  }

  // Conditional for Y Axis.
  if (chosenYAxis === "Ave_duration") {
    var ylabel = "Ave duration (mins)";
  }
  else if (chosenYAxis === "Frequency") {
      var ylabel = "Total Frequency";
  }
  else {
      var ylabel = "Median Ave_distance"
  }
  // create tooltip
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`Weekday: ${d.Day_of_Week}<br>${xlabel}: ${d[chosenXAxis]}<br>${ylabel}: ${d[chosenYAxis]}`)
  });
  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data,this);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}


// Retrieve data from the CSV file and execute everything below
d3.csv("/static/grouped_data.csv").then(function(Data, err) {
  if (err) throw err;

  // parse data
  Data.forEach(function(data) {
    data.Temp = +data.Temp;
    data.Ave_duration  = +data.Ave_duration/60;
    data.Rain = +data.Rain;
    data.Frequency = +data.Frequency;
    data.Snow = +data.Snow;
    data.Ave_distance = +data.Ave_distance;
  });

  // LinearScale functions above csv import
  var xLinearScale = xScale(Data, chosenXAxis);
  var yLinearScale = yScale(Data, chosenYAxis);

  // // Create y scale function
  // var yLinearScale = d3.scaleLinear()
  //   .domain([0, d3.max(Data, d => d.Ave_duration)])
  //   .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(Data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 10)
    .attr("class", "stateCircle")
    .attr("opacity", ".5");

  // Create group for  2 x- axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var ylabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(0, ${height/2-200})`);

// X AND Y LABELS
// Temp for x axis
  var TempLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "Temp") // value to grab for event listener
    .classed("active", true)
    .text("Temp (C)");

// Rain for x axis
  var RainLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "Rain") // value to grab for event listener
    .classed("inactive", true)
    .text("Rain (mm)");

  // Snow for x axis
  var SnowLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "Snow") // value to grab for event listener
    .classed("inactive", true)
    .text("Snow (mm)");

  // Ave_duration for y axis
  var Ave_durationLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("value", "Ave_duration") // value to grab for event listener
    .attr("dy", "1em")
    .classed("active", true)
    .text("Ave duration (mins)");

  // Frequency for y axis
  var FrequencyLabel = ylabelsGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left + 20)
  .attr("x", 0 - (height / 2))
  .attr("value", "Frequency") // value to grab for event listener
  .attr("dy", "1em")
  .classed("inactive", true)
  .text("Total Frequency");

  // Ave_distance for y axis
  var Ave_distanceLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("value", "Ave_distance") // value to grab for event listener
    .attr("dy", "1em")
    .classed("inactive", true)
    .text("Ave Distance (m)");

  // updateToolTip function above csv import upon pFrequency load
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {
        // replaces chosenXAxis with value
        chosenXAxis = value;
         console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(Data, chosenXAxis);
        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);

        // updates y scale for new data
        yLinearScale = yScale(Data, chosenYAxis);
        // updates y axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "Temp") {
          TempLabel
            .classed("active", true)
            .classed("inactive", false);
          RainLabel
            .classed("active", false)
            .classed("inactive", true);
          SnowLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "Rain") {
          TempLabel
            .classed("active", false)
            .classed("inactive", true);
          RainLabel
            .classed("active", true)
            .classed("inactive", false);
          SnowLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          TempLabel
            .classed("active", false)
            .classed("inactive", true);
          RainLabel
          .classed("active", false)
          .classed("inactive", true);
          SnowLabel
          .classed("active", true)
          .classed("inactive", false);
        }
      }
    });

  // y axis labels event listener
  ylabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // replaces chosenYAxis with value
        chosenYAxis = value;
         console.log(chosenYAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(Data, chosenXAxis);
        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);

        // updates y scale for new data
        yLinearScale = yScale(Data, chosenYAxis);
        // updates y axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenYAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenYAxis === "Ave_duration") {
          Ave_durationLabel
            .classed("active", true)
            .classed("inactive", false);
          FrequencyLabel
            .classed("active", false)
            .classed("inactive", true);
          Ave_distanceLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenYAxis === "Frequency") {
          Ave_durationLabel
            .classed("active", false)
            .classed("inactive", true);
          FrequencyLabel
            .classed("active", true)
            .classed("inactive", false);
          Ave_distanceLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          Ave_durationLabel
            .classed("active", false)
            .classed("inactive", true);
          FrequencyLabel
            .classed("active", false)
            .classed("inactive", true);
          Ave_distanceLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });

}).catch(function(error) {
  console.log(error);
});

