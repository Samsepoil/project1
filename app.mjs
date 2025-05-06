import express from 'express'; // Import express module to run local server
import http from 'http';  // Import 'http' module
import qString from 'querystring';  // Import 'querystring' module
import bodyParser from 'body-parser'; // middleware for parsing bodys of info
import session from 'express-session'; // session middleware that allows for express sessions
import crypto from 'crypto'; // for simple encryption 'genHash' of passwords
import e from 'express';

const app = express(); //assigns 'app' to express server

app.set('views', './views'); // sets views directory for express app
app.set('view engine', 'pug'); // sets the view engine for the express server to pug(can serve pug and html mixed)
app.use(express.static('public')); // sets the static folder to 'public'; needed to call files in html and js
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false })); // Middleware to parse the body

app.listen(1234, async () => {
    console.log("Server is running..."); //runs if server is running successfully
});

// Session middleware
app.use(session({
    secret: 'shhhhh',
    saveUninitialized: false,
    resave: false
}));

app.route('/').get((req, res) => {
    res.render('index');
});

app.route('/index').get((req, res) => {
    res.render('index');
});

app.route(`/balance`).get((req, res) => {
    res.render(`balance`);
});

app.route(`/dashboard`).get((req, res) => {
    res.render(`dashboard`);
});

app.route(`/checking`).get((req, res) => {
    res.render(`checking`);
});

app.route(`/loans`).get((req, res) => {
    res.render(`loans`);
});

app.route(`/mortgage`).get((req, res) => {
    res.render(`mortgage`);
});

app.route(`/savings`).get((req, res) => {
    res.render(`savings`);
});


//serving application.html file
app.route('/application').get((req, res) => {
    res.render(`application`);
});

// form submission
app.post('/submit-application', (req, res) => {
    const { type, accountId, loanType, income, creditScore } = req.body;

    // Log received data 
    console.log('Application Data:', { type, accountId, loanType, income, creditScore });

    // Send a response 
    res.send('Application submitted successfully!');
});

// Customer login route
app.route('/customer-login')
    .get((req, res) => {
        res.render('customer-login');
    })
    .post((req, res) => {
        const { username, password } = req.body;

        if (username === "testuser" && password === "password") {
            req.session.isLoggedIn = true;
            req.session.username = username;
            res.json({ success: true });
        } else {
            res.json({
                success: false,
                message: 'Invalid username or password'
            });
        }
    });

      
    app.post('/register', (req, res) => {
        const { username, name, email, password } = req.body;
      
        console.log({ username, name, email, password });
      
        res.send('Registration successful!');
      });
    
      app.route('/register').get((req, res) => {
        res.render('customer-registration');
    });
      