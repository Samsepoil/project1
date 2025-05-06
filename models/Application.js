import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    username: String,
    type: String,
    loanType: String,
    income: Number,
    creditScore: Number,
    status: {
        type: String,
        default: 'Pending'
    },
    dateSubmitted: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Application', applicationSchema);