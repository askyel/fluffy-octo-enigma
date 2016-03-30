console.log("loaded");

var republicans = ["bush", "carson", "christie", "cruz", "graham", "huckabee", "paul", "rubio", "santorum", "trump"];

var democrats = ["clinton", "omalley", "sanders"];

var diameter = 900,
		format = d3.format(",d"),
		color = d3.scale.linear()
    .domain([0, 1]);

var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1);

var svg = d3.select("body").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");

//create nodes and set attributes based on json data
var makeBubbles = function(error, root){
    if (error) throw error;

    var max = d3.max(root.children, function(d){return d.size;});

    var node = svg.selectAll(".node")
				.data(bubble.nodes(classes(root))
							.filter(function(d) { return !d.children; }))
				.enter().append("g")
				.attr("class", "node")
				.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("circle")
				.style("fill", function(d) { return color(d.value/max); })
				.transition().duration(750)
				.delay(function(d, i){return i * 5})
				.attrTween("r", function(d) {
						var i = d3.interpolate(0, d.r);
						return function(t){ return d.r = i(t);};
				});

    node.append("title")
				.text(function(d) { return d.className + ": " + format(d.value); });

    node.append("text")
				.attr("dy", ".3em")
				.style("text-anchor", "middle")
				.text(function(d) { return d.className.substring(0, d.r / 3); });
}

//change the candidate data to the selected one
var changeCandidate = function(name){
    var path;
    if (republicans.indexOf(name) != -1){
				path = "json/r-" + name + ".json";
				color.range(["white", "red"]);
    }
    else { 
				path = "json/d-" + name + ".json";
				color.range(["white", "blue"]);
    }
    d3.select("svg").selectAll(".node").remove();
    d3.json(path, function(error, root) {makeBubbles(error, root);});
};

// Returns a flattened hierarchy containing all leaf nodes under the root.
function classes(root) {
    var classes = [];

    function recurse(name, node) {
				if (node.children) node.children.forEach(function(child) {recurse(node.name, child); });
				else classes.push({packageName: name, className: node.name, value: node.size});
    }
    
    recurse(null, root);
    return {children: classes};
}


$(document).ready(function(){
    d3.select(self.frameElement).style("height", diameter + "px");
    /*
			var can = democrats.concat(republicans);
			var index = Math.floor(Math.random() * can.length);
			changeCandidate(can[index]);
		*/

		$("#candidates .list-group-item").click(function(e){
				e.preventDefault();
				var text = $(this).text();
				changeCandidate(text.toLowerCase());
				$("#candidates .list-group-item").removeClass("active");
				$(this).addClass("active");
				
				d3.select(".profile").select("img")
						.transition()
						.style("opacity", 0)
						.each("end", function(){
								d3.select(this)
										.attr("src", "images/"+text+".jpg")
										.transition()
										.style("opacity", 1);
						});
				d3.select(".profile").select("p")
						.text(text.toUpperCase());
		});
})

for (i in democrats) {
		d = democrats[i];
		$("#candidates").append(
				"<a href='#' class='list-group-item'>" + 
						"<img src='images/"+d+".jpg' alt='"+d+"' class='img-rounded'>" + 
						d + "</a>"
		);
};

for (i in republicans) {
		r = republicans[i];
		$("#candidates").append(
				"<a href='#' class='list-group-item'>" + 
						"<img src='images/"+r+".jpg' alt='"+r+"' class='img-rounded'>" + 
						r + "</a>"
		);
};
