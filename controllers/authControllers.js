const User = require("../models/User");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");


const authController = {
    //Register
    registerUser: async (req, res) => {
        try {
            const hashed = await bcrypt.hash(req.body.password, 10);

            //Creat new user
            const newUser = new User({
                email: req.body.email,
                password: hashed,
            });

            //Save to DB
            const user = await newUser.save();
            res.status(200).json({
                isSuccess: true,
                data: user
            });
        } catch (error) {
            console.log("🚀 ~ registerUser:async ~ error:", error)

            res.status(500).json(error);
        }
    },
// GENERATE ACCESS TOKEN
generateAccessToken: (user)=>{
    return jwt.sign(
        {
            id: user._id,
            admin: user.admin
        },
        process.env.JWT_ACCESS_SECRET,
        {expiresIn: "300s"}
    );
},
// GENERATE REFRESH TOKEN
generaterefreshToken: (user)=>{
    return jwt.sign(
        {
            id: user._id,
            admin: user.admin
        },
        process.env.JWT_REFRESH_SECRET,
        {expiresIn: "300s"}
    );
},

    loginUser: async (req, res) => {
        try {
            const userRepo =  new User()

            const user = await userRepo.collection.findOne({
                "email": req.body.email
            })

            if (user == null) {
                res.status(200).json({
                    "isSuccess": false,
                    "errMessage": "User not found",
                    "data": null
                })
            }

            console.log( user)

            var isMatch = await bcrypt.compare(req.body.password, user.password)

            if (isMatch) {
                const token = authController.generateAccessToken(user);
                const refreshToken = authController.generaterefreshToken(user);
                return res.status(200).json({
                    "isSuccess": true,
                    "user": user,
                    "token": token,
                    "refreshtoken": refreshToken
                });
            } else {
                res.status(200).json({
                    "isSuccess": false,
                    "errMessage": "password incorrect"
                })
            }

        } catch (error) {
            console.log("🚀 ~ loginUser:async ~ error:", error)
            res.status(500).json(error);
        }
    }

}

module.exports = authController;