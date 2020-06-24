var express = require("express");
var app = express();
var mongoose = require("mongoose");
var methodOverride = require("method-override")

var passport = require("passport")

var localStrategy = require("passport-local")

var bodyParser = require("body-parser")



app.set("view engine", "ejs");


app.get("/", function(req,res) {
    res.render("index")
    
})

app.get("/projects", function(req,res) {
    res.render("projects")
    
})
app.get("/contact", function(req,res) {
    res.render("contact")
    
})

app.listen(process.env.PORT, process.env.IP,function(argument) {
    console.log("server is running");
    
});