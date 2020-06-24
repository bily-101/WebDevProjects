var express = require("express");
var app = express();
var mongoose = require("mongoose");
var methodOverride = require("method-override")

var bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
mongoose.connect("mongodb://localhost/SMITH");
app.set("view engine", "ejs");


//SCHEMA
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
})


var photoKey = mongoose.model("campground", campgroundSchema);


var Blog = mongoose.model("Blog", blogSchema);


//BLOG

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



app.get("/",function(req,res){
   res.render("home") 
});


app.get("/campgrounds",function(req,res) {
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

app.post("/campgrounds",function(req,res) {
var name = req.body.name;
var image = req.body.image;
var desc = req.body.description;
var picInfo = {name: name, image: image, description: desc}
    
    photoKey.create(picInfo,function(err, created) {
        if (err) {
            res.redirect("/error");
        }else {
         res.redirect("/campgrounds")   
        }
    })
    

});


app.get("/error", function(req, res) {
   res.render("error") 
});

app.get("/photos/:id",function(req, res) {
    photoKey.findById(req.params.id, function(err, Pictures) {
        if (err) {
            console.log(err)
        }else{
        
             res.render("More_Info",{picInfo: Pictures});  
            
        }
    })
    req.params.id
   
});
    
    
    app.get("/game", function(req, res) {
       res.render("game1") 
    });


app.get("/campgrounds/new",function(req, res) {
   res.render("new.ejs"); 
});

app.listen(process.env.PORT, process.env.IP,function(argument) {
    console.log("server is running");
});