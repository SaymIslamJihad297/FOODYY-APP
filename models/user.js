const mongoose = require('mongoose');
const {Schema} = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');


let userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
})

userSchema.plugin(passportLocalMongoose); // autometically implement the username, hashing, salting and hashpassword

module.exports = mongoose.model("User", userSchema);