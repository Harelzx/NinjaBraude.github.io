// letiable to hold current charts instance
let currentChart = null;
let hitsChart = null;

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
                backgroundColor: "#0d6dfd",
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

});

function getBarColor(count) {
    if (count == 1)
        return "#ffc107"
    if (count == 2)
        return "#f77c16"
    return "#dc3545";
}