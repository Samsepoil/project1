import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    amount: { type: mongoose.Types.Decimal128, required: true },
    description: { type: String, required: true }
});

const bankAccountSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'UserAccount', required: true },
    account_number: { type: String, required: true },
    account_type: { type: String, required: true }, // 'checking' or 'savings'
    balance: { type: mongoose.Types.Decimal128, required: true },
    transactions: [transactionSchema]
});

export default mongoose.model('BankAccount', bankAccountSchema);