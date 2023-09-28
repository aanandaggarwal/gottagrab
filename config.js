import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js"
import { getAuth } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js"

const appSettings = {
    apiKey: "AIzaSyD_IvSRDrRFsPknux2miQblJlqGi-l6-NA",
    authDomain: "gottagrab-a41cb.firebaseapp.com",
    databaseURL: "https://gottagrab-a41cb-default-rtdb.firebaseio.com",
    projectId: "gottagrab-a41cb",
    storageBucket: "gottagrab-a41cb.appspot.com",
    messagingSenderId: "480463748060",
    appId: "1:480463748060:web:d78f98fc26afc085046d19"
}

firebase.initializeApp(appSettings);

var uiConfig = {
    signInSuccessUrl: 'index.html', // Redirect URL after successful sign-in
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
};

var ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start('#firebaseui-auth-container', uiConfig);
document.getElementById('loader').style.display = 'none';
