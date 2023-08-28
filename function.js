// Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAHAacuiD4djhj7uxea0BZz1hTNLHoJtUA",
    authDomain: "teamrocket-f28dc.firebaseapp.com",
    databaseURL: "https://teamrocket-f28dc-default-rtdb.firebaseio.com",
    projectId: "teamrocket-f28dc",
    storageBucket: "teamrocket-f28dc.appspot.com",
    messagingSenderId: "1002113902529",
    appId: "1:1002113902529:web:e29ec76e01d6bd744bf140",
    measurementId: "G-GTPD2EELLW"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

// Fetch data from Firebase and display it using Chart.js
db.collection("Data1").get().then((querySnapshot) => {
    let labels = [];
    let data = [];

    querySnapshot.forEach((doc) => {
        labels.push(doc.data().name);
        data.push(doc.data().numericData); // Replace 'numericData' with the actual field name if different
    });

    var ctx = document.getElementById('medicalDataChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Medical Data',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        }
    });
});
