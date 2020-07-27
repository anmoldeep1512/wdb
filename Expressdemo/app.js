var express = require("express");
var app = express();
var bodyParser = require("body-parser");

var friends = ["Chandler", "Joey", "Monica", "Phoebe", "Rachel", "Ross"];

app.use(bodyParser.urlencoded({exxtended: true}));

app.set("view engine", "ejs");

app.get("/", function(req, res){
	res.render("home");
});

 app.post("/addfriend", function(req, res){
	 var newFriend = req.body.newfriend;
	 friends.push(newFriend);
	res.redirect("/friends") ;
 });

app.get("/friends", function(req, res){
	res.render("friends", {friends: friends});
});

app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("Server Started!!");
});