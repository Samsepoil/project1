import mongoose from 'mongoose';

const creditCardSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'UserAccount', required: true },
    card_type: { type: String, required: true },
    interest_rate: { type: mongoose.Types.Decimal128, required: true },
    credit_limit: { type: mongoose.Types.Decimal128, required: true },
    balance: { type: mongoose.Types.Decimal128, required: true }
});

export default mongoose.model('CreditCard', creditCardSchema);

//Adam Nielsen 