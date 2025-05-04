import firebaseApp from './config.js';
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js"
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js"

const auth = getAuth(firebaseApp);

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is signed in:", user);
        
    } else {
        window.location.href = "index.html";
    }
});

const database = getDatabase(firebaseApp)
const itemsInDB = ref(database, "items")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEL = document.getElementById("shopping-list")

window.onload = function () {
    inputFieldEl.focus()
};

addButtonEl.addEventListener("click", function () {
    let inputValue = inputFieldEl.value
    push(itemsInDB, inputValue)
    clearInputFieldEl()
})

onValue(itemsInDB, function (snapshot) {

    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
        clearShoppingListEl()
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]

            appendItemtoShoppingListEl(currentItem)
        }

    } else {
        shoppingListEL.innerHTML = "No items currently..."
    }

})

function clearShoppingListEl() {
    shoppingListEL.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendItemtoShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    let newEl = document.createElement("li")

    newEl.textContent = itemValue

    newEl.addEventListener("click", function () {
        let exactLocationofIteminDB = ref(database, `items/${itemID}`)
        remove(exactLocationofIteminDB)
    })

    shoppingListEL.append(newEl)
}