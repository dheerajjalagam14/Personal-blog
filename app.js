//jshint esversion:6

const express = require("express")
const ipfilter = require("express-ipfilter").IpFilter
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const ips = process.env.IP_ADDR;
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


const homeStartingContent = "Howdy Friend, I mostly write stuff I feel should stand out in my life. I know it's not a lot, Yeah I'm not one of those daily blogger.";
const aboutContent = "I am Dheeraj Kumar Jalagam, Web Dev from Dallas. I am a Proud Alumni of University Of Southern Mississippi with a Masters title in Computer Science. I ❤️ to code and somedays my code needs ☕️ to compile."
const contactContent = "Please 📧 and I will get back to you asap. Thank You";

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

app.get("/compose", ipfilter(ips, { mode: 'allow' }), function(req, res){
  res.render("compose");
});

app.post("/compose", ipfilter(ips, { mode: 'allow' }), function(req, res){
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
});

app.listen(process.env.PORT||3000, function() {
  console.log("Server started on port 3000");
});
