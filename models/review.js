var mongoose = require("mongoose"); 

// mongoose shema
var ReviewSchema = new mongoose.Schema({
    park: String,
    image: String, 
    description: String, 
    comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
            }
        ],
     author: {
                id: {type: mongoose.Schema.Types.ObjectId, ref: "User"}, 
                username: String
            }
}); 



//mongoose model
module.exports = mongoose.model("Review",ReviewSchema); 