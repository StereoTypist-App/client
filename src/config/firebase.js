const Firebase = require('firebase')
require('firebase/auth')
require('firebase/database')

const config = {
    apiKey: 'AIzaSyD5aR4zMh6oodXebePkY8yS1JEYY4x--9U',
    authDomain: 'stereotypist-bf592.firebaseapp.com',
    databaseURL: 'https://stereotypist-bf592.firebaseio.com',
    projectId: 'stereotypist-bf592',
    storageBucket: 'stereotypist-bf592.appspot.com',
    messagingSenderId: '505356235105'
};
Firebase.initializeApp(config);

module.exports.Firebase = Firebase
