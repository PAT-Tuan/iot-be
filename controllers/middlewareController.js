const jwt = require("jsonwebtoken");


const middlewareController = {
    verifyToken: (req, res, next) => {
        const token = req.headers.token;
        if (token) {
            const accessToken = token.split(" ")[1];
            console.log("🚀 ~ accessToken:", accessToken)
            console.log("🚀 ~ jwt.verify ~ JWT_SECRET:", process.env.JWT_ACCESS_SECRET)
            
            jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET, (error, user) => {
               
                if (error) {
                    return res.status(403).json("Token is not valid");
                }
                req.user = user;
                next();
            });
        } else {
            return res.status(401).json("You're not authenticated");
        }
    },
    verifyTokenAndAdminAuth: (req, res, next) =>{
        middlewareController.verifyToken(req, res, ()=>{
            if(req.user.id == req.params.id || req.user.admin){
                next();
            }
            else{
                res.status(403).json("You are not allowed to delete other");
            }
        });
    }
};

module.exports = middlewareController;