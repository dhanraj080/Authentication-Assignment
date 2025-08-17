const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    companyName: { type: String, required: true },
    age: { type: Number, required: true },
    dateOfBirth: { type: Date, required: true },
    profileImage: {
        filename: { type: String, required: true },
        contentType: { type: String, required: true },
        data: { type: Buffer, required: true } 
    },
    otp: { type: String }, 
    otpExpiry: { type: Date }, 
    isVerified: { type: Boolean, default: false }
}, {
    timestamps: true 
});

const User = mongoose.model('User', UserSchema); 

module.exports = User;