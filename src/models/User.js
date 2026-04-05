

const mongoose = require("mongoose");

const UserSchema= new mongoose.Schema({
    name: String,
    email:{type:String ,unique:true},
    password: String,
    role:{
        type:String,
        enum:["viewer","analyst","admin"],
        default:"viewer",
    },
    status:{
        type:String,
        enum:["active","inactive"],
        default:"active",
    },


},{timestamps:true});

module.exports= mongoose.model("User",UserSchema);  