var express = require("express");
var app = express();

app.get("/" , function(req , res){
	res.send("Hi there!!");
});

app.get("/speak/:animal", function(req, res){
	var sounds = {
		pig: "Oink",
		cow: "Moo",
		dog: "Bow",
		cat: "Meow",
		fish: "...."
	}
	var animal = req.params.animal.toLowerCase();
	var sound = sounds[animal];
	res.send("The " + animal + " says " + sound)
});

app.get("/repeat/:string/:number", function(req , res){
	var s = req.params.string;
	var n = Number(req.params.number);
	var result = "";
	for(var i = 0; i < n; i++)
		{
			result += s + " ";
		}
	res.send(result);
});

app.get("*", function(req, res){
	res.send("PAGE NOT FOUND");
});

app.listen(process.env.PORT || 3000 , process.env.IP , function(){
	console.log("Server has Started!!!");
});