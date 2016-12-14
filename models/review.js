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
        ]
}); 



//mongoose model
module.exports = mongoose.model("Review",ReviewSchema); 