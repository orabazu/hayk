// config/auth.js
var urltestString= "http://localhost:8080";
var urlProdString= "https://tabiatizi.herokuapp.com";
// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : process.env.FACEBOOK_APP_ID, 
        'clientSecret'  : process.env.FACEBOOK_APP_SECRET,
        'callbackURL'   : urltestString + '/auth/facebook/callback',
        'profileFields': ['id', 'displayName', 'picture.type(large)', 'email'],
    },

    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : 'your-secret-clientID-here',
        'clientSecret'  : 'your-client-secret-here',
        'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    }

};
