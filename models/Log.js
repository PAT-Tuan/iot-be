const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema(
    {
        
    }, 
    {timestamps: true}
);

module.exports = mongoose.model("Log",LogSchema);