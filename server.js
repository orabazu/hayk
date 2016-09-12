var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var _ = require('lodash');
var MongoStore = require('connect-mongo')(session);
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('./server/config/config.js');
var User   = require('./server/models/user.js'); 

function generateOrFindUser(accessToken, refreshToken, profile, done){
  if(profile.emails[0]) {
    User.findOneAndUpdate(
      { email: profile.emails[0] },
      {
        name: profile.displayName || profile.username,
        email: profile.emails[0].value,
        photo: profile.photos[0].value
   },
   {
        upsert: true
   },
   done
   );
} else {
    var noEmailError = new Error("Your email privacy settings prevent you from signing into Treking.");
    done(noEmailError, null);
}
}
passport.use(new FacebookStrategy({
  // clientID: process.env.FACEBOOK_APP_ID,
  clientID: '1044143785702675',
  // clientSecret: process.env.FACEBOOK_APP_SECRET,
  clientSecret: '109525a2a67d5af26078885ae9a6b4dd',
  callbackURL: "http://localhost:8080/facebook/return",
  profileFields: ['id', 'displayName', 'photos', 'email']
},
generateOrFindUser)
);
//passport ops
passport.serializeUser(function(user, done){
  done(null, user._id);
});

passport.deserializeUser(function(userId, done){
  User.findById(userId, done);
});

// view engine setup
app.set('view engine', 'ejs'); // set up ejs for templating
app.use('/', express.static(__dirname + '/client'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev')); //log files

mongoose.connect(config.database); // connect to database
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

app.get('/asd', function(req,res){
    res.json("sad");
})
  //GET /auth/login/facebook
  app.get('/login/facebook',
    passport.authenticate('facebook', {scope: ["email"]}));

//GET /auth/facebook/return
app.get('/facebook/return', 
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/sad');
});

  //GET /auth/logout
  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

  app.get('*', function (req, res) {
    res.sendFile( __dirname + '/client/index.html');
});






  app.listen(process.env.PORT || 8080, function () {
   console.log('trekkinn on port 8080');
});

