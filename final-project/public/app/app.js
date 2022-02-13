let person;
let loginStatus;
let yourCards = [];
var _db;
let uid, cardID, currentCard;

//start the connection with Firebase
function initFirebase() {
  _db = firebase.firestore();
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log("connected");
      person = user.displayName;
      loginStatus = true;
      uid = user.uid;
      showHiddenLinks();
      //
    } else {
      console.log("user is not there");
      loginStatus = false;
    }
  });
}

//setup each of the site pages
function route() {
  let hashTag = window.location.hash;
  let pageID = hashTag.replace("#/", "");

  if (pageID === "login") {
    $("nav").css("background", "none");
    $("nav").css("background-color", "#fcdc64");
  } else if (pageID === "home") {
    $("nav").css(
      "background",
      "url(../img/home-banner.jpg) no-repeat center center"
    );
  } else if (pageID === "flashcards") {
    $("nav").css("background", "none");
    $("nav").css("background-color", "#0d88a8");
    addModal();
    displayCards();
  } else if (pageID === "culture") {
    $("nav").css("background", "none");
    $("nav").css("background-color", "#fbc312");
  } else if (pageID === "tutorials") {
    $("nav").css("background", "none");
    $("nav").css("background-color", "#74648c");
  } else if (pageID === "about") {
    $("nav").css("background", "url(../img/about-banner.jpg) center");
  }

  //pass the page id to the model
  if (!pageID) {
    MODEL.grabNewContent("home", dynamicChanges);
  } else {
    MODEL.grabNewContent(pageID, dynamicChanges);
  }
}

//callback function connected to the model to load dynamic data
function dynamicChanges(pageName) {
  //
  console.log("dynamic");
  addModal();
  displayCards();
}
function addYourCard() {
  let buttn = document.getElementById("submit").className;
  if (buttn === "myEdit") {
    editCard();
    return;
  }
  let def = $("#theDef").val();
  let term = $("#theTerm").val();
  let userDoc = uid + "-" + (yourCards.length + 1);
  let newCard = {
    definition: def,
    term: term,
    uid: uid,
    name: userDoc,
  };
  yourCards.push(newCard);
  let newCard2 = {
    definition: def,
    term: term,
    uid: uid,
  };
  $("#theDef").val("");
  $("#theTerm").val("");
  //toast alert
  $(".toast").toast("show");
  $(".toast-head").html("Success!");
  $(".toast-body").html("Your flashcard was saved!");
  _db
    .collection("Flashcards")
    .doc(userDoc)
    .set(newCard2)
    //.add(userObj)
    .then(function (doc) {
      console.log("saved");
    });
  route();
}

function editCard() {
  let idx = currentUser;

  let def2 = $("#theDef").val();
  let term2 = $("#theTerm").val();
  let user2 = yourCards[idx].name;
  let editCard = {
    definition: def2,
    term: term2,
    uid: uid,
  };
  yourCards[idx] = editCard;

  //toast alert
  $(".toast").toast("show");
  $(".toast-head").html("Success!");
  $(".toast-body").html("Your flashcard was edited!");

  _db
    .collection("Flashcards")
    .doc(user2)
    .set(editCard)
    //.add(userObj)
    .then(function (doc) {
      //console.log("saved");
    });
  route();
}

function displayCards() {
  let flashHtml = ``;

  $.each(yourCards, function (index, oneCard) {
    cardID = uid + "-" + index;
    cardID = String(cardID);

    flashHtml =
      flashHtml +
      `<div class="card">
    <div class="square">
    <p>Term: ${oneCard.term}</p><p>Definition: ${oneCard.definition}</p></div>
    <div class="btns">
      <button id="${index}" class="edit">Edit</button>
      <a href="#/home"><button id="${oneCard.name}" onclick="deleteCard(event)" class="delete">Delete</button></a>
    </div>
    </div>`;
  });
  $(".allCards").append(flashHtml);
  addModal();
}

function deleteCard(event) {
  //toast alert
  $(".toast").toast("show");
  $(".toast-head").html("Success!");
  $(".toast-body").html("Flashcard successfully deleted!");
  _db
    .collection("Flashcards")
    .doc(event.target.id)
    .delete()
    .then(() => {
      getYourCards();
    })
    .catch((error) => {
      console.error("Error removing document: ", error);
      //toast alert
      $(".toast").toast("show");
      $(".toast-head").html("Warning!");
      $(".toast-body").html("Error deleting flashcard.");
    });
  getYourCards();
  //route();
}

