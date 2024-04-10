const User = require("../models/User");
const mongoose = require('mongoose');

const userController = {
    //Get all users
    getAllUsers: async(_req,res)=>{
        try {
            const user = await User.find();
            res.status(200).json(user)
        } catch (error) {
            console.log('error getAllUsers', error);
            res.status(500).json(error);
        }
    },
    // Delete User
    deleteUser: async (req, res) => {
        try {
            const userId = req.params.id;
            
            // Kiểm tra xem id có hợp lệ không
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ message: "Invalid user Id" });
            }
    
            // Tìm kiếm người dùng theo id
            const user = await User.findById(userId);
            
            // Kiểm tra xem người dùng tồn tại không
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
    
            // Xóa người dùng
            await user.deleteOne;
            
            // Phản hồi thành công
            res.status(200).json({ message: "User deleted successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    }
    
}

module.exports = userController;