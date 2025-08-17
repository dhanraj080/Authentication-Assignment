const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'dhanraj.gangrade750@gmail.com',
        pass: process.env.EMAIL_PASS || 'kzcc jwsj puwo vcii'
    }
});

const generateOTP = () => crypto.randomInt(100000, 999999).toString();

exports.register = async (req, res) => {
    try {
        const { name, email, password, companyName, age, dateOfBirth } = req.body;
        
        // Checking if the user already exists.
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists!' });

        // Making sure that the image is uploaded.
        if (!req.file) {
            return res.status(400).json({ message: 'A Profile image is required!' });
        }

        // Validating the image format to be PNG or JPG only.
        if (!['image/png', 'image/jpeg', 'image/jpg'].includes(req.file.mimetype)) {
            return res.status(400).json({ message: 'Only PNG and JPG format images are allowed!' });
        }

        // Hashign the password for security
        const hashedPassword = await bcrypt.hash(password, 10);

        // Creating a new user with all required fields
        user = new User({
            name,
            email,
            password: hashedPassword,
            companyName,
            age,
            dateOfBirth,
            profileImage: {
                filename: req.file.originalname,
                contentType: req.file.mimetype,
                data: req.file.buffer
            }
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully. You can now log in.' });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error creating account.' });
    }
};

// Logging in with OTP generation
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        // Check for credentials
        if (!user) return res.status(400).json({ message: 'Sorry, we can\'t log you in.' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Sorry, we can\'t log you in.' });

        // Generating the OTP for additional security
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); 

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        // Sending the OTP via email
        await transporter.sendMail({
            from: process.env.EMAIL_USER || 'dhanraj.gangrade750@gmail.com',
            to: email,
            subject: 'Login Verification OTP',
            text: `Hi ${user.name}, your login OTP is: ${otp}. This OTP will expire in 10 minutes.`
        });

        res.json({ 
            message: 'Please enter the OTP sent to your email.',
            email: email 
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Sorry, we can\'t log you in.' });
    }
};

// Verifying OTP and completing the login with JWT
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: 'User not found!' });

        // Checking the OTP validity
        if (user.otp !== otp || user.otpExpiry < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }

        // Clearing the OTP
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        // Generating a simple JWT token
        const token = jwt.sign(
            { 
                userId: user._id, 
                email: user.email,
                name: user.name 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Returning user data
        res.json({ 
            message: 'Login successful! Redirecting to dashboard.',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                companyName: user.companyName,
                age: user.age,
                dateOfBirth: user.dateOfBirth
            }
        });

    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({ message: 'Error verifying OTP.' });
    }
};

// Get user dashboard
exports.dashboard = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password -otp -otpExpiry');
        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        res.json({
            message: `Welcome ${user.name}!`,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                companyName: user.companyName,
                age: user.age,
                dateOfBirth: user.dateOfBirth
            }
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ message: 'Error loading dashboard.' });
    }
};

// Get the image
exports.getProfileImage = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user || !user.profileImage.data) {
            return res.status(404).json({ message: 'Image not found!' });
        }

        res.set('Content-Type', user.profileImage.contentType);
        res.send(user.profileImage.data);
    } catch (error) {
        console.error('Get image error:', error);
        res.status(500).json({ message: 'Error fetching image.' });
    }
};

// Deleting the user account
exports.deleteAccount = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.userId);
        
        res.json({ message: 'Account deleted successfully.' });
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({ message: 'Error deleting account.' });
    }
};

// Logout 
exports.logout = (req, res) => {
    res.json({ message: 'Logged out successfully. Please remove token from client.' });
};