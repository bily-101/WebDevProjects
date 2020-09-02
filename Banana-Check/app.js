var express = require("express");
var app = express();
var mongoose = require("mongoose");
var methodOverride = require("method-override")
const sgMail = require('@sendgrid/mail');

var fs = require('fs'); 
var path = require('path'); 
require('dotenv/config');
var multer = require('multer'); 

//Require 
var passport = require("passport")

var localStrategy = require("passport-local")
var User = require("./models/user")
var bodyParser = require("body-parser")
var post = require("./models/post")
var rating = require("./models/rating")
//use
app.use(require("express-session")({
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

 passport.use(new localStrategy(User.authenticate()));
 passport.serializeUser(User.serializeUser());
 passport.deserializeUser(User.deserializeUser());


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));

app.use(function (req,res, next) {
    res.locals.currentUser = req.user;
    
    next();
})

mongoose.connect("mongodb+srv://bily:Zikkomodolinobal@cluster0-6fdpa.mongodb.net/massiveBrain?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
 console.log("connected")   
}).catch(err=> {
    console.log(err)
});

app.set("view engine", "ejs");

app.get("/register", function(req, res){
   res.render("register"); 
});
//handling user sign up
app.post("/register", function(req, res){
    User.register(new User({username: req.body.username,email:req.body.email}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        
        passport.authenticate("local")(req, res, function(){
           res.redirect("/can");
        });
    });
});

// LOGIN ROUTES
//render login form
app.get("/login", function(req, res){
   res.render("login"); 
});


//assets

app.get("/newPost", function(req, res) {
    res.render("newPost", {post: post})
})

app.get("/can", function(req,res) {
   post.find({},function(err,posts) {
        if (err) {
            console.log(err)
        }else{
               res.render("can.ejs",{posts: posts})
        }
   })

});
app.post("/can",function(req,res) {
    post.create(req.body.post,function(err, post) {
       
       
        if (err) {
            console.log("err")
     
            res.render("/")
        }else{
            post.user.id = req.user._id;
            post.user.username = req.user.username;
            
            res.redirect("/");
            
        }
    })
})


//login logic
//middleware
app.post("/login", passport.authenticate("local", {
    successRedirect: "/can",
    failureRedirect: "/login"
}) ,function(req, res){
    
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});


app.get("/can/:id", function(req, res) {
    post.findById(req.params.id,function(err,foundPost) {
    if(err) {
        res.send("error");
    }else{
        
  rating.find({}, function(err,rating){
      if (err) {
            console.log(err)
        }else{
   res.render("candy", {post:foundPost, rating: rating}); 
            
        }
  });

    }
});
});
app.post("/can/:id", function(req, res) {
        rating.create(req.body.rating,function(err, rating) {
        if (err) {
            res.render("/")
        }else{
            
        res.redirect("/can")
            
        }
    })
});


app.get("/", function(req,res){
	if(!req.user) {
	res.render("index.ejs");
	}else{
	    res.redirect("/can")
	}
	
});


app.get("/about", function(req,res){
	res.render("about.ejs");
});


//rating


app.listen(process.env.PORT, function () {
  console.log('Example app listening on port 8080!');
});
