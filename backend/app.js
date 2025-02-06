// backend/app.js

const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const ErrorHandler = require("./middleware/error");
const app = express();
const product = require('./controller/product')

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());
app.use("/", express.static("uploads"))
// Serve static files for uploads and products

if(process.env.NODE_ENV !== "PRODUCTION"){
  require("dotenv").config({
    path: "backend/config/.env"
  })
}


const user = require("./controller/user")

app.use("/api/v2/user", user);
app.use("/api/v2/product", product)

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/products', express.static(path.join(__dirname, 'products')));


app.use(ErrorHandler);

module.exports = app;