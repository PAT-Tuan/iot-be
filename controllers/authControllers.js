const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let refreshTokens = [];

const authController = {
    //Register
    registerUser: async (req, res) => {
        try {
            const hashed = await bcrypt.hash(req.body.password, 10);

            // Create new user
            const newUser = new User({
                email: req.body.email,
                password: hashed,
            });

            // Save to DB
            const user = await newUser.save();
            res.status(200).json({
                isSuccess: true,
                data: user
            });
        } catch (error) {
            console.log("Error in registerUser:", error);
            res.status(500).json(error);
        }
    },

    // Generate ACCESS TOKEN
    generateAccessToken: (user) => {
        return jwt.sign(
            {
                id: user._id,
                admin: user.admin
            },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: "365d" }
        );
    },

    // Generate REFRESH TOKEN
    generateRefreshToken: (user) => {
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
            const user = await User.findOne({ email: req.body.email });

            if (!user) {
                return res.status(404).json({ isSuccess: false, message: "User not found" });
            }

            const isMatch = await bcrypt.compare(req.body.password, user.password);

            if (isMatch) {
                const token = authController.generateAccessToken(user);
                const refreshToken = authController.generateRefreshToken(user);
                
                // push refreshToken
                refreshTokens.push(refreshToken);
                
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict",
                });

                return res.status(200).json({
                    isSuccess: true,
                    user: user,
                    token: token,
                });
            } else {
                return res.status(200).json({
                    isSuccess: false,
                    message: "Password incorrect"
                });
            }

        } catch (error) {
            console.log("Error in loginUser:", error);
            res.status(500).json(error);
        }
    },

    requestRefreshToken: async (req, res) => {
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
            
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            const user = await User.findById(decoded.id);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const newRefreshToken = authController.generateRefreshToken(user);
            // Gửi refreshToken mới trong cookie
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            });
            const newAccessToken = authController.generateAccessToken(user);
            return res.status(200).json({ accessToken: newAccessToken });
        } catch (error) {
            console.log("Error in requestRefreshToken:", error);
            return res.status(500).json({ message: "Server error" });
        }
    },

    // LOG OUT
    userLogout: async (req, res) => {
        try {
            res.clearCookie("refreshToken");
            refreshTokens = refreshTokens.filter(token => token !== req.cookies.refreshToken);
            return res.status(200).json("Logged out!");
        } catch (error) {
            console.log("Error in userLogout:", error);
            return res.status(500).json({ message: "Server error" });
        }
    },
};

module.exports = authController;
