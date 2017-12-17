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

var dotenv = require('dotenv')
dotenv.config();


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
	successRedirect: '/profil', // redirect to the secure profile section
	failureRedirect: '/giris', // redirect back to the signup page if there is an error
	failureFlash: true // allow flash messages
}));

/*
/auth/facebook: Send our user to Facebook to authenticate
/auth/facebook/callback: Facebook sends our user back to our application here with token and profile information.
*/
// route for facebook authentication and login
app.get('/auth/facebook', passport.authenticate('facebook', {
	scope: 'email'
}));

// handle the callback after facebook has authenticated the user
app.get('/auth/facebook/callback',
	passport.authenticate('facebook', {
		failureRedirect: '/'
	}),
	function (req, res) {
		// Successful authentication, redirect home.
		res.redirect('/profil');
	});

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

// locally --------------------------------
// app.get('/connect/local', function (req, res) {
// 	res.render('connect-local.ejs', {
// 		message: req.flash('loginMessage')
// 	});
// });
app.post('/connect/local', passport.authenticate('local-signup', {
	successRedirect: '/profil', // redirect to the secure profile section
	failureRedirect: '/connect/local', // redirect back to the signup page if there is an error
	failureFlash: true // allow flash messages
}));

// facebook -------------------------------

// send to facebook to do the authentication
app.get('/connect/facebook', passport.authorize('facebook', {
	scope: 'email'
}));

// handle the callback after facebook has authorized the user
app.get('/connect/facebook/callback',
	passport.authorize('facebook', {
		successRedirect: '/profile',
		failureRedirect: '/'
	}));


// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // facebook -------------------------------
    app.get('/unlink/facebook', function(req, res) {
        var user            = req.user;
        user.facebook.token = undefined;
		user.facebook.name = '';
		user.facebook.email = '';
        user.save(function(err) {
            res.redirect('/profile');
        });
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