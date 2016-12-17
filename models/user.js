var mongoose = require("mongoose"); 
var passportLocalMongoose = require("passport-local-mongoose"); //used on user model

var userSchema = new mongoose.Schema({
    username: String, 
    password: String
});

userSchema.plugin(passportLocalMongoose); //allows for passports methods within the model before it is exported

module.exports = mongoose.model("User", userSchema); 