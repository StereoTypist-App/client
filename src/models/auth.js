const Firebase = require('../config/firebase')

class Auth {
    static register(email,password,displayName,callback) {
        Firebase.auth().createUserWithEmailAndPassword(email, password).then((user) => {
            console.log("Logged in user",user)
        }).catch((err) => {
            callback({error: err})
        })
    }

    static login(email,password) {
        Firebase.auth().signInWithEmailAndPassword(email, password).then((user) => {
            console.log("Logged in user",user)
        }).catch((err) => {
            callback({error: err})
        })
    }

    static currentUser() {
        return Firebase.auth().currentUser;
    }
}

module.exports = Auth