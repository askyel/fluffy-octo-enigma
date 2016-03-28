console.log("loaded");

var republicans = ["bush", "carson", "christie", "cruz", "graham", "huckabee", "paul", "rubio", "santorum", "trump"];

var democrats = ["clinton", "omalley", "sanders"];

var diameter = 900,
    format = d3.format(",d"),
		color = d3.scale.category20c();

var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1);

var svg = d3.select("body").append("svg")
		.attr("width", diameter)
		.attr("height", diameter)
		.attr("class", "bubble");

//change the candidate data to the selected one
var changeCandidate = function(name){
		var path;
		if (republicans.indexOf(name) != -1)
				path = "json/r-" + name + ".json";
		else 
				path = "json/d-" + name + ".json";

		d3.select("svg").selectAll(".node").remove();
		
		d3.json(path, function(error, root) {
				if (error) throw error;

				var node = svg.selectAll(".node")
						.data(bubble.nodes(classes(root))
									.filter(function(d) { return !d.children; }))
						.enter().append("g")
						.attr("class", "node")
						.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

				node.append("title")
						.text(function(d) { return d.className + ": " + format(d.value); });

				node.append("circle")
						.transition().duration(1200)
						.attr("r", function(d) { return d.r; })
						.style("fill", function(d) { return color(d.packageName); });
					

				node.append("text")
						.attr("dy", ".3em")
						.style("text-anchor", "middle")
						.text(function(d) { return d.className.substring(0, d.r / 3); });
		});
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
		
		var can = democrats.concat(republicans);
		var index = Math.floor(Math.random() * can.length);
		changeCandidate(can[index]);

		$(".dropdown-menu li a").click(function(e){
				e.preventDefault();
				var text = $(this).text();
				$(this).parents('.dropdown')
						.find('.dropdown-toggle')
						.html(text+' <span class="caret"></span>');
				changeCandidate(text.toLowerCase());
		});
})
