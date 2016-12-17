var mongoose = require("mongoose"); 
var Review = require("./models/review"); //require the review.js modle of Review
var Comment = require("./models/comment"); // include the comment.js model

var data = [
        {
            park: "Pepe Mountain", 
            image: "http://i2.cdn.cnn.com/cnnnext/dam/assets/160927210830-tk-ah0927-exlarge-169.jpg", 
            description: "Vestibulum blandit egestas nisl at rhoncus. Proin ut enim aliquet, consequat eros eu, ultricies est. Donec leo dui, facilisis vel auctor et, iaculis et odio. Phasellus tincidunt quis sapien quis aliquam. Quisque porttitor porta risus, vitae bibendum sapien ultrices et. Morbi sed hendrerit mauris. Sed laoreet enim at pulvinar posuere. Vivamus volutpat purus eget purus egestas vestibulum. Pellentesque ac ante condimentum, ullamcorper ligula et, rhoncus eros. Fusce tincidunt aliquet mauris eu posuere. Morbi at tristique ante. Suspendisse vitae lorem consequat, facilisis felis vel, volutpat orci. Fusce mi turpis, sollicitudin eu neque vitae, tristique fringilla risus. Nam justo quam, rhoncus venenatis tellus vel, finibus sollicitudin diam."
        },
        
        {
            park: "Pepe Mountain", 
            image: "http://i2.cdn.cnn.com/cnnnext/dam/assets/160927210830-tk-ah0927-exlarge-169.jpg", 
            description: "Vestibulum blandit egestas nisl at rhoncus. Proin ut enim aliquet, consequat eros eu, ultricies est. Donec leo dui, facilisis vel auctor et, iaculis et odio. Phasellus tincidunt quis sapien quis aliquam. Quisque porttitor porta risus, vitae bibendum sapien ultrices et. Morbi sed hendrerit mauris. Sed laoreet enim at pulvinar posuere. Vivamus volutpat purus eget purus egestas vestibulum. Pellentesque ac ante condimentum, ullamcorper ligula et, rhoncus eros. Fusce tincidunt aliquet mauris eu posuere. Morbi at tristique ante. Suspendisse vitae lorem consequat, facilisis felis vel, volutpat orci. Fusce mi turpis, sollicitudin eu neque vitae, tristique fringilla risus. Nam justo quam, rhoncus venenatis tellus vel, finibus sollicitudin diam."
        },
        
        {
            park: "Pepe Mountain", 
            image: "http://i2.cdn.cnn.com/cnnnext/dam/assets/160927210830-tk-ah0927-exlarge-169.jpg", 
            description: "Vestibulum blandit egestas nisl at rhoncus. Proin ut enim aliquet, consequat eros eu, ultricies est. Donec leo dui, facilisis vel auctor et, iaculis et odio. Phasellus tincidunt quis sapien quis aliquam. Quisque porttitor porta risus, vitae bibendum sapien ultrices et. Morbi sed hendrerit mauris. Sed laoreet enim at pulvinar posuere. Vivamus volutpat purus eget purus egestas vestibulum. Pellentesque ac ante condimentum, ullamcorper ligula et, rhoncus eros. Fusce tincidunt aliquet mauris eu posuere. Morbi at tristique ante. Suspendisse vitae lorem consequat, facilisis felis vel, volutpat orci. Fusce mi turpis, sollicitudin eu neque vitae, tristique fringilla risus. Nam justo quam, rhoncus venenatis tellus vel, finibus sollicitudin diam."
        }
    ]
    
    
function seedDB(){
    Comment.remove({}, function(err){
        if(err){
            console.log(err); 
        }else{
            console.log("removed comments!");            //code here does not account for using a username of user
        }
    }); 
    
    
    Review.remove({},function(err){
        if(err){
            console.log(err); 
        } else {
            console.log("removed reviews!"); 
            
    //         data.forEach(function(seed){
    //             Review.create(seed, function(err,review){
    //                 if(err){
    //                     console.log(err); 
    //                 }else{
    //                     console.log("added a campground");
    //                     //create a comment
    //                     Comment.create({ //Comment model
    //                         text: "This meme is so dank it burns my retnas", 
    //                         author: "The Alt Right"
    //                     }, function(err,comment){
    //                         if(err){
    //                             console.log(err); 
    //                         }else{
    //                             review.comments.push(comment); //push the review/comment variable from callbacks into the Comment model in other file
    //                             review.save(); //save push, always save after push ? 
    //                             console.log("created new comment"); 
    //                         }
    //                     }); 
    //                 }
    //             });   
    //         });
        }
    }); 
}

module.exports = seedDB; //kind of like a return, will return the seedDB function when used in another file