import mongoose from 'mongoose';

const paymentScheduleSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    amount: { type: mongoose.Types.Decimal128, required: true },
    status: { type: String, required: true }
});

const loanSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    loan_type: { type: String, required: true },
    loan_amount: { type: mongoose.Types.Decimal128, required: true },
    interest_rate: { type: mongoose.Types.Decimal128, required: true },
    outstanding_balance: { type: mongoose.Types.Decimal128, required: true },
    payment_schedule: [paymentScheduleSchema]
});

export default mongoose.model('Loan', loanSchema);