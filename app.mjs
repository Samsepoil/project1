import express from 'express'; // Import express module to run local server
import http from 'http'; // Import 'http' module
import qString from 'querystring'; // Import 'querystring' module
import bodyParser from 'body-parser'; // middleware for parsing bodys of info
import session from 'express-session'; // session middleware that allows for express sessions
import crypto from 'crypto'; // for simple encryption 'genHash' of passwords
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
app.use(bodyParser.urlencoded({ extended: false })); // Middleware to parse the body

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

app.route('/index').get((req, res) => {
    res.render('index');
});

app.route('/balance').get((req, res) => {
    res.render('balance');
});

app.route('/checking').get((req, res) => {
    res.render('checking');
});

app.route('/loans').get((req, res) => {
    res.render('loans');
});

app.route('/savings').get((req, res) => {
    res.render('savings');
});

app.listen(1234, async () => {
    console.log("Server is running..."); //runs if server is running successfully
});

//Protected Routes

//Credit Card application calculation
function determineCardTierAndTerms(income, creditScore) {
    let tier, creditLimit, interestRate;

    // Base calculations on both income and credit score
    const scoreWeight = creditScore / 850; // Normalize credit score to 0-1 scale
    const incomeWeight = Math.min(income / 1000000, 1); // Cap income weight at 1M
    const combinedScore = (scoreWeight + incomeWeight) / 2;

    // Rest of the function remains the same
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

//Credit Card / Loan Application handling and writing to DB
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

                // Create new credit card matching the schema
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

                // Create new loan matching the schema
                newProduct = new Loan({
                    user_id: userId,
                    loan_type: loanType,
                    loan_amount: mongoose.Types.Decimal128.fromString(loanAmount.toString()),
                    interest_rate: mongoose.Types.Decimal128.fromString(applicationDetails.interestRate.toString()),
                    outstanding_balance: mongoose.Types.Decimal128.fromString(loanAmount.toString()),
                    payment_schedule: paymentSchedule
                });
            }

            // Save both the application and the new product
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

            // Send back approval details
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
            // Redirect to dashboard if session exists
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

    
    