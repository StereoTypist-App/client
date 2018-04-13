const Auth = require('./models/auth')
const $ = require('jquery')
const Firebase = require('./config/firebase').Firebase

$(document).ready(() => {
    if(Auth.currentUser() != null) console.log("Already signed in")
    console.log(Firebase.auth().currentUser)

    const loginBtn = $('#loginBtn')
    const registerBtn = $('#registerBtn')
    const resetBtn = $('#resetBtn')

    loginBtn.click((event) => {
        const email = $('#loginEmail').val()
        const password = $('#loginPassword').val()

        Auth.login(email,password,(data) => {
            if(data.error) return alert(data.error)

            console.log("Logged in",data,Firebase.auth().currentUser)

        })
    })

    registerBtn.click((event) => {
        const email = $('#registerEmail').val()
        const password = $('#registerPassword').val()
        const name = $('#registerName').val()

        Auth.register(email,password,name,(data) => {
            if(data.error) return alert(data.error)

            console.log("Registered",data,Auth.currentUser())
        })
    })
})