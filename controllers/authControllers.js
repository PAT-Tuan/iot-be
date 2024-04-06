const User = require("../models/User");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");


const authController = {
    //Register
    registerUser: async (req, res) => {
        try {
            const hashed = await bcrypt.hash(req.body.password, 10);

            //Creat new user
            const newUser = await new User({
                username: req.body.username,
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

    loginUser: async (req, res) => {
        try {
            const userRepo =  new User()

            const user = await userRepo.collection.findOne({
                "email": req.body.email
            })

            if (user == null) {
                res.status(200).json({
                    "isSuccess": false,
                    "errMessage": "not found user",
                    "data": null
                })
            }

            console.log( user)

            var isMatch = await bcrypt.compare(req.body.password, user.password)

            if (isMatch) {
                res.status(200).json({
                    "isSuccess": true,
                })
            } else {
                res.status(200).json({
                    "isSuccess": false,
                    "errMessage": "password not true"
                })
            }

        } catch (error) {
            console.log("🚀 ~ loginUser:async ~ error:", error)
            res.status(500).json(error);
        }
    }

}

module.exports = authController;