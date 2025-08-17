const mongoose = require('mongoose');
const User = require('../models/User');

const URI = "mongodb+srv://dhanrajgangrade750:s08HwrK5VQNMtJBi@cluster0.qkeyc72.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; 

const connectDatabase = async () => {
    try {
        await mongoose.connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB database is connected successfully.');
        
        await User.createCollection();
        console.log('The user collection is created successfully.');
    } catch (err) {
        console.error('Could not connect to the MongoDB database.', err.message);
        process.exit(1);
    }
};

module.exports = connectDatabase;