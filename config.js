import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js"

const firebaseConfig = {
    apiKey: "AIzaSyD_IvSRDrRFsPknux2miQblJlqGi-l6-NA",
    authDomain: "gottagrab-a41cb.firebaseapp.com",
    databaseURL: "https://gottagrab-a41cb-default-rtdb.firebaseio.com",
    projectId: "gottagrab-a41cb",
    storageBucket: "gottagrab-a41cb.appspot.com",
    messagingSenderId: "480463748060",
    appId: "1:480463748060:web:d78f98fc26afc085046d19"
}

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;