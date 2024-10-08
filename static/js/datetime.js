function updateDateTime() {
    const datetimeElement = document.getElementById('datetime-display');
    const now = new Date();

    // Get the date parts
    const options = { month: 'long', day: 'numeric' };
    const date = now.toLocaleDateString(undefined, options);

    // Get the day of the week
    const day = now.toLocaleDateString(undefined, { weekday: 'long' });

    // Get the time (hours, minutes, seconds, AM/PM)
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';

    // Convert 24-hour format to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    const time = `${hours}:${minutes}:${seconds} ${ampm}`;

    // Set the content of the h1 element
    datetimeElement.textContent = `${date} | ${day} | ${time}`;
}

// Update the date and time every second
setInterval(updateDateTime, 1000);

// Call it once immediately to avoid delay
updateDateTime();