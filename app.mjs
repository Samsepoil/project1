import express from 'express'; // Import express module to run local server
import http from 'http';  // Import 'http' module
import qString from 'querystring';  // Import 'querystring' module
import bodyParser from 'body-parser'; // middleware for parsing bodys of info
import session from 'express-session'; // session middleware that allows for express sessions
import crypto from 'crypto'; // for simple encryption 'genHash' of passwords

const app = express(); //assigns 'app' to express server

//app.set('views', './views'); // sets views directory for express app
//app.set('view engine', 'pug'); // sets the view engine for the express server to pug(can serve pug and html mixed)
app.use(express.static('public', {index: 'index.html'} )); // sets the static folder to 'public'; needed to call files in html and js
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

app.route('/', function () {
    res.sendFile('index.html');
});



//serving the application.html file
app.get('/application', (req, res) => {
    res.sendFile('application.html', { root: './public' });
});

// Route to handle form submission
app.post('/submit-application', (req, res) => {
    const { type, accountId, loanType, income, creditScore } = req.body;

    // Log the received data 
    console.log('Application Data:', { type, accountId, loanType, income, creditScore });

    // Send a response back 
    res.send('Application submitted successfully!');
});