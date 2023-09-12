
function populateDropdown(sessions) {
    const dropdown = document.getElementById('sessionSelect');
    for (let session in sessions) {
        let option = document.createElement('option');
        option.value = session;
        option.text = session;
        dropdown.add(option);
    }
}

fetch('FireBase Data.json')
    .then(response => response.json())
    .then(data => {
        const sessionsData = data.sessions;
        populateDropdown(sessionsData);  // Populate the dropdown

        let sessionTimes = {};

        // Calculate the time taken for each session
        for (let session in sessionsData) {
            if (sessionsData[session].start && sessionsData[session].end) {
                sessionTimes[session] = (sessionsData[session].end.timestamp - sessionsData[session].start.timestamp) / 1000;
            }
        }

        document.getElementById('sessionSelect').addEventListener('change', function() {
            // Sort sessions by their ID and select the chosen sessions
            const selectedSessions = Array.from(this.selectedOptions).map(option => option.value);
            const relevantData = Object.entries(sessionTimes).filter(entry => selectedSessions.includes(entry[0]));
            
            const sessionIDs = relevantData.map(entry => entry[0]);
            const timesTaken = relevantData.map(entry => entry[1]);

            // Plot the chart using Chart.js
            const ctx = document.getElementById('analyticsChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: sessionIDs,
                    datasets: [{
                        label: 'Time Taken (seconds)',
                        data: timesTaken,
                        backgroundColor: 'royalblue'
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        });
    });

function plotObstaclesHitChart(sessionIDs, obstaclesHitData) {
    const ctx = document.getElementById('obstaclesHitChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sessionIDs,
            datasets: [{
                label: 'Number of Obstacles Hit',
                data: obstaclesHitData,
                backgroundColor: 'tomato'
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

    document.getElementById('sessionSelect').addEventListener('change', function() {
        // ... (existing code)
        
        // Calculate the number of obstacles hit for each chosen session
        const obstaclesHitData = selectedSessions.map(session => {
            let count = 0;
            if (sessionsData[session].Hit1) count++;
            if (sessionsData[session].Hit2) count++;
            if (sessionsData[session].Hit3) count++;
            return count;
        });

        // Plot the obstacles hit chart
        plotObstaclesHitChart(sessionIDs, obstaclesHitData);
    });
