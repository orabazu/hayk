var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var _ = require('lodash');
var MongoStore = require('connect-mongo')(session);
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('./server/config/config.js');
var User = require('./server/models/user.js');
var os = require("os");


function generateOrFindUser(accessToken, refreshToken, profile, done) {

	User.findOne({
		'userid': profile.id
	}, function (err, user) {
		if (err)
			return done(err);
		// if the user is found, then log them in
		if (user) {
			return done(null, user); // user found, return that user
		} else {
			// if there is no user found with that facebook id, create them
			var newUser = new User();

			// set all of the facebook information in our user model
			newUser.userid = profile.id;
			newUser.email = profile.emails[0].value;
			newUser.name = profile.displayName || profile.username;
			newUser.photo = profile.photos[0].value;

			// save our user to the database
			newUser.save(function (err) {
				if (err)
					throw err;
				// if successful, return the new user
				return done(null, newUser);
			});
		}
	});
}

urltestString= "http://localhost:8080";
urlProdString= "https://tabiatizi.herokuapp.com";


passport.use(new FacebookStrategy({
		clientID: process.env.FACEBOOK_APP_ID,
		clientSecret: process.env.FACEBOOK_APP_SECRET,
		callbackURL: urlProdString + "/facebook/return",
		profileFields: ['id', 'displayName', 'picture.type(large)', 'email']
	},
	generateOrFindUser));
//passport ops
passport.serializeUser(function (user, done) {
	done(null, user._id);
});

passport.deserializeUser(function (userId, done) {
	User.findById(userId, done);
});

// view engine setup
app.set('view engine', 'ejs'); // set up ejs for templating
app.use('/bower_components', express.static(__dirname + '/client/bower_components'));
app.use('/', express.static(__dirname + '/client'));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(morgan('dev')); //log files

/*
CONNECT TO LOCAL DB
mongoose.connect(config.database); // connect to database
*/

mongoose.connect(process.env.MONGODB_URI, function (error) {
    if (error) console.error(error);
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

//Initialize Passport.js
app.use(passport.initialize());

//Restore session
app.use(passport.session());

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