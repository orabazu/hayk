var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var _ = require('lodash');
var MongoStore = require('connect-mongo')(session);
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('./server/models/user.js');
var os = require("os");
var flash = require('connect-flash');
require('./server/config/passport')(passport); // pass passport for configuration
urltestString = "http://localhost:8080";
urlProdString = "https://tabiatizi.herokuapp.com";

// view engine setup
app.set('view engine', 'ejs'); // set up ejs for templating
app.use('/bower_components', express.static(__dirname + '/client/bower_components'));
app.use('/', express.static(__dirname + '/client'));

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(morgan('dev')); //log files
app.use(cookieParser()); // read cookies (needed for auth)


/*
CONNECT TO LOCAL DB
mongoose.connect(config.database); // connect to database
*/
mongoose.connect(process.env.MONGODB_URI, function (error) {
	if (error);
	else console.log('mongo connected');
});
var db = mongoose.connection;

// Session Configuration for Passport and MongoDB
var sessionOptions = {
	secret: "this is a super secret dadada",
	resave: true,
	saveUninitialized: true,
	store: new MongoStore({
		mongooseConnection: db
	})
};

app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session()); //Restore session
app.use(flash()); // use connect-flash for flash messages stored in session

var router = require('./server/routes/router');
app.use('/api', router)



// PROFILE SECTION =====================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
// app.get('/profile', isLoggedIn, function(req, res) {

// });

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}

//POST /signup
app.post('/signup', passport.authenticate('local-signup', {
	successRedirect: '/giris', // redirect to the secure profile section
	failureRedirect: '/kayit', // redirect back to the signup page if there is an error
	failureFlash: true // allow flash messages
}));

// POST /login
app.post('/login', passport.authenticate('local-login', {
	successRedirect : '/profil', // redirect to the secure profile section
	failureRedirect : '/giris', // redirect back to the signup page if there is an error
	failureFlash : true // allow flash messages
}));

//GET /auth/login/facebook
app.get('/login/facebook', passport.authenticate('facebook', {
	scope: ["email"]
}));
//GET /auth/facebook/return
app.get('/facebook/return',
	passport.authenticate('facebook', {
		failureRedirect: '/'
	}),
	function (req, res) {
		// Successful authentication, redirect home.
		res.redirect('/profil');
	});

//GET /auth/logout
app.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

app.get('*', function (req, res) {
	res.sendFile(__dirname + '/client/index.html');
});

app.listen(process.env.PORT || 8080, function () {
	console.log('arazzi.io on port 8080');
});