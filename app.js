const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config');

const vignetteController = require('./controller/vignetteController');
const userController = require('./controller/userController');

app.all('/*', function(req, res, next) {
    // CORS headers
    res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


// allow to read files in folder uploads
var publicDir = require('path').join(__dirname,'/public');
app.use('/uploads', express.static(publicDir));

// allow to excutes url of web services in such route
app.use('/api/vignettes', vignetteController);
app.use('/api/users', userController);


//Database connection
mongoose.Promise = global.Promise;
mongoose.connect(config.DATABASE,{ useNewUrlParser: true });
mongoose.connection.on('connected', function(req, res) {
    console.log('Connected to the database');
});
mongoose.connection.on('error', function(req, err){
    console.log('Unable to connect to the database ' + err);
});


//Start the server
app.listen(config.PORT, function (){
    console.log('Server Started on port ', config.PORT);
});

