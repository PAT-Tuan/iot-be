const middlewareController = require("../controllers/middlewareController");
const orderController = require("../controllers/orderController");

const router = require("express").Router();

// list order by user id 

router.get("/user", middlewareController.verifyToken, orderController.listOrderByUserId);


// Create order
router.post("/create", middlewareController.verifyToken, orderController.createOrder);

// list order 

router.post("/", orderController.listOrder);

// get order by id
router.post("/get", orderController.getOrderById);

router.post("/me", orderController.listOrderByUserId);

module.exports = router;