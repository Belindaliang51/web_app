var svgWidth = 1100;
var svgHeight = 600;

var margin = {
  top: 50,
  right: 20,
  bottom: 80,
  left: 80
};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
var svg = d3
  .select(".article")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Initial parames 
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

/////////FUNCTIONS////////////////
//define updating x-scale function
function xScale(data, chosenXAxis) {
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenXAxis]) * 0.9,
      d3.max(data, d => d[chosenXAxis]) * 1.1
    ])
    .range([0, width]);
  return xLinearScale;
}

//define updating y-scale function
function yScale(data, chosenYAxis) {
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenYAxis]*0.8),d3.max(data, d => d[chosenYAxis]*1.2)])
    .range([height, 0]);
  return yLinearScale;
}

//updating xAxis function
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

//updating yAxis function
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

//updating circles group function
function renderCircles(chartGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  chartGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return chartGroup;
}

//updating tooltips text
function updateToolTip(chosenXAxis, circlesGroup,chosenYAxis,xLinearScale,yLinearScale){ 

  circlesGroup.selectAll('text')
            .exit()
            .data(data)
            .enter()
            .append('text')
            .text(d=>d.abbr)
            .attr('x', d => xLinearScale(d[chosenXAxis]))
            .attr('y', d => yLinearScale(d[chosenYAxis] -.5))
            .attr('text-anchor', 'middle')
            .attr("class", "stateText");
  return circlesGroup;
}

//load data
d3.csv("data/d3_data.csv").then(function(data, err){
    if (err) throw err;
    console.log(data);
    data.forEach(function(d) {
        d.poverty = +d.poverty;
        d.healthcare = +d.healthcare;
        d.age = +d.age;
        d.income = +d.income;
        d.obesity = +d.obesity;
        d.smokes = +d.smokes;
      });
    //define xscale, yscale
    var xLinearScale = xScale(data,chosenXAxis);
    var yLinearScale = yScale(data, chosenYAxis);

    //initial axis
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //append axis
    var xAxis = chartGroup.append("g")
                          .classed("x-axis", true)
                          .attr("transform", `translate(0, ${height})`)
                          .call(bottomAxis);

    var yAxis = chartGroup.append("g")
                        .classed("y-axis", true)
                        .call(leftAxis);

    //initial circleGroup
    var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 14)
    .classed("stateCircle", true)
    .attr("opacity", ".5");

    //xlabels for axis
    var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") 
    .classed("active", true)
    .text("In Poverty (%)");

    var ageLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") 
    .classed("inactive", true)
    .text("Age (Median)");

    var incomeLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") 
    .classed("inactive", true)
    .text("Householde Income (Median)");

    //ylabels for axis
    var ylabelsGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)");

    var healthcareLabel = ylabelsGroup.append("text")
    .attr("y", 0 - margin.left+40)
    .attr("x", 0 - (height / 2)-margin.top)
    .attr("dy", "1em")
    .classed("axis-text", true)
    .classed("active", true)
    .attr('value','healthcare')
    .text("Lakes Healthcare (%)");

    var smokesLabel = ylabelsGroup.append("text")
    .attr("y", 0 - margin.left+20)
    .attr("x", 0 - (height / 2)-margin.top)
    .attr("dy", "1em")
    .classed("axis-text", true)
    .classed("inactive", true)
    .attr('value','smokes')
    .text("Smokes (%)");

    var obesityLabel = ylabelsGroup.append("text")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2)-margin.top)
    .attr("dy", "1em")
    .classed("axis-text", true)
    .classed("inactive", true)
    .attr('value','obesity')
    .text("Obese (%)");


    //toolTip
    var textsLabel=chartGroup.selectAll('text')
            .exit()
            .data(data)
            .enter()
            .append('text')
            .text(function (d) {
                return `${d.abbr}`;
            })
            .attr('x', d => xLinearScale(d[chosenXAxis]))
            .attr('y', d => yLinearScale(d[chosenYAxis]-.5))
            .attr('text-anchor', 'middle')
            .attr("class", "stateText");
   
    // chartGroup=updateToolTip(chosenXAxis, chartGroup,chosenYAxis,xLinearScale,yLinearScale)
    //x aixs event listener
    xlabelsGroup.selectAll("text")
    .on("click", function() {
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {
        chosenXAxis = value;
        console.log(chosenXAxis)

        xLinearScale = xScale(data, chosenXAxis);
        
        xAxis = renderAxes(xLinearScale, xAxis);

        circlesGroup
        .transition()
        .duration(1000)
        .attr("cx", data => xLinearScale(data[chosenXAxis]))
        .attr("cy", data => yLinearScale(data[chosenYAxis]))

        textsLabel
        .transition()
        .duration(1000)
        .attr("x", data => xLinearScale(data[chosenXAxis]))
        .attr("y", data => yLinearScale(data[chosenYAxis]-.5));

        // changes classes to change bold text
        if (chosenXAxis === "age") {
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if(chosenXAxis === "income") {
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
        } else{
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
      }
    });
    ///////////////////////////////

    //y aixs event listener
    ylabelsGroup.selectAll("text")
    .on("click", function() {
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {
        chosenYAxis = value;
        console.log(chosenYAxis)

        yLinearScale = yScale(data, chosenYAxis);
        
        yAxis = renderYAxes(yLinearScale, yAxis);

        circlesGroup
        .transition()
        .duration(1000)
        .attr("cx", data => xLinearScale(data[chosenXAxis]))
        .attr("cy", data => yLinearScale(data[chosenYAxis]))

        textsLabel
        .transition()
        .duration(1000)
        .attr("x", data => xLinearScale(data[chosenXAxis]))
        .attr("y", data => yLinearScale(data[chosenYAxis]-.5));

        // changes classes to change bold text
        if (chosenYAxis === "obesity") {
          obesityLabel
            .classed("active", true)
            .classed("inactive", false);
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if(chosenXAxis === "healthcare") {
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
          healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
        } else{
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
        }
      }
    });

    
   

    





}).catch(function(error){
    console.log(error);
});