function getYourCards() {
  let newArr = [];
  _db
    .collection("Flashcards")
    .where("uid", "==", uid)
    .get() //getting all the data
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        let newDef =
          doc._delegate._document.data.value.mapValue.fields.definition
            .stringValue;
        let newTerm =
          doc._delegate._document.data.value.mapValue.fields.term.stringValue;
        let newuid =
          doc._delegate._document.data.value.mapValue.fields.uid.stringValue;
        let hardCard = {
          definition: newDef,
          term: newTerm,
          uid: newuid,
          name: doc.id,
        };
        newArr.push(hardCard);
      });
    });
  yourCards = newArr;
  //displayCards();
}

//show or hide links based on login status
function showHiddenLinks() {
  var hiddenEle = document.getElementsByClassName("hide");
  var hiddenLog = document.getElementsByClassName("hide-log");

  if (loginStatus) {
    for (const x of hiddenEle) {
      x.style.display = "block";
    }
    for (const x of hiddenLog) {
      x.style.display = "none";
    }
    getYourCards();
  } else {
    for (const x of hiddenEle) {
      x.style.display = "none";
    }
    for (const x of hiddenLog) {
      x.style.display = "block";
    }
  }
}

//create a new user in firebase
function createUser() {
  let fName = $("#fName").val();
  let email = $("#email").val();
  let password = $("#pass").val();

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      updateUserInFirebase(fName);
      $("#fName").val("");
      $("#lName").val("");
      $("#email").val("");
      $("#pass").val("");

      loginStatus = true;
      showHiddenLinks();

      //toast alert
      $(".toast").toast("show");
      $(".toast-head").html("Success!");
      $(".toast-body").html("Sign up successful. Welcome " + fName + ".");
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
      //toast alert
      $(".toast").toast("show");
      $(".toast-head").html("Warning!");
      $(".toast-body").html("Sign up unsuccessful. Please try again.");
    });
}

//login a user in Firebase
function login() {
  let email = $("#emInput").val();
  let password = $("#passInput").val();

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      $("#emInput").val("");
      $("#passInput").val("");
      //toast alert
      $(".toast").toast("show");
      $(".toast-head").html("Success!");
      $(".toast-body").html("Login successful. Welcome!");
      loginStatus = true;
      showHiddenLinks();
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
      //toast alert
      $(".toast").toast("show");
      $(".toast-head").html("Warning!");
      $(".toast-body").html(
        "Login unsuccessful. Check email and password entered and try again."
      );
    });
}

//logout a user in Firebase
function signOut() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      // Sign-out successful.
      loginStatus = false;
      showHiddenLinks();
      yourCards = [];

      //toast alert
      $(".toast").toast("show");
      $(".toast-head").html("Success!");
      $(".toast-body").html("Sign out successful.");
    })
    .catch((error) => {
      console.log(error);
      //toast alert
      $(".toast").toast("show");
      $(".toast-head").html("Warning!");
      $(".toast-body").html("Sign out unsuccessful. Please try again.");
    });
}

//update user's display name in Firebase
function updateUserInFirebase(disName) {
  firebase.auth().currentUser.updateProfile({
    displayName: disName,
  });
}

//modal functionality
function addModal() {
  var modal = document.getElementById("modal");

  $("#addCard").click(function (e) {
    console.log("click");
    modal.style.display = "block";
    $("#submit").removeClass("myEdit").addClass("myAdd");
  });

  $(".edit").click(function (e) {
    currentUser = e.target.id;
    $("#theDef").val(yourCards[currentUser].definition);
    $("#theTerm").val(yourCards[currentUser].term);
    modal.style.display = "block";
    $("#submit").removeClass("myAdd").addClass("myEdit");
  });

  $(".bg-click").click(function (e) {
    modal.style.display = "none";
  });

  $("#cancel, #submit").click(function (e) {
    modal.style.display = "none";
  });
}

//start all event listeners
function initListeners() {
  //listen for when the hashtag has changed in the url
  $(window).on("hashchange", route);
  route();
  addModal();

  $("#scrollTop").on("click", function () {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  });
}

$(document).ready(function () {
  try {
    let app = firebase.app();
    initFirebase();
    initListeners();
    showHiddenLinks();
    //getYourCards();
  } catch {
    console.error(e);
  }
});
