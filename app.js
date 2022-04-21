console.log("Lightning Cards.");

var newCard = document.querySelector("#add");
console.log("add button query: ", newCard);
var nextCard = document.querySelector("#show");
console.log("show button query: ", nextCard);
var userLogChoice = document.querySelector("#signChoice");
console.log("signChoice button query: ", userLogChoice);
var newUserChoice = document.querySelector("#createChoice");
console.log("createChoice button query: ", newUserChoice);
var logIn = document.querySelector("#LogIn");
console.log("LogIn button query: ", logIn);
var createUser = document.querySelector("#newUser");
console.log("createUser button query: ", createUser);
var logout = document.querySelector("#LogOut");
console.log("LogOut button query: ", logout);

var openPage = document.querySelector("#signOrCreate")
var signPage = document.querySelector("#Sign")
var createPage = document.querySelector("#Create")
var page =  document.querySelector("#page")

var editID = null;
var deleteID = null;
var flashCard = [];
var showA = null;
var session = 0;

nextCard.onclick = function() {
    console.log('my show button works');
    var pBox = document.querySelector("#practice");
    console.log("this is where flash cards show", pBox);
    var randomIndex = Math.floor(Math.random() * flashCard.length);
    var nextQ = flashCard[randomIndex];
    pBox.style.backgroundColor = "#FFFFFF";
    pBox.style.borderStyle = "Solid";
    if (nextCard.innerHTML == "Answer"){
        nextCard.innerHTML = "Next"
        pBox.innerHTML = showA
    }else {
        nextCard.innerHTML = "Answer"
            pBox.innerHTML = nextQ.question
            showA = nextQ.answer
        }
}
newCard.onclick = function() {
    console.log("my add button works");
    var newQuesioninput = document.querySelector("#newQuestion");
    var newQuestion = newQuesioninput.value;
    var newAnswerinput = document.querySelector("#newAnswer");
    var newAnswer = newAnswerinput.value;
    var newValueinput = document.querySelector("#newValue");
    var newValue = newValueinput.value;
    var newAuthorinput = document.querySelector("#newAuthor");
    var newAuthor = newAuthorinput.value;
    var newSubjectinput = document.querySelector("#newSubject");
    var newSubject = newSubjectinput.value;
    addNewFlash(newQuestion, newAnswer, newValue, newAuthor, newSubject);
}
userLogChoice.onclick = function() {  
    console.log('my SignIn button works');  
    openPage.style.display = "none";
    signPage.style.display = "flex";
    createPage.style.display = "none";
    page.style.display = "none";
}
newUserChoice.onclick = function() {
    console.log('my NewUser button works');
    openPage.style.display = "none";
    signPage.style.display = "none";
    createPage.style.display = "flex";
    page.style.display = "none";
}
logIn.onclick = function() {
    console.log('my LogIn button works');
    var userNameinput = document.querySelector("#signEmail");
    var userName = userNameinput.value;
    var userPasswordinput = document.querySelector("#signPassword");
    var userPassword = userPasswordinput.value;
    userLogIn(userName, userPassword);
}
createUser.onclick = function() {
    console.log('my new user button works');

    var newUserinput = document.querySelector("#createEmail");
    var newUser = newUserinput.value;
    var newFirstinput = document.querySelector("#createFirst");
    var newFirst = newFirstinput.value;
    var newLastinput = document.querySelector("#createLast");
    var newLast = newLastinput.value;
    var newPasswordinput = document.querySelector("#createPassword");
    var newPassword = newPasswordinput.value;
    newLogIn(newUser, newFirst, newLast, newPassword);
}
logout.onclick = function() {
    console.log("Logging Out");
    deleteSession();
}

function deleteSession(){
    fetch("http://localhost:8080/sessions/", {
        credentials: 'include',
        method: "DELETE"
    }).then(function (response) {
        if (response.status == 200){
            console.log("Logged Out.");
            loadFlashCards();
        }
    });
}

function addNewFlash(cardQuestion, cardAnswer, cardValue, cardAuthor, cardSubject) {

    var data = "Question=" + encodeURIComponent(cardQuestion);
    data += "&Answer=" + encodeURIComponent(cardAnswer);
    data += "&Value=" + encodeURIComponent(cardValue);
    data += "&Author=" + encodeURIComponent(cardAuthor);
    data += "&Subject=" + encodeURIComponent(cardSubject);
    console.log("newest flash card: ", data);

    fetch("http://localhost:8080/answers", {
        credentials: 'include',
        method: "POST",
        body: data,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }).then(function (response) {
        loadFlashCards();
    });
}

function deleteCardFromServer(questionID) {
    fetch("http://localhost:8080/answers/"+questionID, {
        credentials: 'include',
        method: "DELETE"
    }).then(function (response) {
        if (response.status == 200){
            console.log("This Card was deleted.");
            loadFlashCards();
        }
    });
}

function updateCardFromServer(cardQuestion, cardAnswer, cardValue, cardAuthor, cardSubject, questionID) {
    var editdata = "Question=" + encodeURIComponent(cardQuestion);
    editdata += "&Answer=" + encodeURIComponent(cardAnswer);
    editdata += "&Value=" + encodeURIComponent(cardValue);
    editdata += "&Author=" + encodeURIComponent(cardAuthor);
    editdata += "&Subject=" + encodeURIComponent(cardSubject);
    fetch("http://localhost:8080/answers/"+questionID, {
        credentials: 'include',
        method: "PUT",
        body: editdata,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }).then(function (response) {
        if (response.status == 200){
            console.log("Card was Updated.");
            loadFlashCards();
        }
    });
}

