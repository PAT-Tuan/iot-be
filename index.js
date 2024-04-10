const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv")
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");
const useRoute = require("./routes/user");


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

app.listen(8000, () => {
    console.log("Server is running");
});

// JSON WEB TOKEN
