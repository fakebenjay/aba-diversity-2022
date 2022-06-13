//Create SVG element
var svg = d3.select("#chart-1 .chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

var tooltip1 = d3.select("#chart-1")
  .append('div')
  .style('visibility', 'hidden')
  .attr('class', 'my-tooltip')
  .attr('id', 'tooltip-1')

// Add Y scale
var yScale1 = d3.scaleLinear()
  .domain([100, 0])
  .range([0, height - (margin.top + margin.bottom)])

// Define Y axis and format tick marks
var yAxis1 = d3.axisLeft(yScale1)
  .ticks(5)
  .tickFormat(d => d == 0 ? '0' : d + '%')

var yGrid1 = d3.axisLeft(yScale1)
  .tickSize(-width + margin.right + margin.left, 0, 0)
  .tickFormat("")


// Render Y grid
svg.append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`)
  .attr("class", "grid")
  .style('color', '#777777')
  .style('opacity', '0.3')
  .call(yGrid1)

// Render Y axis
svg.append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`)
  .attr('class', 'y-axis')
  .call(yAxis1)
  .selectAll("text")
  .style('font-size', () => {
    return window.innerWidth > 767 ? '9pt' : '8pt'
  })
  .attr("transform", "translate(-15,0)")
  .style("text-anchor", "middle")

// Render Y grid
svg.append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`)
  .attr("class", "grid")
  .style('color', '#777777')
  .style('opacity', '0.3')
  .call(yGrid1)

// Render lines g
var linesG = svg.append("g")
  .attr('class', 'lines')

//Render X axis
svg.append("g")
  .attr("transform", `translate(0,${height-margin.bottom})`)
  .attr('class', 'x-axis')
  .style('color', 'black')
  .call(xAxis)
  .selectAll(".tick text")
  .style('font-size', `${window.innerWidth < 400 ? '8pt': '10pt'}`)
  .raise()

d3.csv("data-1.csv")
  .then(function(data) {

    var sumstat = d3.nest()
      .key(function(d) {
        return d.year;
      })
      .entries(data);

    // Stack the data: each group will be represented on top of each other
    var mygroups = ["Caucasian/White", "African-American", "Asian", "Hispanic", "Hawaiian/Pacific Islander", "Multiracial", "Native American"] // list of group names
    var mygroup = ['white', 'black', 'asian', 'hispanic', 'pacific', 'multiracial', 'native'] // list of group names
    var stackedData = d3.stack()
      .keys(mygroup)
      .value(function(d, key) {
        return d.values[0][key]
      })
      (sumstat)

    // color palette
    var color = d3.scaleOrdinal()
      .domain(mygroups)
      .range(['#646f8c', '#d5563a', '#132a43', '#5b1933', '#6ba292', '#faa916', '#654f6f'])

    // Show the areas
    svg.selectAll("mylayers")
      .data(stackedData)
      .enter()
      .append("path")
      .attr('class', (d) => {
        return `area ${d.key}`
      })
      .style("fill", function(d) {
        return color(d.key);
      })
      .style("opacity", 1)
      .attr("d", d3.area()
        .x(function(d, i) {
          return xScale(i + 2012);
        })
        .y0(function(d) {
          return yScale1(d[0]) + margin.top;
        })
        .y1(function(d) {
          return yScale1(d[1]) + margin.top;
        })
      )

    // var yr2021 = d3.line()
    //   .x(function(d) {
    //     return xScale(d.year)
    //   })
    //   .y(function(d) {
    //     return (height - margin.bottom) - yScale1(Math.max.apply(Math, yScale1.domain()) - d.pct);
    //   });
    //
    // var yr2022 = d3.line()
    //   .x(function(d) {
    //     return xScale(d.year)
    //   })
    //   .y(function(d) {
    //     return (height - margin.bottom) - yScale1(Math.max.apply(Math, yScale1.domain()) - d.pct);
    //   });
    //
    // svg.select('.lines')
    //   .data([csv])
    //   .append("path")
    //   .attr("class", "line yr2021")
    //   .attr("d", (d) => {
    //     return yr2021(d)
    //   })
    //   .style('stroke', '#d5563a')
    //
    //
    // svg.select('.lines')
    //   .data([csv])
    //   .append("path")
    //   .attr("class", "line yr2022")
    //   .attr("d", (d) => {
    //     return yr2022(d)
    //   })
    //   .style('stroke', '#132a43')
    //
    // csv.unshift('dummy')
    //
    // svg.selectAll(".lines")
    //   .data(csv)
    //   .enter()
    //   .append("circle") // Uses the enter().append() method
    //   .attr("class", d => `dot yr2022 ${yearClassify(d.year).toLowerCase()}`) // Assign a class for styling
    //   .attr("cy", function(d) {
    //     return (height - margin.bottom) - yScale1(Math.max.apply(Math, yScale1.domain()) - d.pct);
    //   })
    //   .attr("cx", function(d) {
    //     return xScale(d.year)
    //   })
    //   .attr("r", 3)
    //   .style('fill', '#d5563a')
    //
    // svg.selectAll(".lines")
    //   .data(csv)
    //   .enter()
    //   .append("circle") // Uses the enter().append() method
    //   .attr("class", d => `dot yr2022 ${yearClassify(d.year).toLowerCase()}`) // Assign a class for styling
    //   .attr("cy", function(d) {
    //     return (height - margin.bottom) - yScale1(Math.max.apply(Math, yScale1.domain()) - d.pct);
    //   })
    //   .attr("cx", function(d) {
    //     return xScale(d.year)
    //   })
    //   .attr("r", 3)
    //   .style('fill', '#132a43')

    var years = [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022]

    years.forEach((d) => {
      svg.append('line')
        .attr("x1", xScale(d) + 2)
        .attr("y1", height - margin.bottom)
        .attr("x2", xScale(d) + 2)
        .attr("y2", margin.top)
        .attr('stroke', '#e8171f')
        .attr('stroke-width', 4)
        .attr('opacity', 0)
        .attr('class', `yearline yr-${d}`)
    })

    svg.append("rect")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .attr("class", "hover-overlay")
      .attr("width", width - margin.right - margin.left)
      .attr("height", height - margin.bottom - margin.top)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .data([data])
      .on("mouseover mousemove touchstart touchmove", function(d) {
        return mouseoverLine(d, 1)
      })
      .on("mouseout", () => {
        d3.selectAll(`.yearline`)
          .attr('opacity', 0)

        d3.select(`#tooltip-1`)
          .html("")
          .attr('display', 'none')
          .style("visibility", "hidden")
          .style("left", null)
          .style("top", null);
      });

    d3.selectAll('.hover-overlay')
      .raise()

    d3.selectAll('.legend-box span')
      .on('mouseover', () => {
        svg.selectAll('.area')
          .style('opacity', .1)

        svg.select('.area.' + event.target.className)
          .style('opacity', 1)
      })
      .on('mouseout', () => {
        svg.selectAll('.area')
          .style('opacity', 1)
      })
  })