function loadFlashCards(){
    fetch("http://localhost:8080/answers", {
        credentials: 'include',
    }).then(function (response) {
        if(response.status == 401){
            openPage.style.display = "flex";
            signPage.style.display = "none";
            createPage.style.display = "none";
            page.style.display = "none";
        }else{
            openPage.style.display = "none";
            signPage.style.display = "none";
            createPage.style.display = "none";
            page.style.display = "flex";
        }
        response.json().then(function (data) {

            console.log("from the server", data);
            flashCard = data;

            var flashCardList = document.querySelector("#flashCards");
            console.log("Flash-cards query: ", flashCardList);
            flashCardList.innerHTML = "";

            flashCard.forEach(function (question) {
// newCardQuestion.classList.add(cardQuestion-list) create id inside of div-
                var newCardItem = document.createElement("li");
                var newCardQuestion = document.createElement("div");
                var newCardAnswer = document.createElement("div");
                var newCardValue = document.createElement("div");
                var newCardAuthor = document.createElement("div");
                var newCardSubject = document.createElement("div");
                var hiddenEditBox = document.querySelector("#editblock")
                var deleteButton = document.createElement("button");
                var editButton = document.createElement("button");
                var saveEditButton = document.querySelector("#save");

                newCardQuestion.innerHTML = "Question: " + question.question;
                newCardAnswer.innerHTML = "Answer: " + question.answer;
                newCardValue.innerHTML = "Value: " + question.value;
                newCardAuthor.innerHTML = "Author: " + question.author;
                newCardSubject.innerHTML = "Subject: " + question.subject;
                deleteButton.innerHTML = "Delete";
                editButton.innerHTML = "Edit";
                
                newCardItem.append(newCardQuestion);
                newCardItem.append(newCardAnswer);
                newCardItem.append(newCardValue);
                newCardItem.append(newCardAuthor);
                newCardItem.append(newCardSubject);
                newCardItem.append(deleteButton);
                newCardItem.append(editButton);

                deleteButton.onclick = function () {
                    console.log("delete button works", question.id);
                    deleteID = question.id;
                    if (confirm("Are you sure?")) {
                        deleteCardFromServer(question.id);
                    }
                };
                editButton.onclick = function () {
                    var editID = question.id;
                    console.log("set edit ID")
                    console.log("edit button works", editID);
                    var editQuesioninput = document.querySelector("#editQuestion");
                    editQuesioninput.value = question.question;
                    var editAnswerinput = document.querySelector("#editAnswer");
                    editAnswerinput.value = question.answer;
                    var editValueinput = document.querySelector("#editValue");
                    editValueinput.value = question.value;
                    var editAuthorinput = document.querySelector("#editAuthor");
                    editAuthorinput.value = question.author;
                    var editSubjectinput = document.querySelector("#editSubject");
                    editSubjectinput.value = question.subject;
                    hiddenEditBox.style.display = "flex";
                        saveEditButton.onclick = function () {
                            console.log("saved card", editID);
                            var editQuestion = editQuesioninput.value;
                            var editAnswer = editAnswerinput.value;
                            var editValue = editValueinput.value;
                            var editAuthor = editAuthorinput.value;
                            var editSubject = editSubjectinput.value;
                            updateCardFromServer(editQuestion, editAnswer, editValue, editAuthor, editSubject, editID);
                            hiddenEditBox.style.display = "none";
                        }
                };
                flashCardList.appendChild(newCardItem);
            });
        });
    });
}

function newLogIn(userEmail, userFirst, userLast, userPassword) {

    var data = "Email=" + encodeURIComponent(userEmail);
    data += "&First=" + encodeURIComponent(userFirst);
    data += "&Last=" + encodeURIComponent(userLast);
    data += "&Password=" + encodeURIComponent(userPassword);
    data += "&Score=" + encodeURIComponent(0);
    console.log("newest user: ", data);

    fetch("http://localhost:8080/users", {
        credentials: 'include',
        method: "POST",
        body: data,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }).then(function (response) {
        if(response.status == 201){
            openPage.style.display = "none";
            signPage.style.display = "none";
            createPage.style.display = "none";
            page.style.display = "flex";
            loadFlashCards();
            }
            else if(response.status == 422){
            var errorMessage2 = document.querySelector("#errorExists");
            errorMessage2.style.display = "flex";
            }
    });
}

function userLogIn(userEmail, userPassword) {

    var data = "Email=" + encodeURIComponent(userEmail);
    data += "&Password=" + encodeURIComponent(userPassword);
    console.log("newest log-in: ", data);

    fetch("http://localhost:8080/sessions", {
        credentials: 'include',
        method: "POST",
        body: data,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }).then(function (response) {
        if(response.status == 201){
            openPage.style.display = "none";
            signPage.style.display = "none";
            createPage.style.display = "none";
            page.style.display = "flex";
            loadFlashCards();
            }
            else if(response.status == 401) {
            var errorMessage1 = document.querySelector("#invalid");
            errorMessage1.style.display = "block";
            }
    });
}

loadFlashCards();