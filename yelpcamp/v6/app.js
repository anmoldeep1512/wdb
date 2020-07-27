var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    request = require("request"),
	passport = require("passport"),
	LocalStratergy = require("passport-local"),
    bodyParser = require("body-parser"),
    Campground = require("./models/campground"),
	seedDB = require("./seeds"),
	User = require("./models/user"),
	Comment = require("./models/comment");

seedDB();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname +"/public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});

app.use(require("express-session")({
	secret: "Woww!",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});


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


// ====== LANDING ==========
app.get("/", function(req, res){
	res.render("landing");
});

// ======== INDEX ===========
app.get("/campgrounds", function(req, res){
	Campground.find({}, function(err, allcampgrounds){
		if(err){
			console.log(err);
		} else{
			res.render("campgrounds/index", {campgrounds: allcampgrounds});
		}
	});
});

// ======= NEW ===========
app.get("/campgrounds/new", function(req, res){
	res.render("campgrounds/new");
});

// ========= CREATE ===========
app.post("/campgrounds", function(resq, res){
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newCampground = {name: name, image: image, description: desc};
	
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds:newlyCreated});
		}
	});
	
	res.redirect("/campgrounds");
});

// ========== SHOW =============
app.get("/campgrounds/:id", function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			console.log(foundCampground);
			
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

// ======================
// COMMENTS ROUTES
// ======================

// ====== NEW ==========
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    })
});

// ========= CREATE ===========
app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               campground.comments.push(comment);
               campground.save();
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
});


//  ========
//  AUTH ROUTES
//  =========


// =========== REGISTER ===========
app.get("/register", function(req, res){
	res.render("register");
});
app.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/campgrounds");
		});
	});
});

// ========== LOGIN ===============
app.get("/login", function(req, res){
	res.render("login");
});
app.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), function(req, res){
});

// ========== LOGOUT ==============
app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/campgrounds");
});


function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} 
	res.redirect("/login");
}


app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("YelpCamp has started!");
});
