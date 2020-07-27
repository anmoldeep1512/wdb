var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/blog_demo", {useNewUrlParser: true});

var postSchema = new mongoose.Schema({
	title: String,
	content: String
});

var Post = mongoose.model("Post", postSchema);

var userSchema = new mongoose.Schema({
	email: String,
	name: String,
	posts: [postSchema]
});

var User = mongoose.model("User", userSchema);

//var newUser = new User({
//	email:"hi",
//	name:"bye",
//});

//newUser.posts.push({
//	title:"meh",
//	content:"noice"
//});

//newUser.save(function(err, user){
//	if(err){
//		console/log(err);
//	} else {
//		console.log(user);
//	}
//});

User.findOne({email: "hi"}, function(err, user){
	if(err){
		console.log(err)
	} else {
		user.posts.push({
			title:"meh", 
			content:"wow"
		});
		user.save(function(err, user){
			if(err){
				console.log(err);
			} else {
				console.log(user);
			}
		})
	}
});