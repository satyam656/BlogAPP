const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const expressSanitizer = require("express-sanitizer");

mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(express.static("public"));
app.use(methodOverride('_method'));
app.set("view engine","ejs");

// Mongoose model config
const blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
})
const Blog = mongoose.model("Blog",blogSchema);

//restful routes

app.get("/",(req,res)=>{
	res.redirect("/blogs");
});
// INDEX routes
app.get("/blogs",(req,res)=>{
	Blog.find({},(err,blogs)=>{
		if(err){
			console.log(err);
		}else {
			res.render("index",{blogs: blogs});
		}
	})
});
// NEW routes
app.get("/blogs/new",(req,res)=>{
	res.render("new");
});
//CRETAE routes
app.post("/blogs",(req,res)=>{
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog,(err,blog)=>{
		if(err){
			res.render("new");
		} else {
			// them redirect to the index
			res.redirect("/blogs");
		}
	})
});
// SHOW routes
app.get("/blogs/:id",(req,res)=>{
	Blog.findById(req.params.id,(err,foundBlog)=>{
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("show",{blog:foundBlog});
		}
	})
});
// EDIT routes
app.get("/blogs/:id/edit",(req,res)=>{
	Blog.findById(req.params.id,(err,foundBlog)=>{
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("edit",{blog: foundBlog});
		}
	})
	
});
//UPDATE routes
app.put("/blogs/:id",(req,res)=>{
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,(err,updatedBlog)=>{
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs/"+req.params.id);
		}
	})
});
//DELETE routes
app.delete("/blogs/:id",(req,res)=>{
	//destroy post
	Blog.findByIdAndRemove(req.params.id,(err)=>{
		if(err){
			res.redirect("/blogs");
		} else{
			//redirect somewhere
			res.redirect("/blogs");
		}
	})
});
app.listen(3000,()=>{
	console.log("server started!");
});