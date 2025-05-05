import mongoose from 'mongoose';

const userAccountSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});

export default mongoose.model('UserAccount', userAccountSchema);