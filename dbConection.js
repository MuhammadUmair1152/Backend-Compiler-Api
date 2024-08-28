const mongoose = require('mongoose');
require('dotenv').config()
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('MongoDB connected');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
    }
};

module.exports = connectDB;
