var express = require("express"); 
var app = express(); 
var mongoose = require("mongoose"); 
var bodyParser = require("body-parser"); 
var methodOverride = require("method-override"); //allows for RESTful routes (delete, update)
var Review = require("./models/review"); //gets the review model from the models/review.js file
var Comment = require("./models/comment"); //connect to the comment.js model
var seedDB = require("./seeds"); //the seed.js file is in the same as app.js so can just have "./seeds"

var passport = require("passport"); 
var localStrategy = require("passport-local"); 
var User = require("./models/user"); 


//============================
 //PASSPORT AUTHENTICATION

app.use(require("express-session")({
    secret: "I hope nobody figures this out",
    resave: false, 
    saveUninitialized: false //when getting a depricated message in the terminal, this is most likely spelled wrong 
})); 

app.use(passport.initialize()); 
app.use(passport.session()); 
passport.use(new localStrategy(User.authenticate())); 

passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser()); 

//============================



app.use(function(req,res,next){ //need next to move on to next middleware
    res.locals.currentUser = req.user; 
    next(); 
});


// seedDB(); 



app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public')); 
mongoose.Promise = global.Promise; //added this because the internet told me how to solve the mongoose promises problem? ... 

// mongoose.connect("mongodb://ruralreviewer:rural@ds133418.mlab.com:33418/ruralreviewer"); //when using mongo labs use this!
app.use(bodyParser.urlencoded({extended: true})); //allows usage of body parser.. not sure why :s 
app.use(methodOverride("_method")); //looks for the _method when overriding PUT

var url = process.env.DATABASEURL || "mongodb://localhost/ruralreviewer" //<--- if env variable doesnt work or doesnt exist, then use the localhost link as the 'url' variable
mongoose.connect(url); //set DATABASEURL to equal the localhost link using export DATABASEURL=mongodb://localhost/ruralreviewer in terminal
//set the environment variable to be localhost on the local machine, but on heroku make the environment variable = to the mongo labs url

//the environment variable will allow someone else to use a different localhost than other users




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


//reviews POST route
app.post("/reviews",isLoggedIn, function(req, res) {
    
    var park = req.body.park;
    var image = req.body.image;  //manually get all the inputs from the form so we can iclude the author object into the Review.create
    var desc = req.body.desc; 
    var author = 
        {
            id: req.user._id, 
            username: req.user.username
        };
    var newReview = {park:park, image:image, description:desc, author:author};  //added author id and username info into the create
    Review.create(newReview, function(err,newPark){  //creates all the data as one object in the database if they also exist in the objects in the reviews.js file
        if(err){
            console.log(err);
        } else {
            res.redirect("/reviews"); 
        }
    });
}); 


//CREATE
//the new review creation screen
app.get("/reviews/new",isLoggedIn, function(req, res) {
    res.render("reviews/new"); 
}); 


//SHOW ROUTE
//The show page for a review
app.get("/reviews/:id",isLoggedIn, function(req, res) {
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
app.get("/reviews/:id/edit",isLoggedIn, function(req, res) {
    Review.findById(req.params.id, function(err,foundReview){
       if(err){
           console.log(err); 
       } else {
           
          var author = foundReview.author.username; 
          var currentUser = req.user.username; 
           
          if(author != currentUser){
              console.log("must be the author of a post to edit"); 
              res.redirect("/reviews"); 
          }else{
                res.render("reviews/edit", {park:foundReview}); 
          }
       }
    }); 
});

//UPDATE ROUTE 
//actually update the information
app.put("/reviews/:id",isLoggedIn, function(req,res){
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
app.delete("/reviews/:id",isLoggedIn, function(req,res){
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


app.get("/reviews/:id/comments/new",isLoggedIn, function(req,res){
    Review.findById(req.params.id, function(err, review){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {review: review, currentUser:req.user});  //passing a variable equal to req.user will have the user log in information (username and id NOT PASSWORD)
        }
    });
});


app.post("/reviews/:id/comments",isLoggedIn, function(req,res){
    Review.findById(req.params.id, function(err, review) {
        if(err){
            console.log(err); 
        }else{ 
  
            Comment.create(req.body.comment, function(err, comment){ //look into the request body and get the park objects. Because I used the square brackets on the comments/new.ejs file
                if(err){
                    console.log(err); 
                }else{
                    //add username and id to comment
                    comment.author.id = req.user._id;  //the "Comment" model has a attribute called "author" with 2 objects --> id and username
                    comment.author.username = req.user.username; 
                    //save comment 
                    comment.save(); 
                    review.comments.push(comment); //found review in the first callback, then the comments array in the review.ejs, and push to comment to that array
                    review.save(); 
                    res.redirect("/reviews/" + review._id); //take the id from the first callback function and use the id 
                }
            }); 
        }
    }); 
});



//=================================================================
    //AUTH ROUTES
//=================================================================

//register page
app.get("/register", function(req, res) {
    res.render("register"); 
}); 

//register post route
app.post("/register", function(req,res){
    var newUser = new User({username: req.body.username}); 
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err); 
            return res.render("register"); //this will stop any processes and send the user to the register page
        }
        passport.authenticate("local")(req, res, function(){
                res.redirect("/reviews");
                console.log("made it past the auth");
        }); 
    }); 
}); 

//login logic
//log in page
app.get("/login", function(req, res) {
    res.render("login");
}); 

//login post
app.post("/login",passport.authenticate("local",  //passport.authenticate method with a argument of local and an object with success and failure 
    {
        successRedirect: "/reviews", 
        failureRedirect: "/login"
    }), function(req, res) {
}); 


//logout
app.get("/logout", function(req,res){
   req.logout(); 
   res.redirect("/reviews"); 
});




//about page
app.get("/about", function(req, res) {
    res.render("about"); 
}); 


//contact page
app.get("/contact", function(req, res) {
    res.render("contact"); 
}); 



//=========================================
    //FUNCTIONS
    
    
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }               
    res.redirect("/login"); 
}; 

//=========================================


app.listen(process.env.PORT, process.env.IP, function(){ //environment variables
    console.log("RuralReviewer server has started!");
}); 

