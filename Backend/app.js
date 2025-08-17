require('dotenv').config(); 

const express = require('express');
const cors = require('cors'); 

const databaseConnection = require('./config/db');

databaseConnection();

const app = express();

app.use(cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors()); 

app.use('/api/auth', require('./routes/authRoute')); 

app.get('/', (req, res) => {
    res.json({ message: 'User Authentication API is running!' });
});

app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File too large! Max size is 5MB.' });
        }
    }
    if (error.message === 'Only PNG and JPG images are allowed!') {
        return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`The server is now running on port ${PORT}`));