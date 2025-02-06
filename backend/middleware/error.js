const ErrorHandler = require("../utils/ErrorHandler");

module.exports = (err, req, res, next) => {
    // Ensure statusCode and message are set
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // Handle CastError (Invalid ObjectId)
    if (err.name === "CastError") {
        const message = `Resource not found with this id. Invalid ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    // Handle Duplicate Key Error (MongoDB)
    if (err.code === 11000) {
        const message = `Duplicate key ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message, 400);
    }

    // Handle JsonWebTokenError (JWT invalid error)
    if (err.name === "JsonWebTokenError") {
        const message = "Your URL is invalid, please try again later";
        err = new ErrorHandler(message, 400);
    }

    // Handle TokenExpiredError (JWT expired)
    if (err.name === "TokenExpiredError") {
        const message = "Your URL is expired, please try again later!";
        err = new ErrorHandler(message, 400);
    }

    // Send the error response
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};
