var express=require("express");
var app=express();
var methodOverride=require("method-override");
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var expressSanitizer=require("express-sanitizer");

app.set("view engine","ejs");
mongoose.connect("mongodb://localhost/blog_app",{ useNewUrlParser: true , useUnifiedTopology: true });
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

var BlogSchema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    date:{type:Date,default:Date.now}
});

var Blog=mongoose.model("Blog",BlogSchema);

app.get("/",function(req,res){
    res.redirect("/blogs");
});

app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }
        else{
            res.render("index",{blogs:blogs});
        }
    });    
});

app.get("/blogs/new",function(req,res){
    res.render("new");
})

app.post("/blogs",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/");
        }
    });
});

app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundblog){
        if(err){
            console.log(err);
        }
        else{
            res.render("show",{blog:foundblog});
        }
    });
});

app.get("/blogs/:id/edit",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findById(req.params.id,function(err,foundblog){
        if(err){
            console.log(err);
        }
        else{
            res.render("edit",{blog:foundblog});
        }
    });
});

app.put("/blogs/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedblog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err,deletedblog){
        if(err){
            res.redirect("/blogs/"+req.params.id);
        }
        else{
            res.redirect("/blogs");
        }
    })
})

app.listen(3000,function(){
    console.log("Blog app started");
});