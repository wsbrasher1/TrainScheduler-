$(document).ready(function(){


// Configuration of the app in Firebase//
var config = {
    apiKey: "AIzaSyB2gaod7hGKHvTd-HSCRQUylKoArlK-aJk",
    authDomain: "train-scheduler-747a5.firebaseapp.com",
    databaseURL: "https://train-scheduler-747a5.firebaseio.com",
    projectId: "train-scheduler-747a5",
    storageBucket: "train-scheduler-747a5.appspot.com",
    messagingSenderId: "460900118908"
  };
  //Initializes the app and passes in the configuration
  firebase.initializeApp(config);
  console.log(firebase);

  //Variables//
  //Create a reference to the database//
  var database = firebase.database();
  var trainName = "";
  var destination = "";
  var firstTrain = "";
  var frequency = 0;

  //Event to get and submit needed data to add a train //
$("#submit-btn").on("click", function(){
  event.preventDefault();

  //To get data values to add to Firebase//
  trainName = $("#train-name").val().trim();
  destination = $("#destination").val().trim();
  firstTrain = $("#first-train").val().trim();
  frequency = $("#frequency").val().trim();

  //To push values to database//
  database.ref().push({
    name: trainName,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });
$("form")[0].reset();
});//To close out on click event for adding trains//

database.ref().on("child_added", function(childSnapshot){
  var nextArr;
  var minAway;
  //Change the year so that first train arrives before now//
  var firstTrainNew = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");
  //Difference between the current and firstTrain
  var diffTime = moment().diff(moment(firstTrainNew), "minutes");
  var remainder = diffTime %
  childSnapshot.val().frequency;
  //Minutes until the next train//
  var minAway = childSnapshot.val().frequency - remainder;
  //Next train time//
  var nextTrain = moment().add(minAway, "minutes");
  nextTrain = moment(nextTrain).format("hh:mm");

  $("#add-row").append("<tr><td>" + childSnapshot.val().name +
      "</td><td>" + childSnapshot.val().destination +
      "</td><td>" + childSnapshot.val().frequency +
      "</td><td>" + nextTrain +
      "</td><td>" + minAway + "</td><td>");
},

//To handle any errors//
function(errorObject){
console.log("Errors handled: " + errorObject.code);
});

database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot){
  //Changes HTML to reflect//
  $("#name-display").html(snapshot.val().name);
  $("#email-display").html(snapshot.val().email);
  $("#age-display").html(snapshot.val().age);
  $("#comment-display").html(snapshot.val().comment);
    });

});
  