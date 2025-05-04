import firebaseApp from './config.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js';

const auth = getAuth(firebaseApp);

document.querySelector("#show-login").addEventListener("click", function(){
    document.querySelector(".popup").classList.add("active");
    document.querySelector("#login-form").style.display = "block"; 
    document.querySelector("#signup-form").style.display = "none"; 
});

document.querySelector("#show-signup").addEventListener("click", function(){
    document.querySelector(".popup").classList.add("active");
    document.querySelector("#login-form").style.display = "none"; 
    document.querySelector("#signup-form").style.display = "block";
});

document.querySelector(".popup .close-btn").addEventListener("click", function(){
    document.querySelector(".popup").classList.remove("active");
});

document.querySelector("#login-form button").addEventListener("click", function(){
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            window.location.href = "app.html";
        })
        .catch((error) => {
            console.error(error.message);
        });
});

document.querySelector("#signup-form button").addEventListener("click", function(){
    const email = document.querySelector("#signup-email").value;
    const password = document.querySelector("#signup-password").value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            window.location.href = "app.html";
        })
        .catch((error) => {
            console.error(error.message);
        });
});

document.querySelector("#login-form a").addEventListener("click", function(){
    const email = document.querySelector("#email").value;

    sendPasswordResetEmail(auth, email)
        .then(() => {
            alert("Password reset email sent. Check your inbox.");
        })
        .catch((error) => {
            console.error(error.message);
        });
});