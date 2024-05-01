const mongoose = require("mongoose");
const { type } = require("os");

const orderSchema = new mongoose.Schema(
    {
        user_id:{
            type: String,
            required: true,
            minlength: 8,
        },
        user_email :{
            type: String,  
        },
        products:[{
            id:{
                type: String,
                required: true,
            },
            title:{
                type: String,
                required: true,
            },
            image:{
                type: String,
                required: true,
            },
            price:{
                type: Number,
                required: true,
            },
            quantity:{
                type: Number,
                required: true,
            }
        }],
        total:{
            type: Number,
            required: true,
        }
    }, 
    {timestamps: true}
);
    module.exports = mongoose.model("Order",orderSchema);