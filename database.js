import mongoose from 'mongoose';

const url = 'mongodb://localhost:27017/ecorp_bank';

async function connectDB() {
    try {
        await mongoose.connect(url);
        console.log('MongoDB connected successfully to ecorp_bank');
        return mongoose.connection;
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
}

export default connectDB;

/*Ethan Long*/
