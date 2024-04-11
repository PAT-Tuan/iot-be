const User = require("../models/User");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { error } = require("console");

let refreshTokens = [];
console.log("🚀 ~ refreshTokenSSS:", refreshTokens);
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
    generateAccessToken: (user) => {
        return jwt.sign(
            {
                id: user._id,
                admin: user.admin
            },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: "35s" }
        );
    },
    // GENERATE REFRESH TOKEN
    generaterefreshToken: (user) => {
        return jwt.sign(
            {
                id: user._id,
                admin: user.admin
            },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "365d" }
        );
    },

    loginUser: async (req, res) => {
        try {
            const userRepo = new User()

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

            console.log(user)

            var isMatch = await bcrypt.compare(req.body.password, user.password)

            if (isMatch) {
                const token = authController.generateAccessToken(user);
                const refreshToken = authController.generaterefreshToken(user);
                
                // push refreshToken
                refreshTokens.push(refreshToken);
                
                //save cookie
                res.cookie("refreshToken", refreshToken,{
                    httpOnly:true,
                    secure: false,
                    path: "/",
                    sameSite: "strict",
                })

                return res.status(200).json({
                    "isSuccess": true,
                    "user": user,
                    "token": token,
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
    },

    requestRefreshToken: async(req, res) =>{
        try {
            // Lấy refresh token từ cookie
            const refreshToken = req.cookies.refreshToken;
    
            // Kiểm tra xem có refreshToken không
            if (!refreshToken) {
                return res.status(401).json("You are not authenticated");
            }
    
            // Kiểm tra xem refreshToken có hợp lệ không
            if (!refreshTokens.includes(refreshToken)) {
                return res.status(403).json("Refresh token is not valid");
            }
            
            // // Tìm người dùng tương ứng với refreshToken trong cơ sở dữ liệu
            // const user = await User.findOne({ refreshToken: refreshToken });

            // // Kiểm tra xem người dùng có tồn tại không
            // if (!user) {
            //     return res.status(404).json({ message: "User not found" });
            // }

            
            // Xác minh refreshToken và lấy thông tin người dùng
            jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (error, user) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: "Server error" });
                }
    
                // Loại bỏ refreshToken đã sử dụng khỏi danh sách
                refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    
                // Tạo mới accessToken và refreshToken
                const newAccessToken = authController.generateAccessToken(user);
                const newRefreshToken = authController.generaterefreshToken(user);
    
                // Gửi refreshToken mới trong cookie
                res.cookie("refreshToken", newRefreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict",
                });
    
                // Trả về accessToken mới
                return res.status(200).json({ accessToken: newAccessToken });
            });
        } catch (error) {
            console.log("Error in requestRefreshToken:", error);
            return res.status(500).json({ message: "Server error" });
        }
    }
}

module.exports = authController;