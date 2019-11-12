var screen = {width: 400, height:500};
var margins = {top:10, right:50, bottom:50, left:50};
var penguinPromise = d3.json("classData.json");

penguinPromise.then(

function(penguins)
    {
        setup(penguins);
    },

function(err)
    {
        console.log(err);
    }
)

var setup = function(penguins)
{
    d3.select("svg")
    .attr("width", screen.width)
    .attr("height", screen.height)
    .append("g")
    .attr("id", "graph")
    .attr("transform", "translate("+margins.left+","+margins.top+")");
    
    var width = screen.width - margins.left - margins.right;
    var height = screen.height - margins.top - margins.bottom;
    
    var xScale = d3.scaleLinear().domain([0, 23]).range([0, width]);
    var yScale = d3.scaleLinear().domain([0, 10]).range([height, 0]);
    
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
    d3.select("svg").append("g").classed("axis", true);

    d3.select(".axis")
    .append("g")
    .attr("id", "xAxis")
    .attr("transform", "translate("+margins.left+","+(margins.top+height) + ")")
    .call(xAxis);

    d3.select(".axis")
    .append("g")
    .attr("id", "yAxis")
    .attr("transform", "translate(25, "+margins.top+")")
    .call(yAxis);
    
    drawArray(penguins, xScale, yScale);
}

var drawArray = function(penguins, xScale, yScale)
{
    var quizes = penguins.map(function(penguin){
        return penguin.quizes;
    })
    var quizGrades = quizes.map(function(quiz){
        return quiz.grade;
    })
    
    var arrays = d3.select("#graph")
    .selectAll("g")
    .data(penguins)
    .enter()
    .append("g")
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .on("mouseover", function(d){ 
        d3.select("body").append("img").attr("src", "penguins/" + d.picture)
    })
    .on("mouseout", function(){ d3.select("body").selectAll("img").remove(); })
    
    var lineGenerator = d3.line()
    .x(function(arr, index){
        return xScale(index)
    })
    .y(function(arr)
    {
       return yScale(arr.grade);
    })
    .curve(d3.curveNatural);
    
    arrays.append("path")
    .datum(function(obj){ return obj.quizes })
    .attr("d", lineGenerator);
    
}