var express = require("express");
var app = express();
var mongoose = require("mongoose");
var methodOverride = require("method-override")


//Require 
var passport = require("passport")

var localStrategy = require("passport-local")
var photoKey = require("./models/photos")
var Comment = require("./models/comment")
var User = require("./models/user")
var Blog = require("./models/blog")

//body parser
var bodyParser = require("body-parser")

//use

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
mongoose.connect("mongodb://localhost/KEEY");
app.set("view engine", "ejs");


//Blog get requests
app.get("/blogs", function(req,res) {
   Blog.find({},function(err,blogs) {
        if (err) {
            console.log(err)
        }else{
               res.render("blog",{blogs: blogs})
        }
   })

});

app.get("/blogs/new",function(req, res) {
    res.render("newBLOG");    
});

app.post("/blogs",function(req,res) {
    Blog.create(req.body.blog,function(err, newBlog) {
        if (err) {
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    })
})

app.delete("/blogs/:id/",function(req,res) {
   Blog.findByIdAndRemove(req.params.id,function(err)
   {
       if(err){
           res.redirect("/blogs")
       }else{
           
           res.redirect("/blogs")
       }
   })
});

app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if (err) {
            res.redirect("o")
        }else{
            res.render("edit",{blog: foundBlog});
        }
    })
    
});

app.put("/blogs/:id", function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err, updatedBlog) {
        if (err) {
            res.redirect("/Blogs");
        }else{
            res.redirect("/blogs/"+ req.params.id);
        }
    })
})

app.get("/blogs/:id",function(req, res) {
Blog.findById(req.params.id,function(err,foundBlog) {
    if(err) {
        res.send("error");
    }else{
        res.render("show",{blog: foundBlog});
    }
})
});



//home


app.get("/",function(req,res){
   res.render("home") 
});


//photos

app.get("/photos",function(req,res) {
//get all photots from db
photoKey.find({}, function(err, allcampgrounds) {
   if (err) {
       console.log(err)
   } else {
       res.render("index",{campgrounds: allcampgrounds})
       
   }
})
        // res.render("campgrounds",{campgrounds: campgrounds})
});


app.post("/photos",function(req,res) {
var name = req.body.name;
var image = req.body.image;
var desc = req.body.description;
var picInfo = {name: name, image: image, description: desc}
    
    photoKey.create(picInfo,function(err, created) {
        if (err) {
            res.redirect("/error");
        }else {
         res.redirect("/photos")   
        }
    })
    

});

app.get("/error", function(req, res) {
   res.render("error") 
});

app.get("/photos/:id",function(req, res) {
    photoKey.findById(req.params.id).populate("comments").exec(function(err, Pictures) {
        if (err) {
            console.log(err);
        }else{
        console.log(Pictures)
             res.render("More_Info",{picInfo: Pictures});  
            
        }
    })
    req.params.id
   
});
    
app.get("/campgrounds/new",function(req, res) {
   res.render("new"); 
});


//comments 
//comments 
//comments 


//listen
 
app.listen(process.env.PORT, process.env.IP,function(argument) {
    console.log("server is running");
});