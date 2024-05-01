const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv")
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");
const useRoute = require("./routes/user");
const orderRoute = require("./routes/order");

const port = process.env.PORT || 4000;


const app = express();
dotenv.config()

mongoose.connect(process.env.MONGODB_URL,{
    dbName:"choc",
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });

app.use(cors()); // tránh lỗi cors
app.use(cookieParser());
app.use(express.json());

//ROUTES
app.use("/v1/auth", authRoute);
app.use("/v1/user", useRoute);
app.use("/v1/order", orderRoute);

app.listen(port, () => {
    console.log("Server is running on port: " + port);
});

// JSON WEB TOKEN
