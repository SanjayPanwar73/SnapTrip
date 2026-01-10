const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type: String,
        required: true,
    },
    favorites: [{
        type: Schema.Types.ObjectId,
        ref: "Listing"
    }]
});

// Add indexes for better query performance
// Note: email index is automatically added by passport-local-mongoose
userSchema.index({ favorites: 1 });

userSchema.plugin(passportLocalMongoose);//its automaticly add username and password
module.exports = mongoose.model('User', userSchema);

