const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');    

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please enter your name'],
        
    },
    email:{
        type:String,
        required:[true,'Please enter your email'],
    },
    password:{
        type:String,
        required:[true,'Please enter your password'],
       
    },

});