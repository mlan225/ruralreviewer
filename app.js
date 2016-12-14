var express = require("express"); 
var app = express(); 
var mongoose = require("mongoose"); 
var bodyParser = require("body-parser"); 
var methodOverride = require("method-override"); //allows for RESTful routes (delete, update)
var Review = require("./models/review"); //gets the review model from the models/review.js file
var Comment = require("./models/comment"); //connect to the comment.js model
var seedDB = require("./seeds"); //the seed.js file is in the same as app.js so can just have "./seeds"



seedDB(); 
app.set("view engine", "ejs");
app.use(express.static('public')); 
mongoose.Promise = global.Promise; //added this because the internet told me how to solve the mongoose promises problem? ... 
mongoose.connect("mongodb://localhost/ruralreviewer"); 
app.use(bodyParser.urlencoded({extended: true})); //allows usage of body parser.. not sure why :s 
app.use(methodOverride("_method")); //looks for the _method when overriding PUT






//home page
app.get("/", function(req,res){
    res.render("home"); 
});






// INDEX for reviews
//reviews gallery
app.get("/reviews", function(req,res){
    Review.find({},function(err,allReviews){
            if(err){
                console.log(err);
            } else {
                res.render("reviews/reviews", {reviews:allReviews}); 
            }
        })
}); 


//CREATE for reviews
//reviews post route
app.post("/reviews", function(req, res) {
    Review.create(req.body.park, function(err,newPark){
        if(err){
            res.render("new");
        } else {
            res.redirect("/reviews"); 
        }
    });
}); 


//CREATE
//the new review creation screen
app.get("/reviews/new", function(req, res) {
    res.render("reviews/new"); 
}); 


//SHOW ROUTE
//The show page for a review
app.get("/reviews/:id", function(req, res) {
    Review.findById(req.params.id).populate("comments").exec(function(err,foundReview){ //find review, populate comments on review, excecute query
       if(err){
           console.log(err); 
       } else {
        res.render("reviews/show", {review:foundReview}); 
        }
    }); 
});

//EDIT ROUTE
//goes to edit form
app.get("/reviews/:id/edit", function(req, res) {
    Review.findById(req.params.id, function(err,foundReview){
       if(err){
           console.log(err); 
       } else {
        res.render("reviews/edit", {park:foundReview}); 
        }
    }); 
});

//UPDATE ROUTE 
//actually update the information
app.put("/reviews/:id", function(req,res){
   Review.findByIdAndUpdate(req.params.id, req.body.park, function(err,updatedPark){
      if(err){
          res.redirect("/reviews"); 
      } else {
          res.redirect("/reviews"); 
      }
   }); 
});


//DESTROY ROUTE
//deletes item from database
app.delete("/reviews/:id", function(req,res){
    Review.findByIdAndRemove(req.params.id, function(err,deletedPark){
        if(err){
            res.redirect("/reviews");
        } else {
            console.log("Deleted " + deletedPark); 
            res.redirect("/reviews"); 
        }
    }); 
}); 

//=================================================================
    //COMMENTS ROUTS
//=================================================================


app.get("/reviews/:id/comments/new", function(req,res){
    Review.findById(req.params.id, function(err, review){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {review: review}); 
        }
    });
});


app.post("/reviews/:id/comments", function(req,res){
    Review.findById(req.params.id, function(err, review) {
        if(err){
            console.log(err); 
        }else{ 
  
            Comment.create(req.body.comment, function(err, comment){ //look into the request body and get the park objects. Because I used the square brackets on the comments/new.ejs file
                if(err){
                    console.log(err); 
                }else{
                    review.comments.push(comment); //found review in the first callback, then the comments array in the review.ejs, and push to comment to that array
                    review.save(); 
                    res.redirect("/reviews/" + review._id); //take the id from the first callback function and use the id 
                }
            }); 
        }
    }); 
});
































//about page
app.get("/about", function(req, res) {
    res.render("about"); 
}); 


//contact page
app.get("/contact", function(req, res) {
    res.render("contact"); 
}); 




app.listen(process.env.PORT, process.env.IP, function(){
    console.log("RuralReviewer server has started!");
}); 