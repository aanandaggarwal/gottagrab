import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js"
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

const app = initializeApp(appSettings)
const auth = getAuth(app);
const database = getDatabase(app)
const itemsInDB = ref(database, "items")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEL = document.getElementById("shopping-list")

window.onload = function() {
    
    inputFieldEl.focus() 
};

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    
    push(itemsInDB, inputValue)
    
    clearInputFieldEl()
})

onValue(itemsInDB, function(snapshot){
    
    if (snapshot.exists()) {
        
        let itemsArray = Object.entries(snapshot.val())
    
        clearShoppingListEl()
    
        for (let i = 0; i < itemsArray.length; i++){
            let currentItem  = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
    
            appendItemtoShoppingListEl(currentItem)
        }

    } else {
        shoppingListEL.innerHTML = "No items currently..."
    }
 
})

function clearShoppingListEl(){
    shoppingListEL.innerHTML = ""
}

function clearInputFieldEl(){
    inputFieldEl.value = ""
}

function appendItemtoShoppingListEl(item){
    let itemID = item[0]
    let itemValue = item[1]

    let newEl = document.createElement("li")
    
    newEl.textContent = itemValue

    newEl.addEventListener("click", function(){
        let exactLocationofIteminDB = ref(database, `items/${itemID}`)
        remove(exactLocationofIteminDB)
    })
    
    shoppingListEL.append(newEl)
}