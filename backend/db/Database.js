const mongoose = require("mongoose");

const connectDatabase = () => {
    mongoose
        .connect(process.env.DB_URL)
        .then((data) => {
            console.log(`MongoDB connected with server: ${data.connection.host}`)
        })
        .catch((err) => {
            console.error(`Database connection failed: ${err.messsage}`)
        })
} 

module.exports = connectDatabase;