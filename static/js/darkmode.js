// Get the theme toggle input element
const themeToggle = document.getElementById('theme-toggle');

// Function to switch between light and dark mode
function switchTheme() {
    if (themeToggle.checked) {
        document.body.classList.remove('light-mode');
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
    }

    updateIcons(); // Call to update icons based on the theme
}

// Function to update icon visibility based on the current theme
function updateIcons() {
    const sunIcon = document.querySelector('.icon-light');
    const moonIcon = document.querySelector('.icon-dark');

    if (themeToggle.checked) {
        sunIcon.style.opacity = '0';
        moonIcon.style.opacity = '1';
    } else {
        sunIcon.style.opacity = '1';
        moonIcon.style.opacity = '0';
    }
}

// Add event listener to the toggle switch
themeToggle.addEventListener('change', () => {
    switchTheme();
});

// Load the theme based on the user's previous choice from localStorage
window.addEventListener('load', () => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
        themeToggle.checked = true;
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.add('light-mode');
    }
    updateIcons(); // Update icons on page load based on the stored theme
});
