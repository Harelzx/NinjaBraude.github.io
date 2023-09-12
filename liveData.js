// liveData.js
// Your web app's Firebase Configuration
var firebaseConfig = {
    apiKey: "AIzaSyAHAacuiD4djhj7uxea0BZz1hTNLHoJtUA",
    authDomain: "teamrocket-f28dc.firebaseapp.com",
    databaseURL: "https://teamrocket-f28dc-default-rtdb.firebaseio.com",
    projectId: "teamrocket-f28dc",
    storageBucket: "teamrocket-f28dc.appspot.com",
    messagingSenderId: "1002113902529",
    appId: "1:1002113902529:web:de94f458587f6da64bf140",
    measurementId: "G-42JQ3RLM5R"
};

console.log("js loded");

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function getCurrentTime() {
    const date = new Date();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const year = String(date.getFullYear()).slice(-2); // Get the last 2 digits of the year
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    const formattedTimestamp = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    return formattedTimestamp;
}
  
function getCategory(topicName) {
    if (topicName === 'laser')
        return "list-group-item-primary";
    if (topicName === 'test')
        return "list-group-item-danger";
    if (topicName === 'height')
        return "list-group-item-warning"
    if (topicName === 'end')
        return "list-group-item-success endTopic"
    return "list-group-item-success";
}

var itemText;

function listenToTopic(topicName) {
    var isFirstData = true;
    var topicRef = firebase.database().ref(topicName);
    const itemList = document.getElementById('itemList');
    
    topicRef.limitToLast(1).on("child_added", function (childSnapshot) {
        if (isFirstData) {
            isFirstData = false;
            return;
        }
        const msg = childSnapshot.val();
        const data = msg.data;
        const time = formatTimestamp(msg.timestamp);

        console.log("data: " + data);
        console.log("data.data: " + data.data);

        itemText = "" + time + " - " + data + "  (topic: " + topicName + ")";
        const newItem = document.createElement('li');
        newItem.className = "liveDataItem " + getCategory(topicName);
        newItem.textContent = itemText;
        itemList.appendChild(newItem);
    });
}

listenToTopic("laser");
listenToTopic("start");
listenToTopic("end");
listenToTopic("test");
listenToTopic("height");