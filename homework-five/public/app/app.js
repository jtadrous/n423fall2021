var _db; //our database

function initFirebase() {
  /* firebase
    .auth()
    .signInAnonymously()
    .then(() => {
      // Signed in..
      //database will only connect to firestore if we are logged in or is an annonymous user
      _db = firebase.firestore();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      _db = [];
      // ...
    }); */

  _db = firebase.firestore();
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

function initListeners() {
  //in listeners, we will create a quick query
  //run firebase serve in npm scripts to test this
  _db
    .collection("Albums")
    .get() //getting all the data
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        showAlbumData(doc);
      });
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
}

//first we init firebase
//then sign in annonymously
//db gets authentication
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
