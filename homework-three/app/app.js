var Students = [];
var toggleList = false;

function startSite() {
  //checks to see if localStorage is available now
  if (localStorage) {
    console.log("localStorage is available");

    //get old data from localStorage
    var stuList = localStorage.getItem("Students");
    var newList = JSON.parse(stuList);
    console.log(newList);

    //add old data to Students list
    $.each(newList, function (index) {
      Students.push(newList[index]);
    });
  } else {
    console.log("localStorage is unavailable");
  }
}

function startListeners() {
  $("#submit").click(function (e) {
    e.preventDefault();

    //grab all user inputs
    let fName = $("#fName").val();
    let lName = $("#lName").val();
    let email = $("#email").val();
    let phone = $("#phone").val();
    let age = $("#age").val();
    let classesStr = $("#classes").val();
    let classes = classesStr.split(",");

    let newStudent = {
      fName: fName,
      lName: lName,
      email: email,
      phone: phone,
      age: age,
      classes: classes,
    };

    //add new student to array
    Students.push(newStudent);

    //set localStorage
    localStorage.setItem("Students", JSON.stringify(Students));

    //reset all input boxes to be blank
    $("#fName").val("");
    $("#lName").val("");
    $("#email").val("");
    $("#age").val("");
    $("#phone").val("");
    $("#classes").val("");
  });

  $("#show").click(function (e) {
    e.preventDefault();
    toggleList = !toggleList;

    if (toggleList) {
      //retrieve and parse localStorage data
      let savedList = localStorage.getItem("Students");
      let myData = JSON.parse(savedList);
      console.log(myData);

      $("#list").html("");
      $("#list").css("display", "block");

      //style each student's data into html
      $.each(myData, function (index) {
        var displayStudent = `<div class="person">
        <h3>${myData[index].fName} ${myData[index].lName}</h3>
        <p>Email: ${myData[index].email}</p>
        <p>Phone: ${myData[index].phone}</p>
        <p>Age: ${myData[index].age}</p>
        <p>Courses:</p>
        <ul>`;

        //loop through each of the classes in the array
        $.each(myData[index].classes, function (idx) {
          displayStudent =
            displayStudent + `<li>${myData[index].classes[idx]}</li>`;
        });

        //add each student's details to page
        $("#list").append(displayStudent + `</ul></div>`);
      });
    } else {
      //hide whole student list from page
      $("#list").css("display", "none");
    }
  });
}

$(document).ready(function () {
  startSite();
  startListeners();
});
