import express from 'express'; 
import http from 'http'; 
import qString from 'querystring'; 
import bodyParser from 'body-parser'; 
import session from 'express-session'; 
import crypto from 'crypto'; 
import mongoose from 'mongoose';
import connectDB from './database.js';
import UserAccount from './models/UserAccount.js';
import BankAccount from './models/BankAccount.js';
import CreditCard from './models/CreditCard.js';
import Loan from './models/Loan.js';
import Application from './models/application.js';

const app = express();

await connectDB();

app.set('views', './views'); // sets views directory for express app
app.set('view engine', 'pug'); // sets the view engine for the express server to pug(can serve pug and html mixed)
app.use(express.static('public')); // sets the static folder to 'public'; needed to call files in html and js
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false })); 

//Session middleware
app.use(session({
    secret: 'shhhhh',
    saveUninitialized: false,
    resave: false
}));

//Authentication middleware
const requireAuth = (req, res, next) => {
    if (req.session && req.session.userId) {
        next();
    } else {
        res.redirect('/customer-login');
    }
};

//Public Routes
app.route('/').get((req, res) => {
    res.render('index');
});

app.route('/balance')
    .get(async (req, res) => {
        if (!req.session.userId) {
            return res.redirect('/customer-login');
        }
        try {
            const bankAccount = await BankAccount.findOne({ user_id: req.session.userId });
            if (!bankAccount) {
                return res.render('balance', { error: 'Bank account not found' });
            }
            res.render('balance', { currentBalance: bankAccount.balance.toString() });
        } catch (error) {
            console.error('Error fetching balance:', error);
            res.render('balance', { error: 'Error fetching balance' });
        }
    })
    .post(async (req, res) => {
        if (!req.session.userId) {
            return res.json({ success: false, message: 'Not logged in' });
        }

        try {
            const { amount, description } = req.body;

            // Use findOneAndUpdate instead of findOne
            const bankAccount = await BankAccount.findOne({ user_id: req.session.userId });

            if (!bankAccount) {
                return res.json({ success: false, message: 'Bank account not found' });
            }

            const currentBalance = parseFloat(bankAccount.balance.toString());
            const newBalance = currentBalance + parseFloat(amount);

            // Server-side validation
            if (newBalance < 0) {
                return res.json({ success: false, message: 'Insufficient funds' });
            }

            // Update only the balance and transactions
            const updatedBankAccount = await BankAccount.findOneAndUpdate(
                { user_id: req.session.userId },
                {
                    $set: { balance: mongoose.Types.Decimal128.fromString(newBalance.toString()) },
                    $push: {
                        transactions: {
                            date: new Date(),
                            amount: mongoose.Types.Decimal128.fromString(amount.toString()),
                            description: description || (amount > 0 ? 'Deposit' : 'Withdrawal')
                        }
                    }
                },
                { new: true }
            );

            res.json({
                success: true,
                newBalance: updatedBankAccount.balance.toString(),
                message: 'Transaction successful'
            });
        } catch (error) {
            console.error('Transaction error:', error);
            res.json({ success: false, message: 'Transaction failed' });
        }
    });

app.route('/checking').get((req, res) => {
    res.render('checking');
});

app.route('/loans').get((req, res) => {
    res.render('loans');
});

app.route('/customer-registration')
    .get((req, res) => {
        res.render('customer-registration');
    })
    .post(async (req, res) => {
        try {
            const { username, name, email, password } = req.body;

            // Check if username already exists
            const existingUsername = await UserAccount.findOne({ username });
            if (existingUsername) {
                return res.json({
                    success: false,
                    message: 'Username already exists'
                });
            }

            // Check if email already exists
            const existingEmail = await UserAccount.findOne({ email });
            if (existingEmail) {
                return res.json({
                    success: false,
                    message: 'Email already registered'
                });
            }

            const newUser = new UserAccount({
                username,
                name,
                email,
                password
            });

            await newUser.save();

            const accountNumber = Math.floor(10000000 + Math.random() * 90000000).toString();

            // Create a new bank account for the user
            const newBankAccount = new BankAccount({
                user_id: newUser._id,
                account_number: accountNumber,
                account_type: 'checking',
                balance: mongoose.Types.Decimal128.fromString('10000.00'),
                transactions: []
            });

            await newBankAccount.save();

            res.json({
                success: true,
                message: 'Registration successful'
            });

        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                success: false,
                message: 'An error occurred during registration'
            });
        }
    });


//Protected Routes

//Credit Card application calculation
function determineCardTierAndTerms(income, creditScore) {
    let tier, creditLimit, interestRate;

    // Base calculations on both income and credit score
    const scoreWeight = creditScore / 850; // Normalize credit score to 0-1 scale
    const incomeWeight = Math.min(income / 1000000, 1); // Cap income weight at 1M
    const combinedScore = (scoreWeight + incomeWeight) / 2;

    if (combinedScore >= 0.8) {
        tier = 'Platinum';
        creditLimit = Math.min(income * 0.4, 50000);
        interestRate = 18.00 + (1 - scoreWeight) * 3;
    } else if (combinedScore >= 0.6) {
        tier = 'Gold';
        creditLimit = Math.min(income * 0.3, 25000);
        interestRate = 21.00 + (1 - scoreWeight) * 3;
    } else {
        tier = 'Silver';
        creditLimit = Math.min(income * 0.2, 10000);
        interestRate = 24.00 + (1 - scoreWeight) * 3.99;
    }

    return {
        tier,
        creditLimit: Math.round(creditLimit),
        interestRate: Number(interestRate.toFixed(2))
    };
}


