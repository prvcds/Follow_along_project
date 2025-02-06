const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');  // Import bcrypt for password hashing
const User = require('../model/user');  
const router = express.Router();
const { upload } = require('../multer');
const ErrorHandler = require('../utils/ErrorHandler');

// Create user route
router.post(
    "/create-user",
    upload.single("file"),
    async (req, res, next) => {
        try {
            // Extract data from the request body
            const { name, email, password } = req.body;

            // Check if the user already exists
            const userEmail = await User.findOne({ email });
            if (userEmail) {
                return next(new ErrorHandler("User already exists", 400));
            }

            // If file is uploaded, get the filename and construct the file URL
            const filename = req.file ? req.file.filename : null;
            const fileUrl = filename ? path.join("uploads", filename) : null; // Assuming 'uploads' is the folder where files are stored

            // Hash the password before saving it
            const hashedPassword = await bcrypt.hash(password, 10);  // 10 is the number of salt rounds

            // Create a new user object
            const user = new User({
                name: name,
                email: email,
                password: hashedPassword,  // Save the hashed password
                avatar: fileUrl,  // Save file URL if uploaded
            });

            // Save the user to the database
            await user.save();

            // Send response back to client with user data (except password) and avatar URL
            res.status(201).json({
                success: true,
                message: "User created successfully",
                user: {
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,  // Avatar URL if file uploaded
                },
            });
        } catch (error) {
            next(error);  // Pass the error to the global error handler
        }
    }
);

module.exports = router;