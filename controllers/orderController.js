const Order = require("../models/Order");
const mongoose = require('mongoose');

const orderController = {
    
    listOrderByUserId: async(req, res) => {
        try {
            // Lấy ID của người dùng từ thông tin xác thực (ví dụ: JWT)
            const userId = req.body.user_id;
            console.log (userId);
    
            // Tìm tất cả các đơn hàng của người dùng có userId tương ứng
            const orders = await Order.find({ user_id: userId });
            // Trả về các đơn hàng tìm thấy
            res.status(200).json({ isSuccess: true, data: orders });
        } catch (error) {
            console.log('error list order by user id', error);
            res.status(500).json(error);
        }
    },
    getOrderById: async(req,res)=>{
        try {
            const order = await Order.findById(req.body.id);
            res.status(200).json({
                isSuccess: true,
                data: order
            })
        } catch (error) {
            console.log('error get order by id', error);
            res.status(500).json({
                isSuccess: false,
                message: error
            });
        }
    },

    listOrder: async(_req,res)=>{
        try {
            const order = await Order.find();
            res.status(200).json({
                isSuccess: true,
                data: order
            })
        } catch (error) {
            console.log('error list order', error);
            res.status(500).json({
                isSuccess: false,
                message: error
            });
        }
    },
    


    createOrder : async function(req, res) {

        try {
            const newOrder = new Order(req.body);
            console.log(newOrder);

            const order = await  newOrder.save();
            
            res.status(200).json({
                isSuccess: true,
                data: order
            });
        } catch (error) {
            console.log("Error in Order:", error);
            res.status(500).json(error);
        }
    }, 
    removeOrderById: async function(req, res) {
        const orderId = req.params.id; // Lấy id của đơn hàng cần xóa từ URL params
        console.log(orderId);
        try {
            // Tìm và xóa đơn hàng từ cơ sở dữ liệu MongoDB
            const deletedOrder = await Order.findByIdAndDelete(orderId);
    
            if (!deletedOrder) {
                return res.status(404).json({ isSuccess: false, message: "Đơn hàng không tồn tại" });
            }
    
            res.status(200).json({ isSuccess: true, message: "Đã xóa đơn hàng thành công", data: deletedOrder });
        } catch (error) {
            console.log("Lỗi khi xóa đơn hàng:", error);
            res.status(500).json({ isSuccess: false, message: "Đã xảy ra lỗi khi xóa đơn hàng", error: error.message });
        }
    }
    
    
}

module.exports = orderController;