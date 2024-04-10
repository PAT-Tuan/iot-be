const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {

        email:{
            type: String,
            required: true,
            minlength: 15,
            maxlength: 50,
            unique: true
        },
        password:{
            type: String,
            required: true,
            minlength: 8,
        },
        admin:{
            type: Boolean,
            default: false,
        },
    }, 
    {timestamps: true}
);
    module.exports = mongoose.model("User",userSchema);