//Loan application calculation
function determineLoanTerms(loanType, income, creditScore) {
    let maxAmount, interestRate;
    const scoreWeight = creditScore / 850;

    // Base interest rate calculation
    const baseRate = 2.00 + (1 - scoreWeight) * 8.99;

    switch (loanType) {
        case 'personal':
            maxAmount = Math.min(income * 0.5, 50000);
            interestRate = baseRate + 1;
            break;
        case 'home':
            maxAmount = Math.min(income * 4, 1000000);
            interestRate = baseRate;
            break;
        case 'auto':
            maxAmount = Math.min(income * 0.8, 100000);
            interestRate = baseRate + 0.5;
            break;
        case 'business':
            maxAmount = Math.min(income * 2, 250000);
            interestRate = baseRate + 1.5;
            break;
        default:
            maxAmount = 0;
            interestRate = 0;
    }

    return {
        maxAmount: Math.round(maxAmount),
        interestRate: Number(interestRate.toFixed(2))
    };
}

//Credit Card / Loan Application handling
app.route('/application')
    .get(requireAuth, (req, res) => {
        res.render('application');
    })
    .post(requireAuth, async (req, res) => {
        try {
            const { type, loanType, income, creditScore } = req.body;
            const userId = req.session.userId;

            let applicationDetails;
            let newProduct;

            if (type === 'credit-card') {
                applicationDetails = determineCardTierAndTerms(income, creditScore);

                // Create new credit card
                newProduct = new CreditCard({
                    user_id: userId,
                    card_type: applicationDetails.tier,
                    interest_rate: mongoose.Types.Decimal128.fromString(applicationDetails.interestRate.toString()),
                    credit_limit: mongoose.Types.Decimal128.fromString(applicationDetails.creditLimit.toString()),
                    balance: mongoose.Types.Decimal128.fromString('0')
                });
            } else if (type === 'loan') {
                applicationDetails = determineLoanTerms(loanType, income, creditScore);

                // Calculate payment schedule
                const loanAmount = applicationDetails.maxAmount;
                const monthlyRate = applicationDetails.interestRate / 100 / 12;
                const months = 36;
                const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
                    (Math.pow(1 + monthlyRate, months) - 1);

                let paymentSchedule = [];
                let currentDate = new Date();

                for (let i = 0; i < months; i++) {
                    currentDate.setMonth(currentDate.getMonth() + 1);
                    paymentSchedule.push({
                        date: new Date(currentDate),
                        amount: mongoose.Types.Decimal128.fromString(monthlyPayment.toFixed(2)),
                        status: 'Pending'
                    });
                }

                // Create new loan 
                newProduct = new Loan({
                    user_id: userId,
                    loan_type: loanType,
                    loan_amount: mongoose.Types.Decimal128.fromString(loanAmount.toString()),
                    interest_rate: mongoose.Types.Decimal128.fromString(applicationDetails.interestRate.toString()),
                    outstanding_balance: mongoose.Types.Decimal128.fromString(loanAmount.toString()),
                    payment_schedule: paymentSchedule
                });
            }

            // Save the application and the new product
            const newApplication = new Application({
                username: req.session.user.username,
                type,
                loanType,
                income,
                creditScore,
                ...applicationDetails
            });

            await Promise.all([
                newApplication.save(),
                newProduct.save()
            ]);

            res.json({
                success: true,
                message: 'Application approved!',
                details: applicationDetails
            });

        } catch (error) {
            console.error('Error processing application:', error);
            res.status(500).json({
                success: false,
                message: 'Error processing application'
            });
        }
    });

app.route('/customer-login')
    .get((req, res) => {
        // Check if user is already logged in
        if (req.session && req.session.userId) {
            return res.redirect('/dashboard');
        }
        // Otherwise show login page
        res.render('customer-login');
    })
    .post(async (req, res) => {
        try {
            const { username, password } = req.body;
            const user = await UserAccount.findOne({ username });

            if (!user || password !== user.password) {
                return res.json({
                    success: false,
                    message: 'Invalid username or password'
                });
            }

            req.session.isLoggedIn = true;
            req.session.userId = user._id;
            req.session.user = user;
            res.json({ success: true });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'An error occurred during login'
            });
        }
    });


app.route('/dashboard')
    .get(requireAuth, async (req, res) => {
        try {
            const user = await UserAccount.findById(req.session.userId);
            if (!user) {
                return res.redirect('/customer-login');
            }

            // Find user's bank accounts
            const bankAccounts = await BankAccount.find({ user_id: user._id });
            // Find user's credit cards
            const creditCards = await CreditCard.find({ user_id: user._id });
            // Find user's loans
            const loans = await Loan.find({ user_id: user._id });

            res.render('dashboard', {
                user,
                bankAccounts,
                creditCards,
                loans
            });
        } catch (error) {
            console.error('Dashboard error:', error);
            res.status(500).send('An error occurred');
        }
    });

app.route('/logout')
    .get(requireAuth, (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.error('Logout error:', err);
            }
            res.redirect('/');
        });
    });

//Start Server
app.listen(1234, async () => {
    console.log("Server is running...");
});   

//Rad Pena & Adam Nielsen