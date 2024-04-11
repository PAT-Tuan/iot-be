const authController = require("../controllers/authControllers");

const router = require("express").Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

//refresh
router.post("/refresh", authController.requestRefreshToken);
module.exports = router;