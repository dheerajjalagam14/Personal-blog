//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
mongoose.connect('mongodb+srv://admin-jalagam:jalagam@cluster-blog-tg8ls.mongodb.net/blogDB', {useNewUrlParser: true});

const postSchema = new mongoose.Schema({
  title:{
    type:String,
    required: true
  },
  content:{
      type:String,
      required: true
    }
});

const Post = mongoose.model("Post",postSchema);


const homeStartingContent = "How's it going by the way ?  Since you already know my name and enough about me, I wouldnt waste your time here. I mostly write here anything that I'd like to stand out. Take some time, Feel free to read anything which interests you.";
const aboutContent = "I am Dheeraj Kumar Jalagam, an aspiring Web developer from Hattiesburg, Mississippi. I have graduated from University Of Southern Mississippi with a Masters title in Computer Science. I ❤️ to code and my code needs ☕️  to compile.  "
const contactContent = "for everything else, please 📧  and I will get back to you asap. Thank You";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", function(req, res){

  Post.find({},function(err,posts){
  res.render("home", {
    homeContent: homeStartingContent,
    posts: posts
    });
  });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });

});

app.get("/posts/:postId", function(req, res){
  const requestedpostId = req.params.postId;

  Post.findOne({_id:requestedpostId},function(err,post){
      res.render("post", {
        title: post.title,
        content: post.content
      });
    });
  });;

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
