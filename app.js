function makeResponsive(){
     
    var svgArea= d3.select("body").select("svg");
    if (!svgArea.empty()) {
        svgArea.remove();
    }

    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight;

    var margin = {
    top: 100,
    right: 300,
    bottom: 200, 
    left: 200
    };

    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart and shift the latter by left and top margins
    var svg = d3.select("#scatter")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .attr("class", "chart");

    var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Import Data
    d3.csv("P&H_data.csv").then(function(phData) {

        // Parse Data & Cast as numbers
        phData.forEach(function(data) {
            data.healthcare = +data.healthcare;
            data.poverty = +data.poverty;
        });
        // Create scale functions
        var xLinearScale = d3.scaleLinear()
        .domain([8, 24])
        .range([0, width]);

        var yLinearScale = d3.scaleLinear()
        .domain([0, 28])
        .range([height, 0]);
        
        // Create axis functions
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // Append axes to the chart
        chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

        chartGroup.append("g")
        .call(leftAxis);

        // Create circles
        var circlesGroup = chartGroup.selectAll("Circle")
        .data(phData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "12")
        .attr("fill", "rgb(117, 145, 197)") 
        .attr("opacity", "0.5");

        // Add state labels to the points
        var circleLabels = chartGroup.selectAll(null)
            .data(phData).enter().append("text");

        circleLabels
            .attr("x", function(d) {
            return xLinearScale(d.poverty);
            })
            .attr("y", function(d) {
            return yLinearScale(d.healthcare);
            })
            .text(function(d) {
            return d.abbr;
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", "10px")
            .attr("text-anchor", "middle")
            .attr("fill", "white");

        // Create axes labels
        chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 100)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .style("text-anchor", "middle")
        .text("Lacks Healthcare (%)");

        chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 5})`)
        .attr("class", "axisText")
        .style("text-anchor", "middle")
        .text("Poverty (%)");
        
        // Initialize tooltip
        var toolTip = d3.tip() 
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return  `${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}<br>`; 
        });

        // Create tooltip in the chart
        chartGroup.call(toolTip);

        // Create event listeners to display and hide the tooltip
        circlesGroup.on("mouseover", function(data) {
            toolTip.style("display", "block")
            toolTip.show(data, this);
        })
        // onmouseout event
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });
    });
}
makeResponsive();
d3.select(window).on("resize", makeResponsive);