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

app.route('/mortgage').get((req, res) => {
    res.render('mortgage');
});

app.route('/savings').get((req, res) => {
    res.render('savings');
});

//Protected Routes
app.route('/application')
    .get(requireAuth, (req, res) => {
        res.render('application');
    })
    .post(requireAuth, (req, res) => {
        const { type, accountId, loanType, income, creditScore } = req.body;
        console.log('Application Data:', { type, accountId, loanType, income, creditScore });
        res.send('Application submitted successfully!');
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