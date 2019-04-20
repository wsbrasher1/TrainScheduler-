


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
  var firstTrainTime = "";
  var frequency = 0;

  //Event to get and submit needed data to add a train //
$("#submit-btn").on("click", function(){

  //To get data values to add to Firebase//
  trainName = $("#trainName").val().trim();
  destination = $("#destination").val().trim();
  firstTrainTime = $("#firstTrainTime").val().trim();
  frequency = $("#frequency").val().trim();

  //To push values to database//
  database.ref().push({
    trainName: trainName,
    destination: destination,
    trainTime: firstTrainTime,
    frequency: frequency,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });
return false;
});//To close out on click event for adding trains//

//To create a Firebase watcher
database.ref().on("child_added", function(Snapshot){
    var newTrainName = Snapshot.val().train;
    var newDestination = Snapshot.val().destination;
    var newFirstTrainTime = Snapshot.val().trainTime;
    var newFrequency = Snapshot.val().frequency;

//Moment//

//First Time (pushed back one year to ensure it comes before current time)
    var firstTimeConversion = moment(newFirstTrainTime, "hh:mm").subtract(1, "years");
    console.log(firstTimeConversion);

//Current Time //
    var currentTimeMoment = moment();
    console.log("Current Time: " + moment(currentTimeMoment).format("hh:mm"));

//Time difference//
    var diffTime = moment().diff(moment(firstTimeConversion), "minutes");
    console.log("Difference in Time: ", + diffTime);

//Time Apart (remainder)//
var tRemainder = diffTime % newFrequency;
console.log(tRemainder);

//Minutes until next train//
var tMinutesUntilTrain = newFrequency - tRemainder;
console.log("Minutes Until Train: " + tMinutesUntilTrain);

//Next Train//
var nextTrain = moment().add(tMinutesUntilTrain, "minutes");
console.log("Arrival Time: " + moment(nextTrain).format("hh:mm"));

//Next Train Arrival//
var nextTrainArrivalTime = moment(nextTrain).format("hh:mm");
//================================End Moment===========================//

//Log snapshot values//
console.log(Snapshot.val());
console.log('train: '+ Snapshot.val().train);
console.log('destination: '+ Snapshot.val().destination);
console.log('train time: '+ Snapshot.val().trainTime);
console.log('frequency: '+ Snapshot.val().frequency);
console.log('next train: '+ nextTrainArrivalTime);
console.log('minutes away: '+ tMinutesUntilTrain);
$(".trainInformation").append('<tr><td>'+ newTrainName +'</td><td>'+ newDestination +'</td><td>'+ newFrequency +'</td><td>'+ nextTrainArrivalTime +'</td><td>'+ tMinutesUntilTrain +'</td></tr>');

	}); // End database.ref//


  