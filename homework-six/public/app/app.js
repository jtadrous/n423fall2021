var _db; //our database
var loginStatus = false;

function initFirebase() {
  _db = firebase.firestore();

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log("connected");
      loginStatus = true;
      showHiddenAlbums(loginStatus);

      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;
      var phoneNumber = user.phoneNumber;
    } else {
      // User is signed out
      console.log("no user");
      loginStatus = false;
    }
  });
}

function showAlbumData(album) {
  $("#playlist").append(
    `<div class="box">
    <img src="${album.data().album_photo}">
    <h3>${album.data().album_name}</h3>
    <p>by - ${album.data().artist_name}</p>
    <p>genre - ${album.data().genre}</p>
    <i class="fa fa-play-circle"></i>
    </div>`
  );
}

function loadAllData() {
  $("#playlist").html("");
  _db
    .collection("Albums")
    .where("genre", "!=", "Pop")
    .get() //getting all the data
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        showAlbumData(doc);
      });
    });

  if (loginStatus) {
    _db
      .collection("Albums")
      .where("genre", "==", "Pop")
      .get() //getting all the data
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          showAlbumData(doc);
        });
      });
  }
}

function showHiddenAlbums(status) {
  var pop = document.getElementById("pop");
  var out = document.getElementById("out");
  var myBtn = document.getElementById("myBtn");

  if (status) {
    pop.style.display = "block";
    out.style.display = "block";
    myBtn.style.display = "none";
  } else {
    pop.style.display = "none";
    out.style.display = "none";
    myBtn.style.display = "block";
  }
}

function signingInWithProvider(provider) {
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      /** @type {firebase.auth.OAuthCredential} */
      var credential = result.credential;

      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      console.log(user + " - google");
      // ...
      var modal = document.getElementById("logModal");
      modal.style.display = "none";
      loginStatus = true;
      showHiddenAlbums(loginStatus);
      loadAllData();
    })
    .catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
}

function signInGoogle() {
  var provider = new firebase.auth.GoogleAuthProvider();
  signingInWithProvider(provider);
}

function signOut() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      // Sign-out successful.
      console.log("signout");
      var modal = document.getElementById("logModal");
      modal.style.display = "none";
      loginStatus = false;
      showHiddenAlbums(loginStatus);
      loadAllData();
    })
    .catch((error) => {
      // An error happened.
      console.log(error);
    });
}

function login() {
  let email = $("#emInput").val();
  let password = $("#passInput").val();

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      console.log("logged in");
      $("#emInput").val("");
      $("#passInput").val("");
      var modal = document.getElementById("logModal");
      modal.style.display = "none";
      loginStatus = true;
      showHiddenAlbums(loginStatus);
      loadAllData();
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
    });
}

function createUser() {
  //to retrieve from input boxes
  let fName = $("#fName").val();
  let lName = $("#lName").val();
  let email = $("#email").val();
  let password = $("#pass").val();

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      console.log(user + " created");
      $("#fName").val("");
      $("#lName").val("");
      $("#email").val("");
      $("#pass").val("");
      var modal = document.getElementById("logModal");
      modal.style.display = "none";
      loginStatus = true;
      showHiddenAlbums(loginStatus);
      loadAllData();
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
    });
}

function initListeners() {
  //in listeners, we will create a quick query
  //run firebase serve in npm scripts to test this
  loadAllData();

  //if the user is not logged in, then they can't see the Pop albums
  $("#all").click(function (e) {
    loadAllData();
  });

  //get all Christian albums
  $("#christian").click(function (e) {
    $("#playlist").html("");
    _db
      .collection("Albums")
      .where("genre", "==", "Christian")
      .get() //getting all the data
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          showAlbumData(doc);
        });
      });
  });

  //get all Indie albums
  $("#indie").click(function (e) {
    $("#playlist").html("");
    _db
      .collection("Albums")
      .where("genre", "==", "Indie")
      .get() //getting all the data
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          showAlbumData(doc);
        });
      });
  });

  //get all Pop albums
  $("#pop").click(function (e) {
    $("#playlist").html("");
    _db
      .collection("Albums")
      .where("genre", "==", "Pop")
      .get() //getting all the data
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          showAlbumData(doc);
        });
      });
  });

  //modal functionality
  var modal = document.getElementById("logModal");
  $("#myBtn").click(function (e) {
    modal.style.display = "block";
  });

  //click x to close modal
  $("#close").click(function (e) {
    modal.style.display = "none";
  });

  //click outside to close modal
  $(window).click(function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
}

$(document).ready(function () {
  try {
    let app = firebase.app();

    //firebase should usually be started right before the listeners
    initFirebase();
    initListeners();
  } catch {
    console.error("Error");
  }
});
