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

var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index");

// seedDB();
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

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("YelpCamp has started!");
});
