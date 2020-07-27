var mongoose = require("mongoose")
var Campground = require("./models/campground")
var Comment = require("./models/comment");

var data = [
	{
		name: "First",
  		image: "https://images.unsplash.com/photo-1546975490-e8b92a360b24?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60",
        description: "A cute doggo."
	},
	{
		name: "Second", 
		image: "https://images.unsplash.com/photo-1500879747858-bb1845b61beb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60",
		description: "A cute doggo."
	},
	{
		name: "Third", 
		image: "https://images.unsplash.com/photo-1525253086316-d0c936c814f8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60",
		description: "A cute doggo."
	}
]

function seedDB(){
	//Remove Campgrounds
	Campground.remove({}, function(err){
		if(err){
			console.log(err);
		} else
		console.log("removed campgrounds!");
		//Add Campgrounds
	
    	data.forEach(function(seed){
    		Campground.create(seed, function(err, campground){
    			if(err){
    				console.log(err)
    			} else {
    				console.log("added a campground.");
					//Comments
					Comment.create(
						{
							text: "Nice",
							author: "Random"
						}, function(err, comment){
							if(err){
								console.log(err);
							} else {
								campground.comments.push(comment);
								campground.save();
								console.log("Created new comment");
							}
							
						});
					}
    			}
    		);
    	});
	});
	
	
	
	//Add Comments
}

module.exports = seedDB;