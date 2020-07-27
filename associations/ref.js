var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/blog_demo_2", {useNewUrlParser: true});

var Post = require("./model/posts");

var User = require("./model/user");

Post.create({
	title: "meh6",
	content: "blah"
}, function(err, post){
	User.findOne({email: "hi"}, function(err, foundUser){
		if(err){
			console.log(err);
		} else {
			foundUser.posts.push(post);
			foundUser.save(function(err, data){
				if(err){
					console.log(err);
				} else {
					console.log(data);
				}
			});
		}
	});
});

//User.create({
//	email:"hi",
//	name:"bye"
//});

//User.findOne({email: "hi"}).populate("posts").exec(function(err, user){
//	if(err){
//		console.log(err);
//	} else {
//		console.log(user);
//	}
//});