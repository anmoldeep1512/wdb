var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    request = require("request"),
    bodyParser = require("body-parser"),
    Campground = require("./models/campground"),
	seedDB = require("./seeds");

seedDB();
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});


//Campground.create(
//	{
//		name: "Third",
//		image: "https://images.unsplash.com/photo-1546975490-e8b92a360b24?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60",
//      description: "A cute doggo."
//	}, function(err,campground){
//		if(err){
//			console.log(err);
//		} else {
//			console.log("NEWLY CREATED CAMPGROUND:");
//			console.log(campground);
//		}
//	
//	});


//var campgrounds = [
//	{name: "First", 
//   image: "https://images.unsplash.com/photo-1546975490-e8b92a360b24?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60"}, 
//	{name: "Second", 
//   image: "https://images.unsplash.com/photo-1525253086316-d0c936c814f8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60"}, 
//	{name: "Third", 
//   image: "https://images.unsplash.com/photo-1500879747858-bb1845b61beb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60"}
//];



app.get("/", function(req, res){
	res.render("landing");
});

app.get("/campgrounds", function(req, res){
	Campground.find({}, function(err, allcampgrounds){
		if(err){
			console.log(err);
		} else{
			res.render("index", {campgrounds: allcampgrounds});
		}
	});
});

app.get("/campgrounds/new", function(req, res){
	res.render("new");
});

app.post("/campgrounds", function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newCampground = {name: name, image: image, description: desc};
	
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			res.render("index", {campgrounds:newlyCreated});
		}
	});
	
	res.redirect("/campgrounds");
});

app.get("/campgrounds/:id", function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			console.log(foundCampground);
			
			res.render("show", {campground: foundCampground});
		}
	});
});

app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("YelpCamp has started!");
});
