document.addEventListener("DOMContentLoaded", () => {
    const socket = io();

    const videoFeed = document.getElementById('video-feed');
    const connecting = document.getElementById('connecting');
    const fullscreen = document.getElementById('fullscreen-btn');

    // Initially hide the video feed and show the connecting/loading message
    videoFeed.style.display = 'none';
    connecting.style.display = 'block';

    socket.on('connect', () => {
        console.log('Connected to server');

        // Show connecting/loading state for 3 seconds before displaying the video feed
        connecting.style.display = 'block';
        videoFeed.style.display = 'none';
        fullscreen.style.display = 'block';

        setTimeout(() => {
            videoFeed.style.display = 'block';
            connecting.style.display = 'none';
        }, 3000);
    });

    socket.on('frame', (data) => {
        // Update the image source with the received frame
        videoFeed.src = 'data:image/jpeg;base64,' + data.image;
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from server');

        // If disconnected, hide the video feed and show the connecting message
        videoFeed.style.display = 'none';
        connecting.style.display = 'block';
    });

    // Request logs from the server
    function requestLogs() {
        socket.emit('request_logs');
    }

    // Listen for log updates from the server
    socket.on('update_logs', function(data) {
        const logBody = $('#logBody');
        logBody.empty(); // Clear the existing log entries

        // Check if there is an error
        if (data.error) {
            logBody.append('<tr ><td colspan="2">Error loading logs</td></tr>');
            return;
        }

        // Populate the table with log entries in reverse order
        const logsToDisplay = data.slice().reverse(); // Create a reversed copy of the logs
        logsToDisplay.forEach((logEntry, index) => {
            if (index === 0) return; // Skip header row
            const row = `<tr>
                <td>${logEntry[0]}</td>
                <td>${logEntry[1]}</td>
            </tr>`;
            logBody.append(row);
        });
    });

    // Request logs on page load
    $(document).ready(function() {
        requestLogs(); // Request initial logs
        setInterval(requestLogs, 5000); // Request logs every 5 seconds
    });

    // Fullscreen functionality for the video feed
    fullscreen.addEventListener('click', function() {
        if (videoFeed.requestFullscreen) {
            videoFeed.requestFullscreen();
        } else if (videoFeed.mozRequestFullScreen) { // Firefox
            videoFeed.mozRequestFullScreen();
        } else if (videoFeed.webkitRequestFullscreen) { // Chrome, Safari, and Opera
            videoFeed.webkitRequestFullscreen();
        } else if (videoFeed.msRequestFullscreen) { // IE/Edge
            videoFeed.msRequestFullscreen();
        }
    });
});
