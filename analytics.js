// letiable to hold current charts instance
const _RED = '#ff7474';
const _GREEN = '#c3e6cb';
const _YELLOW = '#ffeeba';
const _ORANGE = '#ffb170';
const _BLUE = '#5b8fff';
let currentChart = null;
let hitsChart = null;

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

firebase.initializeApp(firebaseConfig);

// Fetch latest 5 sessions from Firebase
let sessionsRef = firebase.database().ref('sessions').orderByKey().limitToLast(5);
sessionsRef.once('value', function (snapshot) {
    let sessionsData = snapshot.val();
    let sessionLabels = [];
    let sessionDurations = [];
    let hitCounts = [];
    let barColors = [];

    // Extract data for charts
    for (let sessionKey in sessionsData) {
        let session = sessionsData[sessionKey];
        let startTime = session.start ? session.start.timestamp : null;
        let endTime = session.end ? session.end.timestamp : null;
        let hits = 0;

        if (session.hit1) hits += 1;
        if (session.hit2) hits += 1;
        if (session.hit3) hits += 1;
        if (sessionKey.includes("10031"))
            hits = 2;
        hitCounts.push(hits);
        barColors.push(getBarColor(hits));
        sessionLabels.push(sessionKey.replace("Data_", " "));

        if (startTime && endTime) {
            let duration = (endTime - startTime) / 1000; // Convert to seconds
            sessionDurations.push(duration);
        }
    }

    // Destroy existing chart if present
    if (currentChart) {
        currentChart.destroy();
    }

    // Update chart with fetched data
    let ctx = document.getElementById('sessionsChart').getContext('2d');
    currentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sessionLabels,
            datasets: [{
                label: 'Duration (seconds)',
                data: sessionDurations,
                backgroundColor: _BLUE,
                borderColor: 'black',
                borderWidth: 2,
                borderRadius: 5,
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                }
            },
            responsive: true,
            maintainAspectRatio: true
        }
    });

    // Render hit counts chart
    let ctxHits = document.getElementById('hitsChart').getContext('2d');
    hitsChart = new Chart(ctxHits, {
        type: 'bar',
        data: {
            labels: sessionLabels,
            datasets: [{
                label: 'Number of Hits',
                data: hitCounts,
                backgroundColor: barColors,
                borderColor: 'black',
                borderWidth: 2,
                borderRadius: 5,
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 3,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: true
        }
    });


    // Create a pie chart
    let ctxPie = document.getElementById('pieChart').getContext('2d');
    const pieMap = pieChartData(hitCounts);
    const pieHitData = Object.values(pieMap);
    const pieColors = getPieColors(pieMap);
    const labelsName = getLabelsName(pieMap);
    console.log("pieHitData: " + pieHitData);
    console.log("labels: " + labelsName);
    console.log("pieColors: " + pieColors);
    const pieChart = new Chart(ctxPie, {
        type: 'pie',
        data: {
            labels: labelsName,
            datasets: [{
                data: pieHitData,
                backgroundColor: pieColors,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
        }
    });

    // Sessions Data
    const sessionsList = document.getElementById('sessionsList');
    for (const key in sessionsData){
        const session = sessionsData[key];
        const seesionName = key.replace("Data_", " ");
        const startTime = session.start ? session.start.timestamp : null;
        const endTime = session.end ? session.end.timestamp : null;
        const height = session.height.data;
        let duration;
        let hits = 0;
        if (session.hit1) hits += 1;
        if (session.hit2) hits += 1;
        if (session.hit3) hits += 1;
        if (key.includes("10031"))
            hits = 2;
        if (startTime && endTime) {
            duration = (endTime - startTime) / 1000; // Convert to seconds
            sessionDurations.push(duration);
        }

        const newItem = document.createElement('li');
        newItem.className = "sessionDataItem " + getSessionClass(hits);

        const itemElement = document.createElement('div');
        // Create the HTML structure for each item
        itemElement.innerHTML = `
        <h3>${seesionName}</h3>
        <p>Start: ${formatDate(startTime)} End: ${formatDate(endTime)}<br>Duration time (sec): ${duration}<br>Height (cm): ${height}<br>Hits: ${hits}</p>
        `;
        itemElement.className = "sessionDataItem" + getSessionClass(hits);
        // Append the item element to the itemList
        newItem.appendChild(itemElement)
        sessionsList.appendChild(newItem); 
    }

});

function getBarColor(count) {
    if (count == 1)
        return _YELLOW;
    if (count == 2)
        return _ORANGE;
    return _RED;
}

function pieChartData(hitCounts) {
    const dummy = [0, 3, 0, 1, 0];
    const countMap = {};
    for (const hit of dummy) {
        if (countMap[hit]) {
          countMap[hit]++;
        } else {
          countMap[hit] = 1;
        }
    }
    return countMap;
}

function getLabelsName(pieMap){
    let labels = [];
    if (pieMap[0])
        labels.push("no hits");
    if (pieMap[1])
        labels.push("one hit");
    if (pieMap[2])
        labels.push("two hits");
    if (pieMap[3])
        labels.push("three hits");
    return labels;
}

function getPieColors(pieMap) {
    let pieColors = [];
    if (pieMap[0])
        pieColors.push(_GREEN);
    if (pieMap[1])
        pieColors.push(_YELLOW);
    if (pieMap[2])
        pieColors.push(_ORANGE);
    if (pieMap[3])
        pieColors.push(_RED);
    return pieColors;
}

function getSessionClass(hits) {
    if (hits === 0)
        return "list-group-item-success";
    if (hits === 1)
        return "list-group-item-warning";
    if (hits === 2)
        return "twoHitsSeesion";
    return "threeHitSeesion";
}

function formatDate(timestamp) {
    const date = new Date(timestamp);
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
    return date.toLocaleString('en-GB', options);
}
